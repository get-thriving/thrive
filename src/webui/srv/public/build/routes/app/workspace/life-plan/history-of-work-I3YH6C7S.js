import {
  sortGoalsNaturally
} from "/build/_shared/chunk-OLMKSGLM.js";
import {
  sortAspectsByTreeOrder
} from "/build/_shared/chunk-37FGSNWH.js";
import {
  PeriodTag
} from "/build/_shared/chunk-HLPWZ3ZO.js";
import "/build/_shared/chunk-HVU6TG3B.js";
import {
  newURLParams
} from "/build/_shared/chunk-R75UYOOE.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  BigPlanStatusTag
} from "/build/_shared/chunk-W6KI7GPI.js";
import "/build/_shared/chunk-P7WFXMQY.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  NavMultipleCompact,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  BranchPanel,
  DateTime,
  makeBranchErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
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
import {
  Box_default,
  styled_default
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
import "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Link,
  useSearchParams
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

// app/routes/app/workspace/life-plan/history-of-work.tsx
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/life-plan/history-of-work.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/life-plan/history-of-work.tsx"
  );
  import.meta.hot.lastModified = "1775685113122.3867";
}
var ParamsSchema = external_exports.object({});
var QuerySchema = external_exports.object({
  hideNoGoal: external_exports.enum(["true", "false"]).optional().transform((v) => v === "true" ? true : false)
});
var handle = {
  displayType: 2 /* BRANCH */
};
var shouldRevalidate = standardShouldRevalidate;
function LifePlanHistoryOfWork() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const [searchParams] = useSearchParams();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const sortedAspects = sortAspectsByTreeOrder(loaderData.aspects);
  const sortedGoals = sortGoalsNaturally(loaderData.goals);
  const goalsByRefId = new Map(sortedGoals.map((g) => [g.ref_id, g]));
  const allBigPlans = loaderData.bigPlanEntries.map((e) => e.big_plan);
  const allHabits = loaderData.habitEntries.map((e) => e.habit);
  const allChores = loaderData.choreEntries.map((e) => e.chore);
  return /* @__PURE__ */ jsxDEV(BranchPanel, { returnLocation: "/app/workspace/life-plan", inputsEnabled: true, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "history-of-work", topLevelInfo, inputsEnabled: true, actions: [NavMultipleCompact({
    navs: [NavSingle({
      text: "Show No Goals",
      link: `/app/workspace/life-plan/history-of-work?${newURLParams(searchParams, "hideNoGoal", "false")}`
    }), NavSingle({
      text: "Hide No Goals",
      link: `/app/workspace/life-plan/history-of-work?${newURLParams(searchParams, "hideNoGoal", "true")}`
    })]
  })] }, void 0, false, {
    fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
    lineNumber: 113,
    columnNumber: 129
  }, this), children: /* @__PURE__ */ jsxDEV(SectionCard, { id: "history-of-work", title: "History of Work", children: sortedAspects.map((aspect) => {
    const aspectGoals = sortedGoals.filter((g) => g.aspect_ref_id === aspect.ref_id);
    return /* @__PURE__ */ jsxDEV(Box_default, { children: [
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: String(aspect.name), size: "large" }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
        lineNumber: 126,
        columnNumber: 15
      }, this),
      aspectGoals.map((goal) => {
        const goalHabits = allHabits.filter((h) => h.aspect_ref_id === aspect.ref_id && (h.goal_ref_id ?? null) === goal.ref_id);
        const goalChores = allChores.filter((c) => c.aspect_ref_id === aspect.ref_id && (c.goal_ref_id ?? null) === goal.ref_id);
        const goalBigPlans = allBigPlans.filter((bp) => bp.aspect_ref_id === aspect.ref_id && (bp.goal_ref_id ?? null) === goal.ref_id);
        if (goalHabits.length === 0 && goalChores.length === 0 && goalBigPlans.length === 0) {
          return null;
        }
        const bigPlansByYear = /* @__PURE__ */ new Map();
        for (const bp of goalBigPlans) {
          const year = computeStartedYear(bp);
          bigPlansByYear.set(year, (bigPlansByYear.get(year) ?? []).concat(bp));
        }
        const years = [...bigPlansByYear.keys()].sort((a, b) => b - a);
        return /* @__PURE__ */ jsxDEV(Box_default, { children: [
          /* @__PURE__ */ jsxDEV(StandardDivider, { title: `\u{1F3AF} ${fullGoalName(goal, goalsByRefId)}`, size: "medium" }, void 0, false, {
            fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
            lineNumber: 142,
            columnNumber: 21
          }, this),
          goalHabits.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV(StandardDivider, { title: "\u{1F4AA} Habits", size: "small" }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 145,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV(DenseLinksContainer, { children: goalHabits.map((h) => /* @__PURE__ */ jsxDEV(DenseLinksItem, { children: /* @__PURE__ */ jsxDEV(DenseSingleLineLink, { to: `/app/workspace/habits/${h.ref_id}`, children: [
              /* @__PURE__ */ jsxDEV("span", { style: {
                flexShrink: 0
              }, children: /* @__PURE__ */ jsxDEV(PeriodTag, { period: h.gen_params.period }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 152,
                columnNumber: 35
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 149,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV(Box_default, { sx: {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0
              }, children: /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: h.name }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 160,
                columnNumber: 35
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 154,
                columnNumber: 33
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 148,
              columnNumber: 31
            }, this) }, `habit-${h.ref_id}`, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 147,
              columnNumber: 48
            }, this)) }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 146,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
            lineNumber: 144,
            columnNumber: 47
          }, this),
          goalChores.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV(StandardDivider, { title: "\u267B\uFE0F Chores", size: "small" }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 168,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV(DenseLinksContainer, { children: goalChores.map((c) => /* @__PURE__ */ jsxDEV(DenseLinksItem, { children: /* @__PURE__ */ jsxDEV(DenseSingleLineLink, { to: `/app/workspace/chores/${c.ref_id}`, children: [
              /* @__PURE__ */ jsxDEV("span", { style: {
                flexShrink: 0
              }, children: /* @__PURE__ */ jsxDEV(PeriodTag, { period: c.gen_params.period }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 175,
                columnNumber: 35
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 172,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV(Box_default, { sx: {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0
              }, children: /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: c.name }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 183,
                columnNumber: 35
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 177,
                columnNumber: 33
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 171,
              columnNumber: 31
            }, this) }, `chore-${c.ref_id}`, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 170,
              columnNumber: 48
            }, this)) }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 169,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
            lineNumber: 167,
            columnNumber: 47
          }, this),
          years.length > 0 && years.map((year) => /* @__PURE__ */ jsxDEV(Box_default, { children: [
            /* @__PURE__ */ jsxDEV(StandardDivider, { title: `\u{1F30D} Big Plans in ${String(year)}`, size: "small" }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 191,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV(DenseLinksContainer, { children: (bigPlansByYear.get(year) ?? []).map((bp) => /* @__PURE__ */ jsxDEV(DenseLinksItem, { children: /* @__PURE__ */ jsxDEV(DenseSingleLineLink, { to: `/app/workspace/big-plans/${bp.ref_id}`, children: [
              /* @__PURE__ */ jsxDEV(BigPlanStatusTag, { status: bp.status, format: "icon" }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 195,
                columnNumber: 35
              }, this),
              /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: bp.name }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 196,
                columnNumber: 35
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 194,
              columnNumber: 33
            }, this) }, `big-plan-${bp.ref_id}`, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 193,
              columnNumber: 73
            }, this)) }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 192,
              columnNumber: 27
            }, this)
          ] }, `aspect-${aspect.ref_id}-goal-${goal.ref_id}-year-${year}`, true, {
            fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
            lineNumber: 190,
            columnNumber: 60
          }, this))
        ] }, `aspect-${aspect.ref_id}-goal-${goal.ref_id}`, true, {
          fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
          lineNumber: 141,
          columnNumber: 20
        }, this);
      }),
      !loaderData.query.hideNoGoal && (() => {
        const noGoalHabits = allHabits.filter((h) => h.aspect_ref_id === aspect.ref_id && (h.goal_ref_id ?? null) === null);
        const noGoalChores = allChores.filter((c) => c.aspect_ref_id === aspect.ref_id && (c.goal_ref_id ?? null) === null);
        const noGoalBigPlans = allBigPlans.filter((bp) => bp.aspect_ref_id === aspect.ref_id && (bp.goal_ref_id ?? null) === null);
        const bigPlansByYear = /* @__PURE__ */ new Map();
        for (const bp of noGoalBigPlans) {
          const year = computeStartedYear(bp);
          bigPlansByYear.set(year, (bigPlansByYear.get(year) ?? []).concat(bp));
        }
        const years = [...bigPlansByYear.keys()].sort((a, b) => b - a);
        return /* @__PURE__ */ jsxDEV(Box_default, { children: [
          /* @__PURE__ */ jsxDEV(StandardDivider, { title: "\u{1F6AB} No Goal", size: "medium" }, void 0, false, {
            fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
            lineNumber: 216,
            columnNumber: 23
          }, this),
          noGoalHabits.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV(StandardDivider, { title: "\u{1F4AA} Habits", size: "small" }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 219,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV(DenseLinksContainer, { children: noGoalHabits.map((h) => /* @__PURE__ */ jsxDEV(DenseLinksItem, { children: /* @__PURE__ */ jsxDEV(DenseSingleLineLink, { to: `/app/workspace/habits/${h.ref_id}`, children: [
              /* @__PURE__ */ jsxDEV("span", { style: {
                flexShrink: 0
              }, children: /* @__PURE__ */ jsxDEV(PeriodTag, { period: h.gen_params.period }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 226,
                columnNumber: 37
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 223,
                columnNumber: 35
              }, this),
              /* @__PURE__ */ jsxDEV(Box_default, { sx: {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0
              }, children: /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: h.name }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 234,
                columnNumber: 37
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 228,
                columnNumber: 35
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 222,
              columnNumber: 33
            }, this) }, `habit-${h.ref_id}`, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 221,
              columnNumber: 52
            }, this)) }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 220,
              columnNumber: 27
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
            lineNumber: 218,
            columnNumber: 51
          }, this),
          noGoalChores.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV(StandardDivider, { title: "\u267B\uFE0F Chores", size: "small" }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 242,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV(DenseLinksContainer, { children: noGoalChores.map((c) => /* @__PURE__ */ jsxDEV(DenseLinksItem, { children: /* @__PURE__ */ jsxDEV(DenseSingleLineLink, { to: `/app/workspace/chores/${c.ref_id}`, children: [
              /* @__PURE__ */ jsxDEV("span", { style: {
                flexShrink: 0
              }, children: /* @__PURE__ */ jsxDEV(PeriodTag, { period: c.gen_params.period }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 249,
                columnNumber: 37
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 246,
                columnNumber: 35
              }, this),
              /* @__PURE__ */ jsxDEV(Box_default, { sx: {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0
              }, children: /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: c.name }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 257,
                columnNumber: 37
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 251,
                columnNumber: 35
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 245,
              columnNumber: 33
            }, this) }, `chore-${c.ref_id}`, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 244,
              columnNumber: 52
            }, this)) }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 243,
              columnNumber: 27
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
            lineNumber: 241,
            columnNumber: 51
          }, this),
          years.length > 0 && years.map((year) => /* @__PURE__ */ jsxDEV(Box_default, { children: [
            /* @__PURE__ */ jsxDEV(StandardDivider, { title: `\u{1F30D} Big Plans in ${String(year)}`, size: "small" }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 265,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV(DenseLinksContainer, { children: (bigPlansByYear.get(year) ?? []).map((bp) => /* @__PURE__ */ jsxDEV(DenseLinksItem, { children: /* @__PURE__ */ jsxDEV(DenseSingleLineLink, { to: `/app/workspace/big-plans/${bp.ref_id}`, children: [
              /* @__PURE__ */ jsxDEV(BigPlanStatusTag, { status: bp.status, format: "icon" }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 269,
                columnNumber: 37
              }, this),
              /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: bp.name }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
                lineNumber: 270,
                columnNumber: 37
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 268,
              columnNumber: 35
            }, this) }, `big-plan-${bp.ref_id}`, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 267,
              columnNumber: 75
            }, this)) }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
              lineNumber: 266,
              columnNumber: 29
            }, this)
          ] }, `aspect-${aspect.ref_id}-goal-none-year-${year}`, true, {
            fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
            lineNumber: 264,
            columnNumber: 62
          }, this))
        ] }, `aspect-${aspect.ref_id}-goal-none`, true, {
          fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
          lineNumber: 215,
          columnNumber: 20
        }, this);
      })()
    ] }, `aspect-${aspect.ref_id}`, true, {
      fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
      lineNumber: 125,
      columnNumber: 16
    }, this);
  }) }, void 0, false, {
    fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
    lineNumber: 122,
    columnNumber: 7
  }, this) }, "life-plan/history-of-work", false, {
    fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
    lineNumber: 113,
    columnNumber: 10
  }, this);
}
_s(LifePlanHistoryOfWork, "Af+sfCBI/68ufI+Nv9pWDE5vnm4=", false, function() {
  return [useLoaderDataSafeForAnimation, useSearchParams];
});
_c = LifePlanHistoryOfWork;
var ErrorBoundary = makeBranchErrorBoundary("/app/workspace/life-plan", ParamsSchema, {
  notFound: () => `Could not find the history of work!`,
  error: () => `There was an error loading the history of work! Please try again!`
});
function computeStartedYear(bp) {
  const ts = bp.working_time ?? bp.actionable_date ?? bp.created_time;
  const dt = DateTime.fromISO(String(ts));
  if (!dt.isValid) {
    throw new Error(`Invalid date: ${ts}`);
  }
  return dt.year;
}
function fullGoalName(goal, goalsByRefId) {
  const visited = /* @__PURE__ */ new Set();
  const parts = [String(goal.name)];
  let current = goal;
  while (current?.parent_goal_ref_id) {
    const parentRefId = String(current.parent_goal_ref_id);
    if (visited.has(parentRefId)) {
      break;
    }
    visited.add(parentRefId);
    const parent = goalsByRefId.get(parentRefId);
    if (!parent) {
      break;
    }
    parts.unshift(String(parent.name));
    current = parent;
  }
  return parts.join(" / ");
}
function DenseLinksContainer(props) {
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: 1,
    rowGap: 0.5,
    paddingBottom: "1rem"
  }, children: props.children }, void 0, false, {
    fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
    lineNumber: 318,
    columnNumber: 10
  }, this);
}
_c2 = DenseLinksContainer;
function DenseLinksItem(props) {
  _s2();
  const isBigScreen = useBigScreen();
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
    flexBasis: isBigScreen ? "18%" : "100%",
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 0
  }, children: props.children }, void 0, false, {
    fileName: "app/routes/app/workspace/life-plan/history-of-work.tsx",
    lineNumber: 332,
    columnNumber: 10
  }, this);
}
_s2(DenseLinksItem, "tSMcTumzNoEiop6dkXrv9elMvRg=", false, function() {
  return [useBigScreen];
});
_c3 = DenseLinksItem;
var DenseSingleLineLink = styled_default(Link)(({
  theme
}) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
  textDecoration: "none",
  color: theme.palette.info.dark,
  ":visited": {
    color: theme.palette.info.dark
  },
  overflow: "hidden",
  whiteSpace: "nowrap",
  minWidth: 0
}));
_c4 = DenseSingleLineLink;
var _c;
var _c2;
var _c3;
var _c4;
$RefreshReg$(_c, "LifePlanHistoryOfWork");
$RefreshReg$(_c2, "DenseLinksContainer");
$RefreshReg$(_c3, "DenseLinksItem");
$RefreshReg$(_c4, "DenseSingleLineLink");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  LifePlanHistoryOfWork as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/life-plan/history-of-work-I3YH6C7S.js.map
