<!-- markdownlint-disable-file MD013 -->

# sync-apple-user-data-do-all

**Schedule:** Daily at 06:00 UTC (`0 6 * * *`), set on `SyncAppleUserDataDoAllUseCase` via `background_mutation_use_case`.

**What it does:** For each Apple-authenticated user with a non-expired refresh token, validates the token with Apple, persists any rotated refresh token, and clears stored credentials when Apple returns `invalid_grant`. Apple has no profile endpoint, so names and emails are not updated.

**Operational notes:** Processes one `AuthApple` row per unit-of-work transaction. Implementation lives in core; this folder is the WebAPI-scheduled cron entrypoint. Skipped when `AUTH_PROVIDER` is not `local-google-apple`.
