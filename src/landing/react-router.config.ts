import type { Config } from "@react-router/dev/config";

export default {
  // No server: every page is rendered to a file at build time and the result is
  // hosted as a static site (ADR 0022). A route that is not listed in
  // `prerender` would have no page at all, so list every one of them.
  ssr: false,
  prerender: ["/", "/terms-conditions", "/privacy-policy"],
} satisfies Config;
