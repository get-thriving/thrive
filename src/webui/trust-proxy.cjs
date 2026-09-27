"use strict";

// react-router-serve does not enable Express `trust proxy`. Behind nginx the
// browser origin is https://host:port while Express reports http, and React
// Router rejects the login POST as a CSRF mismatch. This wraps the Express
// that react-router-serve loads so the app trusts X-Forwarded-Proto / Host.
const Module = require("module");
const originalRequire = Module.prototype.require;

Module.prototype.require = function (id) {
  const loaded = originalRequire.apply(this, arguments);
  if (
    id !== "express" ||
    typeof loaded !== "function" ||
    loaded.__trustProxyPatched
  ) {
    return loaded;
  }

  function express(...args) {
    const app = loaded(...args);
    app.set("trust proxy", 1);
    return app;
  }

  Object.assign(express, loaded);
  Object.setPrototypeOf(express, loaded);
  express.__trustProxyPatched = true;
  return express;
};
