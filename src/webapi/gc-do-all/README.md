<!-- markdownlint-disable-file MD013 -->

# GC do-all cron

**Schedule:** Hourly at minute 0 (`0 * * * *`), inherited from `JupiterBackgroundMutationUseCase` in `jupiter.core.config` (no per-class override).

**What it does:** Runs garbage collection for every non-archived workspace. For each workspace it resolves the owning user and feature sync targets, then invokes `GCService` under a cron domain context tagged with `AppComponent.GC_CRON`.

**Operational notes:** Long-running across all workspaces; progress reporting uses the background “nothing” reporter. Implementation lives in core; this folder documents the WebAPI-scheduled cron only.
