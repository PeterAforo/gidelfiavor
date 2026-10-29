# AGENTS.md

## Environment
- Windows. Use PowerShell for shell commands (bash routes to WSL, which is not available here).

## Architecture
- Frontend: React + Vite + TypeScript (`src/`), built to `dist/`.
- Backend: Express API in `server/index.js`, deployed on Vercel as a serverless function through `api/index.js` (see `vercel.json` rewrites). Locally it runs as a normal Node server.
- Database: Neon PostgreSQL (`DATABASE_URL`). Uploads: Cloudinary (browser uploads directly using `/api/files/upload-signature`).
- Admin routes require `Authorization: Bearer <token>`; `src/lib/api.ts` `fetchAPI` attaches it from `localStorage.auth_token`.
- Deployment details: `docs/VERCEL_DEPLOYMENT.md`.

## Commands
- Run API locally: `node server/index.js` (port 3001, reads root `.env`)
- Run frontend: `npm run dev` (port 8080)
- Unit tests: `npm test`
- Lint: `npm run lint`
- Build: `npm run build`
- Create admin / reset password: `node server/scripts/set-admin-password.js` (interactive)
