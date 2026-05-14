import {
  TagsEditor
} from "/build/_shared/chunk-FTLY2H2V.js";
import {
  entityLinkStd
} from "/build/_shared/chunk-HDJTYRJL.js";
import {
  OccasionKindSelect
} from "/build/_shared/chunk-OBVAFFGG.js";
import {
  BirthdaySelect
} from "/build/_shared/chunk-LR4KQCWM.js";
import "/build/_shared/chunk-IRHCW4HP.js";
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
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  FormControl_default,
  FormLabel_default,
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

// app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx"
  );
  import.meta.hot.lastModified = "1777213342596.6128";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string(),
  occasionId: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  kind: external_exports.nativeEnum(import_webapi_client.OccasionKind),
  date: external_exports.string()
}), external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 4 /* LEAFLET */
};
var shouldRevalidate = standardShouldRevalidate;
function OccasionView() {
  _s();
  const {
    occasion,
    tags,
    allTags
  } = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const inputsEnabled = navigation.state === "idle" && !occasion.archived;
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.OCCASION, entityRefId: occasion.ref_id, fakeKey: `occasion-${occasion.ref_id}`, isLeaflet: true, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: occasion.archived, returnLocation: `/app/workspace/prm/persons/${occasion.person_ref_id}`, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
      lineNumber: 168,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "occasion-properties", title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "occasion-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Save",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
      lineNumber: 169,
      columnNumber: 73
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 1, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 3
        }, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
            lineNumber: 178,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled, defaultValue: occasion.name }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
            lineNumber: 179,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
            lineNumber: 180,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
          lineNumber: 175,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 2
        }, children: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags", label: null, aloneOnLine: !isBigScreen, allTags, defaultValue: tags.map((tag) => tag.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.OCCASION, occasion.ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
          lineNumber: 186,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
          lineNumber: 183,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
        lineNumber: 174,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "kind", children: "Kind" }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
          lineNumber: 191,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OccasionKindSelect, { name: "kind", defaultValue: occasion.kind, inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
          lineNumber: 192,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/kind" }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
          lineNumber: 193,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
        lineNumber: 190,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "date", children: "Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
          lineNumber: 197,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(BirthdaySelect, { name: "date", initialValue: occasion.date, inputsEnabled, allowNoneBirthday: false }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
          lineNumber: 198,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/birthday" }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
          lineNumber: 199,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
        lineNumber: 196,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
      lineNumber: 169,
      columnNumber: 7
    }, this)
  ] }, `occasion-${occasion.ref_id}`, true, {
    fileName: "app/routes/app/workspace/prm/persons/$id/occasions/$occasionId.tsx",
    lineNumber: 167,
    columnNumber: 10
  }, this);
}
_s(OccasionView, "Z7KUQOOP+RXyROuTgNzDTT49CfA=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useBigScreen];
});
_c = OccasionView;
var ErrorBoundary = makeLeafErrorBoundary("../../..", ParamsSchema, {
  notFound: (params) => `Could not find occasion #${params.occasionId}!`,
  error: (params) => `There was an error loading occasion #${params.occasionId}! Please try again!`
});
var _c;
$RefreshReg$(_c, "OccasionView");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  OccasionView as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/prm/persons/$id/occasions/$occasionId-PSNQMLSU.js.map
