import {
  DateInputWithSuggestions,
  getSuggestedDatesForBigPlanMilestoneDate
} from "/build/_shared/chunk-EHMNDFHW.js";
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
import {
  Launch_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  Button_default,
  FormControl_default,
  InputLabel_default,
  OutlinedInput_default,
  Stack_default
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
  Link,
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

// app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react3 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());

// ../core/jupiter/core/big_plans/sub/milestones/component/source-link.tsx
function BigPlanMilestoneSourceLink(props) {
  return /* @__PURE__ */ jsxDEV(
    Button_default,
    {
      startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/sub/milestones/component/source-link.tsx",
        lineNumber: 14,
        columnNumber: 18
      }, this),
      variant: "outlined",
      size: "small",
      component: Link,
      to: `/app/workspace/big-plans/${props.bigPlanId}`,
      sx: { flexGrow: 1 },
      children: "Big Plan"
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/big_plans/sub/milestones/component/source-link.tsx",
      lineNumber: 13,
      columnNumber: 5
    },
    this
  );
}

// app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx"
  );
  import.meta.hot.lastModified = "1775685113164.3225";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string(),
  milestoneId: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  date: external_exports.string()
}), external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 4 /* LEAFLET */
};
var shouldRevalidate = standardShouldRevalidate;
function BigPlanMilestoneView() {
  _s();
  const {
    milestone
  } = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react3.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle" && !milestone.archived;
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.BIG_PLAN_MILESTONE, entityRefId: milestone.ref_id, fakeKey: `big-plan-milestone-${milestone.ref_id}`, isLeaflet: true, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: milestone.archived, returnLocation: `/app/workspace/big-plans/${milestone.big_plan_ref_id}`, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx",
      lineNumber: 153,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "milestone-properties", title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "milestone-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Save",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx",
      lineNumber: 154,
      columnNumber: 74
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", spacing: 2, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 3
        }, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx",
            lineNumber: 163,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled, defaultValue: milestone.name }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx",
            lineNumber: 164,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx",
            lineNumber: 165,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx",
          lineNumber: 160,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(BigPlanMilestoneSourceLink, { bigPlanId: milestone.big_plan_ref_id }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx",
          lineNumber: 167,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx",
        lineNumber: 159,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "date", shrink: true, margin: "dense", children: "Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx",
          lineNumber: 171,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(DateInputWithSuggestions, { name: "date", label: "date", inputsEnabled, defaultValue: milestone.date, suggestedDates: getSuggestedDatesForBigPlanMilestoneDate(topLevelInfo.today) }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx",
          lineNumber: 174,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/date" }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx",
          lineNumber: 175,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx",
        lineNumber: 170,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx",
      lineNumber: 154,
      columnNumber: 7
    }, this)
  ] }, `big-plan-milestone-${milestone.ref_id}`, true, {
    fileName: "app/routes/app/workspace/big-plans/$id/milestones/$milestoneId.tsx",
    lineNumber: 152,
    columnNumber: 10
  }, this);
}
_s(BigPlanMilestoneView, "N8/MT6doIjNK27pJVWTjKT+F99E=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation];
});
_c = BigPlanMilestoneView;
var ErrorBoundary = makeLeafErrorBoundary("../../..", ParamsSchema, {
  notFound: (params) => `Could not find milestone #${params.milestoneId}!`,
  error: (params) => `There was an error loading milestone #${params.milestoneId}! Please try again!`
});
var _c;
$RefreshReg$(_c, "BigPlanMilestoneView");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  BigPlanMilestoneView as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/big-plans/$id/milestones/$milestoneId-4UAA7XBT.js.map
