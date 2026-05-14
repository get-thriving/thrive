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
  useParams
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

// app/routes/app/workspace/smart-lists/$id/$itemId.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist2());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/smart-lists/$id/$itemId.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/smart-lists/$id/$itemId.tsx"
  );
  import.meta.hot.lastModified = "1777213342602.8247";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string(),
  itemId: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  isDone: import_zodix.CheckboxAsString,
  url: external_exports.string().transform((s) => s === "" ? void 0 : s).optional()
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
function SmartListItem() {
  _s();
  const {
    id
  } = useParams();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const inputsEnabled = navigation.state === "idle" && !loaderData.item.archived;
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.SMART_LIST_ITEM, entityRefId: loaderData.item.ref_id, fakeKey: `smart-list-${id}/item-${loaderData.item.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: loaderData.item.archived, returnLocation: `/app/workspace/smart-lists/${id}`, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
      lineNumber: 181,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "email-task-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Save",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
      lineNumber: 182,
      columnNumber: 48
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", useFlexGap: true, spacing: 1, children: /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
        flexGrow: 1
      }, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
          lineNumber: 191,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", defaultValue: loaderData.item.name, name: "name", readOnly: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
          lineNumber: 192,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
          lineNumber: 194,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
        lineNumber: 188,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
        lineNumber: 187,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 1,
          minWidth: "25%"
        }, children: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "generic_tags_names", aloneOnLine: true, allTags: loaderData.allTags, defaultValue: loaderData.genericTags.map((t) => t.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.SMART_LIST_ITEM, loaderData.item.ref_id), label: "Tags" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
          lineNumber: 203,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
          lineNumber: 199,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 1,
          minWidth: "25%"
        }, children: /* @__PURE__ */ jsxDEV(ContactsEditor, { name: "contacts_names", aloneOnLine: true, allContacts: loaderData.allContacts, defaultValue: loaderData.contacts.map((c) => c.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.SMART_LIST_ITEM, loaderData.item.ref_id), label: "Contacts" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
          lineNumber: 210,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
          lineNumber: 206,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
        lineNumber: 198,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormControlLabel_default, { control: /* @__PURE__ */ jsxDEV(Switch_default, { name: "isDone", readOnly: !inputsEnabled, disabled: !inputsEnabled, defaultChecked: loaderData.item.is_done }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
          lineNumber: 215,
          columnNumber: 38
        }, this), label: "Is Done" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
          lineNumber: 215,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/is_done" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
          lineNumber: 216,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
        lineNumber: 214,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "url", children: "Url [Optional]" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
          lineNumber: 220,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Url", name: "url", readOnly: !inputsEnabled, defaultValue: loaderData.item.url }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
          lineNumber: 221,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/url" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
          lineNumber: 222,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
        lineNumber: 219,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
      lineNumber: 182,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Note", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "smart-list-item-note", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Create Note",
      value: "create-note",
      highlight: false,
      disabled: loaderData.note !== null
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
      lineNumber: 226,
      columnNumber: 42
    }, this), children: loaderData.note && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
      lineNumber: 233,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
      lineNumber: 232,
      columnNumber: 29
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
      lineNumber: 226,
      columnNumber: 7
    }, this)
  ] }, `smart-list-${id}/item-${loaderData.item.ref_id}`, true, {
    fileName: "app/routes/app/workspace/smart-lists/$id/$itemId.tsx",
    lineNumber: 180,
    columnNumber: 10
  }, this);
}
_s(SmartListItem, "9/9ZlKslw/Gjg93bqLVPE9csEFs=", false, function() {
  return [useParams, useLoaderDataSafeForAnimation, useActionData, useNavigation, useBigScreen];
});
_c = SmartListItem;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/smart-lists", ParamsSchema, {
  notFound: (params) => `Could not find item ${params.itemId} in smart list ${params.id}!`,
  error: (params) => `There was an error loading item ${params.itemId} in smart list ${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "SmartListItem");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  SmartListItem as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/smart-lists/$id/$itemId-CDVCWD4P.js.map
