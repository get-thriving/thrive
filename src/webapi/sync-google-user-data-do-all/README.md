<!-- markdownlint-disable-file MD013 -->

# sync-google-user-data-do-all

**Schedule:** Daily at 05:00 UTC (`0 5 * * *`), set on `SyncGoogleUserDataDoAllUseCase` via `background_mutation_use_case`.

**What it does:** For each Google-authenticated user with a non-expired refresh token, exchanges the refresh token for an access token, fetches OpenID userinfo from Google, updates the user's name and email when they differ, persists any rotated refresh token, and revokes stored credentials when Google returns `invalid_grant`.

**Operational notes:** Processes one `AuthGoogle` row per unit-of-work transaction. Implementation lives in core; this folder is the WebAPI-scheduled cron entrypoint.
