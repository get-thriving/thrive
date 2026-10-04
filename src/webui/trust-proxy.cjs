"use strict";

// react-router-serve does not enable Express `trust proxy`. Behind a reverse
// proxy the browser Origin is the public https URL, while the URL React Router
// builds can be http, or https on an internal port. Page actions (login, "add
// chores to a time plan", and the other add-from forms) are rejected as a CSRF
// mismatch before the action runs. Resource routes skip that check.
//
// This wraps the Express that react-router-serve loads so the app trusts
// X-Forwarded-Proto / Host, then aligns those headers with the browser Origin
// when that origin is already the public host. Serve 8 imports Express from an
// ES module, which loads the resolved file path. require() loads the bare
// "express" name. Both go through Module._load.
const Module = require("module");
const { fileURLToPath } = require("url");
const originalLoad = Module._load;
const expressEntry = require.resolve("express");

Module._load = function (request) {
  const loaded = originalLoad.apply(this, arguments);
  if (
    !isExpressLoad(request) ||
    typeof loaded !== "function" ||
    loaded.__trustProxyPatched
  ) {
    return loaded;
  }

  function express(...args) {
    const app = loaded(...args);
    app.set("trust proxy", 1);
    app.use(alignForwardedOrigin);
    return app;
  }

  Object.assign(express, loaded);
  Object.setPrototypeOf(express, loaded);
  express.__trustProxyPatched = true;
  return express;
};

function isExpressLoad(request) {
  if (typeof request !== "string") return false;
  if (request === "express" || request === expressEntry) return true;
  let path = request;
  if (path.startsWith("file://")) {
    try {
      path = fileURLToPath(path);
    } catch {
      return false;
    }
  }
  return /[/\\]express[/\\]index\.(js|cjs)$/.test(path);
}

function firstHeader(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return "";
  return raw.split(",")[0].trim();
}

function hostnameOnly(host) {
  const first = firstHeader(host);
  if (!first) return "";
  if (first.startsWith("[")) {
    const end = first.indexOf("]");
    return (end === -1 ? first : first.slice(1, end)).toLowerCase();
  }
  return first.split(":")[0].toLowerCase();
}

function configuredWebUiHostnames() {
  const names = new Set();
  for (const key of ["HOSTED_GLOBAL_WEBUI_URL", "WEBUI_URL"]) {
    const raw = process.env[key];
    if (!raw) continue;
    try {
      names.add(new URL(raw).hostname.toLowerCase());
    } catch {
      // A missing or relative config URL is not a public host.
    }
  }
  return names;
}

// React Router compares Origin to the origin of request.url. Express builds
// that URL from X-Forwarded-Host when it has no port, then fills the port in
// from the internal Host header (for example :10000). The browser Origin has
// no such port, so the check fails. Copy the browser host and scheme onto the
// forwarded headers when the hostnames already agree, or when Render's
// onrender.com host is standing in for the configured public host.
function alignForwardedOrigin(req, _res, next) {
  const originHeader = firstHeader(req.headers.origin);
  if (!originHeader || originHeader === "null") {
    next();
    return;
  }

  let originUrl;
  try {
    originUrl = new URL(originHeader);
  } catch {
    next();
    return;
  }
  if (originUrl.protocol !== "https:" && originUrl.protocol !== "http:") {
    next();
    return;
  }

  const publicHost =
    firstHeader(req.headers["x-forwarded-host"]) ||
    firstHeader(req.headers.host);
  const publicHostname = hostnameOnly(publicHost);
  const originHostname = originUrl.hostname.toLowerCase();
  const samePublicHost =
    publicHostname !== "" && originHostname === publicHostname;
  const renderHostname = hostnameOnly(process.env.RENDER_EXTERNAL_HOSTNAME);
  const renderStandIn =
    process.env.RENDER === "true" &&
    configuredWebUiHostnames().has(originHostname) &&
    (publicHostname === renderHostname ||
      publicHostname.endsWith(".onrender.com"));

  if (samePublicHost || renderStandIn) {
    const proto = originUrl.protocol === "https:" ? "https" : "http";
    req.headers["x-forwarded-proto"] = proto;
    req.headers["x-forwarded-host"] = originUrl.host;
    req.headers.host = originUrl.host;
  }

  next();
}
