# PocketSmart AI: Testing Plan

## Current test status

No test/spec files were found in the uploaded project. This document is a project-specific manual and automation checklist, not a record of tests already run.

## Dashboard checks

1. Start with a clean local database using `npm run db:push` and `npm run db:seed`.
2. Run `npm run build` and confirm the TypeScript/Vite build completes.
3. Confirm the dashboard loads seeded transactions and category budgets.
4. Add a transaction, edit it, and delete it; reload the page and confirm each change persists.
5. Update a category budget and confirm the remaining amount and recommendation state refresh.
6. Check recommendation boundaries: below 70% of a limit, above 70%, and above 100%.
7. Confirm API validation rejects missing transaction fields and handles an unknown transaction/budget id predictably.

## FastAPI account and profile checks

1. Check `GET /health` returns `{"status":"ok"}`.
2. Register a valid user, reject a duplicate username/email, and reject invalid credentials at sign-in.
3. Confirm planner pages, financial-profile data, history, and image routes require authentication.
4. Save a profile such as income `75000`, expenses `30000`, savings `10000`; expect an available planning amount of `35000`.
5. Set expenses plus savings higher than income; expect the available amount to be zero.
6. Verify profile and saved history for one account are not returned to another account.

## Planner checks

- Home: accept valid budget, item counts and up to three rooms; reject zero/negative budget, counts above 50, or too many rooms.
- Party: accept a positive guest count and occasion; reject guest count outside 1-100,000 and invalid budget.
- Jewelry: accept supported image formats up to 8 MB; reject non-image files, unsupported formats, and files over 8 MB.
- With no Gemini key, confirm each planner returns a usable fallback whose allocations do not exceed the submitted budget.
- With Gemini configured, confirm malformed/unavailable model responses fall back without losing the user's saved plan.
- Confirm a generated plan appears in history and details are visible only to its owner.

## Browser and deployment checks

- Test narrow and wide viewports, keyboard focus, form errors, and image-preview removal.
- Verify the app remains usable without a Gemini key and that the UI accurately reports AI availability.
- Before deployment, verify `SECRET_KEY`, persistent storage for `data/` and `static/uploads/`, and the `/health` deployment check.
