import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, type Plugin } from "vite";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CORE_DIR = path.resolve(HERE, "../core/jupiter/core");
const ASSETS_DIR = path.resolve(HERE, "../../assets");

// The page is static, so where its links point is decided when it is built.
// Every setting is read from the environment first (`WEBUI_URL` and `DOCS_URL`
// are set by whatever runs the page: `run:srv`, `run:landing`, Render) and then
// from `src/Config.global`, and the build stops if one is missing: a page
// whose links point nowhere is worse than no page.
const GLOBAL = parseEnv(
  readFileSync(path.resolve(HERE, "../Config.global"), "utf-8"),
);

function requiredSetting(name: string): string {
  const value = process.env[name] ?? GLOBAL[name];
  if (value === undefined || value === "") {
    throw new Error(
      `The landing page needs ${name}: set it in the environment or in src/Config.global`,
    );
  }
  return value;
}

function withoutTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

// Fontsource sets `font-display: swap`, which draws the text in the fallback
// font and then switches it to Plex once that has loaded: a visible jump. The
// page is small and the fonts are served from the same place, so it waits for
// them instead (`block`), as the docs do.
function fontsourceBlockPlugin(): Plugin {
  return {
    name: "landing:fontsource-font-display-block",
    enforce: "pre",
    transform(code, id) {
      if (!/[\\/]@fontsource[\\/].*\.css$/.test(id.split("?")[0])) {
        return null;
      }
      return {
        code: code.replaceAll("font-display: swap", "font-display: block"),
        map: null,
      };
    },
  };
}

const LANDING_LINKS = {
  appUrl: withoutTrailingSlash(requiredSetting("WEBUI_URL")),
  docsUrl: withoutTrailingSlash(requiredSetting("DOCS_URL")),
  communityUrl: requiredSetting("COMMUNITY_URL"),
  sourceUrl: requiredSetting("SOURCE_URL"),
  supportEmail: requiredSetting("SUPPORT_EMAIL"),
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
  plugins: [fontsourceBlockPlugin(), reactRouter()],
});
