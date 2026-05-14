import {
  PartialDateSelect
} from "/build/_shared/chunk-ORKGH2CA.js";
import "/build/_shared/chunk-6KSNNK5R.js";
import "/build/_shared/chunk-YDXQ3444.js";
import {
  AspectSelect
} from "/build/_shared/chunk-OIJ3E3DH.js";
import "/build/_shared/chunk-WCBSHJX3.js";
import "/build/_shared/chunk-37FGSNWH.js";
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
import "/build/_shared/chunk-72ELS2LF.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
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
  FormLabel_default,
  InputLabel_default,
  OutlinedInput_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_dist
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

// app/routes/app/workspace/life-plan/chapters/new.tsx
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/life-plan/chapters/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/life-plan/chapters/new.tsx"
  );
  import.meta.hot.lastModified = "1775685113124.0432";
}
var ParamsSchema = external_exports.object({});
var CreateFormSchema = external_exports.object({
  name: external_exports.string(),
  aspect: external_exports.string(),
  startDate: external_exports.string(),
  endDate: external_exports.string()
});
var handle = {
  displayType: 4 /* LEAFLET */
};
var shouldRevalidate = standardShouldRevalidate;
function NewChapter() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: "chapters/new", isLeaflet: true, returnLocation: "/app/workspace/life-plan/chapters", inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
      lineNumber: 98,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "New Chapter", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "chapter-create", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "chapter-create",
      text: "Create",
      value: "create",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
      lineNumber: 99,
      columnNumber: 89
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
          lineNumber: 106,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled, type: "text", placeholder: "Chapter name" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
          lineNumber: 107,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
          lineNumber: 108,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
        lineNumber: 105,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: /* @__PURE__ */ jsxDEV(AspectSelect, { name: "aspect", label: "Aspect", inputsEnabled, disabled: false, allAspects: loaderData.allAspects, defaultValue: loaderData.rootAspect.ref_id }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
        lineNumber: 112,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
        lineNumber: 111,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "startDate", children: "Start Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
          lineNumber: 116,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(PartialDateSelect, { maxAge: loaderData.lifePlan.max_age, name: "startDate", initialDate: null, inputsEnabled, allMilestones: loaderData.allMilestones }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
          lineNumber: 117,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/start_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
          lineNumber: 118,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
        lineNumber: 115,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "endDate", children: "End Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
          lineNumber: 122,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(PartialDateSelect, { maxAge: loaderData.lifePlan.max_age, name: "endDate", initialDate: null, inputsEnabled, allMilestones: loaderData.allMilestones }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
          lineNumber: 123,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/end_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
          lineNumber: 124,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
        lineNumber: 121,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
      lineNumber: 99,
      columnNumber: 7
    }, this)
  ] }, "chapters/new", true, {
    fileName: "app/routes/app/workspace/life-plan/chapters/new.tsx",
    lineNumber: 97,
    columnNumber: 10
  }, this);
}
_s(NewChapter, "HpzLPGz90sA8ksDul7dJ/onN3Ts=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation];
});
_c = NewChapter;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/life-plan/chapters", ParamsSchema, {
  notFound: () => `Could not find the chapter!`,
  error: () => `There was an error creating the chapter! Please try again!`
});
var _c;
$RefreshReg$(_c, "NewChapter");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NewChapter as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/life-plan/chapters/new-AV6DMCWJ.js.map
