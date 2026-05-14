import {
  ScheduleStreamMultiSelect
} from "/build/_shared/chunk-ETY27RHY.js";
import "/build/_shared/chunk-3U5H3AD4.js";
import "/build/_shared/chunk-7YZ2X2X4.js";
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
  selectZod
} from "/build/_shared/chunk-HVVVLUYY.js";
import {
  basicShouldRevalidate
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
  Button_default,
  FormControl_default,
  InputAdornment_default,
  InputLabel_default,
  OutlinedInput_default,
  Stack_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import {
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
  useSearchParams
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

// app/routes/app/workspace/calendar/schedule/export/$id.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/calendar/schedule/export/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/calendar/schedule/export/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342576.0415";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  scheduleStreamRefIds: selectZod(external_exports.string())
}), external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("create-note")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = basicShouldRevalidate;
function ScheduleExportViewOne() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();
  const isBigScreen = useBigScreen();
  const [hasCopiedExternalUrl, setHasCopiedExternalUrl] = (0, import_react2.useState)(false);
  const serviceProperties = (0, import_react2.useContext)(ServicePropertiesContext);
  const inputsEnabled = navigation.state === "idle" && !loaderData.scheduleExport.archived;
  const externalId = loaderData.scheduleExport.external_id ?? "";
  const externalCalendarUrl = `${serviceProperties.webUiUrl}/app/public/schedule/export/${externalId}`;
  async function copyExternalCalendarUrl() {
    await navigator.clipboard.writeText(externalCalendarUrl);
    setHasCopiedExternalUrl(true);
  }
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.SCHEDULE_EXPORT, entityRefId: loaderData.scheduleExport.ref_id, fakeKey: `schedule-export-${loaderData.scheduleExport.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: loaderData.scheduleExport.archived, returnLocation: `/app/workspace/calendar/schedule/export?${query}`, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
      lineNumber: 184,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "schedule-export-properties", title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "schedule-export-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Save",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
      lineNumber: 185,
      columnNumber: 80
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, useFlexGap: true, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: !isBigScreen, sx: {
          flexGrow: 1
        }, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
            lineNumber: 194,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "name", name: "name", readOnly: !inputsEnabled, defaultValue: loaderData.scheduleExport.name }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
            lineNumber: 195,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
            lineNumber: 196,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
          lineNumber: 191,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: !isBigScreen, children: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags_names", allTags: loaderData.allTags, defaultValue: loaderData.tags.map((t) => t.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.SCHEDULE_EXPORT, loaderData.scheduleExport.ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
          lineNumber: 200,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
          lineNumber: 199,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
        lineNumber: 190,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "scheduleStreamRefIds", children: "Calendar Streams" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
          lineNumber: 205,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(ScheduleStreamMultiSelect, { labelId: "scheduleStreamRefIds", label: "Calendar Streams", name: "scheduleStreamRefIds", readOnly: !inputsEnabled, allScheduleStreams: loaderData.allScheduleStreams, defaultValue: loaderData.scheduleExport.schedule_stream_ref_ids }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
          lineNumber: 206,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/schedule_stream_ref_ids" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
          lineNumber: 207,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
        lineNumber: 204,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "externalCalendarUrl", children: "External Calendar URL" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
          lineNumber: 211,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "External Calendar URL", name: "externalCalendarUrl", readOnly: true, value: externalCalendarUrl, endAdornment: /* @__PURE__ */ jsxDEV(InputAdornment_default, { position: "end", children: /* @__PURE__ */ jsxDEV(Button_default, { variant: "outlined", onClick: copyExternalCalendarUrl, disabled: hasCopiedExternalUrl, children: hasCopiedExternalUrl ? "Copied" : "Copy" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
          lineNumber: 215,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
          lineNumber: 214,
          columnNumber: 134
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
          lineNumber: 214,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
        lineNumber: 210,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
      lineNumber: 185,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Note", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "schedule-export-note", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Create Note",
      value: "create-note",
      highlight: false,
      disabled: loaderData.note !== null
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
      lineNumber: 222,
      columnNumber: 42
    }, this), children: loaderData.note && /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
      lineNumber: 228,
      columnNumber: 29
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
      lineNumber: 222,
      columnNumber: 7
    }, this)
  ] }, `schedule-export-${loaderData.scheduleExport.ref_id}`, true, {
    fileName: "app/routes/app/workspace/calendar/schedule/export/$id.tsx",
    lineNumber: 183,
    columnNumber: 10
  }, this);
}
_s(ScheduleExportViewOne, "Q7jdg3KHaqFARfJqOoVvzd4zYr0=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useSearchParams, useBigScreen];
});
_c = ScheduleExportViewOne;
var ErrorBoundary = makeLeafErrorBoundary(_c2 = (params) => `/app/workspace/calendar/schedule/export/${params.id}`, ParamsSchema, {
  notFound: (params) => `Could not find export #${params.id}!`,
  error: (params) => `There was an error loading export #${params.id}! Please try again!`
});
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "ScheduleExportViewOne");
$RefreshReg$(_c2, "ErrorBoundary$makeLeafErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  ScheduleExportViewOne as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/calendar/schedule/export/$id-C4LSX5AQ.js.map
