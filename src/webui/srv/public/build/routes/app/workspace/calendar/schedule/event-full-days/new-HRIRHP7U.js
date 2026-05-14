import {
  ScheduleStreamSelect
} from "/build/_shared/chunk-F37AJ4V5.js";
import "/build/_shared/chunk-LUFLY6NA.js";
import "/build/_shared/chunk-3U5H3AD4.js";
import "/build/_shared/chunk-7YZ2X2X4.js";
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
  ButtonGroup_default,
  Button_default,
  FormControl_default,
  InputLabel_default,
  OutlinedInput_default,
  Stack_default
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

// app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx"
  );
  import.meta.hot.lastModified = "1775685113137.2502";
}
var ParamsSchema = external_exports.object({});
var QuerySchema = external_exports.object({
  date: external_exports.string().regex(/[0-9][0-9][0-9][0-9][-][0-9][0-9][-][0-9][0-9]/).optional()
});
var CreateFormSchema = external_exports.object({
  scheduleStreamRefId: external_exports.string(),
  name: external_exports.string(),
  startDate: external_exports.string(),
  durationDays: external_exports.string().transform((v) => parseInt(v, 10))
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function ScheduleEventFullDaysNew() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();
  const inputsEnabled = navigation.state === "idle";
  const [durationDays, setDurationDays] = (0, import_react2.useState)(1);
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: "schedule-event-full-days/new", returnLocation: `/app/workspace/calendar?${query}`, inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
      lineNumber: 100,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "schedule-event-full-days-properties", title: "Properties", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "schedule-event-full-days-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Create",
      value: "create",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
      lineNumber: 101,
      columnNumber: 129
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "scheduleStreamRefId", children: "Schedule Stream" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
          lineNumber: 107,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(ScheduleStreamSelect, { labelId: "scheduleStreamRefId", label: "Schedule Stream", name: "scheduleStreamRefId", readOnly: !inputsEnabled, allScheduleStreams: loaderData.allScheduleStreams, defaultValue: loaderData.allScheduleStreams[0] }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
          lineNumber: 108,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/schedule_stream_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
          lineNumber: 109,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
        lineNumber: 106,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
          lineNumber: 112,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "name", name: "name", readOnly: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
          lineNumber: 113,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
          lineNumber: 114,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
        lineNumber: 111,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "startDate", shrink: true, margin: "dense", children: "Start Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
          lineNumber: 118,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "startDate", name: "startDate", readOnly: !inputsEnabled, disabled: !inputsEnabled, defaultValue: loaderData.date }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
          lineNumber: 121,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/start_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
          lineNumber: 123,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
        lineNumber: 117,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, direction: "row", children: [
        /* @__PURE__ */ jsxDEV(ButtonGroup_default, { variant: "outlined", disabled: !inputsEnabled, children: [
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled, variant: durationDays === 1 ? "contained" : "outlined", onClick: () => setDurationDays(1), children: "1d" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
            lineNumber: 128,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled, variant: durationDays === 3 ? "contained" : "outlined", onClick: () => setDurationDays(3), children: "3d" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
            lineNumber: 131,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled, variant: durationDays === 7 ? "contained" : "outlined", onClick: () => setDurationDays(7), children: "7d" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
            lineNumber: 134,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
          lineNumber: 127,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "durationDays", shrink: true, margin: "dense", children: "Duration (Days)" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
            lineNumber: 140,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "number", label: "Duration (Days)", name: "durationDays", readOnly: !inputsEnabled, value: durationDays, onChange: (e) => setDurationDays(parseInt(e.target.value, 10)) }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
            lineNumber: 143,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/duration_days" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
            lineNumber: 145,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
          lineNumber: 139,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
        lineNumber: 126,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
      lineNumber: 101,
      columnNumber: 7
    }, this)
  ] }, "schedule-event-full-days/new", true, {
    fileName: "app/routes/app/workspace/calendar/schedule/event-full-days/new.tsx",
    lineNumber: 99,
    columnNumber: 10
  }, this);
}
_s(ScheduleEventFullDaysNew, "oA9InVaw1P43PeyzvA+2+IpLelc=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useSearchParams];
});
_c = ScheduleEventFullDaysNew;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/calendar", ParamsSchema, {
  notFound: () => `Could not find the event full days!`,
  error: () => `There was an error creating the event full days! Please try again!`
});
var _c;
$RefreshReg$(_c, "ScheduleEventFullDaysNew");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  ScheduleEventFullDaysNew as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/calendar/schedule/event-full-days/new-HRIRHP7U.js.map
