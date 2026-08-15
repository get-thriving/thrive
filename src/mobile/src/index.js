import { SplashScreen } from "@capacitor/splash-screen";

import { getWebUiUrl } from "./config";
import { prepareTelemetry, recordLaunchFailure } from "./telemetry";

prepareTelemetry();

document.addEventListener("DOMContentLoaded", async () => {
  await SplashScreen.hide();

  let webUiUrl;
  try {
    webUiUrl = await getWebUiUrl();
  } catch (err) {
    // Working out which URL to open needs the device to answer questions about
    // itself. If that fails there is nothing to retry towards.
    recordLaunchFailure(err, "resolve-webui-url");
    window.location.href = "/error.html?reported=1";
    return;
  }

  try {
    await loadURLWithTimeout(webUiUrl.toString());
  } catch (err) {
    recordLaunchFailure(err, "load-webui");
    window.location.href = "/error.html?reported=1";
  }
});

function loadURLWithTimeout(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    let isTimeout = false;

    const timeoutId = setTimeout(() => {
      isTimeout = true;
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("error", handleError);
      reject(new Error(`Loading URL timed out after ${timeout} ms`));
    }, timeout);

    const handleLoad = () => {
      if (!isTimeout) {
        clearTimeout(timeoutId);
        window.removeEventListener("load", handleLoad);
        window.removeEventListener("error", handleError);
        resolve();
      }
    };

    const handleError = () => {
      if (!isTimeout) {
        clearTimeout(timeoutId);
        window.removeEventListener("load", handleLoad);
        window.removeEventListener("error", handleError);
        reject(new Error("Failed to load URL"));
      }
    };

    setTimeout(() => {
      window.location.href = url;
      window.addEventListener("load", handleLoad);
      window.addEventListener("error", handleError);
    }, 100);
  });
}
