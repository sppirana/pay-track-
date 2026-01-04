# CMS Monorepo (Backend + Frontend)

This repo contains an Express + MongoDB API and a React + Vite frontend.

## Tech Stack
- Backend: Node.js, Express, Mongoose, TypeScript
- Frontend: React, Vite, TypeScript

## Repo Structure
- backend/ — API (Express, MongoDB)
- frontend/ — Web app (React + Vite)

## Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or remote)

## Setup
### 1) Backend
```bash
cd backend
cp .env.example .env  # or create .env with variables below
npm install
npm run dev           # starts API with nodemon on http://localhost:5000
# or build & run
npm run build
npm start
```
Environment variables (.env):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cms
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev   # starts Vite dev server (default http://localhost:5173)
```

## Useful Scripts
- backend: `npm run dev`, `npm run build`, `npm start`
- frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`, `npm run typecheck`

## Git Hygiene
- Do not commit `node_modules/` or secrets (`.env`).
- Commit only source files under `backend/src` and `frontend/src` plus config.
