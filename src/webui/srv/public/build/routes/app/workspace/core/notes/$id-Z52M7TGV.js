import {
  EntitySummaryLink
} from "/build/_shared/chunk-ZK23STK3.js";
import {
  noteOwnerLinkToEntityTag,
  parseNoteOwner
} from "/build/_shared/chunk-BRK4DZ5N.js";
import {
  EntityNoteEditor
} from "/build/_shared/chunk-PDFSPG4I.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import "/build/_shared/chunk-YNGTC4PW.js";
import "/build/_shared/chunk-X6MG2JXZ.js";
import "/build/_shared/chunk-Z3RPM676.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import "/build/_shared/chunk-72ELS2LF.js";
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
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-FUGZILJZ.js";
import "/build/_shared/chunk-43PAR6MS.js";
import "/build/_shared/chunk-QJ3XFSPL.js";
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

// app/routes/app/workspace/core/notes/$id.tsx
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/core/notes/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/core/notes/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342585.346";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function NoteDetail() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle" && !loaderData.note.archived;
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `core/notes/${loaderData.note.ref_id}`, returnLocation: "/app/workspace/core/notes", inputsEnabled, showArchiveAndRemoveButton: true, entityArchived: loaderData.note.archived, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/core/notes/$id.tsx",
      lineNumber: 126,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Note", children: [
      /* @__PURE__ */ jsxDEV(EntitySummaryLink, { today: topLevelInfo.today, hideModifiedTime: true, summary: (() => {
        const owner = parseNoteOwner(loaderData.note.owner);
        const summary = {
          entity_tag: noteOwnerLinkToEntityTag(loaderData.note.owner),
          parent_ref_id: loaderData.note.note_collection_ref_id,
          ref_id: owner.refId,
          name: loaderData.note.name,
          archived: loaderData.note.archived,
          created_time: loaderData.note.created_time,
          last_modified_time: loaderData.note.last_modified_time,
          archived_time: loaderData.note.archived_time
        };
        return summary;
      })() }, void 0, false, {
        fileName: "app/routes/app/workspace/core/notes/$id.tsx",
        lineNumber: 129,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled }, void 0, false, {
        fileName: "app/routes/app/workspace/core/notes/$id.tsx",
        lineNumber: 143,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/core/notes/$id.tsx",
      lineNumber: 128,
      columnNumber: 7
    }, this)
  ] }, `core/notes/${loaderData.note.ref_id}`, true, {
    fileName: "app/routes/app/workspace/core/notes/$id.tsx",
    lineNumber: 125,
    columnNumber: 10
  }, this);
}
_s(NoteDetail, "IMUWl/EuSL028qdBEjVNaTICzMo=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation];
});
_c = NoteDetail;
var ErrorBoundary = makeLeafErrorBoundary(`/app/workspace/core/notes`, ParamsSchema, {
  notFound: (params) => `Could not find note #${params.id}!`,
  error: (params) => `There was an error loading note #${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "NoteDetail");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NoteDetail as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/core/notes/$id-Z52M7TGV.js.map
