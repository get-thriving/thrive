import {
  AppComponentTag
} from "/build/_shared/chunk-7SVPUDIO.js";
import {
  ScheduleStreamMultiSelect
} from "/build/_shared/chunk-ETY27RHY.js";
import "/build/_shared/chunk-3U5H3AD4.js";
import "/build/_shared/chunk-7YZ2X2X4.js";
import {
  EntitySummaryLink
} from "/build/_shared/chunk-ZK23STK3.js";
import {
  selectZod
} from "/build/_shared/chunk-HVVVLUYY.js";
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
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  BranchPanel,
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
import {
  ExpandMore_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  AccordionDetails_default,
  AccordionSummary_default,
  Accordion_default,
  Box_default,
  FormControlLabel_default,
  FormControl_default,
  InputLabel_default,
  Switch_default,
  styled_default
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

// app/routes/app/workspace/calendar/settings.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/calendar/settings.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/calendar/settings.tsx"
  );
  import.meta.hot.lastModified = "1777213342577.514";
}
var ParamsSchema = external_exports.object({});
var ScheduleExternalSyncFormSchema = external_exports.object({
  scheduleStreamRefIds: selectZod(external_exports.string()),
  syncEvenIfNotModified: import_zodix.CheckboxAsString
});
var handle = {
  displayType: 2 /* BRANCH */
};
var shouldRevalidate = standardShouldRevalidate;
function CalendarSettings() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const [query] = useSearchParams();
  const scheduleStreamsByRefId = new Map(loaderData.scheduleStreams.map((stream) => [stream.ref_id, stream]));
  return /* @__PURE__ */ jsxDEV(BranchPanel, { returnLocation: `/app/workspace/calendar?${query}`, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/settings.tsx",
      lineNumber: 99,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "External Calendar Sync", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "calendar-external-sync", topLevelInfo, inputsEnabled, expansion: 0 /* ALWAYS_SHOW */, actions: [ActionSingle({
      text: "Sync",
      value: "sync",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/settings.tsx",
      lineNumber: 101,
      columnNumber: 60
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "scheduleStreamRefId", children: "Schedule Streams" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/settings.tsx",
          lineNumber: 107,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(ScheduleStreamMultiSelect, { labelId: "scheduleStreamRefIds", label: "Schedule Streams", name: "scheduleStreamRefIds", readOnly: !inputsEnabled, allScheduleStreams: loaderData.scheduleStreams.filter((ss) => ss.source === import_webapi_client.ScheduleStreamSource.EXTERNAL_ICAL) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/settings.tsx",
          lineNumber: 108,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/filter_schedule_stream_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/settings.tsx",
          lineNumber: 109,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/settings.tsx",
        lineNumber: 106,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormControlLabel_default, { control: /* @__PURE__ */ jsxDEV(Switch_default, { name: "syncEvenIfNotModified", readOnly: !inputsEnabled, disabled: !inputsEnabled, defaultChecked: false }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/settings.tsx",
          lineNumber: 113,
          columnNumber: 38
        }, this), label: "Sync Even If Not Modified" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/settings.tsx",
          lineNumber: 113,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/sync_even_if_not_modified" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/settings.tsx",
          lineNumber: 114,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/settings.tsx",
        lineNumber: 112,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/calendar/settings.tsx",
      lineNumber: 101,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Previous Runs", size: "large" }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/settings.tsx",
      lineNumber: 118,
      columnNumber: 7
    }, this),
    loaderData.entries.map((entry) => {
      return /* @__PURE__ */ jsxDEV(Accordion_default, { children: [
        /* @__PURE__ */ jsxDEV(AccordionSummary_default, { expandIcon: /* @__PURE__ */ jsxDEV(ExpandMore_default, {}, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/settings.tsx",
          lineNumber: 122,
          columnNumber: 43
        }, this), children: /* @__PURE__ */ jsxDEV(AccordionHeader, { children: [
          "Run from ",
          /* @__PURE__ */ jsxDEV(AppComponentTag, { source: entry.source }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/settings.tsx",
            lineNumber: 124,
            columnNumber: 26
          }, this),
          "on ",
          entry.today,
          " from ",
          entry.start_of_window,
          " to",
          " ",
          entry.end_of_window,
          " ",
          entry.sync_even_if_not_modified ? "and sync forced " : " ",
          "with ",
          entry.entity_records.length,
          entry.even_more_entity_records ? "+" : "",
          " entities synced",
          /* @__PURE__ */ jsxDEV(TimeDiffTag, { today: topLevelInfo.today, labelPrefix: "from", collectionTime: entry.created_time }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/settings.tsx",
            lineNumber: 130,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/settings.tsx",
          lineNumber: 123,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/settings.tsx",
          lineNumber: 122,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(AccordionDetails_default, { children: [
          /* @__PURE__ */ jsxDEV(ExternalSyncTargetsSection, { children: [
            "Synced Streams",
            entry.per_stream_results.map((stream) => /* @__PURE__ */ jsxDEV(EntityCard, { children: [
              /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/calendar/schedule/stream/${stream.schedule_stream_ref_id}`, children: scheduleStreamsByRefId.get(stream.schedule_stream_ref_id)?.name || "Archived Stream" }, void 0, false, {
                fileName: "app/routes/app/workspace/calendar/settings.tsx",
                lineNumber: 138,
                columnNumber: 21
              }, this),
              stream.error_msg && /* @__PURE__ */ jsxDEV(Box_default, { children: /* @__PURE__ */ jsxDEV(ErrorDisplay, { children: stream.error_msg }, void 0, false, {
                fileName: "app/routes/app/workspace/calendar/settings.tsx",
                lineNumber: 143,
                columnNumber: 25
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/calendar/settings.tsx",
                lineNumber: 142,
                columnNumber: 42
              }, this)
            ] }, `calendar-streams-${entry.ref_id}-${stream.schedule_stream_ref_id}`, true, {
              fileName: "app/routes/app/workspace/calendar/settings.tsx",
              lineNumber: 137,
              columnNumber: 57
            }, this))
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/calendar/settings.tsx",
            lineNumber: 135,
            columnNumber: 15
          }, this),
          entry.entity_records.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Entities", size: "large" }, void 0, false, {
              fileName: "app/routes/app/workspace/calendar/settings.tsx",
              lineNumber: 149,
              columnNumber: 19
            }, this),
            entry.entity_records.map((record) => /* @__PURE__ */ jsxDEV(EntityCard, { children: /* @__PURE__ */ jsxDEV(EntitySummaryLink, { today: topLevelInfo.today, summary: record }, void 0, false, {
              fileName: "app/routes/app/workspace/calendar/settings.tsx",
              lineNumber: 151,
              columnNumber: 23
            }, this) }, `entities-${entry.ref_id}-${record.ref_id}`, false, {
              fileName: "app/routes/app/workspace/calendar/settings.tsx",
              lineNumber: 150,
              columnNumber: 55
            }, this))
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/calendar/settings.tsx",
            lineNumber: 148,
            columnNumber: 51
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/settings.tsx",
          lineNumber: 134,
          columnNumber: 13
        }, this)
      ] }, entry.ref_id, true, {
        fileName: "app/routes/app/workspace/calendar/settings.tsx",
        lineNumber: 121,
        columnNumber: 14
      }, this);
    })
  ] }, "calendar-settings", true, {
    fileName: "app/routes/app/workspace/calendar/settings.tsx",
    lineNumber: 98,
    columnNumber: 10
  }, this);
}
_s(CalendarSettings, "83YxqHNZ7OCrH/7EBATZRqzvR28=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useSearchParams];
});
_c = CalendarSettings;
var ErrorBoundary = makeBranchErrorBoundary(_c2 = (_params, searchParams) => `/app/workspace/calendar?${searchParams}`, ParamsSchema, {
  error: () => `There was an error creating the event in day! Please try again!`
});
_c3 = ErrorBoundary;
var AccordionHeader = styled_default(Box_default)(({
  theme
}) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap"
}));
_c4 = AccordionHeader;
var ErrorDisplay = styled_default("pre")(({
  theme
}) => ({
  color: theme.palette.error.main,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word"
}));
_c5 = ErrorDisplay;
var ExternalSyncTargetsSection = styled_default(Box_default)(({
  theme
}) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
  paddingBottom: theme.spacing(1)
}));
_c6 = ExternalSyncTargetsSection;
var _c;
var _c2;
var _c3;
var _c4;
var _c5;
var _c6;
$RefreshReg$(_c, "CalendarSettings");
$RefreshReg$(_c2, "ErrorBoundary$makeBranchErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
$RefreshReg$(_c4, "AccordionHeader");
$RefreshReg$(_c5, "ErrorDisplay");
$RefreshReg$(_c6, "ExternalSyncTargetsSection");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  CalendarSettings as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/calendar/settings-YVAX3JKQ.js.map
