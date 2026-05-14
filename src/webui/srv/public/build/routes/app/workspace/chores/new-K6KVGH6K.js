import {
  LifePlanAssociations
} from "/build/_shared/chunk-OE7VPYTO.js";
import "/build/_shared/chunk-6SJK4Y2K.js";
import "/build/_shared/chunk-OIJ3E3DH.js";
import "/build/_shared/chunk-OLMKSGLM.js";
import "/build/_shared/chunk-ZFN6H2GY.js";
import {
  lifePlanBirthdayDate
} from "/build/_shared/chunk-HQECWRQJ.js";
import "/build/_shared/chunk-WCBSHJX3.js";
import "/build/_shared/chunk-37FGSNWH.js";
import "/build/_shared/chunk-IRHCW4HP.js";
import {
  RecurringTaskGenParamsBlock
} from "/build/_shared/chunk-WKUBLS6Z.js";
import "/build/_shared/chunk-HVU6TG3B.js";
import {
  IsKeySelect
} from "/build/_shared/chunk-SWYHSSUT.js";
import "/build/_shared/chunk-T6GSSEVE.js";
import "/build/_shared/chunk-NLPUBZ3T.js";
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
import {
  isWorkspaceFeatureAvailable
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  FormControlLabel_default,
  FormControl_default,
  InputLabel_default,
  OutlinedInput_default,
  Stack_default,
  Switch_default
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

// app/routes/app/workspace/chores/new.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/chores/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/chores/new.tsx"
  );
  import.meta.hot.lastModified = "1775685113127.3657";
}
var ParamsSchema = external_exports.object({});
var CreateFormSchema = external_exports.object({
  name: external_exports.string(),
  aspect: external_exports.string().optional(),
  chapter: external_exports.string().optional(),
  goal: external_exports.string().optional(),
  period: external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod),
  isKey: import_zodix.CheckboxAsString,
  eisen: external_exports.nativeEnum(import_webapi_client.Eisen),
  difficulty: external_exports.nativeEnum(import_webapi_client.Difficulty),
  actionableFromDay: external_exports.string().optional(),
  actionableFromMonth: external_exports.string().optional(),
  dueAtDay: external_exports.string().optional(),
  dueAtMonth: external_exports.string().optional(),
  mustDo: import_zodix.CheckboxAsString,
  skipRule: external_exports.string().optional(),
  startAtDate: external_exports.string().optional(),
  endAtDate: external_exports.string().optional()
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function NewChore() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const birthdayDate = loaderData.lifePlan ? lifePlanBirthdayDate(loaderData.lifePlan) : null;
  const [selectedAspect, setSelectedAspect] = (0, import_react2.useState)(loaderData.rootAspect?.ref_id ?? "");
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: "chores/new", returnLocation: "/app/workspace/chores", inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/chores/new.tsx",
      lineNumber: 132,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "New Chore", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "chore-create", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "chore-create",
      text: "Create",
      value: "create",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/chores/new.tsx",
      lineNumber: 133,
      columnNumber: 87
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", useFlexGap: true, spacing: 1, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 3
        }, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/new.tsx",
            lineNumber: 143,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled, defaultValue: "" }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/new.tsx",
            lineNumber: 144,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/new.tsx",
            lineNumber: 145,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 140,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 1
        }, children: [
          /* @__PURE__ */ jsxDEV(IsKeySelect, { name: "isKey", defaultValue: false, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/new.tsx",
            lineNumber: 151,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/is_key" }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/new.tsx",
            lineNumber: 152,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 148,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/chores/new.tsx",
        lineNumber: 139,
        columnNumber: 9
      }, this),
      isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(LifePlanAssociations, { inputsEnabled, allAspects: loaderData.allAspects ?? [], aspectValue: selectedAspect, onAspectChange: setSelectedAspect, allChapters: loaderData.allChapters ?? [], allGoals: loaderData.allGoals ?? [], birthday: birthdayDate, today: aDateToDate(topLevelInfo.today), allMilestones: loaderData.allMilestones ?? [] }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 157,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/aspect_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 158,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/chapter_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 159,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/goal_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 160,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/chores/new.tsx",
        lineNumber: 156,
        columnNumber: 93
      }, this),
      /* @__PURE__ */ jsxDEV(RecurringTaskGenParamsBlock, { inputsEnabled, allowSkipRule: true, period: import_webapi_client.RecurringTaskPeriod.DAILY, eisen: import_webapi_client.Eisen.REGULAR, difficulty: import_webapi_client.Difficulty.EASY, actionableFromDay: null, actionableFromMonth: null, dueAtDay: null, dueAtMonth: null, skipRule: null, actionData }, void 0, false, {
        fileName: "app/routes/app/workspace/chores/new.tsx",
        lineNumber: 163,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormControlLabel_default, { control: /* @__PURE__ */ jsxDEV(Switch_default, { name: "mustDo", readOnly: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 166,
          columnNumber: 38
        }, this), label: "Must Do In Vacation" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 166,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/must_do" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 167,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/chores/new.tsx",
        lineNumber: 165,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "startAtDate", shrink: true, children: "Start At date [Optional]" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 171,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "startAtDate", name: "startAtDate", readOnly: !inputsEnabled, disabled: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 174,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/start_at_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 175,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/chores/new.tsx",
        lineNumber: 170,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "endAtDate", shrink: true, children: "End At Date [Optional]" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 179,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "endAtDate", name: "endAtDate", readOnly: !inputsEnabled, disabled: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 182,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/end_at_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/new.tsx",
          lineNumber: 183,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/chores/new.tsx",
        lineNumber: 178,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/chores/new.tsx",
      lineNumber: 133,
      columnNumber: 7
    }, this)
  ] }, "chores/new", true, {
    fileName: "app/routes/app/workspace/chores/new.tsx",
    lineNumber: 131,
    columnNumber: 10
  }, this);
}
_s(NewChore, "YpFyu2dztK3+4J+EH5RLRMksSzs=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation];
});
_c = NewChore;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/chores", ParamsSchema, {
  error: () => `There was an error creating the chore! Please try again!`
});
var _c;
$RefreshReg$(_c, "NewChore");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NewChore as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/chores/new-K6KVGH6K.js.map
