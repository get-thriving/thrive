import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CORE_DIR = path.resolve(HERE, "../core/jupiter/core");
const ASSETS_DIR = path.resolve(HERE, "../../assets");

// The page is static, so where its links point is decided when it is built.
// `src/Config.global` says where the hosted apps live; the environment
// (`WEBUI_URL`, `DOCS_URL`, as every other service reads them) overrides it, so
// a local build links to the local WebUI.
const GLOBAL = parseEnv(
  readFileSync(path.resolve(HERE, "../Config.global"), "utf-8"),
);

function withoutTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

const LANDING_LINKS = {
  appUrl: withoutTrailingSlash(
    process.env.WEBUI_URL ?? GLOBAL.HOSTED_GLOBAL_WEBUI_URL ?? "",
  ),
  docsUrl: withoutTrailingSlash(
    process.env.DOCS_URL ?? "https://docs.get-thriving.com",
  ),
  communityUrl: GLOBAL.COMMUNITY_URL ?? "",
  sourceUrl: "https://github.com/get-thriving/thrive",
  supportEmail: "mike@get-thriving.com",
};

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
    strictPort: true,
  },
  define: {
    __LANDING_LINKS__: JSON.stringify(LANDING_LINKS),
  },
  resolve: {
    alias: [
      { find: /^~\//, replacement: `${path.resolve(HERE, "app")}/` },
      { find: /^@assets\//, replacement: `${ASSETS_DIR}/` },
      { find: /^#\/core\//, replacement: `${CORE_DIR}/` },
      { find: /^@jupiter\/core\//, replacement: `${CORE_DIR}/` },
    ],
  },
  plugins: [reactRouter()],
});
