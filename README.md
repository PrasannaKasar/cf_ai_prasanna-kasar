# 💬 AI Chatbot using Cloudflare Workers & Durable Objects

A lightweight, AI chatbot built with 
- **Llama 3.3** run on **Cloudflare Workers**
- **Durable Objects** for session management and chat history
- hosted on **Cloudflare Pages**
- minimalist **React (Next js)** frontend.  
It supports both text and voice input and persists conversation history via Durable Objects.  

---

## 🚀 Live Project

**Frontend URL:** [http://localhost:5173](http://localhost:5173)  
**Backend (Worker):** [http://localhost:8787](http://localhost:8787)

*(Will be updated once deployed to Cloudflare Pages & Workers)*

---

## 🧠 Features

- Anonymous chat sessions (no signup required)
- Chat history persistence via Durable Objects
- Real-time AI responses using OpenAI / AI APIs
- Voice input via browser `SpeechRecognition` API
- Modular frontend–backend separation

---

## 🧰 Tech Stack

### **Frontend**
- React (Vite)
- TypeScript
- Tailwind CSS
- SpeechRecognition API (for voice input)
- Axios (for backend communication)

### **Backend**     # If want to use custom backend
- Cloudflare Workers (Serverless runtime)
- Durable Objects (for session-based storage)
- TypeScript
- OpenAI API (or any AI model endpoint)

---

## 📦 NPM Packages Used

Below are the core packages used in this project:

### **Frontend**
```bash
npm install npm@11.6.0 react-markdown@10.1.0 typescript@5.8.3   # required for building web app
```

### **Backend**
```bash
npm install miniflare@4.20251011.1 wrangler@4.45.0 # additional dependecies required for building cloudflare workers web app
```

⚙️ Setup Instructions
🟢 Option 1 — Use My Backend (Quick Setup)

You only need to set up the frontend locally.

Steps:

Clone this repository:

git clone https://github.com/yourusername/ai-chatbot.git
cd ai-chatbot/frontend


Install dependencies:

npm install


In the frontend source (`./next-app/app/page.tsx`), ensure the backend endpoint points to my backend:

const BACKEND_URL = "[https://your-backend.workers.dev](https://cloudflare-worker.pskasar-b23.workers.dev/)";


Start the development server:

```bash
cd next-app
npm run dev
```


Visit http://localhost:5173

⚡ Option 2 — Run Your Own Frontend & Backend

If you want to use your own Workers setup:

Steps:

Clone the repo and install dependencies for both frontend and backend:

```bash
git clone https://github.com/prasannakasar/ai-chatbot.git
cd ai-chatbot/next-app && npm install
cd ../cloudflare-worker && npm install
npm run dev
npm run deploy      
```


Update your frontend endpoint:

const BACKEND_URL = "https://your-worker-name.username.workers.dev";


Run the frontend:

cd ../frontend
npm run dev

📁 Project Structure
.
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── .gitignore
│
├── backend/
│   ├── src/
│   ├── wrangler.toml
│   ├── package.json
│   └── .gitignore
│
└── README.md

🧾 .gitignore Recommendations

For each directory (frontend, backend, and root):

# Node
node_modules/
.env
dist/
build/

# Editor/OS files
.DS_Store
*.log
.vscode/

📚 Resources
📘 Cloudflare Docs

Durable Objects Overview

Workers Quickstart

Wrangler CLI Reference

🎥 YouTube References

Cloudflare Workers Crash Course

Durable Objects Explained Simply

(You can add more links here later.)

🧩 Prompts Reference (PROMPTS.md)

All AI prompt templates used in this project are stored in PROMPTS.md.
This helps document and analyze your model’s behavior and design choices.

👨‍💻 Author

Prasanna
B.Tech in Computer Engineering, VJTI Mumbai
Project built as part of a Cloudflare + AI assignment

📝 License

This project is licensed under the MIT License — feel free to fork and modify!

⚡ "Simple, fast, and serverless — powered by Cloudflare."