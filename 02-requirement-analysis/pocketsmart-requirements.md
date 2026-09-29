# PocketSmart AI: Requirements Analysis

## Scope found in the upload

The project currently contains two application paths. The React/Express dashboard uses a SQLite database through Prisma. The FastAPI application serves account-based planning pages and stores its user and recommendation records in local JSON files. They are separate applications and their data is not synchronized.

## Implemented functional requirements

### Budget dashboard

- Read, create, edit, and delete income/expense transactions.
- Read and update category spending limits.
- Summarize recorded income, expenses, and available balance.
- Show category progress and recommendations when spending approaches or exceeds a category limit.
- Seed the local database with sample transactions and budgets for a demonstration.

### Account-based recommendation planners

- Register and sign in to access the dashboard and saved plans.
- Save a monthly profile containing net income, essential expenses, and a savings goal; calculate the non-negative remainder for planning.
- Create home-interior plans using a budget, item counts, rooms, and optional requirements.
- Create party/event plans using a budget, guest count, occasion, venue style, selected services, and optional requirements.
- Create jewelry plans using a budget, occasion, optional style preferences, and an optional outfit image.
- Save recommendations to per-user history and open plan details.
- Use Gemini when configured; otherwise return budget-safe fallback recommendations.
- Provide retailer search links for suggested items.

## Validation and limits found in code

- Registration usernames are 3-40 characters and limited to letters, numbers, underscore, period, and hyphen; passwords are 8-128 characters.
- Planner budgets must be greater than zero and no more than 100,000,000; item counts are 0-50; party guest counts are 1-100,000.
- Optional text fields are capped at 2,000 characters.
- Outfit uploads are limited to 8 MB and supported image formats; upload access is authenticated and scoped to the owning user's saved plan.

## Operational requirements

- Node.js 18+ and npm for the React/Express app; SQLite is configured through Prisma's `DATABASE_URL`.
- Python 3.10+ for the FastAPI app and the dependencies in `requirements.txt`.
- A `SECRET_KEY` of at least 32 characters for deployment. `GOOGLE_API_KEY` or `GEMINI_API_KEY` is optional and enables Gemini recommendations.
- Persistent storage is needed for the FastAPI app's `data/` records and uploaded images in deployments.

## Explicit boundaries

- The dashboard and FastAPI planner do not share accounts or records.
- The dashboard prototype contains fixed dates, comparison percentages, savings-target assumptions, and synthetic trend points; these are not historical analytics.
- Shopping links are searches, not confirmed inventory or checkout integrations. Planner amounts are estimates, not financial advice.
- The repository has no test/spec files at the time of this analysis. The implementation plan should treat automated coverage as outstanding work.
