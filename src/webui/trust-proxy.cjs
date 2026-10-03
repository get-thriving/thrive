"use strict";

// react-router-serve does not enable Express `trust proxy`. Behind nginx the
// browser origin is https://host:port while Express reports http, and React
// Router rejects the login POST as a CSRF mismatch. This wraps the Express
// that react-router-serve loads so the app trusts X-Forwarded-Proto / Host.
//
// Serve 8 imports Express from an ES module, which loads the resolved file
// path. require() loads the bare "express" name. Both go through Module._load.
const Module = require("module");
const originalLoad = Module._load;
const expressEntry = require.resolve("express");

Module._load = function (request) {
  const loaded = originalLoad.apply(this, arguments);
  if (
    (request !== "express" && request !== expressEntry) ||
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
