import { config } from "dotenv";
import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";

import { Env, Hosting } from "../../gen/ts/webapi-client/dist";

config({
  path: ["Config.project", "../Config.global", "../../secrets/Config.secrets"],
});

let hostedGlobalWebUiUrl = process.env.HOSTED_GLOBAL_WEBUI_URL as string;
if (process.env.ENV === Env.LOCAL && process.env.BUILD_TARGET === "android") {
  hostedGlobalWebUiUrl = hostedGlobalWebUiUrl.replace("localhost", "10.0.2.2");
}

const frontDoorUrl = new URL(
  process.env.FRONTDOOR_PATTERN as string,
  hostedGlobalWebUiUrl,
);

export default defineConfig({
  root: "./src", // Source folder
  build: {
    outDir: "../dist", // Output folder
    emptyOutDir: true, // Clean the output folder before building
    rollupOptions: {
      input: ["./src/index.html", "./src/error.html"],
      preserveEntrySignatures: "strict",
    },
  },
  plugins: [
    handlebars({
      context: {
        android: process.env.BUILD_TARGET === "android",
        ios: process.env.BUILD_TARGET === "ios",
        title: process.env.PUBLIC_NAME,
        clientVersion: process.env.VERSION,
        webUiUrl: frontDoorUrl.toString(),
        universe: process.env.UNIVERSE,
        env: process.env.ENV,
        telemetry: process.env.TELEMETRY ?? "local",
        // A browser DSN is public by construction, so baking it into the
        // shipped bundle gives nothing away. Deliberately absent from
        // Config.project: dotenv resolves a multi-path load first-file-wins, so
        // a placeholder there would shadow the real value in Config.secrets.
        sentryPublicDsn: process.env.SENTRY_PUBLIC_DSN ?? "",
      },
    }),
  ],
});
