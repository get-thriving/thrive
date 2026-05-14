import {
  UpcomingBirthdaysWidget,
  WidgetContainer
} from "/build/_shared/chunk-RVW46DIE.js";
import "/build/_shared/chunk-W2LTCAXB.js";
import {
  PeriodTag
} from "/build/_shared/chunk-HLPWZ3ZO.js";
import "/build/_shared/chunk-HVU6TG3B.js";
import {
  TagTag
} from "/build/_shared/chunk-KB3ZBF4C.js";
import "/build/_shared/chunk-4ZSHFYIG.js";
import {
  EntityNoNothingCard
} from "/build/_shared/chunk-35FY5RIR.js";
import {
  InboxTasksNoTasksCard
} from "/build/_shared/chunk-Y2XMZIJC.js";
import {
  TabPanel
} from "/build/_shared/chunk-VEYCIPLX.js";
import "/build/_shared/chunk-GKFPZ6TR.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import {
  InboxTaskStack
} from "/build/_shared/chunk-IFDICYHD.js";
import "/build/_shared/chunk-YVDLHOTH.js";
import "/build/_shared/chunk-ZNIVMWFF.js";
import "/build/_shared/chunk-BOZSZ6DZ.js";
import "/build/_shared/chunk-Q4OQDEZG.js";
import {
  DifficultyTag,
  EisenTag
} from "/build/_shared/chunk-U5MVWZEK.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  filterInboxTasksForDisplay,
  inboxTaskFindEntryToParent,
  sortInboxTasksByEisenAndDifficulty,
  sortInboxTasksNaturally
} from "/build/_shared/chunk-RTB3GZDR.js";
import "/build/_shared/chunk-DNXYZ7BB.js";
import "/build/_shared/chunk-5CBAK2HS.js";
import "/build/_shared/chunk-NVWDLS2H.js";
import "/build/_shared/chunk-4TWETDNJ.js";
import "/build/_shared/chunk-NBD44M5V.js";
import "/build/_shared/chunk-NLPUBZ3T.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  FilterManyOptions,
  NavMultipleSpread,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import "/build/_shared/chunk-Z3RPM676.js";
