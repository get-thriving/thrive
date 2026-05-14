<!-- markdownlint-disable-file MD013 -->

# Search mutation log processing requeue do-all cron

**Schedule:** Every 5 minutes (`*/5 * * * *`), defined on the use case class.

**What it does:** Recovers stuck work on the search mutation log. Calls `reset_all_processing_to_unindexed` so rows left in `processing` (e.g. after a crash or timeout) become `unindexed` again and can be claimed by the drain cron. Cron context uses `AppComponent.SEARCH_MUTATION_LOG_PROCESSING_REQUEUE`.

**Operational notes:** Complements `SearchMutationLogDrainDoAllUseCase`; without it, stale `processing` claims could block progress. Implementation lives in core; this folder documents the WebAPI-scheduled cron only.
