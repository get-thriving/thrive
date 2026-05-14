import {
  TimeEventSourceLink
} from "/build/_shared/chunk-UE7A3TRT.js";
import {
  occasionTimeEventName
} from "/build/_shared/chunk-24RA7B23.js";
import {
  parseEntityLinkStd
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
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import "/build/_shared/chunk-L6BTFETC.js";
import "/build/_shared/chunk-NLP5SXQ3.js";
import {
  Box_default,
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

// app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx"
  );
  import.meta.hot.lastModified = "1777639374792.993";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = basicShouldRevalidate;
function TimeEventFullDaysBlockViewOne() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();
  const inputsEnabled = navigation.state === "idle" && !loaderData.fullDaysBlock.archived;
  const corePropertyEditable = false;
  const [durationDays, setDurationDays] = (0, import_react2.useState)(loaderData.fullDaysBlock.duration_days);
  (0, import_react2.useEffect)(() => {
    setDurationDays(loaderData.fullDaysBlock.duration_days);
  }, [loaderData.fullDaysBlock.duration_days]);
  let name = null;
  const {
    theType
  } = parseEntityLinkStd(loaderData.fullDaysBlock.owner);
  switch (theType) {
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      name = loaderData.scheduleEvent.name;
      break;
    case import_webapi_client.NamedEntityTag.OCCASION:
      name = occasionTimeEventName(loaderData.fullDaysBlock, loaderData.contact, loaderData.occasion);
      break;
    case import_webapi_client.NamedEntityTag.VACATION:
      name = loaderData.vacation.name;
      break;
    default:
      throw new Error(`Unknown full-days time event owner type: ${theType}`);
  }
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `time-event-full-days-block-${loaderData.fullDaysBlock.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityNotEditable: !corePropertyEditable, entityArchived: loaderData.fullDaysBlock.archived, returnLocation: `/app/workspace/calendar?${query}`, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
      lineNumber: 122,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "time-event-full-days-block-properties", title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "time-event-full-days-block-properties", topLevelInfo, inputsEnabled, actions: [ActionMultipleSpread({
      actions: [ActionSingle({
        text: "Save",
        value: "update",
        highlight: true
      })]
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
      lineNumber: 123,
      columnNumber: 91
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Box_default, { sx: {
        display: "flex",
        flexDirection: "row",
        gap: "0.25rem"
      }, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
            lineNumber: 136,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "name", name: "name", readOnly: true, defaultValue: name }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
            lineNumber: 137,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
            lineNumber: 138,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
          lineNumber: 135,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(TimeEventSourceLink, { timeEvent: loaderData.fullDaysBlock, extraInfo: {
          person: loaderData.person ?? void 0
        } }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
          lineNumber: 141,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
        lineNumber: 130,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "startDate", shrink: true, margin: "dense", children: "Start Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
          lineNumber: 147,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "startDate", name: "startDate", readOnly: !inputsEnabled || !corePropertyEditable, disabled: !inputsEnabled || !corePropertyEditable, defaultValue: loaderData.fullDaysBlock.start_date }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
          lineNumber: 150,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/start_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
          lineNumber: 152,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
        lineNumber: 146,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, direction: "row", children: [
        /* @__PURE__ */ jsxDEV(ButtonGroup_default, { variant: "outlined", disabled: !corePropertyEditable, children: [
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled, variant: durationDays === 1 ? "contained" : "outlined", onClick: () => setDurationDays(1), children: "1D" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
            lineNumber: 157,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled, variant: durationDays === 3 ? "contained" : "outlined", onClick: () => setDurationDays(3), children: "3d" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
            lineNumber: 160,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: !inputsEnabled, variant: durationDays === 7 ? "contained" : "outlined", onClick: () => setDurationDays(7), children: "7d" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
            lineNumber: 163,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
          lineNumber: 156,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "durationDays", shrink: true, margin: "dense", children: "Duration (Days)" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
            lineNumber: 169,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "number", label: "Duration (Days)", name: "durationDays", readOnly: !inputsEnabled || !corePropertyEditable, value: durationDays, onChange: (e) => setDurationDays(parseInt(e.target.value, 10)) }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
            lineNumber: 172,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/duration_days" }, void 0, false, {
            fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
            lineNumber: 174,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
          lineNumber: 168,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
        lineNumber: 155,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
      lineNumber: 123,
      columnNumber: 7
    }, this)
  ] }, `time-event-full-days-block-${loaderData.fullDaysBlock.ref_id}`, true, {
    fileName: "app/routes/app/workspace/calendar/time-event/full-days-block/$id.tsx",
    lineNumber: 121,
    columnNumber: 10
  }, this);
}
_s(TimeEventFullDaysBlockViewOne, "QYHBue3WNQtqVsDvz5PLUVlHorQ=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useSearchParams];
});
_c = TimeEventFullDaysBlockViewOne;
var ErrorBoundary = makeLeafErrorBoundary(_c2 = (params) => `/app/workspace/calendar/time-event/full-days-block/${params.id}`, ParamsSchema, {
  notFound: (params) => `Could not find time event full days block #${params.id}!`,
  error: (params) => `There was an error loading time event full days block #${params.id}! Please try again!`
});
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "TimeEventFullDaysBlockViewOne");
$RefreshReg$(_c2, "ErrorBoundary$makeLeafErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  TimeEventFullDaysBlockViewOne as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/calendar/time-event/full-days-block/$id-3HRRXEVZ.js.map
