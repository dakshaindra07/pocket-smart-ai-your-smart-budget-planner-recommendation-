# PocketSmart AI: Development Guide

This folder contains a copy of the uploaded project with its original relative layout. The original files in `GitHubUpload/` remain unchanged.

## Choose an application

### React/Express budget dashboard

From this folder, install dependencies and prepare the local database:

```bash
npm install
```

Before the database commands, set `DATABASE_URL="file:./dev.db"` in the environment or local `.env` file. Because the Prisma schema is in `prisma/`, this stores the database at `prisma/dev.db`. The copied `.env.example` currently documents the FastAPI settings but does not include `DATABASE_URL`.

Then run:

```bash
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:5173`. Vite serves the client and Express serves the API on port 3001.

Useful scripts: `npm run build`, `npm run db:generate`, and `npm run db:seed`.

### FastAPI recommendation planners

Use Python 3.10 or later. In PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Set a random `SECRET_KEY` (at least 32 characters) in `.env`. Set `GOOGLE_API_KEY` or `GEMINI_API_KEY` to enable Gemini; without it, budget-safe fallback recommendations remain available.

```powershell
uvicorn app:app --reload --reload-exclude "$PWD\.venv" --port 8000
```

Open `http://127.0.0.1:8000`. The `/health` endpoint reports service status.

## Source map

- `src/`, `server/`, and `prisma/`: React dashboard, Express API, and SQLite data model.
- `app.py`, `auth.py`, `models.py`, and `gemini_utils.py`: FastAPI routes, authentication, validation, and planner recommendations.
- `templates/` and `static/`: server-rendered pages and static assets.
- `README.md`, `package.json`, and `requirements.txt`: project setup and dependency references.

## Development cautions

- These are separate applications; they do not share accounts or storage.
- Do not commit `.env`, local database files, user data, or uploaded outfit photos.
- Planner recommendations and shopping prices are estimates. The dashboard's sample trend/comparison values are prototype values, not computed historical analytics.
