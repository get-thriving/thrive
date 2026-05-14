<!-- markdownlint-disable-file MD013 -->

# Search mutation log drain do-all cron

**Schedule:** Every 30 seconds (`*/30 * * * * *`, six-field crontab including seconds), defined on the use case class.

**What it does:** Drains the deferred search mutation queue. Claims up to 100 rows in `unindexed` state (ordered by creation time), applies indexing for each mutation via `SearchIndexingForMutationService`, then marks rows `INDEXED`. Cron context uses `AppComponent.SEARCH_MUTATION_LOG_DRAIN`.

**Operational notes:** High frequency relative to other crons; intended to keep near-real-time indexing latency low. Implementation lives in core; this folder documents the WebAPI-scheduled cron only.
