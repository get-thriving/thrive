<!-- markdownlint-disable-file MD013 -->

# Clear abandoned users cron

**Schedule:** Daily at 04:00 UTC (`0 4 * * *`), set on `ClearAbandonedUsersUseCase` via `background_mutation_use_case`.

**What it does:** Finds non-archived users with no `UserWorkspaceLink` (including archived links) who were created at least seven days ago, then hard-deletes each user and dependent entities via `generic_destroyer` under a cron domain context tagged with `AppComponent.CLEAR_ABANDONED_USERS_CRON`.

**Operational notes:** Runs one user at a time in separate unit-of-work transactions. Implementation lives in core; this folder documents the WebAPI-scheduled cron only.
