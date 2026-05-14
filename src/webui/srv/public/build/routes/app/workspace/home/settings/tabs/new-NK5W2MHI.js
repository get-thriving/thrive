import {
  IconSelector
} from "/build/_shared/chunk-IU4ODRE6.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import "/build/_shared/chunk-Z3RPM676.js";
import {
  LeafPanel,
  makeLeafErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  FormControl_default,
  InputLabel_default,
  OutlinedInput_default,
  ToggleButtonGroup_default,
  ToggleButton_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_dist as require_dist2
} from "/build/_shared/chunk-ZZL6WUOE.js";
import "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  useActionData,
  useNavigation
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

// app/routes/app/workspace/home/settings/tabs/new.tsx
var import_webapi_client3 = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react3 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());

// ../core/jupiter/core/home/component/home-tab-target-select.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);

// ../core/jupiter/core/home/sub/tab/target.ts
var import_webapi_client = __toESM(require_dist(), 1);
function homeTabTargetName(target) {
  switch (target) {
    case import_webapi_client.HomeTabTarget.BIG_SCREEN:
      return "Big Screen";
    case import_webapi_client.HomeTabTarget.SMALL_SCREEN:
      return "Small Screen";
  }
}

// ../core/jupiter/core/home/component/home-tab-target-select.tsx
function HomeTabTargetSelect(props) {
  const [target, setTarget] = (0, import_react.useState)(props.defaultValue);
  (0, import_react.useEffect)(() => {
    setTarget(props.defaultValue);
  }, [props.defaultValue]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      ToggleButtonGroup_default,
      {
        value: target,
        exclusive: true,
        fullWidth: true,
        onChange: (_, newTarget) => newTarget !== null && setTarget(newTarget),
        children: [
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "target-big-screen",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.HomeTabTarget.BIG_SCREEN,
              children: homeTabTargetName(import_webapi_client2.HomeTabTarget.BIG_SCREEN)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/home/component/home-tab-target-select.tsx",
              lineNumber: 28,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "target-small-screen",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.HomeTabTarget.SMALL_SCREEN,
              children: homeTabTargetName(import_webapi_client2.HomeTabTarget.SMALL_SCREEN)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/home/component/home-tab-target-select.tsx",
              lineNumber: 36,
              columnNumber: 9
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/home/component/home-tab-target-select.tsx",
        lineNumber: 22,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("input", { name: props.name, type: "hidden", value: target }, void 0, false, {
      fileName: "../core/jupiter/core/home/component/home-tab-target-select.tsx",
      lineNumber: 45,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/home/component/home-tab-target-select.tsx",
    lineNumber: 21,
    columnNumber: 5
  }, this);
}

// app/routes/app/workspace/home/settings/tabs/new.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/home/settings/tabs/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/home/settings/tabs/new.tsx"
  );
  import.meta.hot.lastModified = "1775685113118.0627";
}
var ParamsSchema = external_exports.object({});
var CreateFormSchema = external_exports.object({
  target: external_exports.nativeEnum(import_webapi_client3.HomeTabTarget),
  name: external_exports.string(),
  icon: external_exports.string().optional()
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function NewTab() {
  _s();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react3.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: "home/settings/tab/new", returnLocation: "/app/workspace/home/settings", inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
      lineNumber: 78,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "New Tab", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "tab-create", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "tab-create",
      text: "Create",
      value: "create",
      disabled: !inputsEnabled,
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
      lineNumber: 79,
      columnNumber: 85
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
          lineNumber: 87,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled, defaultValue: "" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
          lineNumber: 88,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
          lineNumber: 89,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
        lineNumber: 86,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(HomeTabTargetSelect, { name: "target", defaultValue: import_webapi_client3.HomeTabTarget.BIG_SCREEN, inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
          lineNumber: 93,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/target" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
          lineNumber: 94,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
        lineNumber: 92,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "icon", children: "Icon" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
          lineNumber: 97,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(IconSelector, { readOnly: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
          lineNumber: 98,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/icon" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
          lineNumber: 99,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
        lineNumber: 96,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
      lineNumber: 79,
      columnNumber: 7
    }, this)
  ] }, "home-tab/new", true, {
    fileName: "app/routes/app/workspace/home/settings/tabs/new.tsx",
    lineNumber: 77,
    columnNumber: 10
  }, this);
}
_s(NewTab, "G7puvUxUXA/5akLEuLt3IBDsrwc=", false, function() {
  return [useActionData, useNavigation];
});
_c = NewTab;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/home/settings", ParamsSchema, {
  notFound: () => `Could not find the tab!`,
  error: () => `There was an error creating the tab! Please try again!`
});
var _c;
$RefreshReg$(_c, "NewTab");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NewTab as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/home/settings/tabs/new-NK5W2MHI.js.map
