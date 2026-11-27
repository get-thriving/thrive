# CRM backfill do-all

**What it does:** Reconciles the CRM entity indexing map with domain users. It loads all unarchived users, compares them to `crm_entity_indexing_map` rows, re-syncs missing or stale users via `CRMEntityIndexService`, and removes stale map rows when users are no longer present in the domain.

**Intended schedule:** Hourly (same cadence as search index backfill). Wired in Render, PM2 (`WEBAPI_CRON_FOLDERS`), and self-hosted compose.

**Further reading:** Mirrors the search indexing map pattern (ADR 0007, ADR 0009).

**Operational notes:** Implementation lives in core; this package is the WebAPI entrypoint for running `CrmBackfillDoAllUseCase`. The CRM is Resend (`jupiter.core.apps.crm.impl.resend`): one global contact per email, with the deployment recorded in the `thrive_universe`, `thrive_env` and `thrive_instance` contact properties. Bump `INDEX_METHOD_VERSION` in `entity_index.py` to push every user through the CRM again, e.g. after changing what is stored on a contact.
