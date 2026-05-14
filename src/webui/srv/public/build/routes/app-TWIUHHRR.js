import {
  registerPlugin
} from "/build/_shared/chunk-UM44QNUN.js";
import {
  GlobalPropertiesContext,
  ServicePropertiesContext
} from "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_frontdoor
} from "/build/_shared/chunk-7YAKCRRX.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Outlet,
  useLoaderData,
  useNavigate
} from "/build/_shared/chunk-VVGD4GL7.js";
import "/build/_shared/chunk-V5CWULKU.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import "/build/_shared/chunk-JFC3UFZQ.js";
import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";
import "/build/_shared/chunk-ZIPKILLR.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../../node_modules/@capacitor/app/dist/esm/index.js
var App = registerPlugin("App", {
  web: () => import("/build/_shared/web-W5UOXEVV.js").then((m) => new m.AppWeb())
});

// ../../node_modules/@capacitor/splash-screen/dist/esm/index.js
var SplashScreen = registerPlugin("SplashScreen", {
  web: () => import("/build/_shared/web-DAD6IC3N.js").then((m) => new m.SplashScreenWeb())
});

// app/routes/app.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_frontdoor = __toESM(require_frontdoor());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app.tsx"
  );
  import.meta.hot.lastModified = "1775685113111.0142";
}
var shouldRevalidate = () => false;
function App2() {
  _s();
  const loaderData = useLoaderData();
  const navigate = useNavigate();
  (0, import_react2.useEffect)(() => {
    if (loaderData.serviceProperties.frontDoorInfo.appShell === import_webapi_client.AppShell.MOBILE_CAPACITOR) {
      SplashScreen.hide();
    }
    async function setupBackButton() {
      const backHandler = await App.addListener("backButton", () => {
        if (window.history.state?.idx > 0) {
          navigate(-1);
        } else {
          App.exitApp();
        }
      });
      return () => {
        backHandler.remove();
      };
    }
    if (loaderData.serviceProperties.frontDoorInfo.appPlatform === import_webapi_client.AppPlatform.MOBILE_ANDROID || loaderData.serviceProperties.frontDoorInfo.appPlatform === import_webapi_client.AppPlatform.TABLET_ANDROID) {
      setupBackButton();
    }
  }, [loaderData.serviceProperties.frontDoorInfo, navigate]);
  return /* @__PURE__ */ jsxDEV(GlobalPropertiesContext.Provider, { value: loaderData.globalProperties, children: /* @__PURE__ */ jsxDEV(ServicePropertiesContext.Provider, { value: loaderData.serviceProperties, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
    fileName: "app/routes/app.tsx",
    lineNumber: 68,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/routes/app.tsx",
    lineNumber: 67,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/app.tsx",
    lineNumber: 66,
    columnNumber: 10
  }, this);
}
_s(App2, "N2SatOuRU4egVdk46n1pt2MrA7A=", false, function() {
  return [useLoaderData, useNavigate];
});
_c = App2;
var _c;
$RefreshReg$(_c, "App");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  App2 as default,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app-TWIUHHRR.js.map
