import { resolveConfig } from "vite";
const c = await resolveConfig(
  { configFile: "/Users/horia/Work/thrive/src/webui/vite.config.mts" },
  "serve",
);
console.log("ssr.noExternal:", JSON.stringify(c.ssr?.noExternal));
console.log("ssr.external:", JSON.stringify(c.ssr?.external));
console.log(
  "ssr.resolve.mainFields:",
  JSON.stringify(c.ssr?.resolve?.mainFields),
);
console.log(
  "ssr.resolve.conditions:",
  JSON.stringify(c.ssr?.resolve?.conditions),
);
console.log("resolve.mainFields:", JSON.stringify(c.resolve?.mainFields));
console.log("resolve.dedupe:", JSON.stringify(c.resolve?.dedupe));
