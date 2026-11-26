# NUDU Beauty & Fragrance

Starter for the NUDU Beauty & Fragrance storefront. The frontend and backend are separate applications. Product data is currently sample data, and cart and wishlist state stay in the browser. The frontend is not connected to the API or a database yet.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run the frontend

```powershell
cd frontend
npm install
npm run dev
```

Vite prints the local URL (normally `http://localhost:5173`). If that port is already in use, Vite selects the next available port. Open the address printed in the terminal.

## Run the backend

In a separate terminal:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

The API listens on port 5000 by default. Check `http://localhost:5000/api/health` for its JSON health response. Set `PORT` in `backend/.env` to use another port.

## AI Skincare Assistant (Ollama)

The site has a floating "AI Assistant" chat widget powered by a local [Ollama](https://ollama.com) model — no API key needed, everything stays on your machine.

Setup:

```powershell
# 1. Install Ollama (once) from https://ollama.com/download
# 2. Pull a model (once)
ollama pull llama3.2
# 3. Make sure the server is running (it usually starts automatically)
ollama serve
```

Then run the backend as above. The backend calls Ollama at `http://localhost:11434` by default; override with `OLLAMA_URL` and `OLLAMA_MODEL` in `backend/.env`. If Ollama is not running, the widget politely shows an offline message instead of breaking the site.

- `GET /api/chat/status` — checks whether Ollama is reachable
- `POST /api/chat` — body `{ "message": "...", "history": [...] }`, returns `{ "reply": "..." }`

## Project layout

- `frontend/` — React + Vite interface
- `backend/` — Express API

