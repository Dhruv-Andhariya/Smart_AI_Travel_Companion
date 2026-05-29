# Deployment checklist — Trip-Ai

- **Frontend (Client)**:
  - Build with `cd Client && npm run build`.
  - Deploy as a static site (Render/GitHub Pages/Vercel). If using Render Static Site, set build command to `npm run build` and publish `Client/dist`.
  - Ensure `VITE_API_BASE_URL` points to backend URL.

- **Backend (Server)**:
  - Ensure `DATABASE_URL` points to production Postgres (encode `@` as `%40`).
  - Set `JWT_SECRET`, `WEATHER_API_KEY`, `GROQ_API_KEY`, `CLIENT_URL` (frontend URL) in environment variables.
  - Deploy Node service (Render Web Service). If Render runs from repo root, set start command: `cd Server && npm start`, or set Root Directory to `Server`.
  - After DB is set, run migrations: `cd Server && npx prisma migrate deploy`.

- **Notes**:
  - Do NOT commit `.env` files; store secrets in the host's environment.
  - To enable automated dependency PRs, add Dependabot (`.github/dependabot.yml`).
  - Test locally after any dependency updates.
