# PocketSmart AI: Project Plan

This plan reflects the code present in the uploaded project. No schedule or completion dates are assumed.

## Existing baseline

- [x] React dashboard with transaction and budget operations.
- [x] Express API backed by Prisma and SQLite, including seed data.
- [x] FastAPI account flow, authenticated pages, and financial profile.
- [x] Home, party/event, and jewelry recommendation workflows.
- [x] Optional Gemini generation with a fallback path.
- [x] Per-user recommendation history and optional outfit-image handling.
- [x] Setup and run instructions in the project README.

## Recommended next work

### 1. Define product boundaries

- Decide whether the dashboard and planner remain separate tools or should share accounts and data.
- Decide which currency and locale conventions apply to each experience; the dashboard currently displays USD while the planners use INR.
- Identify whether the dashboard's fixed comparison and trend values should be replaced or removed.

### 2. Establish verification

- Add focused automated tests for profile remainder calculations, request validation, allocation limits, and user-specific history/image access.
- Verify the dashboard's create/edit/delete transaction and budget update flows against a clean SQLite database.
- Exercise planner fallback behavior without a Gemini key and the configured path with a valid key.

### 3. Prepare deployment

- Set and validate `SECRET_KEY`; configure `GOOGLE_API_KEY` only where AI generation is required.
- Confirm persistent storage for FastAPI JSON data and outfit uploads.
- Confirm the Render health check and deployment instructions against the target environment.
- Document backup, retention, and recovery expectations for locally stored records and uploaded images.

### 4. Review user-facing accuracy

- Verify that budget estimates are clearly labeled and that search links do not imply verified pricing.
- Review dashboard trends and savings figures before using them as real financial insights.
- Review privacy wording and retention behavior for outfit images.

## Release gate

Treat deployment as ready only after the above verification, configuration, persistence, and user-facing accuracy checks have been completed. The repository currently contains no test/spec files, so automated test coverage is an open item.
