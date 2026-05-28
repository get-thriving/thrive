# Stats do-all cron

**Schedule:** Hourly at minute 0 (`0 * * * *`), inherited from `JupiterBackgroundMutationUseCase` in `jupiter.core.config` (no per-class override).

**What it does:** Recomputes statistics for every non-archived workspace. For each workspace it resolves the owning user and stats targets from enabled features, then invokes `StatsService.do_it` with today’s date and cron context tagged with `AppComponent.STATS_CRON`.

**Operational notes:** Full pass over workspaces; used to keep aggregated stats fresh. Implementation lives in core; this folder documents the WebAPI-scheduled cron only.
