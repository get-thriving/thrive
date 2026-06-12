const { createRoutesFromFolders } = require("@remix-run/v1-route-convention");

/** @type {import('@remix-run/dev').AppConfig} */
const config = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  // The published service always lives under the `/publish` path: its routes are
  // `/publish/*` and, in self-hosted mode, nginx mounts it at `/publish` on the
  // shared domain (without stripping the prefix). Serve the client bundle under
  // `/publish/build/` too, so asset requests stay within that mount instead of
  // hitting the root (which nginx routes to the WebUI). Assets are still written
  // to `public/build`; only the URL prefix changes.
  publicPath: "/publish/build/",
  routes(defineRoutes) {
    return createRoutesFromFolders(defineRoutes);
  },
  watchPaths: ["../core"],
  serverDependenciesToBundle: [/^@jupiter\/core(\/.*)?$/],
};

module.exports = config;
