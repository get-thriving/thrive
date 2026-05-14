import {
  ScheduleStreamSelect
} from "/build/_shared/chunk-F37AJ4V5.js";
import "/build/_shared/chunk-LUFLY6NA.js";
import "/build/_shared/chunk-3U5H3AD4.js";
import "/build/_shared/chunk-7YZ2X2X4.js";
import {
  TimeEventParamsSource
} from "/build/_shared/chunk-KOESW7BN.js";
import {
  ContactsEditor
} from "/build/_shared/chunk-VGTT4RYC.js";
import {
  timeEventInDayBlockParamsToTimezone
} from "/build/_shared/chunk-24RA7B23.js";
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
  ActionMultipleSpread,
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
import "/build/_shared/chunk-L6BTFETC.js";
import "/build/_shared/chunk-NLP5SXQ3.js";
import {
  ButtonGroup_default,
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

// app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx
var import_webapi_client2 = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());

// ../core/jupiter/core/schedule/sub/event_in_day/root.ts
var import_webapi_client = __toESM(require_dist(), 1);
function isCorePropertyEditable(event) {
  return event.source === import_webapi_client.ScheduleStreamSource.USER;
}

// app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342575.6252";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  userTimezone: external_exports.string(),
  name: external_exports.string(),
  startDate: external_exports.string(),
  startTimeInDay: external_exports.string().optional(),
  durationMins: external_exports.string().transform((v) => parseInt(v, 10))
}), external_exports.object({
  intent: external_exports.literal("change-schedule-stream"),
  scheduleStreamRefId: external_exports.string()
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
var shouldRevalidate = basicShouldRevalidate;
function ScheduleEventInDayViewOne() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();
  const isBigScreen = useBigScreen();
  const inputsEnabled = navigation.state === "idle" && !loaderData.scheduleEventInDay.archived;
  const corePropertyEditable = isCorePropertyEditable(loaderData.scheduleEventInDay);
  const blockParamsInTz = timeEventInDayBlockParamsToTimezone({
    startDate: loaderData.timeEventInDayBlock.start_date,
    startTimeInDay: loaderData.timeEventInDayBlock.start_time_in_day
  }, topLevelInfo.user.timezone);
  const [startDate, setStartDate] = (0, import_react2.useState)(blockParamsInTz.startDate);
  const [startTimeInDay, setStartTimeInDay] = (0, import_react2.useState)(blockParamsInTz.startTimeInDay);
  const [durationMins, setDurationMins] = (0, import_react2.useState)(loaderData.timeEventInDayBlock.duration_mins);
  (0, import_react2.useEffect)(() => {
    const blockParamsInTz2 = timeEventInDayBlockParamsToTimezone({
      startDate: loaderData.timeEventInDayBlock.start_date,
      startTimeInDay: loaderData.timeEventInDayBlock.start_time_in_day
    }, topLevelInfo.user.timezone);
    setStartDate(blockParamsInTz2.startDate);
    setStartTimeInDay(blockParamsInTz2.startTimeInDay);
    setDurationMins(loaderData.timeEventInDayBlock.duration_mins);
  }, [loaderData.timeEventInDayBlock, topLevelInfo.user.timezone]);
  const [debounceForeign, setDeoubceForeign] = (0, import_react2.useState)(false);
  setTimeout(() => setDeoubceForeign(true), 100);
  (0, import_react2.useEffect)(() => {
    if (!debounceForeign) {
      return;
    }
    if (query.get("sourceStartDate") && query.get("sourceStartTimeInDay")) {
      setStartDate(query.get("sourceStartDate"));
      setStartTimeInDay(query.get("sourceStartTimeInDay"));
    }
    if (query.get("sourceDurationMins")) {
      setDurationMins(parseInt(query.get("sourceDurationMins"), 10));
    }
  }, [query, debounceForeign]);
  const allScheduleStreamsByRefId = new Map(loaderData.allScheduleStreams.map((st) => [st.ref_id, st]));
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client2.NamedEntityTag.SCHEDULE_EVENT_IN_DAY, entityRefId: loaderData.scheduleEventInDay.ref_id, fakeKey: `schedule-event-in-day-${loaderData.scheduleEventInDay.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityNotEditable: !corePropertyEditable, entityArchived: loaderData.scheduleEventInDay.archived, returnLocation: `/app/workspace/calendar?${query}`, children: [
    /* @__PURE__ */ jsxDEV(TimeEventParamsSource, { startDate, startTimeInDay, durationMins }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
      lineNumber: 240,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
      lineNumber: 241,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "schedule-event-in-day-properties", title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "schedule-event-in-day-properties", topLevelInfo, inputsEnabled, actions: [ActionMultipleSpread({
      actions: [ActionSingle({
        text: "Save",
        value: "update",
        highlight: true,
        disabled: !corePropertyEditable
      }), ActionSingle({
        text: "Change Stream",
        value: "change-schedule-stream",
        disabled: !corePropertyEditable
      })]
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
      lineNumber: 242,
      columnNumber: 86
    }, this), children: [
      /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "userTimezone", value: topLevelInfo.user.timezone }, void 0, false, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
        lineNumber: 254,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "scheduleStreamRefId", children: "Schedule Stream" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
          lineNumber: 256,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(ScheduleStreamSelect, { labelId: "scheduleStreamRefId", label: "Schedule Stream", name: "scheduleStreamRefId", readOnly: !inputsEnabled || !corePropertyEditable, allScheduleStreams: loaderData.allScheduleStreams, defaultValue: allScheduleStreamsByRefId.get(loaderData.scheduleEventInDay.schedule_stream_ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
          lineNumber: 257,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/schedule_stream_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
          lineNumber: 258,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
        lineNumber: 255,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: !isBigScreen, sx: {
        flexGrow: 1
      }, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
          lineNumber: 264,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "name", name: "name", readOnly: !inputsEnabled || !corePropertyEditable, defaultValue: loaderData.scheduleEventInDay.name }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
          lineNumber: 265,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
          lineNumber: 266,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
        lineNumber: 261,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", useFlexGap: true, gap: 2, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 1
        }, children: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags_names", allTags: loaderData.allTags, defaultValue: loaderData.tags.map((t) => t.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client2.NamedEntityTag.SCHEDULE_EVENT_IN_DAY, loaderData.scheduleEventInDay.ref_id), aloneOnLine: !isBigScreen }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
          lineNumber: 273,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
          lineNumber: 270,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 1
        }, children: /* @__PURE__ */ jsxDEV(ContactsEditor, { name: "contacts_names", allContacts: loaderData.allContacts, defaultValue: loaderData.contacts.map((contact) => contact.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client2.NamedEntityTag.SCHEDULE_EVENT_IN_DAY, loaderData.scheduleEventInDay.ref_id), aloneOnLine: !isBigScreen }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
          lineNumber: 279,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
          lineNumber: 276,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
        lineNumber: 269,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", useFlexGap: true, gap: 2, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "startDate", shrink: true, margin: "dense", children: "Start Date" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
            lineNumber: 285,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "startDate", name: "startDate", readOnly: !inputsEnabled || !corePropertyEditable, disabled: !inputsEnabled || !corePropertyEditable, value: startDate, onChange: (e) => setStartDate(e.target.value) }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
            lineNumber: 288,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/start_date" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
            lineNumber: 290,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
          lineNumber: 284,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "startTimeInDay", shrink: true, margin: "dense", children: "Start Time" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
            lineNumber: 294,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "time", label: "startTimeInDay", name: "startTimeInDay", readOnly: !inputsEnabled || !corePropertyEditable, value: startTimeInDay, onChange: (e) => setStartTimeInDay(e.target.value) }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
            lineNumber: 297,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/start_time_in_day" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
            lineNumber: 299,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
          lineNumber: 293,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
        lineNumber: 283,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, direction: "row", children: [
        /* @__PURE__ */ jsxDEV(ButtonGroup_default, { variant: "outlined", disabled: !inputsEnabled || !corePropertyEditable, children: [
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled || !corePropertyEditable, variant: durationMins === 15 ? "contained" : "outlined", onClick: () => setDurationMins(15), children: "15m" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
            lineNumber: 305,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled || !corePropertyEditable, variant: durationMins === 30 ? "contained" : "outlined", onClick: () => setDurationMins(30), children: "30m" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
            lineNumber: 308,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled || !corePropertyEditable, variant: durationMins === 60 ? "contained" : "outlined", onClick: () => setDurationMins(60), children: "60m" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
            lineNumber: 311,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
          lineNumber: 304,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "durationMins", shrink: true, margin: "dense", children: "Duration (Mins)" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
            lineNumber: 317,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "number", label: "Duration (Mins)", name: "durationMins", readOnly: !inputsEnabled || !corePropertyEditable, value: durationMins, onChange: (e) => {
            if (Number.isNaN(parseInt(e.target.value, 10))) {
              setDurationMins(0);
              e.preventDefault();
              return;
            }
            return setDurationMins(parseInt(e.target.value, 10));
          } }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
            lineNumber: 320,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/duration_mins" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
            lineNumber: 329,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
          lineNumber: 316,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
        lineNumber: 303,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
      lineNumber: 242,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Note", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "inbox-task-note", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Create Note",
      value: "create-note",
      highlight: false,
      disabled: loaderData.note !== null
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
      lineNumber: 334,
      columnNumber: 42
    }, this), children: loaderData.note && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
      lineNumber: 341,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
      lineNumber: 340,
      columnNumber: 29
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
      lineNumber: 334,
      columnNumber: 7
    }, this)
  ] }, `schedule-event-in-day-${loaderData.scheduleEventInDay.ref_id}`, true, {
    fileName: "app/routes/app/workspace/calendar/schedule/event-in-day/$id.tsx",
    lineNumber: 239,
    columnNumber: 10
  }, this);
}
_s(ScheduleEventInDayViewOne, "YOYgU82U1UQqSw2wa4Yfy/pBMZM=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useSearchParams, useBigScreen];
});
_c = ScheduleEventInDayViewOne;
var ErrorBoundary = makeLeafErrorBoundary(_c2 = (params) => `/app/workspace/calendar/schedule/event-in-day/${params.id}`, ParamsSchema, {
  notFound: (params) => `Could not find event in day #${params.id}!`,
  error: (params) => `There was an error loading event in day #${params.id}! Please try again!`
});
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "ScheduleEventInDayViewOne");
$RefreshReg$(_c2, "ErrorBoundary$makeLeafErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  ScheduleEventInDayViewOne as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/calendar/schedule/event-in-day/$id-LZLVILFN.js.map
