# PocketSmart AI: Project Guide

PocketSmart AI is a personal budgeting and purchase-planning project. The uploaded source includes two independent local web applications.

## Budget dashboard

The React dashboard shows income, expenses, category budgets, transactions, and budget-threshold recommendations. Users can add, edit, and delete transactions and update category limits. It uses an Express API, Prisma, and SQLite. Seeded example data is available through `npm run db:seed`.

## Recommendation planners

The FastAPI application supports account registration and sign-in, a monthly financial profile, and three planning workflows:

- Home interiors: room priorities, fixture/furniture counts, and shopping suggestions.
- Parties and events: guest count, occasion, venue, and optional catering, decoration, and entertainment.
- Jewelry: occasion and style preferences, with optional outfit-photo matching.

Plans are saved to the signed-in user's history. Gemini is optional; when no API key is configured, the planner uses its fallback recommendations. Suggested retailer links are search links.

## Budget profile

The monthly amount suggested to the planners is:

`max(0, take-home income - essential expenses - savings goal)`

This is a planning estimate. It is not a bank connection, verified balance, or financial advice.

## Local setup

See `README.md` in this folder for the full setup instructions. In brief, the dashboard uses Node.js/npm and the FastAPI planners use Python 3.10+; they run on separate local ports and do not share accounts or records.

## Data and privacy notes

- The dashboard stores data in its local SQLite database.
- The FastAPI application stores users and recommendation history under `data/` and outfit images under `static/uploads/`.
- Keep secrets and personal data out of source control. Configure a strong `SECRET_KEY` for deployment and use persistent storage for deployed records and images.
- Estimates, generated recommendations, and retailer searches may be incomplete or outdated; verify details with providers before making purchases.

## Known prototype limitations

The dashboard includes fixed date/comparison labels, a fixed savings assumption, and synthetic chart trend points. Those display values should not be interpreted as verified month-over-month analytics. The two application paths also use different currency conventions: USD on the dashboard and INR in the planner pages.
