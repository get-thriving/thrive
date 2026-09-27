import type { Config } from "@react-router/dev/config";
import { PUBLISHED_ROUTE_PREFIX } from "@jupiter/core/common/sub/publish/published-share-url";

export default {
  ssr: true,
  // Every route of this service lives under `/publish`, so the router owns that
  // prefix instead of each route path repeating it. It also keeps client
  // requests such as `/publish/__manifest` inside the mount that nginx proxies
  // here in the self-hosted single-domain setup. Shared with the share urls the
  // WebUI hands out, so there is one place that says where this service lives.
  basename: PUBLISHED_ROUTE_PREFIX,
} satisfies Config;
