# PocketSmart AI: Project Design

## System shape

The repository contains two standalone web application paths under one project directory. They serve related budgeting goals but currently have separate persistence and account models.

### React and Express dashboard

- `src/App.tsx` renders the React dashboard and calls the `/api` endpoints.
- `server/index.ts` implements the Express transaction, budget, and recommendation endpoints.
- `prisma/schema.prisma` defines `Transaction` and `Budget` models in SQLite.
- `prisma/seed.ts` populates sample data for the dashboard.
- Vite serves the client; the Express API listens on port 3001 in local development.

### FastAPI recommendation planner

- `app.py` owns HTML routes, planner submissions, profile calculations, saved history, and image-upload handling.
- `templates/` contains the Jinja pages; `static/` contains browser assets and private outfit uploads.
- `auth.py` handles JSON-backed user records, password hashing, JWTs, and session checks.
- `models.py` validates registration, financial-profile, and planner inputs.
- `gemini_utils.py` supplies optional Gemini generation, fallback recommendations, budget fitting, and retailer search links.
- User records and recommendation history live in the local `data/` directory.

## Main data paths

1. The dashboard loads transactions, budgets, and recommendations from Express endpoints backed by Prisma/SQLite.
2. A planner form posts validated inputs to FastAPI. The planner uses Gemini if configured, or a local budget-safe fallback otherwise.
3. FastAPI stores each result in recommendation history associated with the signed-in username. Outfit files are served only after an ownership check.
4. The financial profile computes `max(0, monthly net income - essential expenses - savings goal)` and supplies a suggested amount to each planner.

## Design constraints

- Keep the two entry points independent unless a deliberate integration project is approved.
- Preserve source-relative paths and each application's own setup/configuration files.
- Never treat generated price estimates or retailer search results as live quotes.
- Keep secrets out of source control; use environment configuration for API keys and deployment secrets.
- Retain authentication checks around planner pages, history, profile data, and uploaded images.
