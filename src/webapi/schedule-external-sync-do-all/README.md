# Schedule external sync do-all cron

**Schedule:** Hourly at minute 0 (`0 * * * *`), inherited from `JupiterBackgroundMutationUseCase` in `jupiter.core.config` (no per-class override).

**What it does:** Triggers external schedule sync for every non-archived workspace via `ScheduleExternalSyncService.do_it`, using the current date and cron domain context tagged with `AppComponent.SCHEDULE_EXTERNAL_SYNC_CRON`.

**Operational notes:** Pulls calendar/schedule data from configured external sources per workspace. Implementation lives in core; this folder documents the WebAPI-scheduled cron only.
