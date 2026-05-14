import {
  ScheduleStreamColorInput
} from "/build/_shared/chunk-XZIOVQ6W.js";
import {
  isCorePropertyEditable
} from "/build/_shared/chunk-LUFLY6NA.js";
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

// app/routes/app/workspace/calendar/schedule/stream/$id.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/calendar/schedule/stream/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/calendar/schedule/stream/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342577.2153";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  color: external_exports.nativeEnum(import_webapi_client.ScheduleStreamColor)
}), external_exports.object({
  intent: external_exports.literal("create-note")
}), external_exports.object({
  intent: external_exports.literal("sync")
}), external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = basicShouldRevalidate;
function ScheduleStreamViewOne() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();
  const isBigScreen = useBigScreen();
  const inputsEnabled = navigation.state === "idle" && !loaderData.scheduleStream.archived;
  const corePropertyEditable = isCorePropertyEditable(loaderData.scheduleStream);
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.SCHEDULE_STREAM, entityRefId: loaderData.scheduleStream.ref_id, fakeKey: `schedule-stream-${loaderData.scheduleStream.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityNotEditable: !corePropertyEditable, entityArchived: loaderData.scheduleStream.archived, returnLocation: `/app/workspace/calendar/schedule/stream?${query}`, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
      lineNumber: 180,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "schedule-stream-properties", title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "schedule-stream-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Save",
      value: "update",
      highlight: true
    }), ActionSingle({
      text: "Sync",
      value: "sync",
      disabled: loaderData.scheduleStream.source !== import_webapi_client.ScheduleStreamSource.EXTERNAL_ICAL
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
      lineNumber: 181,
      columnNumber: 80
    }, this), children: [
      loaderData.scheduleStream.source === import_webapi_client.ScheduleStreamSource.EXTERNAL_ICAL && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "sourceIcalUrl", children: "Source iCal URL" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
          lineNumber: 191,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "sourceIcalUrl", name: "sourceIcalUrl", defaultValue: loaderData.scheduleStream.source_ical_url, readOnly: true }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
          lineNumber: 192,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
        lineNumber: 190,
        columnNumber: 85
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, useFlexGap: true, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: !isBigScreen, sx: {
          flexGrow: 1
        }, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
            lineNumber: 199,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "name", name: "name", readOnly: !inputsEnabled || !corePropertyEditable, defaultValue: loaderData.scheduleStream.name }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
            lineNumber: 200,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
            lineNumber: 201,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
          lineNumber: 196,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: !isBigScreen, children: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags_names", allTags: loaderData.allTags, defaultValue: loaderData.tags.map((t) => t.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.SCHEDULE_STREAM, loaderData.scheduleStream.ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
          lineNumber: 205,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
          lineNumber: 204,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
        lineNumber: 195,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "color", children: "Color" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
          lineNumber: 210,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(ScheduleStreamColorInput, { labelId: "color", label: "Color", name: "color", value: loaderData.scheduleStream.color, readOnly: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
          lineNumber: 211,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/color" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
          lineNumber: 212,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
        lineNumber: 209,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
      lineNumber: 181,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Note", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "inbox-task-note", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Create Note",
      value: "create-note",
      highlight: false,
      disabled: loaderData.note !== null
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
      lineNumber: 216,
      columnNumber: 42
    }, this), children: loaderData.note && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
      lineNumber: 223,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
      lineNumber: 222,
      columnNumber: 29
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
      lineNumber: 216,
      columnNumber: 7
    }, this)
  ] }, `schedule-stream-${loaderData.scheduleStream.ref_id}`, true, {
    fileName: "app/routes/app/workspace/calendar/schedule/stream/$id.tsx",
    lineNumber: 179,
    columnNumber: 10
  }, this);
}
_s(ScheduleStreamViewOne, "Nmyr6yi+urrkhxVa9T9Hm1lxWZ8=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useSearchParams, useBigScreen];
});
_c = ScheduleStreamViewOne;
var ErrorBoundary = makeLeafErrorBoundary(_c2 = (params) => `/app/workspace/calendar/schedule/stream/${params.id}`, ParamsSchema, {
  notFound: (params) => `Could not find stream #${params.id}!`,
  error: (params) => `There was an error loading stream #${params.id}! Please try again!`
});
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "ScheduleStreamViewOne");
$RefreshReg$(_c2, "ErrorBoundary$makeLeafErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  ScheduleStreamViewOne as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/calendar/schedule/stream/$id-SF2LKBDP.js.map
