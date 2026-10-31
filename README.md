# Bunny Hosting

Bunny Hosting is an independent Minecraft hosting control-panel project.

## Current milestone

The repository contains a responsive, dark-themed dashboard preview built with Next.js and a small Fastify API.

### Dashboard preview
- Workspace sidebar and responsive mobile navigation
- Overview cards for servers, nodes and API status
- Server list with search
- Getting-started checklist
- Nodes, backups, users and settings roadmap screens
- Server template gallery with Java, Bedrock and proxy presets, search and filters
- Clear preview-state messaging; no fake provisioning actions

### Design references and attribution
- Obsidian Panel (MIT): feature inspiration for template presets, server icon handling, file tools, plugin discovery and scheduling. This repository implements its own UI and backend; it does not copy Obsidian Panel source files.
- CCVaults / ccLeaf: Minecraft icon and texture reference library. The current dashboard links to the library; individual assets will only be bundled after confirming their reuse terms and attribution requirements.
- Workspace sidebar and responsive mobile navigation
- Overview cards for servers, nodes and API status
- Server list with search
- Getting-started checklist
- Nodes, backups, users and settings roadmap screens
- Clear preview-state messaging; no fake provisioning actions

### API
- \`GET /health\` — API health and version
- \`GET /api/servers\` — read-only demo server inventory

### Local development

Requirements: Node.js 22+ and npm 10+.

\`\`\`bash
npm install
cp .env.example .env
npm run dev:api
\`\`\`

In a second terminal:

\`\`\`bash
npm run dev:web
\`\`\`

Open \`http://localhost:3000\`. The dashboard expects the API at \`http://localhost:4000\` by default. Set \`NEXT_PUBLIC_API_URL\` if it runs elsewhere.

Optional local PostgreSQL and Redis:

\`\`\`bash
docker compose up -d
\`\`\`

## Not production-ready yet

This is a UI and API foundation, not a functioning public hosting service. Real authentication, persistent server records, node registration, isolated Docker provisioning, console streaming, file management, backups, quotas and billing have not been implemented. Do not expose the development API to the public internet.

## Planned milestones

1. Secure authentication and persistent workspace data.
2. A separately secured node agent with strict resource and container isolation.
3. Server lifecycle controls, console and monitoring.
4. File management, backups, user roles and audit logging.
5. Deployment hardening and documentation.

All provisioning actions must remain disabled until the node agent and its security boundaries are implemented and tested.
