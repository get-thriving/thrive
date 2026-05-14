import {
  noteOwnerLinkToEntityTag,
  parseNoteOwner
} from "/build/_shared/chunk-BRK4DZ5N.js";
import {
  EntityNoNothingCard
} from "/build/_shared/chunk-35FY5RIR.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  FilterManyOptions,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  makeTrunkErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence,
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-QJ3XFSPL.js";
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
  useTrunkNeedsToShowLeaf
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Outlet
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

// app/routes/app/workspace/core/notes.tsx
var import_webapi_client2 = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());

// ../core/jupiter/core/common/sub/notes/note-owner-type-name.ts
var import_webapi_client = __toESM(require_dist(), 1);
function noteOwnerEntityTagName(tag) {
  switch (tag) {
    case import_webapi_client.NamedEntityTag.TODO_TASK:
      return "Todo Task";
    case import_webapi_client.NamedEntityTag.WORKING_MEM:
      return "Working Mem";
    case import_webapi_client.NamedEntityTag.TIME_PLAN:
      return "Time Plan";
    case import_webapi_client.NamedEntityTag.SCHEDULE_STREAM:
      return "Schedule Stream";
    case import_webapi_client.NamedEntityTag.SCHEDULE_EXPORT:
      return "Schedule Export";
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      return "Schedule Event In Day";
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      return "Schedule Event Full Days";
    case import_webapi_client.NamedEntityTag.HABIT:
      return "Habit";
    case import_webapi_client.NamedEntityTag.CHORE:
      return "Chore";
    case import_webapi_client.NamedEntityTag.BIG_PLAN:
      return "Big Plan";
    case import_webapi_client.NamedEntityTag.DOC:
      return "Doc";
    case import_webapi_client.NamedEntityTag.JOURNAL:
      return "Journal";
    case import_webapi_client.NamedEntityTag.VACATION:
      return "Vacation";
    case import_webapi_client.NamedEntityTag.ASPECT:
      return "Aspect";
    case import_webapi_client.NamedEntityTag.CHAPTER:
      return "Chapter";
    case import_webapi_client.NamedEntityTag.GOAL:
      return "Goal";
    case import_webapi_client.NamedEntityTag.MILESTONE:
      return "Milestone";
    case import_webapi_client.NamedEntityTag.VISION:
      return "Vision";
    case import_webapi_client.NamedEntityTag.SMART_LIST:
      return "Smart List";
    case import_webapi_client.NamedEntityTag.SMART_LIST_ITEM:
      return "Smart List Item";
    case import_webapi_client.NamedEntityTag.METRIC:
      return "Metric";
    case import_webapi_client.NamedEntityTag.METRIC_ENTRY:
      return "Metric Entry";
    case import_webapi_client.NamedEntityTag.PERSON:
      return "Person";
    case import_webapi_client.NamedEntityTag.OCCASION:
      return "Occasion";
    case import_webapi_client.NamedEntityTag.TIME_PLAN_ACTIVITY:
      return "Time Plan Activity";
    default:
      return tag;
  }
}

// ../core/jupiter/core/common/sub/notes/component/note-owner-type-chip.tsx
function NoteOwnerTypeChip(props) {
  const tag = noteOwnerLinkToEntityTag(props.owner);
  return /* @__PURE__ */ jsxDEV(SlimChip, { label: noteOwnerEntityTagName(tag), color: "default" }, void 0, false, {
    fileName: "../core/jupiter/core/common/sub/notes/component/note-owner-type-chip.tsx",
    lineNumber: 11,
    columnNumber: 10
  }, this);
}

// app/routes/app/workspace/core/notes.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/core/notes.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/core/notes.tsx"
  );
  import.meta.hot.lastModified = "1777213342585.1077";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function Notes() {
  _s();
  const {
    notes,
    noteOwnerFilterTags
  } = useLoaderDataSafeForAnimation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();
  const [selectedOwnerTypes, setSelectedOwnerTypes] = (0, import_react2.useState)([]);
  const ownerTypeOptions = (0, import_react2.useMemo)(() => noteOwnerFilterTags.map((tag) => ({
    value: tag,
    text: noteOwnerEntityTagName(tag)
  })), [noteOwnerFilterTags]);
  const filteredNotes = (0, import_react2.useMemo)(() => {
    const sorted = [...notes].sort((a, b) => {
      const ta = parseNoteOwner(a.owner).theType;
      const tb = parseNoteOwner(b.owner).theType;
      if (ta < tb) {
        return -1;
      }
      if (ta > tb) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
    if (selectedOwnerTypes.length === 0) {
      return sorted;
    }
    return sorted.filter((n) => {
      const {
        theType
      } = parseNoteOwner(n.owner);
      return selectedOwnerTypes.some((t) => t === theType);
    });
  }, [notes, selectedOwnerTypes]);
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { returnLocation: "/app/workspace", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "core-notes-actions", topLevelInfo, inputsEnabled: true, actions: [FilterManyOptions("Owner type", ownerTypeOptions, setSelectedOwnerTypes)] }, void 0, false, {
    fileName: "app/routes/app/workspace/core/notes.tsx",
    lineNumber: 95,
    columnNumber: 82
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeafToo, children: [
      filteredNotes.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "No Notes", message: "There are no notes to show. Notes are attached to entities and cannot be created independently.", helpSubject: import_webapi_client2.DocsHelpSubject.ROOT }, void 0, false, {
        fileName: "app/routes/app/workspace/core/notes.tsx",
        lineNumber: 97,
        columnNumber: 40
      }, this),
      /* @__PURE__ */ jsxDEV(EntityStack, { children: filteredNotes.map((note) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `note-${note.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/core/notes/${note.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: note.name }, void 0, false, {
          fileName: "app/routes/app/workspace/core/notes.tsx",
          lineNumber: 102,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(NoteOwnerTypeChip, { owner: note.owner }, void 0, false, {
          fileName: "app/routes/app/workspace/core/notes.tsx",
          lineNumber: 103,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/core/notes.tsx",
        lineNumber: 101,
        columnNumber: 15
      }, this) }, `note-${note.ref_id}`, false, {
        fileName: "app/routes/app/workspace/core/notes.tsx",
        lineNumber: 100,
        columnNumber: 38
      }, this)) }, void 0, false, {
        fileName: "app/routes/app/workspace/core/notes.tsx",
        lineNumber: 99,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/core/notes.tsx",
      lineNumber: 96,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/core/notes.tsx",
      lineNumber: 110,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/core/notes.tsx",
      lineNumber: 109,
      columnNumber: 7
    }, this)
  ] }, "core/notes", true, {
    fileName: "app/routes/app/workspace/core/notes.tsx",
    lineNumber: 95,
    columnNumber: 10
  }, this);
}
_s(Notes, "Kl8mfvhCOF6IMJPTWdyos2drqGE=", false, function() {
  return [useLoaderDataSafeForAnimation, useTrunkNeedsToShowLeaf];
});
_c = Notes;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the notes! Please try again!`
});
var _c;
$RefreshReg$(_c, "Notes");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Notes as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/core/notes-GEVESFUX.js.map
