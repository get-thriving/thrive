import {
  ScheduleStreamSelect
} from "/build/_shared/chunk-F37AJ4V5.js";
import "/build/_shared/chunk-LUFLY6NA.js";
import "/build/_shared/chunk-3U5H3AD4.js";
import "/build/_shared/chunk-7YZ2X2X4.js";
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

// app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx
var import_webapi_client2 = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());

// ../core/jupiter/core/schedule/sub/event_full_days/root.ts
var import_webapi_client = __toESM(require_dist(), 1);
function isCorePropertyEditable(event) {
  return event.source === import_webapi_client.ScheduleStreamSource.USER;
}

// app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342575.2458";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  startDate: external_exports.string(),
  durationDays: external_exports.string().transform((v) => parseInt(v, 10))
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
function ScheduleEventFullDaysViewOne() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();
  const isBigScreen = useBigScreen();
  const inputsEnabled = navigation.state === "idle" && !loaderData.scheduleEventFullDays.archived;
  const corePropertyEditable = isCorePropertyEditable(loaderData.scheduleEventFullDays);
  const [durationDays, setDurationDays] = (0, import_react2.useState)(loaderData.timeEventFullDaysBlock.duration_days);
  (0, import_react2.useEffect)(() => {
    setDurationDays(loaderData.timeEventFullDaysBlock.duration_days);
  }, [loaderData.timeEventFullDaysBlock.duration_days]);
  const allScheduleStreamsByRefId = new Map(loaderData.allScheduleStreams.map((st) => [st.ref_id, st]));
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client2.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS, entityRefId: loaderData.scheduleEventFullDays.ref_id, fakeKey: `schedule-event-full-days-${loaderData.scheduleEventFullDays.ref_id}`, showArchiveAndRemoveButton: inputsEnabled, inputsEnabled, entityNotEditable: !corePropertyEditable, entityArchived: loaderData.scheduleEventFullDays.archived, returnLocation: `/app/workspace/calendar?${query}`, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
      lineNumber: 202,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "schedule-event-full-days-properties", title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "schedule-event-full-days-properties", topLevelInfo, inputsEnabled, actions: [ActionMultipleSpread({
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
      fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
      lineNumber: 203,
      columnNumber: 89
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "scheduleStreamRefId", children: "Schedule Stream" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 216,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(ScheduleStreamSelect, { labelId: "scheduleStreamRefId", label: "Schedule Stream", name: "scheduleStreamRefId", readOnly: !inputsEnabled || !corePropertyEditable, allScheduleStreams: loaderData.allScheduleStreams, defaultValue: allScheduleStreamsByRefId.get(loaderData.scheduleEventFullDays.schedule_stream_ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 217,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/schedule_stream_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 218,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
        lineNumber: 215,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, useFlexGap: true, children: /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: !isBigScreen, sx: {
        flexGrow: 1
      }, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 224,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "name", name: "name", readOnly: !inputsEnabled || !corePropertyEditable, defaultValue: loaderData.scheduleEventFullDays.name }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 225,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 226,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
        lineNumber: 221,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
        lineNumber: 220,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", useFlexGap: true, gap: 2, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 1
        }, children: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags_names", allTags: loaderData.allTags, defaultValue: loaderData.tags.map((t) => t.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client2.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS, loaderData.scheduleEventFullDays.ref_id), aloneOnLine: !isBigScreen }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 234,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 231,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 1
        }, children: /* @__PURE__ */ jsxDEV(ContactsEditor, { name: "contacts_names", allContacts: loaderData.allContacts, defaultValue: loaderData.contacts.map((contact) => contact.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client2.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS, loaderData.scheduleEventFullDays.ref_id), aloneOnLine: !isBigScreen }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 240,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 237,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
        lineNumber: 230,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "startDate", shrink: true, margin: "dense", children: "Start Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 245,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "startDate", name: "startDate", readOnly: !inputsEnabled || !corePropertyEditable, disabled: !inputsEnabled || !corePropertyEditable, defaultValue: loaderData.timeEventFullDaysBlock.start_date }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 248,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/start_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 250,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
        lineNumber: 244,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, direction: "row", children: [
        /* @__PURE__ */ jsxDEV(ButtonGroup_default, { variant: "outlined", disabled: !inputsEnabled || !corePropertyEditable, children: [
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled || !corePropertyEditable, variant: durationDays === 1 ? "contained" : "outlined", onClick: () => setDurationDays(1), children: "1D" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
            lineNumber: 255,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled || !corePropertyEditable, variant: durationDays === 3 ? "contained" : "outlined", onClick: () => setDurationDays(3), children: "3d" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
            lineNumber: 258,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled || !corePropertyEditable, variant: durationDays === 7 ? "contained" : "outlined", onClick: () => setDurationDays(7), children: "7d" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
            lineNumber: 261,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 254,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "durationDays", shrink: true, margin: "dense", children: "Duration (Days)" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
            lineNumber: 267,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "number", label: "Duration (Days)", name: "durationDays", readOnly: !inputsEnabled || !corePropertyEditable, value: durationDays, onChange: (e) => setDurationDays(parseInt(e.target.value, 10)) }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
            lineNumber: 270,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/duration_days" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
            lineNumber: 272,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
          lineNumber: 266,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
        lineNumber: 253,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
      lineNumber: 203,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Note", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "inbox-task-note", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Create Note",
      value: "create-note",
      highlight: false,
      disabled: loaderData.note !== null
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
      lineNumber: 277,
      columnNumber: 42
    }, this), children: loaderData.note && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
      lineNumber: 284,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
      lineNumber: 283,
      columnNumber: 29
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
      lineNumber: 277,
      columnNumber: 7
    }, this)
  ] }, `schedule-event-full-days-${loaderData.scheduleEventFullDays.ref_id}`, true, {
    fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/$id.tsx",
    lineNumber: 201,
    columnNumber: 10
  }, this);
}
_s(ScheduleEventFullDaysViewOne, "T2ZK28lJ4wFy+agsbiVbhdd3Kvc=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useSearchParams, useBigScreen];
});
_c = ScheduleEventFullDaysViewOne;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/calendar", ParamsSchema, {
  notFound: (params) => `Could not find event full days with ID ${params.id}!`,
  error: (params) => `There was an error loading event full days with ID ${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "ScheduleEventFullDaysViewOne");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  ScheduleEventFullDaysViewOne as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/calendar/schedule/event-full-days/$id-XKJPWNWR.js.map
