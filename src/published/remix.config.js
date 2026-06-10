const { createRoutesFromFolders } = require("@remix-run/v1-route-convention");

/** @type {import('@remix-run/dev').AppConfig} */
const config = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  routes(defineRoutes) {
    return createRoutesFromFolders(defineRoutes);
  },
  watchPaths: ["../core"],
  serverDependenciesToBundle: [/^@jupiter\/core(\/.*)?$/],
};

module.exports = config;
