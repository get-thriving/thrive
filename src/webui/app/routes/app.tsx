import { App as CapacitorApp } from "@capacitor/app";
import { SplashScreen } from "@capacitor/splash-screen";
import { AppPlatform, AppShell } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import {
  GlobalPropertiesContext,
  serverToClientGlobalProperties,
} from "@jupiter/core/config-client";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { FrontDoorInfoContext } from "@jupiter/core/infra/frontdoor-info-context";
import { OverdueThresholdsContext } from "@jupiter/core/infra/overdue-thresholds-context";
import { ServiceLinksContext } from "@jupiter/core/infra/service-links-context";
import { loadFrontDoorInfo } from "@jupiter/core/frontdoor.server";

import { ServicePropertiesContext } from "~/logic/config";
import {
  SERVICE_PROPERTIES,
  serverToClientServiceProperties,
} from "~/logic/config.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // This is the only place where we can read this field.
  const frontDoor = await loadFrontDoorInfo(
    GLOBAL_PROPERTIES.version,
    request.headers.get("Cookie"),
    request.headers.get("User-Agent"),
  );

  return json({
    globalProperties: serverToClientGlobalProperties(GLOBAL_PROPERTIES),
    serviceProperties: serverToClientServiceProperties(
      SERVICE_PROPERTIES,
      frontDoor,
    ),
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      loaderData.serviceProperties.frontDoorInfo.appShell ===
      AppShell.MOBILE_CAPACITOR
    ) {
      SplashScreen.hide();
    }

    async function setupBackButton() {
      const backHandler = await CapacitorApp.addListener("backButton", () => {
        if (window.history.state?.idx > 0) {
          navigate(-1);
        } else {
          CapacitorApp.exitApp();
        }
      });

      return () => {
        backHandler.remove();
      };
    }

    if (
      loaderData.serviceProperties.frontDoorInfo.appPlatform ===
        AppPlatform.MOBILE_ANDROID ||
      loaderData.serviceProperties.frontDoorInfo.appPlatform ===
        AppPlatform.TABLET_ANDROID
    ) {
      setupBackButton();
    }
  }, [loaderData.serviceProperties.frontDoorInfo, navigate]);

  return (
    <GlobalPropertiesContext.Provider value={loaderData.globalProperties}>
      <ServicePropertiesContext.Provider value={loaderData.serviceProperties}>
        <FrontDoorInfoContext.Provider
          value={loaderData.serviceProperties.frontDoorInfo}
        >
          <ServiceLinksContext.Provider value={loaderData.serviceProperties}>
            <OverdueThresholdsContext.Provider
              value={loaderData.serviceProperties}
            >
              <Outlet />
            </OverdueThresholdsContext.Provider>
          </ServiceLinksContext.Provider>
        </FrontDoorInfoContext.Provider>
      </ServicePropertiesContext.Provider>
    </GlobalPropertiesContext.Provider>
  );
}
