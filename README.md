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

## Project layout

- `frontend/` — React + Vite interface
- `backend/` — Express API

