<!-- markdownlint-disable-file MD013 -->

# Search index backfill do-all cron

**Schedule:** Hourly at minute 0 (`0 * * * *`), inherited from `JupiterBackgroundMutationUseCase` in `jupiter.core.config` (no per-class `@background_mutation_use_case` override on this class).

**What it does:** Reconciles the search entity indexing map with domain state. For each workspace and each `NamedEntityTag`, it loads entity summaries from the domain DB, compares them to `search_entity_indexing_map` rows, re-indexes missing or stale entities via `SearchEntityIndexService`, and removes stale index entries when the map has rows no longer present in the domain. Cron context uses `AppComponent.SEARCH_INDEX_BACKFILL`.

**Further reading:** [ADR 0007: Search entity indexing map and backfill cron](../../../docs/adrs/0007.search-entity-indexing-map-and-hourly-backfill.md).

**Operational notes:** Can be heavy on large workspaces because it walks entity types systematically. Implementation lives in core; this folder documents the WebAPI-scheduled cron only.
