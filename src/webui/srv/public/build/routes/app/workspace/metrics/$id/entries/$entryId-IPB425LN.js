import {
  ContactsEditor
} from "/build/_shared/chunk-VGTT4RYC.js";
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
import {
  TimeDiffTag
} from "/build/_shared/chunk-YNGTC4PW.js";
import "/build/_shared/chunk-X6MG2JXZ.js";
import "/build/_shared/chunk-Z3RPM676.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
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
  useNavigation,
  useParams
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

// app/routes/app/workspace/metrics/$id/entries/$entryId.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/metrics/$id/entries/$entryId.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx"
  );
  import.meta.hot.lastModified = "1777213342595.749";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string(),
  entryId: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  collectionTime: external_exports.string(),
  value: external_exports.string().transform(parseFloat)
}), external_exports.object({
  intent: external_exports.literal("create-note")
}), external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function MetricEntry() {
  _s();
  const {
    id,
    entryId
  } = useParams();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const inputsEnabled = navigation.state === "idle" && !loaderData.metricEntry.archived;
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.METRIC_ENTRY, entityRefId: loaderData.metricEntry.ref_id, fakeKey: `metric-${id}/entry-${entryId}`, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: loaderData.metricEntry.archived, returnLocation: `/app/workspace/metrics/${id}`, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
      lineNumber: 179,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "metric-entry-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Save",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
      lineNumber: 180,
      columnNumber: 48
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, children: [
        /* @__PURE__ */ jsxDEV(TimeDiffTag, { today: topLevelInfo.today, labelPrefix: "Collected", collectionTime: loaderData.metricEntry.collection_time }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
          lineNumber: 186,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 1
        }, children: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags", label: null, aloneOnLine: true, allTags: loaderData.allTags, defaultValue: loaderData.tags.map((tag) => tag.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.METRIC_ENTRY, loaderData.metricEntry.ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
          lineNumber: 191,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
          lineNumber: 188,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 1
        }, children: /* @__PURE__ */ jsxDEV(ContactsEditor, { name: "contacts_names", label: null, aloneOnLine: true, allContacts: loaderData.allContacts, defaultValue: loaderData.contacts.map((contact) => contact.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.METRIC_ENTRY, loaderData.metricEntry.ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
          lineNumber: 197,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
          lineNumber: 194,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
        lineNumber: 185,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "collectionTime", shrink: true, children: "Collection Time" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
          lineNumber: 201,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "collectionTime", defaultValue: loaderData.metricEntry.collection_time ? aDateToDate(loaderData.metricEntry.collection_time).toFormat("yyyy-MM-dd") : void 0, name: "collectionTime", readOnly: !inputsEnabled, disabled: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
          lineNumber: 204,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/collection_time" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
          lineNumber: 206,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
        lineNumber: 200,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "value", children: "Value" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
          lineNumber: 210,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "number", inputProps: {
          step: "any"
        }, label: "Value", name: "value", readOnly: !inputsEnabled, defaultValue: loaderData.metricEntry.value }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
          lineNumber: 211,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/value" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
          lineNumber: 214,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
        lineNumber: 209,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
      lineNumber: 180,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Note", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "metric-entry-note", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Create Note",
      value: "create-note",
      highlight: false,
      disabled: loaderData.note !== null
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
      lineNumber: 218,
      columnNumber: 42
    }, this), children: loaderData.note && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
      lineNumber: 225,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
      lineNumber: 224,
      columnNumber: 29
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
      lineNumber: 218,
      columnNumber: 7
    }, this)
  ] }, `metric-${id}/entry-${entryId}`, true, {
    fileName: "app/routes/app/workspace/metrics/$id/entries/$entryId.tsx",
    lineNumber: 178,
    columnNumber: 10
  }, this);
}
_s(MetricEntry, "TewwSzSAEQwbTQr7GwkA2zMgkeY=", false, function() {
  return [useParams, useLoaderDataSafeForAnimation, useActionData, useNavigation, useBigScreen];
});
_c = MetricEntry;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/metrics", ParamsSchema, {
  notFound: (params) => `Could not find entry ${params.entryId} in metric ${params.id}!`,
  error: (params) => `There was an error loading entry ${params.entryId} in metric ${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "MetricEntry");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  MetricEntry as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/metrics/$id/entries/$entryId-IPB425LN.js.map
