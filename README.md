# Bunny Hosting

An independent Minecraft hosting control-panel project. This repository starts with a small, runnable API and dashboard foundation.

## Requirements
- Node.js 22 or newer
- npm 10 or newer
- Docker Desktop / Docker Engine (optional, for local PostgreSQL and Redis)

## Run the API
```bash
npm install
cp .env.example .env
npm run dev:api
```
Open http://localhost:4000/health

## Run the dashboard
In a second terminal:
```bash
npm run dev:web
```
Open http://localhost:3000

The dashboard reads the API health endpoint. Set `NEXT_PUBLIC_API_URL` if the API is not at `http://localhost:4000`.

## Optional local data services
```bash
docker compose up -d
```

## Current scope
- Health endpoint
- Read-only demo server inventory endpoint
- Starter dashboard
- Local PostgreSQL and Redis services

## Not implemented yet
No real server provisioning, Docker control, file manager, authentication, billing, or public node agent is included yet. Do not expose this development API to the public internet. The next milestone is authenticated API access and a separately secured node agent.
