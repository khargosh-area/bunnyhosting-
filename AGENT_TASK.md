# AI coding agent task — Bunny Hosting

You are working in the `bunny-hosting` repository.

## Product goal
Build an independent, secure Minecraft hosting control panel. Do not copy Pterodactyl source code or branding. Use the existing stack: Next.js + TypeScript, Fastify, PostgreSQL, Redis, Docker, and a separately deployed node agent.

## Current milestone
Inspect the existing code before editing. Preserve the current working `/health` and `/api/servers` endpoints and dashboard. Implement the next milestone only: PostgreSQL persistence for server metadata and basic user authentication.

## Hard security requirements
- Never expose the Docker socket to the public API or browser.
- Do not add arbitrary shell-command execution.
- Do not run containers in privileged mode.
- Use least-privilege service accounts and scoped credentials.
- Validate all input with schemas.
- Hash passwords with Argon2id.
- Store secrets in environment variables, never commit them.
- Keep node-agent communication separate from public user API.
- Add tests for authorization and input validation.
- Do not claim server provisioning works until an isolated node-agent integration is implemented and tested.

## Deliverables
1. Database schema and migrations.
2. Registration/login/logout with secure, httpOnly cookies.
3. Authenticated server-list endpoint scoped to the current user.
4. Tests and updated README.
5. A concise summary of files changed and exact local test commands.
