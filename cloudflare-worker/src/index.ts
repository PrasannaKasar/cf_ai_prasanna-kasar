export class ChatHistory {
  state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request) {
    const method = request.method;

    if (method === "POST") {
      const json = await request.json();
      if (
        typeof json === "object" &&
        json !== null &&
        "userInput" in json &&
        "aiResponse" in json
      ) {
        const { userInput, aiResponse } = json as { userInput: string; aiResponse: string };

        const history = (await this.state.storage.get("history")) as string[] || [];
        history.push(`User: ${userInput}`);
        history.push(`AI: ${aiResponse}`);
        await this.state.storage.put("history", history);
        return Response.json({ success: true });
      }
      return new Response("Invalid body", { status: 400 });
    }

    if (method === "GET") {
      const history = (await this.state.storage.get("history")) as string[] || [];
      return Response.json({ history });
    }

    return new Response("Method not allowed", { status: 405 });
  }
}

export interface Env {
  AI: Ai; // Ensure Ai type is imported or globally available
  CHAT_HISTORY: DurableObjectNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Session-ID",
        },
      });
    }

    // Support POST (sending a new message) and GET (retrieving chat history)
    if (request.method !== "POST" && request.method !== "GET") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Session-ID",
        },
      });
    }

    // Get or create session ID
    let sessionId = request.headers.get("X-Session-ID");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }
    const chatId = env.CHAT_HISTORY.idFromName(sessionId);
    const chatStub = env.CHAT_HISTORY.get(chatId);

    if (request.method === "GET") {
      // Proxy to DO itself for chat history
      const resp = await chatStub.fetch("https://dummy/chat", { method: "GET" });
      const data = await resp.text();
      return new Response(data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }

    // request.method === "POST": Send message, update history, and get LLM response
    let userInput: string;
    try {
      const body = await request.json();
      if (
        typeof body === "object" &&
        body !== null &&
        "input" in body &&
        typeof (body as any).input === "string"
      ) {
        userInput = (body as { input: string }).input;
      } else {
        return new Response("Invalid input format", {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    } catch {
      return new Response("Bad Request", {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Fetch chat history from DO and build LLM context
    const resp = await chatStub.fetch("https://dummy/chat", { method: "GET" });
    const data = await resp.json();
    const history = (typeof data === "object" && data !== null && "history" in data && Array.isArray((data as any).history))
      ? (data as { history: string[] }).history
      : [];


    const chatMessages = (history || []).flatMap((line: string) => {
      if (line.startsWith("User: ")) {
        return [{ role: "user", content: line.slice(6) }];
      } else if (line.startsWith("AI: ")) {
        return [{ role: "assistant", content: line.slice(4) }];
      }
      return [];
    });

    const messages = [
      { role: "system", content:  "You are HealthMate, a friendly AI assistant that gives reliable health and wellness tips.\
    You should always clarify you’re not a doctor, and encourage users to consult professionals when needed." },
      ...chatMessages,
      { role: "user", content: userInput }
    ];

    // Call LLM
    const aiResponse = await env.AI.run(
      "@cf/meta/llama-3.3-70b-instruct-fp8-fast", { messages }
    );

    let safeText: string;
    if (
      aiResponse &&
      typeof aiResponse === "object"
    ) {
      if ("output_text" in aiResponse && typeof aiResponse.output_text === "string") {
        safeText = aiResponse.output_text;
      } else if ("result" in aiResponse && typeof aiResponse.result === "string") {
        safeText = aiResponse.result;
      } else {
        // fallback: stringify the actual response object
        safeText = JSON.stringify(aiResponse);
      }
    } else {
      safeText = String(aiResponse);
    }

    // Save chat turn to DO
    await chatStub.fetch("https://dummy/chat", {
      method: "POST",
      body: JSON.stringify({
        userInput,
        aiResponse: safeText
      }),
    });

    return new Response(JSON.stringify({ aiResponse: safeText, sessionId }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
} satisfies ExportedHandler<Env>;
