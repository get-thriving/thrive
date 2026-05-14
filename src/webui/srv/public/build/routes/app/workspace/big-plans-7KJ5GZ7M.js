import {
  BigPlanTimelineBigScreen,
  BigPlanTimelineSmallScreen
} from "/build/_shared/chunk-LWTJ5F7Z.js";
import {
  BigPlanStack
} from "/build/_shared/chunk-32S7BKKT.js";
import {
  bigPlanFindEntryToParent,
  sortBigPlansNaturally
} from "/build/_shared/chunk-K2HUSH5I.js";
import {
  computeAspectHierarchicalNameFromRoot,
  sortAspectsByTreeOrder
} from "/build/_shared/chunk-37FGSNWH.js";
import "/build/_shared/chunk-R6BBIENF.js";
import "/build/_shared/chunk-TD4OCNC5.js";
import "/build/_shared/chunk-SLZ5UQVD.js";
import "/build/_shared/chunk-KB3ZBF4C.js";
import {
  EntityNoNothingCard
} from "/build/_shared/chunk-35FY5RIR.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import "/build/_shared/chunk-U5MVWZEK.js";
import "/build/_shared/chunk-HGSZOXV4.js";
import "/build/_shared/chunk-W6KI7GPI.js";
import "/build/_shared/chunk-P7WFXMQY.js";
import "/build/_shared/chunk-DNXYZ7BB.js";
import "/build/_shared/chunk-NVWDLS2H.js";
import "/build/_shared/chunk-NBD44M5V.js";
import "/build/_shared/chunk-NLPUBZ3T.js";
import {
  basicShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  FilterFewOptionsCompact,
  FilterManyOptions,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import "/build/_shared/chunk-Z3RPM676.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import "/build/_shared/chunk-3BC3B3FK.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import "/build/_shared/chunk-72ELS2LF.js";
import "/build/_shared/chunk-MY6WUQK6.js";
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
  isWorkspaceFeatureAvailable
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  ViewList_default,
  ViewTimeline_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-QJ3XFSPL.js";
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

// app/routes/app/workspace/big-plans.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/big-plans.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/big-plans.tsx"
  );
  import.meta.hot.lastModified = "1777213342573.854";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var View = /* @__PURE__ */ function(View2) {
  View2["TIMELINE_BY_ASPECT_AND_GOAL"] = "timeline-by-aspect-and-goal";
  View2["TIMELINE_BY_ASPECT"] = "timeline-by-aspect";
  View2["TIMELINE"] = "timeline";
  View2["LIST_BY_ASPECT_AND_GOAL"] = "list-by-aspect-and-goal";
  View2["LIST_BY_ASPECT"] = "list-by-aspect";
  View2["LIST"] = "list";
  return View2;
}(View || {});
var shouldRevalidate = basicShouldRevalidate;
function BigPlans() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const isBigScreen = useBigScreen();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const [selectedTagsRefId, setSelectedTagsRefId] = (0, import_react2.useState)([]);
  const [selectedContactsRefId, setSelectedContactsRefId] = (0, import_react2.useState)([]);
  const entriesByRefId = /* @__PURE__ */ new Map();
  for (const entry of loaderData.bigPlans) {
    entriesByRefId.set(entry.big_plan.ref_id, bigPlanFindEntryToParent(entry));
  }
  const sortedBigPlans = sortBigPlansNaturally(loaderData.bigPlans.map((b) => b.big_plan)).filter((bp) => {
    const entry = entriesByRefId.get(bp.ref_id);
    const tagsOk = selectedTagsRefId.length === 0 || entry?.tags?.some((tag) => selectedTagsRefId.includes(tag.ref_id));
    const contactsOk = selectedContactsRefId.length === 0 || entry?.contacts?.some((contact) => selectedContactsRefId.includes(contact.ref_id));
    return tagsOk && contactsOk;
  });
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const initialView = isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) ? View.TIMELINE_BY_ASPECT : View.TIMELINE;
  const [selectedView, setSelectedView] = (0, import_react2.useState)(initialView);
  const thisYear = DateTime.local({
    zone: topLevelInfo.user.timezone
  }).startOf("year");
  const sortedAspects = sortAspectsByTreeOrder(loaderData.allAspects || []);
  const allAspectsByRefId = new Map(loaderData.allAspects?.map((p) => [p.ref_id, p]));
  const bigPlanMilestonesByRefId = new Map(loaderData.bigPlans.map((b) => [b.big_plan.ref_id, b.milestones]));
  const bigPlanStatsByRefId = new Map(loaderData.bigPlans.map((b) => [b.big_plan.ref_id, b.stats]));
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: "/app/workspace/big-plans/new", returnLocation: "/app/workspace", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "big-plans-actions", topLevelInfo, inputsEnabled: true, actions: [FilterFewOptionsCompact("View", selectedView, [{
    value: View.TIMELINE_BY_ASPECT_AND_GOAL,
    text: "Timeline by Aspect & Goal",
    icon: /* @__PURE__ */ jsxDEV(ViewTimeline_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/big-plans.tsx",
      lineNumber: 121,
      columnNumber: 11
    }, this),
    gatedOn: import_webapi_client.WorkspaceFeature.LIFE_PLAN
  }, {
    value: View.TIMELINE_BY_ASPECT,
    text: "Timeline by Aspect",
    icon: /* @__PURE__ */ jsxDEV(ViewTimeline_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/big-plans.tsx",
      lineNumber: 126,
      columnNumber: 11
    }, this),
    gatedOn: import_webapi_client.WorkspaceFeature.LIFE_PLAN
  }, {
    value: View.TIMELINE,
    text: "Timeline",
    icon: /* @__PURE__ */ jsxDEV(ViewTimeline_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/big-plans.tsx",
      lineNumber: 131,
      columnNumber: 11
    }, this)
  }, {
    value: View.LIST_BY_ASPECT_AND_GOAL,
    text: "List by Aspect & Goal",
    icon: /* @__PURE__ */ jsxDEV(ViewList_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/big-plans.tsx",
      lineNumber: 135,
      columnNumber: 11
    }, this),
    gatedOn: import_webapi_client.WorkspaceFeature.LIFE_PLAN
  }, {
    value: View.LIST_BY_ASPECT,
    text: "List by Aspect",
    icon: /* @__PURE__ */ jsxDEV(ViewList_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/big-plans.tsx",
      lineNumber: 140,
      columnNumber: 11
    }, this),
    gatedOn: import_webapi_client.WorkspaceFeature.LIFE_PLAN
  }, {
    value: View.LIST,
    text: "List",
    icon: /* @__PURE__ */ jsxDEV(ViewList_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/big-plans.tsx",
      lineNumber: 145,
      columnNumber: 11
    }, this)
  }], (selected) => setSelectedView(selected)), FilterManyOptions("Tags", loaderData.allTags.map((tag) => ({
    value: tag.ref_id,
    text: tag.name
  })), setSelectedTagsRefId), FilterManyOptions("Contacts", loaderData.allContacts.map((contact) => ({
    value: contact.ref_id,
    text: contact.name
  })), setSelectedContactsRefId)] }, void 0, false, {
    fileName: "app/routes/app/workspace/big-plans.tsx",
    lineNumber: 118,
    columnNumber: 127
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf || shouldShowALeaflet, children: [
      sortedBigPlans.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no big plans to show. You can create a new big plan.", newEntityLocations: "/app/workspace/big-plans/new", helpSubject: import_webapi_client.DocsHelpSubject.BIG_PLANS }, void 0, false, {
        fileName: "app/routes/app/workspace/big-plans.tsx",
        lineNumber: 154,
        columnNumber: 41
      }, this),
      sortedBigPlans.length > 0 && isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && selectedView === View.TIMELINE_BY_ASPECT_AND_GOAL && /* @__PURE__ */ jsxDEV(Fragment, { children: sortedAspects.map((p) => {
        const aspectBigPlans = sortedBigPlans.filter((se) => entriesByRefId.get(se.ref_id)?.aspect?.ref_id === p.ref_id);
        if (aspectBigPlans.length === 0) {
          return null;
        }
        const fullAspectName = computeAspectHierarchicalNameFromRoot(p, allAspectsByRefId);
        const goalsByRefId = /* @__PURE__ */ new Map();
        for (const bp of aspectBigPlans) {
          const goal = entriesByRefId.get(bp.ref_id)?.goal;
          if (goal) {
            goalsByRefId.set(goal.ref_id, goal);
          }
        }
        const sortedGoals = Array.from(goalsByRefId.values()).sort((a, b) => a.name.localeCompare(b.name));
        const noGoalPlans = aspectBigPlans.filter((bp) => !entriesByRefId.get(bp.ref_id)?.goal);
        return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
          /* @__PURE__ */ jsxDEV(StandardDivider, { title: fullAspectName, size: "large" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans.tsx",
            lineNumber: 173,
            columnNumber: 21
          }, this),
          sortedGoals.map((goal) => {
            const goalBigPlans = aspectBigPlans.filter((bp) => entriesByRefId.get(bp.ref_id)?.goal?.ref_id === goal.ref_id);
            return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
              /* @__PURE__ */ jsxDEV(StandardDivider, { title: goal.name, size: "medium" }, void 0, false, {
                fileName: "app/routes/app/workspace/big-plans.tsx",
                lineNumber: 177,
                columnNumber: 27
              }, this),
              isBigScreen && /* @__PURE__ */ jsxDEV(BigPlanTimelineBigScreen, { today: topLevelInfo.today, thisYear, bigPlans: goalBigPlans, bigPlanMilestonesByRefId, bigPlanStatsByRefId, dateMarkers: [{
                date: topLevelInfo.today,
                color: "red",
                label: "Today"
              }] }, void 0, false, {
                fileName: "app/routes/app/workspace/big-plans.tsx",
                lineNumber: 178,
                columnNumber: 43
              }, this),
              !isBigScreen && /* @__PURE__ */ jsxDEV(BigPlanTimelineSmallScreen, { today: topLevelInfo.today, thisYear, bigPlans: goalBigPlans, bigPlanMilestonesByRefId, bigPlanStatsByRefId, dateMarkers: [{
                date: topLevelInfo.today,
                color: "red",
                label: "Today"
              }] }, void 0, false, {
                fileName: "app/routes/app/workspace/big-plans.tsx",
                lineNumber: 183,
                columnNumber: 44
              }, this)
            ] }, goal.ref_id, true, {
              fileName: "app/routes/app/workspace/big-plans.tsx",
              lineNumber: 176,
              columnNumber: 22
            }, this);
          }),
          noGoalPlans.length > 0 && /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
            /* @__PURE__ */ jsxDEV(StandardDivider, { title: "No Goal", size: "medium" }, void 0, false, {
              fileName: "app/routes/app/workspace/big-plans.tsx",
              lineNumber: 191,
              columnNumber: 25
            }, this),
            isBigScreen && /* @__PURE__ */ jsxDEV(BigPlanTimelineBigScreen, { today: topLevelInfo.today, thisYear, bigPlans: noGoalPlans, bigPlanMilestonesByRefId, bigPlanStatsByRefId, dateMarkers: [{
              date: topLevelInfo.today,
              color: "red",
              label: "Today"
            }] }, void 0, false, {
              fileName: "app/routes/app/workspace/big-plans.tsx",
              lineNumber: 192,
              columnNumber: 41
            }, this),
            !isBigScreen && /* @__PURE__ */ jsxDEV(BigPlanTimelineSmallScreen, { today: topLevelInfo.today, thisYear, bigPlans: noGoalPlans, bigPlanMilestonesByRefId, bigPlanStatsByRefId, dateMarkers: [{
              date: topLevelInfo.today,
              color: "red",
              label: "Today"
            }] }, void 0, false, {
              fileName: "app/routes/app/workspace/big-plans.tsx",
              lineNumber: 197,
              columnNumber: 42
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/big-plans.tsx",
            lineNumber: 190,
            columnNumber: 48
          }, this)
        ] }, p.ref_id, true, {
          fileName: "app/routes/app/workspace/big-plans.tsx",
          lineNumber: 172,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/routes/app/workspace/big-plans.tsx",
        lineNumber: 156,
        columnNumber: 175
      }, this),
      sortedBigPlans.length > 0 && isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && selectedView === View.TIMELINE_BY_ASPECT && /* @__PURE__ */ jsxDEV(Fragment, { children: sortedAspects.map((p) => {
        const theBigPlans = sortedBigPlans.filter((se) => entriesByRefId.get(se.ref_id)?.aspect?.ref_id === p.ref_id);
        if (theBigPlans.length === 0) {
          return null;
        }
        const fullAspectName = computeAspectHierarchicalNameFromRoot(p, allAspectsByRefId);
        return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
          /* @__PURE__ */ jsxDEV(StandardDivider, { title: fullAspectName, size: "large" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans.tsx",
            lineNumber: 215,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(Fragment, { children: [
            isBigScreen && /* @__PURE__ */ jsxDEV(BigPlanTimelineBigScreen, { today: topLevelInfo.today, thisYear, bigPlans: theBigPlans, bigPlanMilestonesByRefId, bigPlanStatsByRefId, dateMarkers: [{
              date: topLevelInfo.today,
              color: "red",
              label: "Today"
            }] }, void 0, false, {
              fileName: "app/routes/app/workspace/big-plans.tsx",
              lineNumber: 217,
              columnNumber: 39
            }, this),
            !isBigScreen && /* @__PURE__ */ jsxDEV(BigPlanTimelineSmallScreen, { today: topLevelInfo.today, thisYear, bigPlans: theBigPlans, bigPlanMilestonesByRefId, bigPlanStatsByRefId, dateMarkers: [{
              date: topLevelInfo.today,
              color: "red",
              label: "Today"
            }] }, void 0, false, {
              fileName: "app/routes/app/workspace/big-plans.tsx",
              lineNumber: 222,
              columnNumber: 40
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/big-plans.tsx",
            lineNumber: 216,
            columnNumber: 21
          }, this)
        ] }, p.ref_id, true, {
          fileName: "app/routes/app/workspace/big-plans.tsx",
          lineNumber: 214,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/routes/app/workspace/big-plans.tsx",
        lineNumber: 207,
        columnNumber: 166
      }, this),
      sortedBigPlans.length > 0 && selectedView === View.TIMELINE && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        isBigScreen && /* @__PURE__ */ jsxDEV(BigPlanTimelineBigScreen, { today: topLevelInfo.today, thisYear, bigPlans: sortedBigPlans, bigPlanMilestonesByRefId, bigPlanStatsByRefId, dateMarkers: [{
          date: topLevelInfo.today,
          color: "red",
          label: "Today"
        }] }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans.tsx",
          lineNumber: 233,
          columnNumber: 29
        }, this),
        !isBigScreen && /* @__PURE__ */ jsxDEV(BigPlanTimelineSmallScreen, { today: topLevelInfo.today, thisYear, bigPlans: sortedBigPlans, bigPlanMilestonesByRefId, bigPlanStatsByRefId, dateMarkers: [{
          date: topLevelInfo.today,
          color: "red",
          label: "Today"
        }] }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans.tsx",
          lineNumber: 238,
          columnNumber: 30
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/big-plans.tsx",
        lineNumber: 232,
        columnNumber: 73
      }, this),
      sortedBigPlans.length > 0 && isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && selectedView === View.LIST_BY_ASPECT_AND_GOAL && /* @__PURE__ */ jsxDEV(Fragment, { children: sortedAspects.map((p) => {
        const aspectBigPlans = sortedBigPlans.filter((se) => entriesByRefId.get(se.ref_id)?.aspect?.ref_id === p.ref_id);
        if (aspectBigPlans.length === 0) {
          return null;
        }
        const fullAspectName = computeAspectHierarchicalNameFromRoot(p, allAspectsByRefId);
        const goalsByRefId = /* @__PURE__ */ new Map();
        for (const bp of aspectBigPlans) {
          const goal = entriesByRefId.get(bp.ref_id)?.goal;
          if (goal) {
            goalsByRefId.set(goal.ref_id, goal);
          }
        }
        const sortedGoals = Array.from(goalsByRefId.values()).sort((a, b) => a.name.localeCompare(b.name));
        const noGoalPlans = aspectBigPlans.filter((bp) => !entriesByRefId.get(bp.ref_id)?.goal);
        return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
          /* @__PURE__ */ jsxDEV(StandardDivider, { title: fullAspectName, size: "large" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans.tsx",
            lineNumber: 262,
            columnNumber: 21
          }, this),
          sortedGoals.map((goal) => {
            const goalBigPlans = aspectBigPlans.filter((bp) => entriesByRefId.get(bp.ref_id)?.goal?.ref_id === goal.ref_id);
            return /* @__PURE__ */ jsxDEV(BigPlanStack, { topLevelInfo, label: goal.name, bigPlans: goalBigPlans, bigPlanMilestonesByRefId, bigPlanStatsByRefId, entriesByRefId, showOptions: {
              showDonePct: true,
              showMilestonesLeft: true,
              showLifePlan: true,
              showEisen: true,
              showDifficulty: true,
              showActionableDate: true,
              showDueDate: true,
              showHandleMarkDone: false,
              showHandleMarkNotDone: false
            } }, goal.ref_id, false, {
              fileName: "app/routes/app/workspace/big-plans.tsx",
              lineNumber: 265,
              columnNumber: 22
            }, this);
          }),
          noGoalPlans.length > 0 && /* @__PURE__ */ jsxDEV(BigPlanStack, { topLevelInfo, label: "No Goal", bigPlans: noGoalPlans, bigPlanMilestonesByRefId, bigPlanStatsByRefId, entriesByRefId, showOptions: {
            showDonePct: true,
            showMilestonesLeft: true,
            showLifePlan: true,
            showEisen: true,
            showDifficulty: true,
            showActionableDate: true,
            showDueDate: true,
            showHandleMarkDone: false,
            showHandleMarkNotDone: false
          } }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans.tsx",
            lineNumber: 277,
            columnNumber: 48
          }, this)
        ] }, p.ref_id, true, {
          fileName: "app/routes/app/workspace/big-plans.tsx",
          lineNumber: 261,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/routes/app/workspace/big-plans.tsx",
        lineNumber: 245,
        columnNumber: 171
      }, this),
      sortedBigPlans.length > 0 && isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && selectedView === View.LIST_BY_ASPECT && /* @__PURE__ */ jsxDEV(Fragment, { children: sortedAspects.map((p) => {
        const theBigPlans = sortedBigPlans.filter((se) => entriesByRefId.get(se.ref_id)?.aspect?.ref_id === p.ref_id);
        if (theBigPlans.length === 0) {
          return null;
        }
        const fullAspectName = computeAspectHierarchicalNameFromRoot(p, allAspectsByRefId);
        return /* @__PURE__ */ jsxDEV(BigPlanStack, { topLevelInfo, label: fullAspectName, bigPlans: theBigPlans, bigPlanMilestonesByRefId, bigPlanStatsByRefId, entriesByRefId, showOptions: {
          showDonePct: true,
          showMilestonesLeft: true,
          showLifePlan: true,
          showEisen: true,
          showDifficulty: true,
          showActionableDate: true,
          showDueDate: true,
          showHandleMarkDone: false,
          showHandleMarkNotDone: false
        } }, p.ref_id, false, {
          fileName: "app/routes/app/workspace/big-plans.tsx",
          lineNumber: 299,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/routes/app/workspace/big-plans.tsx",
        lineNumber: 292,
        columnNumber: 162
      }, this),
      sortedBigPlans.length > 0 && selectedView === View.LIST && /* @__PURE__ */ jsxDEV(BigPlanStack, { topLevelInfo, bigPlans: sortedBigPlans, bigPlanMilestonesByRefId, bigPlanStatsByRefId, entriesByRefId, showOptions: {
        showDonePct: true,
        showMilestonesLeft: true,
        showLifePlan: true,
        showEisen: true,
        showDifficulty: true,
        showActionableDate: true,
        showDueDate: true,
        showHandleMarkDone: false,
        showHandleMarkNotDone: false
      } }, void 0, false, {
        fileName: "app/routes/app/workspace/big-plans.tsx",
        lineNumber: 313,
        columnNumber: 69
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/big-plans.tsx",
      lineNumber: 153,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/big-plans.tsx",
      lineNumber: 327,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/big-plans.tsx",
      lineNumber: 326,
      columnNumber: 7
    }, this)
  ] }, "big-plans", true, {
    fileName: "app/routes/app/workspace/big-plans.tsx",
    lineNumber: 118,
    columnNumber: 10
  }, this);
}
_s(BigPlans, "yqJTr/iN0+ujr+dZmQiYk/mvkiU=", false, function() {
  return [useLoaderDataSafeForAnimation, useBigScreen, useTrunkNeedsToShowLeaf, useLeafNeedsToShowLeaflet];
});
_c = BigPlans;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the big plans! Please try again!`
});
var _c;
$RefreshReg$(_c, "BigPlans");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  BigPlans as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/big-plans-7KJ5GZ7M.js.map
