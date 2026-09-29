# PocketSmart AI: Demonstration Script

## Setup

Choose which part to demonstrate. The apps are separate.

- Dashboard: from the Development folder, run `npm install`, `npm run db:push`, `npm run db:seed`, then `npm run dev`; open `http://localhost:5173`.
- Recommendation planners: configure `.env` with a strong `SECRET_KEY`, optionally add `GOOGLE_API_KEY`, install `requirements.txt`, run Uvicorn on port 8000, and open `http://127.0.0.1:8000`.

The planner demo works without a Gemini key using fallback recommendations.

## Suggested 5-7 minute walkthrough

1. **Introduce the dashboard.** Point out income, spending, available balance, category limits, recent transactions, and the recommendations panel. Explain that the seeded records are demo data and some trend/comparison labels are prototype values.
2. **Show a transaction workflow.** Add a small expense, edit it, then remove it. Show how the category totals refresh.
3. **Sign in to the planner app.** Register a demo account and open the dashboard. The account-based planner app is separate from the React dashboard.
4. **Set the monthly profile.** Enter take-home income `75000`, essential expenses `30000`, and savings goal `10000`. Show the resulting `35000` monthly planning amount and its formula.
5. **Create a home plan.** Use a budget below the profile amount, choose a room, and request a few fixtures. Show categorized recommendations and retailer search links.
6. **Create an event or jewelry plan.** For an event, enter a guest count and select services. For jewelry, choose an occasion and optionally add a supported outfit image. If no API key is configured, point out the fallback notice.
7. **Return to saved history.** Open the saved plan and its details. Mention that plans and uploads are stored for the signed-in account.

## Demo close

Emphasize that the app helps organize a budget and compare ideas. Recommendations and prices are estimates, search links do not guarantee stock or price, and the tools do not connect to a bank or replace financial advice.
