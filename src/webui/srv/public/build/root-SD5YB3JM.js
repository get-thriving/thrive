import {
  SnackbarProvider
} from "/build/_shared/chunk-43PAR6MS.js";
import {
  getPublicName
} from "/build/_shared/chunk-L6BTFETC.js";
import "/build/_shared/chunk-NLP5SXQ3.js";
import {
  CssBaseline_default,
  ThemeProvider,
  createTheme,
  styled_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useLoaderData
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

// app/root.tsx
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());

// ../core/jupiter/core/infra/component/env-banner.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function EnvBanner({ env }) {
  switch (env) {
    case import_webapi_client.Env.PRODUCTION:
      return null;
    case import_webapi_client.Env.STAGING:
      return /* @__PURE__ */ jsxDEV(EnvBannerSection, { children: /* @__PURE__ */ jsxDEV("div", { children: "You are running a staging build" }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/env-banner.tsx",
        lineNumber: 15,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/env-banner.tsx",
        lineNumber: 14,
        columnNumber: 9
      }, this);
    case import_webapi_client.Env.LOCAL:
      return /* @__PURE__ */ jsxDEV(EnvBannerSection, { children: /* @__PURE__ */ jsxDEV("div", { children: "You are running a local build" }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/env-banner.tsx",
        lineNumber: 21,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/env-banner.tsx",
        lineNumber: 20,
        columnNumber: 9
      }, this);
  }
}
var EnvBannerSection = styled_default("section")`
  z-index: 99999;
  position: fixed;
  bottom: 0vh;
  width: 100%;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: #ffe08a;
`;

// app/root.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/root.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/root.tsx"
  );
  import.meta.hot.lastModified = "1775685113110.0627";
}
function buildTheme(useNightMode) {
  return createTheme({
    palette: {
      mode: useNightMode ? "dark" : "light",
      primary: {
        main: "#3F51B5",
        light: "#7986CB",
        dark: "#303F9F"
      },
      secondary: {
        main: "#FF4081",
        light: "#FF79B0",
        dark: "#C60055"
      },
      ...!useNightMode && {
        divider: "#E0E0E0",
        text: {
          primary: "#212121",
          secondary: "#757575",
          disabled: "#BDBDBD"
        }
      }
    },
    typography: {
      fontFamily: '"Helvetica", "Arial", sans-serif'
    },
    ...useNightMode && {
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              border: "1px solid rgba(255, 255, 255, 0.12)"
            }
          }
        }
      }
    }
  });
}
function meta({
  data
}) {
  return [{
    charset: "utf-8"
  }, {
    title: getPublicName(data.globalProperties)
  }];
}
function links() {
  return [{
    rel: "manifest",
    href: "/pwa-manifest"
  }];
}
var shouldRevalidate = ({
  nextUrl
}) => {
  return nextUrl.searchParams.has("invalidateTopLevel");
};
function Root() {
  _s();
  const loaderData = useLoaderData();
  const osPrefersDark = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false;
  const [systemNightMode, setSystemNightMode] = (0, import_react2.useState)(osPrefersDark);
  (0, import_react2.useEffect)(() => {
    if (loaderData.useNightMode !== null)
      return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemNightMode(mq.matches);
    const handler = (e) => setSystemNightMode(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [loaderData.useNightMode]);
  const effectiveNightMode = loaderData.useNightMode ?? systemNightMode;
  const theme = (0, import_react2.useMemo)(() => buildTheme(effectiveNightMode), [effectiveNightMode]);
  return /* @__PURE__ */ jsxDEV("html", { lang: "en", children: [
    /* @__PURE__ */ jsxDEV("head", { children: [
      /* @__PURE__ */ jsxDEV("meta", { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" }, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 124,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Meta, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 125,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Links, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 126,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/root.tsx",
      lineNumber: 123,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("body", { children: [
      /* @__PURE__ */ jsxDEV(import_react2.StrictMode, { children: /* @__PURE__ */ jsxDEV(ThemeProvider, { theme, children: /* @__PURE__ */ jsxDEV(SnackbarProvider, { children: [
        /* @__PURE__ */ jsxDEV(CssBaseline_default, {}, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 132,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(EnvBanner, { env: loaderData.globalProperties.env }, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 133,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 134,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/root.tsx",
        lineNumber: 131,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 130,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 129,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Scripts, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 138,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(LiveReload, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 139,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/root.tsx",
      lineNumber: 128,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/root.tsx",
    lineNumber: 122,
    columnNumber: 10
  }, this);
}
_s(Root, "HGByz+Obg7Knph1hEE9cZXRnVS4=", false, function() {
  return [useLoaderData];
});
_c = Root;
var _c;
$RefreshReg$(_c, "Root");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Root as default,
  links,
  meta,
  shouldRevalidate
};
//# sourceMappingURL=/build/root-SD5YB3JM.js.map
