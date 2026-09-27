import path from "node:path";
import { fileURLToPath } from "node:url";

import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CORE_DIR = path.resolve(HERE, "../core/jupiter/core");

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
    strictPort: true,
  },
  resolve: {
    // One copy of each of these, whichever package imported it. MUI ships both
    // an ESM and a CommonJS build with no `exports` map, so without a fixed
    // main field the server can end up with two copies and two theme contexts.
    dedupe: [
      "react",
      "react-dom",
      "react-router",
      "@mui/material",
      "@mui/system",
      "@mui/private-theming",
      "@mui/styled-engine",
      "@emotion/react",
      "@emotion/styled",
    ],
    mainFields: ["module", "main"],
    alias: [
      { find: /^~\//, replacement: `${path.resolve(HERE, "app")}/` },
      { find: /^#\/core\//, replacement: `${CORE_DIR}/` },
      { find: /^@jupiter\/core\//, replacement: `${CORE_DIR}/` },
    ],
  },
  // Everything the routes pull in, pre-bundled at startup. Vite otherwise
  // discovers these one route at a time, and each discovery re-optimizes and
  // reloads mid-session, which leaves two copies of React in the page
  // ("Invalid hook call" / useContext of null). React Router's
  // `unstable_optimizeDeps` does the same by crawling all routes, but that adds
  // ~2.5 minutes to a cold start. To regenerate: turn that flag on in
  // react-router.config.ts, start the dev server, and copy the keys of
  // `optimized` from node_modules/.vite/deps/_metadata.json.
  optimizeDeps: {
    include: [
      "@babel/runtime/helpers/esm/extends",
      "@babel/runtime/helpers/extends",
      "@calumk/editorjs-codecup",
      "@capacitor/app",
      "@capacitor/splash-screen",
      "@editorjs/checklist",
      "@editorjs/delimiter",
      "@editorjs/editorjs",
      "@editorjs/header",
      "@editorjs/nested-list",
      "@editorjs/quote",
      "@editorjs/table",
      "@emotion/react/jsx-dev-runtime",
      "@googlemaps/js-api-loader",
      "@hello-pangea/dnd",
      "@jupiter/webapi-client",
      "@mui/icons-material",
      "@mui/icons-material/AccountCircle",
      "@mui/icons-material/Add",
      "@mui/icons-material/ArrowBack",
      "@mui/icons-material/ArrowBackIosNew",
      "@mui/icons-material/ArrowDownward",
      "@mui/icons-material/ArrowForward",
      "@mui/icons-material/ArrowForwardIos",
      "@mui/icons-material/ArrowUpward",
      "@mui/icons-material/CalendarMonth",
      "@mui/icons-material/Close",
      "@mui/icons-material/DateRange",
      "@mui/icons-material/EventAvailable",
      "@mui/icons-material/ExpandMore",
      "@mui/icons-material/Flag",
      "@mui/icons-material/Flare",
      "@mui/icons-material/GroupWork",
      "@mui/icons-material/History",
      "@mui/icons-material/Launch",
      "@mui/icons-material/Logout",
      "@mui/icons-material/Luggage",
      "@mui/icons-material/Menu",
      "@mui/icons-material/OpenInNew",
      "@mui/icons-material/Policy",
      "@mui/icons-material/QuestionAnswer",
      "@mui/icons-material/Reorder",
      "@mui/icons-material/Security",
      "@mui/icons-material/SmartToy",
      "@mui/icons-material/SportsEsports",
      "@mui/icons-material/Tune",
      "@mui/icons-material/ViewKanban",
      "@mui/icons-material/ViewList",
      "@mui/icons-material/ViewTimeline",
      "@mui/icons-material/VpnKey",
      "@mui/material",
      "@mui/material/Grid2",
      "@mui/material/styles",
      "@nivo/calendar",
      "@nivo/line",
      "@popperjs/core",
      "buffer-polyfill",
      "clsx",
      "dotenv",
      "editorjs-drag-drop",
      "emoji-picker-react",
      "framer-motion",
      "hoist-non-react-statics",
      "http-status-codes",
      "ical-generator",
      "js-cookie",
      "luxon",
      "notistack",
      "prop-types",
      "react",
      "react-dom",
      "react-dom/client",
      "react-is",
      "react-router",
      "react-router/dom",
      "react-transition-group",
      "react/jsx-dev-runtime",
      "react/jsx-runtime",
      "stylis",
      "ua-parser-js",
      "zod",
      "zodix",
    ],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /gen\/ts\/webapi-client/],
    },
  },
  ssr: {
    // Let Node load the CommonJS API client itself rather than having Vite
    // inline a linked workspace package.
    external: ["@jupiter/webapi-client"],
    noExternal: [
      // Core is shipped as TS source, so it must go through the bundler.
      /^@jupiter\/core(\/.*)?$/,
      // MUI's ESM builds use directory imports, which Node's ESM loader rejects.
      /^@mui\//,
      // Emotion has to travel with MUI: MUI's styled components read the theme
      // from emotion's own context, so a second copy of emotion leaves them
      // rendering with the default theme.
      /^@emotion\//,
    ],
  },
  plugins: [reactRouter()],
});
