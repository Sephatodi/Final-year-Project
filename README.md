# Farm-Aid

Offline-first farm management and telehealth PWA for livestock farmers and veterinary experts. Built with React + Vite (frontend) and Node/Express + Sequelize (backend), with CouchDB sync and an optional Python AI service.

## Structure

```
.
├── FrontEnd/farm-aid-frontend/   # React + Vite PWA (the web app)
├── Backend/                      # Node/Express API + Sequelize models
├── couchdb/                      # CouchDB Dockerfile + init (used by render.yaml)
├── server.js                     # Root entry — delegates to Backend/server.js
├── render.yaml                   # Render.com deployment (backend + couchdb)
└── package.json                  # Root scripts (install, build, start)
```

## Prerequisites

- Node.js 18+ and npm
- A PostgreSQL database (e.g. Neon) and optional CouchDB
- Python 3 only if running the optional AI service (`Backend` note: AI falls back to a rule-based system when TensorFlow is unavailable)

## Setup

```bash
# Install root + backend dependencies
npm install

# Configure environment
cp .env.example .env          # root (frontend/build)
cp Backend/.env.example Backend/.env   # backend

# Initialize database schema + seed (optional, uses DATABASE_URL)
npm run setup-db
```

## Run

```bash
# Backend API (http://localhost:5000)
npm start

# Frontend dev server (http://localhost:5173)
cd FrontEnd/farm-aid-frontend && npm install && npm run dev

# Frontend production build (emits dist/ + service worker)
npm run build
```

## Demo accounts (client-side, offline-first)

The frontend seeds these demo accounts locally for offline use:

| Role   | Email                | Password   |
|--------|----------------------|------------|
| Farmer | farmer@example.com   | Test123!   |
| Expert | expert@example.com   | Test123!   |
| Admin  | admin@example.com    | Test123!   |

## Deployment

`render.yaml` defines two services: the Node backend (`npm install` → `node server.js`) and a CouchDB Docker service. The frontend builds from `FrontEnd/farm-aid-frontend/` via `npm run build`.