import {
  TimeEventParamsSource
} from "/build/_shared/chunk-KOESW7BN.js";
import "/build/_shared/chunk-24RA7B23.js";
import "/build/_shared/chunk-HDJTYRJL.js";
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
  DateTime,
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

// app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx"
  );
  import.meta.hot.lastModified = "1775685113141.6738";
}
var ParamsSchema = external_exports.object({});
var QuerySchema = external_exports.object({
  bigPlanRefId: external_exports.string(),
  timePlanReason: external_exports.literal("for-time-plan").optional(),
  timePlanRefId: external_exports.string().optional(),
  timePlanActivityRefId: external_exports.string().optional(),
  date: external_exports.string().regex(/[0-9][0-9][0-9][0-9][-][0-9][0-9][-][0-9][0-9]/).optional()
});
var CreateFormSchema = external_exports.object({
  userTimezone: external_exports.string(),
  startDate: external_exports.string(),
  startTimeInDay: external_exports.string().optional(),
  durationMins: external_exports.string().transform((v) => parseInt(v, 10))
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function TimeEventInDayBlockCreateForBigPlan() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();
  const inputsEnabled = navigation.state === "idle" && !loaderData.bigPlan.archived;
  const rightNow = DateTime.local({
    zone: topLevelInfo.user.timezone
  });
  const [startDate, setStartDate] = (0, import_react2.useState)(rightNow.toFormat("yyyy-MM-dd"));
  const [startTimeInDay, setStartTimeInDay] = (0, import_react2.useState)(rightNow.toFormat("HH:mm"));
  const [durationMins, setDurationMins] = (0, import_react2.useState)(60);
  (0, import_react2.useEffect)(() => {
    if (query.get("sourceStartDate") && query.get("sourceStartTimeInDay")) {
      setStartDate(query.get("sourceStartDate"));
      setStartTimeInDay(query.get("sourceStartTimeInDay"));
    }
    if (query.get("sourceDurationMins")) {
      setDurationMins(parseInt(query.get("sourceDurationMins"), 10));
    }
  }, [query]);
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: "time-event-in-day-block/new", returnLocation: `/app/workspace/calendar?${query}`, inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(TimeEventParamsSource, { startDate, startTimeInDay, durationMins }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
      lineNumber: 156,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
      lineNumber: 157,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "time-event-in-day-block-properties", title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "time-event-in-day-block-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Create",
      value: "create",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
      lineNumber: 158,
      columnNumber: 88
    }, this), children: [
      /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "userTimezone", value: topLevelInfo.user.timezone }, void 0, false, {
        fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
        lineNumber: 163,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
          lineNumber: 166,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "name", name: "name", defaultValue: loaderData.bigPlan.name, readOnly: true }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
          lineNumber: 167,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
        lineNumber: 165,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "startDate", shrink: true, margin: "dense", children: "Start Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
          lineNumber: 171,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "startDate", name: "startDate", readOnly: !inputsEnabled, disabled: !inputsEnabled, value: startDate, onChange: (e) => setStartDate(e.target.value) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
          lineNumber: 174,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/start_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
          lineNumber: 176,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
        lineNumber: 170,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "startTimeInDay", shrink: true, margin: "dense", children: "Start Time" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
          lineNumber: 180,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "time", label: "startTimeInDay", name: "startTimeInDay", readOnly: !inputsEnabled, value: startTimeInDay, onChange: (e) => setStartTimeInDay(e.target.value) }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
          lineNumber: 183,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/start_time_in_day" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
          lineNumber: 185,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
        lineNumber: 179,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, direction: "row", children: [
        /* @__PURE__ */ jsxDEV(ButtonGroup_default, { variant: "outlined", disabled: !inputsEnabled, children: [
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled, variant: durationMins === 15 ? "contained" : "outlined", onClick: () => setDurationMins(15), children: "15m" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
            lineNumber: 190,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled, variant: durationMins === 30 ? "contained" : "outlined", onClick: () => setDurationMins(30), children: "30m" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
            lineNumber: 193,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled, variant: durationMins === 60 ? "contained" : "outlined", onClick: () => setDurationMins(60), children: "60m" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
            lineNumber: 196,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
          lineNumber: 189,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "durationMins", shrink: true, margin: "dense", children: "Duration (Mins)" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
            lineNumber: 202,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "number", label: "Duration (Mins)", name: "durationMins", readOnly: !inputsEnabled, value: durationMins, onChange: (e) => {
            if (Number.isNaN(parseInt(e.target.value, 10))) {
              setDurationMins(0);
              e.preventDefault();
              return;
            }
            return setDurationMins(parseInt(e.target.value, 10));
          } }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
            lineNumber: 205,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/duration_mins" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
            lineNumber: 214,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
          lineNumber: 201,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
        lineNumber: 188,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
      lineNumber: 158,
      columnNumber: 7
    }, this)
  ] }, "time-event-in-day-block/new", true, {
    fileName: "app/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan.tsx",
    lineNumber: 155,
    columnNumber: 10
  }, this);
}
_s(TimeEventInDayBlockCreateForBigPlan, "BV8Uh0/futcP2fjfG0INtQPX3No=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useSearchParams];
});
_c = TimeEventInDayBlockCreateForBigPlan;
var ErrorBoundary = makeLeafErrorBoundary(_c2 = (_params, searchParams) => `/app/workspace/calendar?${searchParams}`, ParamsSchema, {
  error: () => `There was an error creating the event in day! Please try again!`
});
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "TimeEventInDayBlockCreateForBigPlan");
$RefreshReg$(_c2, "ErrorBoundary$makeLeafErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  TimeEventInDayBlockCreateForBigPlan as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/calendar/time-event/in-day-block/new-for-big-plan-TWO7RYNN.js.map
