# 💬 AI Healthcare Chatbot

A modern healthcare conversational AI built with cutting-edge cloud technologies, designed to provide accurate and responsive health-related assistance.

## 🎯 Overview

- 🤖 **AI Engine**: Llama 3.3 (70B parameters) on Cloudflare Workers AI
- 💾 **State Management**: Persistent sessions via Durable Objects
- 🌐 **Infrastructure**: Deployed on Cloudflare's global edge network
- ⚛️ **Frontend**: Modern Next.js 13 with App Router

Supporting both text and voice interactions for natural health-related conversations.

## 🚀 Live Demo

- **Chat Interface**: [Healthcare Chatbot](https://faa644f7.cf-ai-prasanna-kasar.pages.dev/)
- **API Endpoint**: [Cloudflare Worker](https://cloudflare-worker.pskasar-b23.workers.dev)

## ✨ Key Features

- 🤖 **AI-Powered Chat**: Real-time responses from Llama 3.3
- 💾 **Persistent Memory**: Chat history preserved across sessions
- 🎤 **Voice Commands**: Intuitive speech recognition
- 🔒 **Anonymous Access**: No login required
- 📱 **Responsive UI**: Optimized for all devices
- ⚡ **Edge Computing**: Global low-latency responses

## 🛠️ Technology Stack

### Frontend
- ⚛️ **Next.js 13**: React framework with App Router
- 🔷 **TypeScript**: Full type safety
- 🎨 **DaisyUI + Tailwind**: Modern UI components
- 🎤 **Web Speech API**: Voice interaction
- 📡 **Fetch API**: Efficient backend communication

### Backend
- ☁️ **Cloudflare Workers**: Serverless compute at the edge
- 💾 **Durable Objects**: Stateful session management
- 🤖 **Workers AI**: Llama 3.3 integration
- 🔐 **Session Handling**: Secure chat persistence

## 🚀 Getting Started

### Quick Start (Using Existing Backend)

1. **Setup Frontend**
   ```bash
   # Clone repository
   git clone https://github.com/PrasannaKasar/cf_ai_prasanna-kasar.git
   cd cf_ai_prasanna-kasar/next-app

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

2. **Configure Backend**  
   In `next-app/app/page.tsx`:
   ```typescript
   const BACKEND_URL = "https://cloudflare-worker.pskasar-b23.workers.dev/";
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Full Stack Development

To deploy your own Cloudflare Worker backend:

1. **Setup Project**
   ```bash
   # Clone repository
   git clone https://github.com/PrasannaKasar/cf_ai_prasanna-kasar.git
   cd cf_ai_prasanna-kasar
   
   # Install dependencies
   cd next-app && npm install    # Frontend setup
   cd ../cloudflare-worker && npm install  # Backend setup
   ```

2. **Deploy Backend**
   ```bash
   npm run deploy
   ```

3. **Update Frontend Configuration**  
   Update `next-app/app/page.tsx`:
   ```typescript
   const BACKEND_URL = "https://your-worker.username.workers.dev";
   ```

4. **Start frontend**
   ```bash
   cd ../next-app
   npm run dev
   ```

## 📁 Project Structure

```
.
├── next-app/               # Frontend application
│   ├── app/               # Next.js 13 app directory
│   │   ├── page.tsx      # Main chat interface
│   │   └── layout.tsx    # Root layout
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
│
├── cloudflare-worker/     # Backend application
│   ├── src/
│   │   └── index.ts      # Worker entry point
│   ├── wrangler.toml     # Cloudflare config
│   └── package.json      # Backend dependencies
│
└── README.md             # Project documentation
```

## 📚 Learning Resources

### Cloudflare Workers
- [Official Documentation](https://developers.cloudflare.com/workers/)
- [Llama 3.3 Integration Guide](https://developers.cloudflare.com/workers-ai/models/llama-3.3-70b-instruct-fp8-fast/)
- [Video Tutorial: Workers Quickstart](https://www.youtube.com/watch?v=H7Qe96fqg1M)

### Durable Objects
- [State Management Guide](https://developers.cloudflare.com/durable-objects/reference/in-memory-state/)

### Cloudflare Pages
- [Pages Documentation](https://developers.cloudflare.com/pages/)
- [Video: Deploying to Pages](https://www.youtube.com/watch?v=B2bLUc3iOsI)

## 🧩 Additional Resources

Check `PROMPTS.md` for all AI prompt templates used in this project.

## 👨‍💻 Author

**Prasanna**  
B.Tech in Computer Engineering, VJTI Mumbai  
*Project built for Cloudflare Workers AI Hackathon*

## 📝 License

This project is open source under the MIT License.

---

⚡ *"Simple, fast, and serverless — powered by Cloudflare"*