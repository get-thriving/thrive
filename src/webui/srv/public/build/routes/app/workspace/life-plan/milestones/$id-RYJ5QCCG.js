import {
  AspectSelect
} from "/build/_shared/chunk-OIJ3E3DH.js";
import "/build/_shared/chunk-37FGSNWH.js";
import {
  EntityNoteEditor
} from "/build/_shared/chunk-PDFSPG4I.js";
import {
  TagsEditor
} from "/build/_shared/chunk-FTLY2H2V.js";
import {
  entityLinkStd
} from "/build/_shared/chunk-HDJTYRJL.js";
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
import "/build/_shared/chunk-Z3RPM676.js";
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
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-FUGZILJZ.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
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

// app/routes/app/workspace/life-plan/milestones/$id.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/life-plan/milestones/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/life-plan/milestones/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342593.4414";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  aspect: external_exports.string(),
  date: external_exports.string()
}), external_exports.object({
  intent: external_exports.literal("create-note")
}), external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 4 /* LEAFLET */
};
var shouldRevalidate = standardShouldRevalidate;
function MilestoneView() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle" && !loaderData.milestone.archived;
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.MILESTONE, entityRefId: loaderData.milestone.ref_id, isLeaflet: true, fakeKey: `milestones-${loaderData.milestone.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: loaderData.milestone.archived, returnLocation: "/app/workspace/life-plan/milestones", children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
      lineNumber: 178,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "milestone-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Save",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
      lineNumber: 179,
      columnNumber: 48
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 1, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 3
        }, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
            fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
            lineNumber: 188,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "name", name: "name", readOnly: !inputsEnabled, disabled: !inputsEnabled, defaultValue: loaderData.milestone.name }, void 0, false, {
            fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
            lineNumber: 189,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
            lineNumber: 190,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
          lineNumber: 185,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 2
        }, children: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags", label: null, aloneOnLine: !isBigScreen, allTags: loaderData.allTags, defaultValue: loaderData.tags.map((tag) => tag.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.MILESTONE, loaderData.milestone.ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
          lineNumber: 196,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
          lineNumber: 193,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
        lineNumber: 184,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(AspectSelect, { name: "aspect", label: "Aspect", inputsEnabled, disabled: false, allAspects: loaderData.allAspects, defaultValue: loaderData.milestone.aspect_ref_id }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
          lineNumber: 201,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/aspect_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
          lineNumber: 202,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
        lineNumber: 200,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "date", shrink: true, margin: "dense", children: "Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
          lineNumber: 206,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(DateInputWithSuggestions, { name: "date", label: "date", inputsEnabled, defaultValue: loaderData.milestone.date, suggestedDates: getSuggestedDatesForBigPlanMilestoneDate(topLevelInfo.today) }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
          lineNumber: 209,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/date" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
          lineNumber: 210,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
        lineNumber: 205,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
      lineNumber: 179,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Note", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "milestone-note", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Create Note",
      value: "create-note",
      highlight: false,
      disabled: loaderData.note !== null
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
      lineNumber: 214,
      columnNumber: 42
    }, this), children: loaderData.note && /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
      lineNumber: 220,
      columnNumber: 29
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
      lineNumber: 214,
      columnNumber: 7
    }, this)
  ] }, `milestone-${loaderData.milestone.ref_id}`, true, {
    fileName: "app/routes/app/workspace/life-plan/milestones/$id.tsx",
    lineNumber: 177,
    columnNumber: 10
  }, this);
}
_s(MilestoneView, "DSME04qE5kaLGVa8vl5jxhyo4ac=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useBigScreen, useNavigation];
});
_c = MilestoneView;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/life-plan/milestones", ParamsSchema, {
  notFound: (params) => `Could not find milestone with ID ${params.id}!`,
  error: (params) => `There was an error loading milestone with ID ${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "MilestoneView");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  MilestoneView as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/life-plan/milestones/$id-RYJ5QCCG.js.map