import "/build/_shared/chunk-PE4INIRM.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  DateTime,
  makeTrunkErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence,
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
import {
  PERSON_CATCH_UP
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  GroupWork_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import {
  Box_default,
  Tab_default,
  Tabs_default
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
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Outlet,
  useFetcher
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

// app/routes/app/workspace/prm/persons.tsx
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_webapi_client2 = __toESM(require_dist());

// ../core/jupiter/core/prm/sub/circle/components/tag.tsx
function CircleTag(props) {
  return /* @__PURE__ */ jsxDEV(SlimChip, { label: `\u2B55 ${props.circle.name}`, variant: "filled", color: "info" }, void 0, false, {
    fileName: "../core/jupiter/core/prm/sub/circle/components/tag.tsx",
    lineNumber: 11,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/prm/sub/person/component/upcoming-catch-ups-widget.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function UpcomingCatchUpsWidget(props) {
  const personTasks = props.personTasks;
  const today = aDateToDate(props.topLevelInfo.today).endOf("day");
  const oneMonthFromNow = today.plus({ months: 1 }).endOf("day");
  const sortedInboxTasks = sortInboxTasksByEisenAndDifficulty(
    personTasks.personInboxTasks
  );
  const upcomingCatchUps = filterInboxTasksForDisplay(
    sortedInboxTasks,
    personTasks.personEntriesByRefId,
    personTasks.optimisticUpdates,
    {
      allowSources: [PERSON_CATCH_UP],
      allowStatuses: [
        import_webapi_client.InboxTaskStatus.NOT_STARTED,
        import_webapi_client.InboxTaskStatus.IN_PROGRESS,
        import_webapi_client.InboxTaskStatus.BLOCKED
      ],
      includeIfNoActionableDate: true,
      dueDateEnd: oneMonthFromNow
    }
  );
  if (upcomingCatchUps.length === 0) {
    return /* @__PURE__ */ jsxDEV(
      InboxTasksNoTasksCard,
      {
        parent: "person",
        parentLabel: "New Person",
        parentNewLocations: "/app/workspace/prm/persons/new"
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/prm/sub/person/component/upcoming-catch-ups-widget.tsx",
        lineNumber: 40,
        columnNumber: 7
      },
      this
    );
  }
  return /* @__PURE__ */ jsxDEV(
    InboxTaskStack,
    {
      topLevelInfo: props.topLevelInfo,
      showOptions: {
        showStatus: true,
        showDueDate: true,
        showHandleMarkDone: true,
        showHandleMarkNotDone: true
      },
      label: "Upcoming Catch Ups",
      inboxTasks: upcomingCatchUps,
      optimisticUpdates: personTasks.optimisticUpdates,
      moreInfoByRefId: personTasks.personEntriesByRefId,
      onCardMarkDone: personTasks.onCardMarkDone,
      onCardMarkNotDone: personTasks.onCardMarkNotDone
    },
    "upcoming-catch-ups",
    false,
    {
      fileName: "../core/jupiter/core/prm/sub/person/component/upcoming-catch-ups-widget.tsx",
      lineNumber: 49,
      columnNumber: 5
    },
    this
  );
}

// app/routes/app/workspace/prm/persons.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/prm/persons.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/prm/persons.tsx"
  );
  import.meta.hot.lastModified = "1777213342596.0422";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function Persons() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const entries = loaderData.entries;
  const [selectedCirclesRefId, setSelectedCirclesRefId] = (0, import_react2.useState)([]);
  const [selectedTagsRefId, setSelectedTagsRefId] = (0, import_react2.useState)([]);
  const [optimisticUpdates, setOptimisticUpdates] = (0, import_react2.useState)({});
  const circlesByRefId = new Map(loaderData.allCircles.map((c) => [c.ref_id, c]));
  const filteredEntries = entries.filter((entry) => {
    if (selectedCirclesRefId.length === 0) {
    } else if (!entry.circle_ref_ids.some((cid) => selectedCirclesRefId.includes(cid))) {
      return false;
    }
    if (selectedTagsRefId.length === 0) {
      return true;
    }
    return entry.tags?.some((tag) => selectedTagsRefId.includes(tag.ref_id));
  });
  const sortedPersonInboxTasks = loaderData.personInboxTasks ? sortInboxTasksNaturally(loaderData.personInboxTasks.map((e) => e.inbox_task)) : void 0;
  const personEntriesByRefId = {};
  if (loaderData.personInboxTasks) {
    for (const entry of loaderData.personInboxTasks) {
      personEntriesByRefId[entry.inbox_task.ref_id] = inboxTaskFindEntryToParent(entry);
    }
  }
  const cardActionFetcher = useFetcher();
  function handleCardMarkDone(it) {
    setOptimisticUpdates((prev) => ({
      ...prev,
      [it.ref_id]: {
        status: import_webapi_client2.InboxTaskStatus.DONE,
        eisen: prev[it.ref_id]?.eisen ?? it.eisen
      }
    }));
    setTimeout(() => {
      cardActionFetcher.submit({
        id: it.ref_id,
        status: import_webapi_client2.InboxTaskStatus.DONE
      }, {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen"
      });
    }, 0);
  }
  function handleCardMarkNotDone(it) {
    setOptimisticUpdates((prev) => ({
      ...prev,
      [it.ref_id]: {
        status: import_webapi_client2.InboxTaskStatus.NOT_DONE,
        eisen: prev[it.ref_id]?.eisen ?? it.eisen
      }
    }));
    setTimeout(() => {
      cardActionFetcher.submit({
        id: it.ref_id,
        status: import_webapi_client2.InboxTaskStatus.NOT_DONE
      }, {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen"
      });
    }, 0);
  }
  const rightNow = DateTime.local({
    zone: topLevelInfo.user.timezone
  });
  const personTasks = sortedPersonInboxTasks !== void 0 ? {
    personInboxTasks: sortedPersonInboxTasks,
    personEntriesByRefId,
    optimisticUpdates,
    onCardMarkDone: handleCardMarkDone,
    onCardMarkNotDone: handleCardMarkNotDone
  } : void 0;
  const showSidebar = isBigScreen && personTasks !== void 0;
  const [smallScreenTab, setSmallScreenTab] = (0, import_react2.useState)(0);
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: "/app/workspace/prm/persons/new", returnLocation: "/app/workspace", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "persons-actions", topLevelInfo, inputsEnabled: true, actions: [NavMultipleSpread({
    navs: [NavSingle({
      text: "Circles",
      link: `/app/workspace/prm/circles`,
      icon: /* @__PURE__ */ jsxDEV(GroupWork_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons.tsx",
        lineNumber: 174,
        columnNumber: 13
      }, this)
    })]
  }), FilterManyOptions("Circles", loaderData.allCircles.map((c) => ({
    value: c.ref_id,
    text: String(c.name)
  })), setSelectedCirclesRefId), FilterManyOptions("Tags", loaderData.allTags.map((tag) => ({
    value: tag.ref_id,
    text: tag.name
  })), setSelectedTagsRefId)] }, void 0, false, {
    fileName: "app/routes/app/workspace/prm/persons.tsx",
    lineNumber: 170,
    columnNumber: 127
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf || shouldShowALeaflet, children: [
      isBigScreen && /* @__PURE__ */ jsxDEV(Box_default, { sx: {
        display: "flex",
        alignItems: "flex-start",
        gap: 2
      }, children: [
        /* @__PURE__ */ jsxDEV(Box_default, { sx: {
          flex: 1,
          minWidth: 0
        }, children: [
          filteredEntries.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no persons to show with the current filters. You can create a new person.", newEntityLocations: "/app/workspace/prm/persons/new", helpSubject: import_webapi_client2.DocsHelpSubject.PRM }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons.tsx",
            lineNumber: 194,
            columnNumber: 48
          }, this),
          /* @__PURE__ */ jsxDEV(EntityStack, { children: filteredEntries.map((entry) => /* @__PURE__ */ jsxDEV(PersonCard, { entry, circlesByRefId }, entry.person.ref_id, false, {
            fileName: "app/routes/app/workspace/prm/persons.tsx",
            lineNumber: 196,
            columnNumber: 47
          }, this)) }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons.tsx",
            lineNumber: 195,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/prm/persons.tsx",
          lineNumber: 190,
          columnNumber: 13
        }, this),
        showSidebar && /* @__PURE__ */ jsxDEV(Box_default, { sx: {
          width: "320px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2
        }, children: [
          /* @__PURE__ */ jsxDEV(WidgetContainer, { geometry: {
            row: 0,
            col: 0,
            dimension: import_webapi_client2.WidgetDimension.DIM_KX1
          }, children: /* @__PURE__ */ jsxDEV(UpcomingBirthdaysWidget, { rightNow, timezone: topLevelInfo.user.timezone, topLevelInfo, personTasks, geometry: {
            row: 0,
            col: 0,
            dimension: import_webapi_client2.WidgetDimension.DIM_KX1
          } }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons.tsx",
            lineNumber: 212,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons.tsx",
            lineNumber: 207,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(WidgetContainer, { geometry: {
            row: 0,
            col: 0,
            dimension: import_webapi_client2.WidgetDimension.DIM_KX1
          }, children: /* @__PURE__ */ jsxDEV(UpcomingCatchUpsWidget, { rightNow, timezone: topLevelInfo.user.timezone, topLevelInfo, personTasks, geometry: {
            row: 0,
            col: 0,
            dimension: import_webapi_client2.WidgetDimension.DIM_KX1
          } }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons.tsx",
            lineNumber: 224,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons.tsx",
            lineNumber: 219,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/prm/persons.tsx",
          lineNumber: 200,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/prm/persons.tsx",
        lineNumber: 185,
        columnNumber: 25
      }, this),
      !isBigScreen && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV(Tabs_default, { value: smallScreenTab, variant: "fullWidth", onChange: (_, newValue) => setSmallScreenTab(newValue), children: [
          /* @__PURE__ */ jsxDEV(Tab_default, { label: "People" }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons.tsx",
            lineNumber: 236,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(Tab_default, { label: "Tasks" }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons.tsx",
            lineNumber: 237,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/prm/persons.tsx",
          lineNumber: 235,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(TabPanel, { value: smallScreenTab, index: 0, children: [
          filteredEntries.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no persons to show with the current filters. You can create a new person.", newEntityLocations: "/app/workspace/prm/persons/new", helpSubject: import_webapi_client2.DocsHelpSubject.PRM }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons.tsx",
            lineNumber: 241,
            columnNumber: 48
          }, this),
          /* @__PURE__ */ jsxDEV(EntityStack, { children: filteredEntries.map((entry) => /* @__PURE__ */ jsxDEV(PersonCard, { entry, circlesByRefId }, entry.person.ref_id, false, {
            fileName: "app/routes/app/workspace/prm/persons.tsx",
            lineNumber: 243,
            columnNumber: 47
          }, this)) }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons.tsx",
            lineNumber: 242,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/prm/persons.tsx",
          lineNumber: 240,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(TabPanel, { value: smallScreenTab, index: 1, children: personTasks ? /* @__PURE__ */ jsxDEV(Box_default, { sx: {
          display: "flex",
          flexDirection: "column",
          gap: 2
        }, children: [
          /* @__PURE__ */ jsxDEV(UpcomingBirthdaysWidget, { rightNow, timezone: topLevelInfo.user.timezone, topLevelInfo, personTasks, geometry: {
            row: 0,
            col: 0,
            dimension: import_webapi_client2.WidgetDimension.DIM_KX1
          } }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons.tsx",
            lineNumber: 253,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(UpcomingCatchUpsWidget, { rightNow, timezone: topLevelInfo.user.timezone, topLevelInfo, personTasks, geometry: {
            row: 0,
            col: 0,
            dimension: import_webapi_client2.WidgetDimension.DIM_KX1
          } }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons.tsx",
            lineNumber: 258,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/prm/persons.tsx",
          lineNumber: 248,
          columnNumber: 30
        }, this) : /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no upcoming tasks.", newEntityLocations: "/app/workspace/prm/persons/new", helpSubject: import_webapi_client2.DocsHelpSubject.PRM }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons.tsx",
          lineNumber: 263,
          columnNumber: 26
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons.tsx",
          lineNumber: 247,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/prm/persons.tsx",
        lineNumber: 234,
        columnNumber: 26
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/prm/persons.tsx",
      lineNumber: 183,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/prm/persons.tsx",
      lineNumber: 268,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/prm/persons.tsx",
      lineNumber: 267,
      columnNumber: 7
    }, this)
  ] }, "persons", true, {
    fileName: "app/routes/app/workspace/prm/persons.tsx",
    lineNumber: 170,
    columnNumber: 10
  }, this);
}
_s(Persons, "3q3ww/nElmPhJuVi6T/NxQB4x0M=", false, function() {
  return [useLoaderDataSafeForAnimation, useBigScreen, useFetcher, useTrunkNeedsToShowLeaf, useLeafNeedsToShowLeaflet];
});
_c = Persons;
function PersonCard({
  entry,
  circlesByRefId
}) {
  return /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `person-${entry.person.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/prm/persons/${entry.person.ref_id}`, children: [
    /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: entry.contact.name }, void 0, false, {
      fileName: "app/routes/app/workspace/prm/persons.tsx",
      lineNumber: 282,
      columnNumber: 9
    }, this),
    entry.circle_ref_ids.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: entry.circle_ref_ids.map((circleRefId) => circlesByRefId.get(circleRefId)).filter((c) => Boolean(c)).map((circle) => /* @__PURE__ */ jsxDEV(CircleTag, { circle }, `circle-${circle.ref_id}`, false, {
      fileName: "app/routes/app/workspace/prm/persons.tsx",
      lineNumber: 284,
      columnNumber: 125
    }, this)) }, void 0, false, {
      fileName: "app/routes/app/workspace/prm/persons.tsx",
      lineNumber: 283,
      columnNumber: 45
    }, this),
    entry.person.catch_up_params && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(PeriodTag, { period: entry.person.catch_up_params.period }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons.tsx",
        lineNumber: 287,
        columnNumber: 13
      }, this),
      entry.person.catch_up_params.eisen && /* @__PURE__ */ jsxDEV(EisenTag, { eisen: entry.person.catch_up_params.eisen }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons.tsx",
        lineNumber: 288,
        columnNumber: 52
      }, this),
      entry.person.catch_up_params.difficulty && /* @__PURE__ */ jsxDEV(DifficultyTag, { difficulty: entry.person.catch_up_params.difficulty }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons.tsx",
        lineNumber: 289,
        columnNumber: 57
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/prm/persons.tsx",
      lineNumber: 286,
      columnNumber: 42
    }, this),
    entry.tags?.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
      fileName: "app/routes/app/workspace/prm/persons.tsx",
      lineNumber: 291,
      columnNumber: 33
    }, this))
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/prm/persons.tsx",
    lineNumber: 281,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/app/workspace/prm/persons.tsx",
    lineNumber: 280,
    columnNumber: 10
  }, this);
}
_c2 = PersonCard;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the PRM! Please try again!`
});
var _c;
var _c2;
$RefreshReg$(_c, "Persons");
$RefreshReg$(_c2, "PersonCard");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Persons as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/prm/persons-HWGOL3GO.js.map
