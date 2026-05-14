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
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  LeafPanel,
  makeBranchErrorBoundary
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
  TextField_default
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

// app/routes/app/workspace/home/settings/tabs/$id/details.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist2());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/home/settings/tabs/$id/details.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/home/settings/tabs/$id/details.tsx"
  );
  import.meta.hot.lastModified = "1775685113118.467";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  icon: external_exports.string()
}), external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function HomeTabDetails() {
  _s();
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.HOME_TAB, entityRefId: loaderData.tab.ref_id, fakeKey: `home-tab-details-${loaderData.tab.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: loaderData.tab.archived, returnLocation: `/app/workspace/home/settings/tabs/${loaderData.tab.ref_id}`, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id/details.tsx",
      lineNumber: 126,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "home-tab-details", title: "Tab Details", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "home-tab-details", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "home-tab-details-update",
      text: "Update",
      value: "update",
      disabled: !inputsEnabled,
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id/details.tsx",
      lineNumber: 127,
      columnNumber: 71
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(TextField_default, { name: "name", label: "Name", defaultValue: loaderData.tab.name, disabled: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/details.tsx",
          lineNumber: 135,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/details.tsx",
          lineNumber: 136,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/home/settings/tabs/$id/details.tsx",
        lineNumber: 134,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "icon", children: "Icon" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/details.tsx",
          lineNumber: 140,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(IconSelector, { readOnly: !inputsEnabled, defaultIcon: loaderData.tab.icon }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/details.tsx",
          lineNumber: 141,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/icon" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/details.tsx",
          lineNumber: 142,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/home/settings/tabs/$id/details.tsx",
        lineNumber: 139,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id/details.tsx",
      lineNumber: 127,
      columnNumber: 7
    }, this)
  ] }, `home-tab-details-${loaderData.tab.ref_id}`, true, {
    fileName: "app/routes/app/workspace/home/settings/tabs/$id/details.tsx",
    lineNumber: 125,
    columnNumber: 10
  }, this);
}
_s(HomeTabDetails, "cNNulih4OKR31B2LOD4VKLYN844=", false, function() {
  return [useNavigation, useLoaderDataSafeForAnimation, useActionData];
});
_c = HomeTabDetails;
var ErrorBoundary = makeBranchErrorBoundary("/app/workspace/home/settings/tabs", ParamsSchema, {
  notFound: (params) => `Could not find tab #${params.id}!`,
  error: (params) => `There was an error loading tab #${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "HomeTabDetails");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  HomeTabDetails as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/home/settings/tabs/$id/details-G5O2VDFX.js.map
