import { AppComponent } from "@jupiter/webapi-client";

export function appComponentName(source: AppComponent) {
  switch (source) {
    case AppComponent.CLI:
      return "Cli";
    case AppComponent.WEB:
      return "Web";
    case AppComponent.APP:
      return "App";
    case AppComponent.GC_CRON:
      return "GC Cron";
    case AppComponent.GEN_CRON:
      return "Gen Cron";
    case AppComponent.SCHEDULE_EXTERNAL_SYNC_CRON:
      return "Schedule External Sync Cron";
    case AppComponent.STATS_CRON:
      return "Stats Cron";
    case AppComponent.SEARCH_INDEX_BACKFILL:
      return "Search Index Backfill Cron";
    case AppComponent.SEARCH_MUTATION_LOG_DRAIN:
      return "Search Mutation Log Drain Cron";
    case AppComponent.SEARCH_MUTATION_LOG_PROCESSING_REQUEUE:
      return "Search Mutation Log Processing Re-Queue Cron";
  }
}
