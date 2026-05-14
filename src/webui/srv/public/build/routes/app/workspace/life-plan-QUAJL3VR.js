import {
  VisionSnippet
} from "/build/_shared/chunk-5S362QH6.js";
import "/build/_shared/chunk-542UTXAG.js";
import {
  sortMilestonesNaturally
} from "/build/_shared/chunk-YDXQ3444.js";
import {
  sortGoalsNaturally
} from "/build/_shared/chunk-OLMKSGLM.js";
import {
  sortChaptersNaturally
} from "/build/_shared/chunk-ZFN6H2GY.js";
import {
  lifePlanBirthdayDate
} from "/build/_shared/chunk-HQECWRQJ.js";
import {
  isMilestonePartialDate,
  midDate
} from "/build/_shared/chunk-WCBSHJX3.js";
import {
  computeAspectDistanceFromRoot,
  isRootAspect,
  shiftAspectDownInListOfChildren,
  shiftAspectUpInListOfChildren,
  sortAspectsByTreeOrder
} from "/build/_shared/chunk-37FGSNWH.js";
import "/build/_shared/chunk-IRHCW4HP.js";
import {
  makeIntent
} from "/build/_shared/chunk-7SK2WYB3.js";
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
  NavMultipleCompact,
  NavMultipleSpread,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
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
import {
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  Add_default,
  ArrowDownward_default,
  ArrowUpward_default,
  History_default,
  Tune_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  Box_default,
  Button_default,
  Divider_default,
  IconButton_default,
  Stack_default,
  Tooltip_default,
  Typography_default,
  alpha,
  lighten,
  styled_default,
  useTheme
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_dist
} from "/build/_shared/chunk-ZZL6WUOE.js";
import {
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowBranch,
  useTrunkNeedsToShowLeaf
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Form,
  Link,
  Outlet,
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

// app/routes/app/workspace/life-plan.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/life-plan.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/life-plan.tsx"
  );
  import.meta.hot.lastModified = "1775685113156.7354";
}
var UpdateFormSchema = external_exports.object({
  intent: external_exports.string()
});
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function LifePlanView() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const theme = useTheme();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const today = aDateToDate(topLevelInfo.today);
  const navigation = useNavigation();
  const isBigScreen = useBigScreen();
  const actionData = useActionData();
  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const inputsEnabled = navigation.state === "idle";
  const [hoveredMilestoneRefId, setHoveredMilestoneRefId] = (0, import_react2.useState)(null);
  const sortedAspects = sortAspectsByTreeOrder(loaderData.aspects.map((entry) => entry.aspect));
  const allAspectsByRefId = new Map(loaderData.aspects.map((entry) => [entry.aspect.ref_id, entry.aspect]));
  const allChaptersByAspectRefId = /* @__PURE__ */ new Map();
  for (const entry of loaderData.chapters) {
    if (!allChaptersByAspectRefId.has(entry.chapter.aspect_ref_id)) {
      allChaptersByAspectRefId.set(entry.chapter.aspect_ref_id, []);
    }
    allChaptersByAspectRefId.get(entry.chapter.aspect_ref_id).push(entry.chapter);
  }
  const allGoalsByAspectRefId = /* @__PURE__ */ new Map();
  for (const entry of loaderData.goals) {
    if (!allGoalsByAspectRefId.has(entry.goal.aspect_ref_id)) {
      allGoalsByAspectRefId.set(entry.goal.aspect_ref_id, []);
    }
    allGoalsByAspectRefId.get(entry.goal.aspect_ref_id).push(entry.goal);
  }
  const sortedMilestones = sortMilestonesNaturally(loaderData.milestones.map((entry) => entry.milestone));
  const {
    totalRows,
    milestonePositions
  } = computeMilestonePositions(loaderData.lifePlan, sortedMilestones);
  const todayMiddle = computeTodayMiddle(loaderData.lifePlan, today);
  const yearMarkers = Array.from({
    length: 10
  }, (_, idx) => {
    return {
      year: loaderData.lifePlan.birth_year + idx * 10,
      left: idx * 10,
      age: idx * 10
    };
  });
  const maxIndent = Math.max(...sortedAspects.map((aspect) => computeAspectDistanceFromRoot(aspect, allAspectsByRefId)));
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { returnLocation: "/app/workspace", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "life-plan", topLevelInfo, inputsEnabled, actions: [NavMultipleSpread({
    navs: [NavSingle({
      text: "New Vision",
      link: `/app/workspace/life-plan/visions/new-draft`,
      icon: /* @__PURE__ */ jsxDEV(Add_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 191,
        columnNumber: 13
      }, this)
    }), NavSingle({
      text: "New Aspect",
      link: `/app/workspace/life-plan/aspects/new`,
      icon: /* @__PURE__ */ jsxDEV(Add_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 195,
        columnNumber: 13
      }, this)
    }), NavSingle({
      text: "New Chapter",
      link: `/app/workspace/life-plan/chapters/new`,
      icon: /* @__PURE__ */ jsxDEV(Add_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 199,
        columnNumber: 13
      }, this)
    }), NavSingle({
      text: "New Goal",
      link: `/app/workspace/life-plan/goals/new`,
      icon: /* @__PURE__ */ jsxDEV(Add_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 203,
        columnNumber: 13
      }, this)
    }), NavSingle({
      text: "New Milestone",
      link: `/app/workspace/life-plan/milestones/new`,
      icon: /* @__PURE__ */ jsxDEV(Add_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 207,
        columnNumber: 13
      }, this)
    })]
  }), NavMultipleCompact({
    navs: [NavSingle({
      text: "",
      link: `/app/workspace/life-plan/settings`,
      icon: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 213,
        columnNumber: 13
      }, this)
    }), NavSingle({
      text: "Vision History",
      link: `/app/workspace/life-plan/visions`,
      icon: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 217,
        columnNumber: 13
      }, this)
    }), NavSingle({
      text: "Aspects",
      link: `/app/workspace/life-plan/aspects`,
      icon: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 221,
        columnNumber: 13
      }, this)
    }), NavSingle({
      text: "Chapters",
      link: `/app/workspace/life-plan/chapters`,
      icon: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 225,
        columnNumber: 13
      }, this)
    }), NavSingle({
      text: "Goals",
      link: `/app/workspace/life-plan/goals`,
      icon: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 229,
        columnNumber: 13
      }, this)
    }), NavSingle({
      text: "Milestones",
      link: `/app/workspace/life-plan/milestones`,
      icon: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 233,
        columnNumber: 13
      }, this)
    }), NavSingle({
      text: "History of Work",
      link: `/app/workspace/life-plan/history-of-work`,
      icon: /* @__PURE__ */ jsxDEV(History_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 237,
        columnNumber: 13
      }, this)
    })]
  })] }, void 0, false, {
    fileName: "app/routes/app/workspace/life-plan.tsx",
    lineNumber: 187,
    columnNumber: 79
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf || shouldShowALeaflet, branchForceHide: shouldShowABranch, children: [
      /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 241,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(EntityStack, { children: /* @__PURE__ */ jsxDEV(Form, { method: "post", style: {
        position: "relative"
      }, children: [
        /* @__PURE__ */ jsxDEV(SectionLabeled, { label: "Vision", children: /* @__PURE__ */ jsxDEV(VisionSnippet, { vision: loaderData.activeVision ?? void 0, note: loaderData.activeVisionNote ?? void 0 }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan.tsx",
          lineNumber: 247,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan.tsx",
          lineNumber: 246,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(SectionLabeled, { label: "Life Months", children: /* @__PURE__ */ jsxDEV(LifeMonthsGrid, { birthday: lifePlanBirthdayDate(loaderData.lifePlan), today, isBigScreen }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan.tsx",
          lineNumber: 251,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan.tsx",
          lineNumber: 250,
          columnNumber: 13
        }, this),
        isBigScreen && /* @__PURE__ */ jsxDEV(SectionLabeled, { label: "Milestones", children: /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(Box_default, { sx: {
            border: (theme2) => `2px dotted ${theme2.palette.divider}`,
            borderRadius: "4px",
            position: "relative",
            paddingLeft: "0.5rem",
            height: `${0.25 + totalRows * 1.25 + 1}rem`,
            minHeight: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }, children: [
            sortedMilestones.length == 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body2", children: "You need to create some milestones" }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan.tsx",
                lineNumber: 268,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "contained", component: Link, to: "/app/workspace/life-plan/milestones/new", sx: {
                flexShrink: 0
              }, children: "Create New Milestone" }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan.tsx",
                lineNumber: 271,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/life-plan.tsx",
              lineNumber: 267,
              columnNumber: 54
            }, this),
            sortedMilestones.map((milestone) => {
              const isHighlighted = hoveredMilestoneRefId === milestone.ref_id;
              return /* @__PURE__ */ jsxDEV(Tooltip_default, { title: milestone.name, placement: "top", children: /* @__PURE__ */ jsxDEV(MilestoneTimelineLink, { to: `/app/workspace/life-plan/milestones/${milestone.ref_id}`, indent: maxIndent, left: milestonePositions.get(milestone.ref_id).left, width: milestonePositions.get(milestone.ref_id).width, top: milestonePositions.get(milestone.ref_id).top, highlighted: isHighlighted, onMouseEnter: () => setHoveredMilestoneRefId(milestone.ref_id), onMouseLeave: () => setHoveredMilestoneRefId(null), children: milestone.name }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan.tsx",
                lineNumber: 281,
                columnNumber: 27
              }, this) }, `milestone-${milestone.ref_id}`, false, {
                fileName: "app/routes/app/workspace/life-plan.tsx",
                lineNumber: 280,
                columnNumber: 26
              }, this);
            })
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/life-plan.tsx",
            lineNumber: 256,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: {
            marginLeft: `${maxIndent}rem`,
            position: "relative",
            height: "1.5rem"
          }, children: yearMarkers.map((yearMarker) => {
            return /* @__PURE__ */ jsxDEV(YearMarker, { left: yearMarker.left, top: 0.25, children: [
              yearMarker.year,
              yearMarker.age > 0 ? ` (${yearMarker.age}s)` : ""
            ] }, `year-marker-${yearMarker.year}`, true, {
              fileName: "app/routes/app/workspace/life-plan.tsx",
              lineNumber: 294,
              columnNumber: 26
            }, this);
          }) }, void 0, false, {
            fileName: "app/routes/app/workspace/life-plan.tsx",
            lineNumber: 288,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: {
            position: "absolute",
            marginLeft: `${maxIndent}rem`,
            width: `calc(100% - ${maxIndent}rem)`,
            height: "-webkit-fill-available"
          }, children: [
            /* @__PURE__ */ jsxDEV(Tooltip_default, { title: "Today", placement: "top", children: /* @__PURE__ */ jsxDEV(TodayVertical, { middle: todayMiddle, top: 0, blur: 0 }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan.tsx",
              lineNumber: 308,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan.tsx",
              lineNumber: 307,
              columnNumber: 21
            }, this),
            sortedMilestones.map((milestone) => {
              const isHighlighted = hoveredMilestoneRefId === milestone.ref_id;
              return /* @__PURE__ */ jsxDEV(Tooltip_default, { title: `${milestone.name} on ${milestone.date}`, placement: "top", children: /* @__PURE__ */ jsxDEV(MilestoneVertical, { middle: milestonePositions.get(milestone.ref_id).middle, top: 0, blur: computeFutureBlurForPoint(milestonePositions.get(milestone.ref_id).middle, todayMiddle, loaderData.lifePlan.max_age), highlighted: isHighlighted, onMouseEnter: () => setHoveredMilestoneRefId(milestone.ref_id), onMouseLeave: () => setHoveredMilestoneRefId(null) }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan.tsx",
                lineNumber: 313,
                columnNumber: 27
              }, this) }, `milestone-tooltip-${milestone.ref_id}`, false, {
                fileName: "app/routes/app/workspace/life-plan.tsx",
                lineNumber: 312,
                columnNumber: 26
              }, this);
            })
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/life-plan.tsx",
            lineNumber: 301,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/life-plan.tsx",
          lineNumber: 255,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan.tsx",
          lineNumber: 254,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV(SectionLabeled, { label: "Aspects, Chapters, and Goals", children: /* @__PURE__ */ jsxDEV(Fragment, { children: sortedAspects.map((aspect) => {
          const parentAspect = aspect.parent_aspect_ref_id ? allAspectsByRefId.get(aspect.parent_aspect_ref_id) : void 0;
          const indent = computeAspectDistanceFromRoot(aspect, allAspectsByRefId);
          const chapters = allChaptersByAspectRefId.get(aspect.ref_id) ?? [];
          const goals = allGoalsByAspectRefId.get(aspect.ref_id) ?? [];
          const sortedChapters = sortChaptersNaturally(lifePlanBirthdayDate(loaderData.lifePlan), today, chapters, sortedMilestones, sortedAspects);
          const {
            totalRows: totalRows2,
            chapterPositions
          } = computeChapterPositions(today, loaderData.lifePlan, sortedChapters, sortedMilestones);
          return /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `aspect-${aspect.ref_id}`, indent, children: /* @__PURE__ */ jsxDEV(Stack_default, { direction: "column", children: [
            /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", children: [
              /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/life-plan/aspects/${aspect.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: `\u2B50 ${aspect.name}` }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan.tsx",
                lineNumber: 336,
                columnNumber: 29
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan.tsx",
                lineNumber: 335,
                columnNumber: 27
              }, this),
              isRootAspect(aspect) || parentAspect === void 0 ? void 0 : /* @__PURE__ */ jsxDEV(Fragment, { children: [
                /* @__PURE__ */ jsxDEV(IconButton_default, { size: "medium", type: "submit", name: "intent", value: makeIntent("reorder", {
                  refId: parentAspect.ref_id,
                  newOrderOfChildAspects: shiftAspectUpInListOfChildren(aspect, parentAspect.order_of_child_aspects)
                }), children: /* @__PURE__ */ jsxDEV(ArrowUpward_default, { fontSize: "medium" }, void 0, false, {
                  fileName: "app/routes/app/workspace/life-plan.tsx",
                  lineNumber: 344,
                  columnNumber: 33
                }, this) }, void 0, false, {
                  fileName: "app/routes/app/workspace/life-plan.tsx",
                  lineNumber: 340,
                  columnNumber: 31
                }, this),
                /* @__PURE__ */ jsxDEV(IconButton_default, { size: "medium", type: "submit", name: "intent", value: makeIntent("reorder", {
                  refId: parentAspect.ref_id,
                  newOrderOfChildAspects: shiftAspectDownInListOfChildren(aspect, parentAspect.order_of_child_aspects)
                }), children: /* @__PURE__ */ jsxDEV(ArrowDownward_default, { fontSize: "medium" }, void 0, false, {
                  fileName: "app/routes/app/workspace/life-plan.tsx",
                  lineNumber: 351,
                  columnNumber: 33
                }, this) }, void 0, false, {
                  fileName: "app/routes/app/workspace/life-plan.tsx",
                  lineNumber: 347,
                  columnNumber: 31
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/app/workspace/life-plan.tsx",
                lineNumber: 339,
                columnNumber: 93
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/life-plan.tsx",
              lineNumber: 334,
              columnNumber: 25
            }, this),
            sortedChapters.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV(Divider_default, {}, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan.tsx",
                lineNumber: 357,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ jsxDEV(Box_default, { sx: {
                marginLeft: `${maxIndent - indent}rem`,
                position: "relative",
                height: `${0.25 + totalRows2 * 2.25}rem`
              }, children: sortedChapters.map((chapter) => {
                const position = chapterPositions.get(chapter.ref_id);
                const {
                  fadeStart,
                  fadeEnd
                } = computeFutureFuzzinessForInterval(position.left, position.left + position.width, todayMiddle, loaderData.lifePlan.max_age);
                const chapterTextColor = lighten(theme.palette.info.dark, fadeStart);
                return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
                  isMilestonePartialDate(chapter.start_date) && /* @__PURE__ */ jsxDEV(ChapterMilestoneLink, { left: position.left, top: position.top }, void 0, false, {
                    fileName: "app/routes/app/workspace/life-plan.tsx",
                    lineNumber: 371,
                    columnNumber: 84
                  }, this),
                  /* @__PURE__ */ jsxDEV(Tooltip_default, { title: chapter.name, placement: "top", children: /* @__PURE__ */ jsxDEV(ChapterTimelineLink, { to: `/app/workspace/life-plan/chapters/${chapter.ref_id}`, left: position.left, width: position.width, top: position.top, indent: 0, fadestart: fadeStart, fadeend: fadeEnd, children: /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: `\u{1F4D6} ${chapter.name}`, color: chapterTextColor }, void 0, false, {
                    fileName: "app/routes/app/workspace/life-plan.tsx",
                    lineNumber: 374,
                    columnNumber: 41
                  }, this) }, void 0, false, {
                    fileName: "app/routes/app/workspace/life-plan.tsx",
                    lineNumber: 373,
                    columnNumber: 39
                  }, this) }, void 0, false, {
                    fileName: "app/routes/app/workspace/life-plan.tsx",
                    lineNumber: 372,
                    columnNumber: 37
                  }, this),
                  isMilestonePartialDate(chapter.end_date) && /* @__PURE__ */ jsxDEV(ChapterMilestoneLink, { left: position.left + position.width, top: position.top }, void 0, false, {
                    fileName: "app/routes/app/workspace/life-plan.tsx",
                    lineNumber: 377,
                    columnNumber: 82
                  }, this)
                ] }, `chapter-${chapter.ref_id}`, true, {
                  fileName: "app/routes/app/workspace/life-plan.tsx",
                  lineNumber: 370,
                  columnNumber: 34
                }, this);
              }) }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan.tsx",
                lineNumber: 358,
                columnNumber: 29
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/life-plan.tsx",
              lineNumber: 356,
              columnNumber: 55
            }, this),
            goals.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV(Divider_default, {}, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan.tsx",
                lineNumber: 384,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", spacing: 1, useFlexGap: true, flexWrap: "wrap", sx: {
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                paddingLeft: "1rem",
                paddingRight: "1rem"
              }, children: buildGoalForest(goals).map((node) => renderGoalRoot(node)) }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan.tsx",
                lineNumber: 385,
                columnNumber: 29
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/life-plan.tsx",
              lineNumber: 383,
              columnNumber: 46
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/life-plan.tsx",
            lineNumber: 333,
            columnNumber: 23
          }, this) }, `aspect-${aspect.ref_id}`, false, {
            fileName: "app/routes/app/workspace/life-plan.tsx",
            lineNumber: 332,
            columnNumber: 24
          }, this);
        }) }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan.tsx",
          lineNumber: 321,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan.tsx",
          lineNumber: 320,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 243,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 242,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/life-plan.tsx",
      lineNumber: 240,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan.tsx",
      lineNumber: 404,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan.tsx",
      lineNumber: 403,
      columnNumber: 7
    }, this)
  ] }, "aspects", true, {
    fileName: "app/routes/app/workspace/life-plan.tsx",
    lineNumber: 187,
    columnNumber: 10
  }, this);
}
_s(LifePlanView, "kHpGhmMAKB+at3nAaP5KjI2640E=", false, function() {
  return [useLoaderDataSafeForAnimation, useTheme, useNavigation, useBigScreen, useActionData, useTrunkNeedsToShowBranch, useTrunkNeedsToShowLeaf, useLeafNeedsToShowLeaflet];
});
_c = LifePlanView;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the life plan! Please try again!`
});
var ChapterTimelineLink = styled_default(Link)(({
  theme,
  left,
  width,
  top,
  fadestart: fadeStart,
  fadeend: fadeEnd
}) => ({
  position: "absolute",
  textDecoration: "none",
  color: theme.palette.info.dark,
  ":visited": {
    color: theme.palette.info.dark
  },
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "inline-flex",
  alignItems: "center",
  paddingLeft: "0.5rem",
  left: `${left * 100}%`,
  width: `${width * 100}%`,
  height: "2rem",
  top: `${top}rem`,
  marginLeft: "0.25rem",
  marginRight: "0.25rem",
  marginBottom: "0.25rem",
  background: `linear-gradient(90deg, ${lighten(theme.palette.action.hover, fadeStart)} 0%, ${lighten(theme.palette.action.hover, fadeEnd)} 100%)`,
  borderRadius: "0.25rem",
  border: `1px solid transparent`,
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    padding: "1px",
    background: `linear-gradient(90deg, ${lighten(theme.palette.divider, fadeStart)} 0%, ${lighten(theme.palette.divider, fadeEnd)} 100%)`,
    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    pointerEvents: "none"
  }
}));
_c2 = ChapterTimelineLink;
var ChapterMilestoneLink = styled_default("div")(({
  theme,
  left,
  top
}) => ({
  position: "absolute",
  textDecoration: "none",
  left: `${left * 100}%`,
  top: `${top + 0.8}rem`,
  width: "0.4rem",
  height: "0.4rem",
  backgroundColor: theme.palette.error.light,
  zIndex: theme.zIndex.appBar,
  borderRadius: "0.15rem"
}));
_c3 = ChapterMilestoneLink;
var MilestoneTimelineLink = styled_default(Link, {
  shouldForwardProp: (prop) => prop !== "highlighted"
})(({
  theme,
  left,
  width,
  top,
  indent,
  highlighted
}) => ({
  position: "absolute",
  textDecoration: "none",
  color: theme.palette.info.dark,
  ":visited": {
    color: theme.palette.info.dark
  },
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "0.75rem",
  lineHeight: "1rem",
  textAlign: "center",
  left: `calc(${indent}rem + ${left * 100}%)`,
  width: `${width * 100}%`,
  height: "1rem",
  top: `${top}rem`,
  marginLeft: "0.25rem",
  marginRight: "0.25rem",
  marginBottom: "0.25rem",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "0.1rem",
  backgroundColor: highlighted ? alpha(theme.palette.info.main, 0.12) : "transparent",
  borderColor: highlighted ? theme.palette.info.main : theme.palette.divider,
  "&:hover": {
    borderColor: theme.palette.info.main,
    backgroundColor: alpha(theme.palette.info.main, 0.12),
    color: theme.palette.info.main
  }
}));
_c4 = MilestoneTimelineLink;
var MilestoneVertical = styled_default("div", {
  shouldForwardProp: (prop) => prop !== "highlighted"
})(({
  theme,
  middle,
  top,
  blur,
  highlighted
}) => {
  const dimColor = alpha(theme.palette.info.main, 0.1);
  return {
    position: "absolute",
    left: `${middle * 100}%`,
    top: `${top}rem`,
    width: "2px",
    height: "100%",
    zIndex: theme.zIndex.appBar,
    transform: "scaleY(1.05)",
    filter: `blur(${blur}px)`,
    cursor: "pointer",
    backgroundColor: highlighted ? theme.palette.info.main : "transparent",
    backgroundImage: highlighted ? "none" : `repeating-linear-gradient(to bottom, ${dimColor} 0, ${dimColor} 8px, transparent 8px, transparent 14px)`,
    "&:hover": {
      backgroundColor: theme.palette.info.main,
      backgroundImage: "none"
    }
  };
});
_c5 = MilestoneVertical;
var TodayVertical = styled_default("div")(({
  theme,
  middle,
  top,
  blur
}) => ({
  position: "absolute",
  left: `${middle * 100}%`,
  top: `${top}rem`,
  width: "2px",
  height: "100%",
  zIndex: theme.zIndex.appBar,
  backgroundColor: theme.palette.info.main,
  filter: `blur(${blur}px)`
}));
_c6 = TodayVertical;
var YearMarker = styled_default("div")(({
  theme,
  left,
  top
}) => ({
  position: "absolute",
  left: `${left}%`,
  top: `${top}rem`,
  lineHeigh: "1rem",
  height: "1rem",
  textAlign: "center",
  fontSize: "0.75rem",
  color: theme.palette.text.secondary
}));
_c7 = YearMarker;
var SectionLabel = styled_default("div")(({
  theme
}) => ({
  width: "1.5rem",
  maxWidth: "1.5rem",
  minHeight: "3rem",
  display: "flex",
  alignItems: "center",
  paddingBottom: "0.25rem",
  justifyContent: "flex-end",
  borderRadius: "0.25rem",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
  letterSpacing: "0.05rem",
  writingMode: "vertical-rl",
  textOrientation: "mixed",
  transform: "rotate(180deg)",
  userSelect: "none"
}));
_c8 = SectionLabel;
function SectionLabeled(props) {
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
    display: "flex",
    alignItems: "stretch",
    gap: 1,
    width: "100%"
  }, children: [
    /* @__PURE__ */ jsxDEV(SectionLabel, { children: props.label }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan.tsx",
      lineNumber: 604,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Box_default, { sx: {
      flex: 1,
      minWidth: 0
    }, children: props.children }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan.tsx",
      lineNumber: 605,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/life-plan.tsx",
    lineNumber: 598,
    columnNumber: 10
  }, this);
}
_c9 = SectionLabeled;
function computeChapterPositions(today, lifePlan, chapters, milestones) {
  const chapterPositions = /* @__PURE__ */ new Map();
  const birthdayDate = lifePlanBirthdayDate(lifePlan);
  const maxDate = DateTime.fromObject({
    year: lifePlan.birth_year + lifePlan.max_age,
    month: 12,
    day: 31
  });
  const maxWidth = maxDate.diff(birthdayDate, "days").days;
  function computeForOne(chapter) {
    const startDate = DateTime.max(birthdayDate, midDate(chapter.start_date, birthdayDate, today, milestones));
    const endDate = midDate(chapter.end_date, birthdayDate, today, milestones);
    const left = Math.max(0, startDate.diff(birthdayDate, "days").days / maxWidth);
    const width = Math.max(0.05, endDate.diff(startDate, "days").days / maxWidth);
    const right = Math.min(1, left + width);
    return {
      left,
      width,
      right
    };
  }
  const rows = [];
  let rowIdx = -1;
  for (const chapter of chapters) {
    const chapterPosition = computeForOne(chapter);
    let usefulRowIdx = -1;
    for (let i = 0; i < rows.length; i++) {
      if (chapterPosition.left >= rows[i]) {
        usefulRowIdx = i;
        break;
      }
    }
    if (usefulRowIdx === -1) {
      rowIdx++;
      rows[rowIdx] = chapterPosition.right;
      usefulRowIdx = rowIdx;
    } else {
      rows[usefulRowIdx] = chapterPosition.right;
    }
    chapterPositions.set(chapter.ref_id, {
      left: chapterPosition.left,
      top: 0.25 + usefulRowIdx * 2.25,
      width: chapterPosition.width
    });
  }
  return {
    totalRows: rowIdx + 1,
    chapterPositions
  };
}
function computeMilestonePositions(lifePlan, milestones) {
  const milestonePositions = /* @__PURE__ */ new Map();
  const birthdayDate = lifePlanBirthdayDate(lifePlan);
  const maxDate = DateTime.fromObject({
    year: lifePlan.birth_year + lifePlan.max_age,
    month: 12,
    day: 31
  });
  const maxWidth = maxDate.diff(birthdayDate, "days").days;
  function computeForOne(milestone) {
    const middle = aDateToDate(milestone.date).diff(birthdayDate, "days").days / maxWidth;
    const left = Math.max(0, middle - 0.075 / 2);
    const width = Math.max(0.075 / 2, 0.075);
    return {
      left,
      width,
      middle
    };
  }
  const rows = [];
  let rowIdx = -1;
  for (const milestone of milestones) {
    const milestonePosition = computeForOne(milestone);
    let usefulRowIdx = -1;
    for (let i = 0; i < rows.length; i++) {
      if (milestonePosition.left >= rows[i]) {
        usefulRowIdx = i;
        break;
      }
    }
    if (usefulRowIdx === -1) {
      rowIdx++;
      rows[rowIdx] = milestonePosition.left + milestonePosition.width;
      usefulRowIdx = rowIdx;
    } else {
      rows[usefulRowIdx] = milestonePosition.left + milestonePosition.width;
    }
    milestonePositions.set(milestone.ref_id, {
      left: milestonePosition.left,
      middle: milestonePosition.middle,
      top: 0.25 + usefulRowIdx * 1.25,
      width: milestonePosition.width
    });
  }
  return {
    totalRows: rowIdx + 1,
    milestonePositions
  };
}
function computeTodayMiddle(lifePlan, today) {
  const birthdayDate = lifePlanBirthdayDate(lifePlan);
  const maxDate = DateTime.fromObject({
    year: lifePlan.birth_year + lifePlan.max_age,
    month: 12,
    day: 31
  });
  const maxWidth = maxDate.diff(birthdayDate, "days").days;
  if (maxWidth <= 0) {
    return 0;
  }
  return Math.min(1, Math.max(0, today.diff(birthdayDate, "days").days / maxWidth));
}
var FUTURE_FUZZINESS_HORIZON_YEARS = 20;
var FUTURE_FUZZINESS_MIN_COLOR_STRENGTH = 0.3;
function computeFutureFuzzinessForInterval(left, right, todayMiddle, maxAge) {
  const futureFuzzinessHorizon = Math.min(1, FUTURE_FUZZINESS_HORIZON_YEARS / maxAge);
  if (futureFuzzinessHorizon <= 0) {
    return {
      fadeStart: 0,
      fadeEnd: 0
    };
  }
  const computeOne = (x) => {
    const distanceIntoFuture = x - todayMiddle;
    if (distanceIntoFuture <= 0) {
      return 0;
    }
    const normalized = Math.min(1, distanceIntoFuture / futureFuzzinessHorizon);
    return (1 - FUTURE_FUZZINESS_MIN_COLOR_STRENGTH) * normalized;
  };
  return {
    fadeStart: computeOne(left),
    fadeEnd: computeOne(right)
  };
}
function computeFutureBlurForPoint(middle, todayMiddle, maxAge) {
  const futureFuzzinessHorizon = Math.min(1, FUTURE_FUZZINESS_HORIZON_YEARS / maxAge);
  if (futureFuzzinessHorizon <= 0) {
    return 0;
  }
  const distanceIntoFuture = middle - todayMiddle;
  if (distanceIntoFuture <= 0) {
    return 0;
  }
  const normalized = Math.min(1, distanceIntoFuture / futureFuzzinessHorizon);
  return 2 * normalized;
}
function buildGoalForest(goals) {
  const sortedGoals = sortGoalsNaturally(goals);
  const nodesByRefId = /* @__PURE__ */ new Map();
  for (const goal of sortedGoals) {
    nodesByRefId.set(goal.ref_id, {
      goal,
      children: []
    });
  }
  const roots = [];
  for (const goal of sortedGoals) {
    const node = nodesByRefId.get(goal.ref_id);
    const parentRefId = goal.parent_goal_ref_id ?? null;
    const parent = parentRefId ? nodesByRefId.get(parentRefId) : void 0;
    if (!parent || parentRefId === goal.ref_id) {
      roots.push(node);
      continue;
    }
    parent.children.push(node);
  }
  return roots;
}
function renderGoalRoot(node) {
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
    flexBasis: "16rem",
    paddingRight: "0.5rem"
  }, children: [
    /* @__PURE__ */ jsxDEV(EntityLink, { inline: true, singleLine: true, to: `/app/workspace/life-plan/goals/${node.goal.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: `\u{1F3AF} ${node.goal.name}` }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan.tsx",
      lineNumber: 794,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan.tsx",
      lineNumber: 793,
      columnNumber: 7
    }, this),
    node.children.length > 0 && /* @__PURE__ */ jsxDEV(Box_default, { sx: {
      paddingTop: "0.25rem"
    }, children: node.children.map((child) => renderGoalNode(child, 1)) }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan.tsx",
      lineNumber: 796,
      columnNumber: 36
    }, this)
  ] }, `goal-root-${node.goal.ref_id}`, true, {
    fileName: "app/routes/app/workspace/life-plan.tsx",
    lineNumber: 789,
    columnNumber: 10
  }, this);
}
function renderGoalNode(node, depth) {
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
    paddingLeft: `${depth * 1}rem`,
    paddingBottom: "0.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem"
  }, children: [
    /* @__PURE__ */ jsxDEV(EntityLink, { inline: true, singleLine: true, to: `/app/workspace/life-plan/goals/${node.goal.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: `\u{1F3AF} ${node.goal.name}` }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan.tsx",
      lineNumber: 812,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan.tsx",
      lineNumber: 811,
      columnNumber: 7
    }, this),
    node.children.length > 0 && node.children.map((child) => renderGoalNode(child, depth + 1))
  ] }, `goal-${node.goal.ref_id}`, true, {
    fileName: "app/routes/app/workspace/life-plan.tsx",
    lineNumber: 804,
    columnNumber: 10
  }, this);
}
var TOTAL_YEARS = 100;
var MONTHS_PER_YEAR = 12;
function LifeMonthsGrid({
  birthday,
  today,
  isBigScreen
}) {
  const todayMillis = today.toMillis();
  const ageMs = todayMillis - birthday.toMillis();
  const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1e3);
  const percent = Math.min(100, Math.round(ageYears / TOTAL_YEARS * 100));
  return /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", sx: {
    alignItems: "center",
    gap: 2
  }, children: [
    isBigScreen && /* @__PURE__ */ jsxDEV(Stack_default, { sx: {
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      minWidth: "3rem"
    }, children: [
      /* @__PURE__ */ jsxDEV(Typography_default, { sx: {
        fontSize: "1.4rem",
        fontWeight: "bold",
        lineHeight: 1
      }, children: [
        percent,
        "%"
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 838,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Typography_default, { variant: "caption", sx: {
        color: "text.secondary",
        fontSize: "0.6rem",
        textAlign: "center"
      }, children: "lived so far" }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 845,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/life-plan.tsx",
      lineNumber: 832,
      columnNumber: 23
    }, this),
    /* @__PURE__ */ jsxDEV(Box_default, { sx: {
      overflowX: "auto"
    }, children: Array.from({
      length: MONTHS_PER_YEAR
    }, (_, month) => /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", sx: {
      alignItems: "center"
    }, children: Array.from({
      length: TOTAL_YEARS
    }, (_2, year) => {
      const monthStart = birthday.plus({
        years: year
      }).set({
        month: month + 1,
        day: 1
      }).startOf("day");
      const monthEnd = monthStart.plus({
        months: 1
      });
      const monthStartMillis = monthStart.toMillis();
      const monthEndMillis = monthEnd.toMillis();
      const isCurrent = monthStartMillis <= todayMillis && todayMillis < monthEndMillis;
      const isPast = monthEndMillis <= todayMillis;
      const backgroundColor = isCurrent ? "#ffd700" : isPast ? "#cccccc" : "#f0f0f0";
      return /* @__PURE__ */ jsxDEV(Tooltip_default, { title: `Age ${year}, ${monthStart.toFormat("LLLL yyyy")}`, placement: "top", children: /* @__PURE__ */ jsxDEV(Box_default, { sx: {
        width: "8px",
        height: "8px",
        margin: "1px",
        flexShrink: 0,
        backgroundColor
      } }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 879,
        columnNumber: 19
      }, this) }, year, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 878,
        columnNumber: 18
      }, this);
    }) }, month, false, {
      fileName: "app/routes/app/workspace/life-plan.tsx",
      lineNumber: 858,
      columnNumber: 24
    }, this)) }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan.tsx",
      lineNumber: 853,
      columnNumber: 7
    }, this),
    isBigScreen && /* @__PURE__ */ jsxDEV(Stack_default, { sx: {
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      minWidth: "3rem"
    }, children: [
      /* @__PURE__ */ jsxDEV(Typography_default, { sx: {
        fontSize: "1.4rem",
        fontWeight: "bold",
        lineHeight: 1
      }, children: [
        100 - percent,
        "%"
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 896,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Typography_default, { variant: "caption", sx: {
        color: "text.secondary",
        fontSize: "0.6rem",
        textAlign: "center"
      }, children: "left to live" }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan.tsx",
        lineNumber: 903,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/life-plan.tsx",
      lineNumber: 890,
      columnNumber: 23
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/life-plan.tsx",
    lineNumber: 828,
    columnNumber: 10
  }, this);
}
_c0 = LifeMonthsGrid;
var _c;
var _c2;
var _c3;
var _c4;
var _c5;
var _c6;
var _c7;
var _c8;
var _c9;
var _c0;
$RefreshReg$(_c, "LifePlanView");
$RefreshReg$(_c2, "ChapterTimelineLink");
$RefreshReg$(_c3, "ChapterMilestoneLink");
$RefreshReg$(_c4, "MilestoneTimelineLink");
$RefreshReg$(_c5, "MilestoneVertical");
$RefreshReg$(_c6, "TodayVertical");
$RefreshReg$(_c7, "YearMarker");
$RefreshReg$(_c8, "SectionLabel");
$RefreshReg$(_c9, "SectionLabeled");
$RefreshReg$(_c0, "LifeMonthsGrid");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  LifePlanView as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/life-plan-QUAJL3VR.js.map
