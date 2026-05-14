import {
  ContactsEditor
} from "/build/_shared/chunk-VGTT4RYC.js";
import {
  TimeEventFullDaysBlockStack
} from "/build/_shared/chunk-EHKP722S.js";
import "/build/_shared/chunk-24RA7B23.js";
import {
  EntityNoteEditor
} from "/build/_shared/chunk-PDFSPG4I.js";
import {
  TagsEditor
} from "/build/_shared/chunk-FTLY2H2V.js";
import {
  entityLinkStd
} from "/build/_shared/chunk-HDJTYRJL.js";
import "/build/_shared/chunk-HGSZOXV4.js";
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
import "/build/_shared/chunk-Z3RPM676.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import "/build/_shared/chunk-MY6WUQK6.js";
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

// app/routes/app/workspace/vacations/$id.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/vacations/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/vacations/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342620.6487";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  startDate: external_exports.string(),
  endDate: external_exports.string()
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
function Vacation() {
  _s();
  const {
    vacation,
    note,
    timeEventBlock,
    tags,
    contacts,
    allTags,
    allContacts
  } = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const inputsEnabled = navigation.state === "idle" && !vacation.archived;
  const timeEventBlockEntry = {
    time_event: timeEventBlock,
    entry: {
      vacation,
      time_event: timeEventBlock
    }
  };
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.VACATION, entityRefId: vacation.ref_id, fakeKey: `vacation-${vacation.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: vacation.archived, returnLocation: "/app/workspace/vacations", children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/vacations/$id.tsx",
      lineNumber: 195,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "vacation-update", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "vacation-update",
      text: "Save",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/vacations/$id.tsx",
      lineNumber: 196,
      columnNumber: 48
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", spacing: 1, children: /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
        flexGrow: 3
      }, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
          fileName: "app/routes/app/workspace/vacations/$id.tsx",
          lineNumber: 206,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "name", name: "name", readOnly: !inputsEnabled, disabled: !inputsEnabled, defaultValue: vacation.name }, void 0, false, {
          fileName: "app/routes/app/workspace/vacations/$id.tsx",
          lineNumber: 207,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
          fileName: "app/routes/app/workspace/vacations/$id.tsx",
          lineNumber: 208,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/vacations/$id.tsx",
        lineNumber: 203,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/vacations/$id.tsx",
        lineNumber: 202,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", useFlexGap: true, spacing: 1, children: [
        allTags && tags && /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 2
        }, children: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags", aloneOnLine: true, allTags, defaultValue: tags.map((tag) => tag.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.VACATION, vacation.ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/vacations/$id.tsx",
          lineNumber: 216,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/vacations/$id.tsx",
          lineNumber: 213,
          columnNumber: 31
        }, this),
        allContacts && contacts && /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 2
        }, children: /* @__PURE__ */ jsxDEV(ContactsEditor, { name: "contacts_names", aloneOnLine: true, allContacts, defaultValue: contacts.map((contact) => contact.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.VACATION, vacation.ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/vacations/$id.tsx",
          lineNumber: 222,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/vacations/$id.tsx",
          lineNumber: 219,
          columnNumber: 39
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/vacations/$id.tsx",
        lineNumber: 212,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "startDate", shrink: true, children: "Start Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/vacations/$id.tsx",
          lineNumber: 227,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "startDate", defaultValue: aDateToDate(vacation.start_date).toFormat("yyyy-MM-dd"), name: "startDate", readOnly: !inputsEnabled, disabled: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/vacations/$id.tsx",
          lineNumber: 230,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/start_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/vacations/$id.tsx",
          lineNumber: 232,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/vacations/$id.tsx",
        lineNumber: 226,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "endDate", shrink: true, children: "End Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/vacations/$id.tsx",
          lineNumber: 236,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "endDate", defaultValue: aDateToDate(vacation.end_date).toFormat("yyyy-MM-dd"), name: "endDate", readOnly: !inputsEnabled, disabled: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/vacations/$id.tsx",
          lineNumber: 239,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/end_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/vacations/$id.tsx",
          lineNumber: 241,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/vacations/$id.tsx",
        lineNumber: 235,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/vacations/$id.tsx",
      lineNumber: 196,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Note", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "vacation-create-note", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "vacation-create-note",
      text: "Create Note",
      value: "create-note",
      highlight: false,
      disabled: note !== null
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/vacations/$id.tsx",
      lineNumber: 245,
      columnNumber: 42
    }, this), children: note && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: note, inputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/vacations/$id.tsx",
      lineNumber: 253,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/vacations/$id.tsx",
      lineNumber: 252,
      columnNumber: 18
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/vacations/$id.tsx",
      lineNumber: 245,
      columnNumber: 7
    }, this),
    isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.SCHEDULE) && /* @__PURE__ */ jsxDEV(TimeEventFullDaysBlockStack, { topLevelInfo, inputsEnabled, title: "Time Events", entries: [timeEventBlockEntry] }, void 0, false, {
      fileName: "app/routes/app/workspace/vacations/$id.tsx",
      lineNumber: 257,
      columnNumber: 90
    }, this)
  ] }, `vacation-${vacation.ref_id}`, true, {
    fileName: "app/routes/app/workspace/vacations/$id.tsx",
    lineNumber: 194,
    columnNumber: 10
  }, this);
}
_s(Vacation, "NcyBRyexWroQ4VjnZn5Mci4hek0=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useBigScreen];
});
_c = Vacation;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/vacations", ParamsSchema, {
  notFound: (params) => `Could not find vacation #${params.id}!`,
  error: (params) => `There was an error loading vacation #${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "Vacation");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Vacation as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/vacations/$id-BA5LGUA4.js.map
