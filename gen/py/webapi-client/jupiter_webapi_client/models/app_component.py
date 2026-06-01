from enum import Enum


class AppComponent(str, Enum):
    APP = "app"
    CLEAR_ABANDONED_USERS_CRON = "clear-abandoned-users-cron"
    CLI = "cli"
    CRM_BACKFILL = "crm-backfill"
    GC_CRON = "gc-cron"
    GEN_CRON = "gen-cron"
    SCHEDULE_EXTERNAL_SYNC_CRON = "schedule-external-sync-cron"
    SEARCH_INDEX_BACKFILL = "search-index-backfill"
    SEARCH_MUTATION_LOG_DRAIN = "search-mutation-log-drain"
    SEARCH_MUTATION_REQUEUE = "search-mutation-requeue"
    STATS_CRON = "stats-cron"
    SYNC_GOOGLE_USER_DATA_DO_ALL = "sync-google-user-data-do-all"
    WEB = "web"

    def __str__(self) -> str:
        return str(self.value)
