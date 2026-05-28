from enum import Enum


class AppComponent(str, Enum):
    APP = "app"
    CLI = "cli"
    GC_CRON = "gc-cron"
    GEN_CRON = "gen-cron"
    SCHEDULE_EXTERNAL_SYNC_CRON = "schedule-external-sync-cron"
    SEARCH_INDEX_BACKFILL = "search-index-backfill"
    SEARCH_MUTATION_LOG_DRAIN = "search-mutation-log-drain"
    SEARCH_MUTATION_REQUEUE = "search-mutation-requeue"
    STATS_CRON = "stats-cron"
    WEB = "web"

    def __str__(self) -> str:
        return str(self.value)
