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
  EntityNoteEditor
} from "/build/_shared/chunk-PDFSPG4I.js";
import {
  TagsEditor
} from "/build/_shared/chunk-FTLY2H2V.js";
import {
  entityLinkStd
} from "/build/_shared/chunk-HDJTYRJL.js";
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
  FormLabel_default,
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

// app/routes/app/workspace/life-plan/chapters/$id.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/life-plan/chapters/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/life-plan/chapters/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342591.7815";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  aspect: external_exports.string(),
  startDate: external_exports.string(),
  endDate: external_exports.string()
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
function Chapter() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle" && !loaderData.chapter.archived;
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.CHAPTER, entityRefId: loaderData.chapter.ref_id, isLeaflet: true, fakeKey: `chapters-${loaderData.chapter.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: loaderData.chapter.archived, returnLocation: "/app/workspace/life-plan/chapters", children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
      lineNumber: 186,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "chapter-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Save",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
      lineNumber: 187,
      columnNumber: 48
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 1, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 3
        }, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
            fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
            lineNumber: 196,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "name", name: "name", readOnly: !inputsEnabled, disabled: !inputsEnabled, defaultValue: loaderData.chapter.name }, void 0, false, {
            fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
            lineNumber: 197,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
            lineNumber: 198,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
          lineNumber: 193,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 2
        }, children: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags", label: null, aloneOnLine: !isBigScreen, allTags: loaderData.allTags, defaultValue: loaderData.tags.map((tag) => tag.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.CHAPTER, loaderData.chapter.ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
          lineNumber: 204,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
          lineNumber: 201,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
        lineNumber: 192,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: /* @__PURE__ */ jsxDEV(AspectSelect, { name: "aspect", label: "Aspect", inputsEnabled, disabled: false, allAspects: loaderData.allAspects, defaultValue: loaderData.chapter.aspect_ref_id }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
        lineNumber: 209,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
        lineNumber: 208,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "startDate", children: "Start Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
          lineNumber: 213,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(PartialDateSelect, { maxAge: loaderData.lifePlan.max_age, name: "startDate", initialDate: loaderData.chapter.start_date, inputsEnabled, allMilestones: loaderData.allMilestones }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
          lineNumber: 214,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/start_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
          lineNumber: 215,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
        lineNumber: 212,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "endDate", children: "End Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
          lineNumber: 219,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(PartialDateSelect, { maxAge: loaderData.lifePlan.max_age, name: "endDate", initialDate: loaderData.chapter.end_date, inputsEnabled, allMilestones: loaderData.allMilestones }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
          lineNumber: 220,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/end_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
          lineNumber: 221,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
        lineNumber: 218,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
      lineNumber: 187,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Note", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "chapter-note", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Create Note",
      value: "create-note",
      highlight: false,
      disabled: loaderData.note !== null
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
      lineNumber: 225,
      columnNumber: 42
    }, this), children: loaderData.note && /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
      lineNumber: 231,
      columnNumber: 29
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
      lineNumber: 225,
      columnNumber: 7
    }, this)
  ] }, `chapter-${loaderData.chapter.ref_id}`, true, {
    fileName: "app/routes/app/workspace/life-plan/chapters/$id.tsx",
    lineNumber: 185,
    columnNumber: 10
  }, this);
}
_s(Chapter, "DSME04qE5kaLGVa8vl5jxhyo4ac=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useBigScreen, useNavigation];
});
_c = Chapter;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/life-plan/chapters", ParamsSchema, {
  notFound: (params) => `Could not find chapter with ID ${params.id}!`,
  error: (params) => `There was an error loading chapter with ID ${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "Chapter");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Chapter as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/life-plan/chapters/$id-CWBSDUV2.js.map
