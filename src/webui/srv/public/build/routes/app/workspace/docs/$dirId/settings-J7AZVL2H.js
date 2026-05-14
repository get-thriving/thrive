import {
  DirSelect
} from "/build/_shared/chunk-4VS4VGIU.js";
import {
  isDirRoot
} from "/build/_shared/chunk-RDEY3YL3.js";
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
  FormControl_default,
  InputLabel_default,
  OutlinedInput_default,
  Stack_default,
  Typography_default
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

// app/routes/app/workspace/docs/$dirId/settings.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/docs/$dirId/settings.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/docs/$dirId/settings.tsx"
  );
  import.meta.hot.lastModified = "1777810170522.2603";
}
var ParamsSchema = external_exports.object({
  dirId: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  parent_dir_ref_id: external_exports.string()
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function DirFolderSettings() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const isRoot = isDirRoot(loaderData.dir);
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `docs-dir-settings-${loaderData.dir.ref_id}`, returnLocation: `/app/workspace/docs/${loaderData.dirId}`, inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/docs/$dirId/settings.tsx",
      lineNumber: 158,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Folder", actions: !isRoot ? /* @__PURE__ */ jsxDEV(SectionActions, { id: "docs-dir-settings-save", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "docs-dir-settings-save",
      text: "Save",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/docs/$dirId/settings.tsx",
      lineNumber: 160,
      columnNumber: 54
    }, this) : void 0, children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, children: [
      isRoot && /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body2", color: "text.secondary", children: "The collection root folder cannot be renamed or moved. You can still edit tags below." }, void 0, false, {
        fileName: "app/routes/app/workspace/docs/$dirId/settings.tsx",
        lineNumber: 167,
        columnNumber: 22
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "docs-dir-settings-name", children: "Name" }, void 0, false, {
          fileName: "app/routes/app/workspace/docs/$dirId/settings.tsx",
          lineNumber: 172,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", defaultValue: loaderData.dir.name, readOnly: !inputsEnabled || isRoot, inputProps: {
          "aria-labelledby": "docs-dir-settings-name"
        } }, void 0, false, {
          fileName: "app/routes/app/workspace/docs/$dirId/settings.tsx",
          lineNumber: 173,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
          fileName: "app/routes/app/workspace/docs/$dirId/settings.tsx",
          lineNumber: 176,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/docs/$dirId/settings.tsx",
        lineNumber: 171,
        columnNumber: 11
      }, this),
      !isRoot && /* @__PURE__ */ jsxDEV(DirSelect, { name: "parent_dir_ref_id", label: "Parent folder", inputsEnabled, disabled: false, allDirs: loaderData.allDirs, excludeSubtreeRootRefId: loaderData.dirId, defaultValue: loaderData.dir.parent_dir_ref_id ?? void 0 }, void 0, false, {
        fileName: "app/routes/app/workspace/docs/$dirId/settings.tsx",
        lineNumber: 179,
        columnNumber: 23
      }, this),
      /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags", allTags: loaderData.allTags, defaultValue: loaderData.tags.map((t) => t.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.DIR, loaderData.dir.ref_id), label: "Tags", aloneOnLine: true }, void 0, false, {
        fileName: "app/routes/app/workspace/docs/$dirId/settings.tsx",
        lineNumber: 181,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/docs/$dirId/settings.tsx",
      lineNumber: 166,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/docs/$dirId/settings.tsx",
      lineNumber: 160,
      columnNumber: 7
    }, this)
  ] }, `docs-dir-settings-${loaderData.dir.ref_id}`, true, {
    fileName: "app/routes/app/workspace/docs/$dirId/settings.tsx",
    lineNumber: 157,
    columnNumber: 10
  }, this);
}
_s(DirFolderSettings, "IMUWl/EuSL028qdBEjVNaTICzMo=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation];
});
_c = DirFolderSettings;
var ErrorBoundary = makeLeafErrorBoundary(_c2 = (params) => `/app/workspace/docs/${params.dirId}`, ParamsSchema, {
  notFound: () => `Could not find this folder!`,
  error: () => `There was an error loading folder settings! Please try again!`
});
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "DirFolderSettings");
$RefreshReg$(_c2, "ErrorBoundary$makeLeafErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  DirFolderSettings as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/docs/$dirId/settings-J7AZVL2H.js.map
