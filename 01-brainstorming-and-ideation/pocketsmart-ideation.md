# PocketSmart AI: Brainstorming and Ideation

## Project opportunity

PocketSmart AI brings everyday spending awareness together with practical, budget-bounded planning. The upload contains two complementary experiences: a transaction and budget dashboard, plus planners for home interiors, parties and events, and jewelry.

## Intended users

- People who want a quick view of income, spending, category budgets, and recent transactions.
- People organizing a home purchase, celebration, or jewelry purchase who need to work within a stated budget.
- Users who want recommendations and retailer search links without treating estimates as guaranteed prices.

## Product principles

- Make the budget the boundary for each plan.
- Keep essential expenses and a savings goal visible when calculating monthly planning money.
- Offer a usable fallback when the optional Gemini service is unavailable.
- Let users return to their saved recommendation plans.
- Be clear that recommendations and prices are estimates, not financial advice or live seller inventory.

## Ideas represented in the current project

- Cash-flow dashboard with transaction and category-budget management.
- Budget-aware category recommendations on the dashboard.
- Profile-based monthly planning amount: take-home income minus essential expenses and savings goal, floored at zero.
- Home, event, and jewelry planners with optional Gemini-generated recommendations.
- Saved planner history, retailer search links, and optional outfit-photo matching for jewelry.

## Future ideas to evaluate

These are proposals, not claims about implemented features:

- Add automated tests for budget math, API validation, account isolation, and recommendation limits.
- Replace prototype dashboard labels and trend values with date-filtered calculations from real history.
- Add exportable plans and a clear comparison view for estimates versus actual spending.
- Consider multi-currency support only after the dashboard's USD display and the planner's INR inputs are intentionally reconciled.
- Gather user feedback on whether the dashboard and recommendation planner should become one authenticated experience.

## Questions for project review

- Should the dashboard and planner share one user account and data store?
- Which user-visible insights should be derived from real transaction history before presenting them as trends?
- What evidence should be shown alongside a recommendation, especially when AI generation is enabled?
