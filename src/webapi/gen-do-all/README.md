# Gen do-all cron

**Schedule:** Hourly at minute 0 (`0 * * * *`), inherited from `JupiterBackgroundMutationUseCase` in `jupiter.core.config` (no per-class override).

**What it does:** Runs task generation for every non-archived workspace. For each workspace it loads the owning user and inferred gen targets, then calls `GenService.do_it` with today’s date and cron context tagged with `AppComponent.GEN_CRON`.

**Operational notes:** Iterates all workspaces sequentially. Implementation lives in core; this folder documents the WebAPI-scheduled cron only.
