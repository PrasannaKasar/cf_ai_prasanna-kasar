"use client";
import { useState, useRef, useEffect, memo } from "react";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";

const MessageContent = memo(({ text, sender }: { text: string; sender: Message["sender"] }) => {
  // Only use markdown for AI messages
  if (sender === "ai") {
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown
          components={{
            p: ({ node, ...props }) => <p className="my-1" {...props} />,
            ul: ({ node, ...props }) => <ul className="my-1 ml-4" {...props} />,
            ol: ({ node, ...props }) => <ol className="my-1 ml-4" {...props} />,
            li: ({ node, ...props }) => <li className="my-0" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    );
  }
  return <div className="message-text">{text}</div>;
});
MessageContent.displayName = "MessageContent";

// Message 
type Message = {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  ts: number;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  // recognitionRef holds the browser SpeechRecognition instance when active.
  // Use `any` to avoid requiring lib.dom in every TS setup.
  const recognitionRef = useRef<any | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition.');
      return;
    }
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      alert("Your browser does not support speech recognition.");
      return;
    }

  // Some TypeScript setups can't infer the constructor type, so use `any` here
  const recognition: any = new (SpeechRecognitionCtor as any)();
    recognition.lang = "en-US"; // You can customize the language
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      try {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
      } finally {
        setListening(false);
      }
    };

    recognition.onerror = (e: any) => {
      const err = e?.error ?? e;
      alert("Speech recognition error: " + String(err));
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    setListening(true);
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  // Get or set a persistent sessionId
  const getSessionId = () => {
    let id = window.localStorage.getItem("llm-session-id");
    if (!id) {
      id = uuidv4();
      window.localStorage.setItem("llm-session-id", id);
    }
    return id;
  };

  const scrollToBottom = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  };

  useEffect(() => {
    // auto-scroll when messages change
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: uuidv4(), sender: "user", text: input.trim(), ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const sessionId = getSessionId();
    const BACKEND_URL = "https://cloudflare-worker.pskasar-b23.workers.dev"
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": sessionId,
        },
        body: JSON.stringify({ input: userMsg.text }),
      });

      if (!res.ok) {
        const sys: Message = { id: uuidv4(), sender: "system", text: `Error: ${res.status} ${res.statusText}`, ts: Date.now() };
        setMessages((prev) => [...prev, sys]);
        return;
      }

      const data = await res.json();

      let aiText: string;
      try {
        const aiResponse = typeof data.aiResponse === "string" ? JSON.parse(data.aiResponse) : data.aiResponse;
        aiText = String(aiResponse?.response ?? aiResponse ?? "");
      } catch (e) {
        aiText = String(data.aiResponse ?? data?.response ?? "");
      }

      const aiMsg: Message = { id: uuidv4(), sender: "ai", text: aiText, ts: Date.now() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const sys: Message = { id: uuidv4(), sender: "system", text: `Network error: ${String(err)}`, ts: Date.now() };
      setMessages((prev) => [...prev, sys]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    localStorage.clear();
    setMessages([])
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">HealthCare Chatbot</h1>
      <h2>Using Llama 3.3</h2>
      <br />
      <div ref={containerRef} className="bg-base-200 p-6 rounded-lg mb-4 h-[560px] overflow-y-auto chat-container shadow-inner">
        {messages.map((m) => (
          <div key={m.id} className={`message-row ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`message-bubble ${m.sender === 'user' ? 'bg-primary text-primary-content rounded-xl self-end' : m.sender === 'ai' ? 'bg-white text-gray-900 rounded-xl' : 'bg-warning text-warning-content rounded-md'}`}>
              <MessageContent text={m.text} sender={m.sender} />
              <div className="message-meta text-xs text-gray-500 mt-1">{new Date(m.ts).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-row justify-start">
            <div className="message-bubble bg-white text-gray-900 rounded-xl">
              <MessageContent text="Thinking…" sender="ai" />
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 items-center mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
          className="flex-1 input input-bordered"
          placeholder="Ask something about health..."
          aria-label="Message input"
        />
        <button
          onClick={listening ? stopListening : startListening}
          className={`btn btn-success ${listening ? 'opacity-50' : ''}`}
          disabled={listening}
          aria-pressed={listening}
        >
          {listening ? 'Listening...' : '🎤'}
        </button>
        <button
          onClick={sendMessage}
          className="btn btn-primary"
          disabled={loading || !input.trim()}
        >
          {loading ? 'Sending…' : 'Send'}
        </button>
        <button
          onClick={clearChat}
          className="btn btn-ghost"
        >
          Clear Chat History
        </button>
      </div>
    </main>
  );
}