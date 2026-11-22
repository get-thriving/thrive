import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, route } from "@react-router/dev/routes";

// Every page the site has. Each one must also be listed in `prerender` in
// react-router.config.ts, as there is no server to render it on request.

export default [
  layout("routes/site.tsx", [
    index("routes/home.tsx"),
    route("terms-conditions", "routes/terms-conditions.tsx"),
    route("privacy-policy", "routes/privacy-policy.tsx"),
  ]),
] satisfies RouteConfig;
