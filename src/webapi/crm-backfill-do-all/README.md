# CRM backfill do-all

**What it does:** Reconciles the CRM entity indexing map with domain users. It loads all unarchived users, compares them to `crm_entity_indexing_map` rows, re-syncs missing or stale users via `CRMEntityIndexService`, and removes stale map rows when users are no longer present in the domain.

**Intended schedule:** Hourly (same cadence as search index backfill). Wired in Render, PM2 (`WEBAPI_CRON_FOLDERS`), and self-hosted compose.

**Further reading:** Mirrors the search indexing map pattern (ADR 0007, ADR 0009).

**Operational notes:** Implementation lives in core; this package is the WebAPI entrypoint for running `CrmBackfillDoAllUseCase`. Wix deployment metadata uses hardcoded extended-field keys in `jupiter.core.crm.impl.wix`.
