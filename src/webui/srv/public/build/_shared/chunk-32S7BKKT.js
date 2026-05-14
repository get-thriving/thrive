import {
  bigPlanDonePct
} from "/build/_shared/chunk-K2HUSH5I.js";
import {
  ChapterTag,
  GoalTag
} from "/build/_shared/chunk-R6BBIENF.js";
import {
  AspectTag
} from "/build/_shared/chunk-TD4OCNC5.js";
import {
  ContactTag
} from "/build/_shared/chunk-SLZ5UQVD.js";
import {
  TagTag
} from "/build/_shared/chunk-KB3ZBF4C.js";
import {
  DifficultyTag,
  EisenTag
} from "/build/_shared/chunk-U5MVWZEK.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  BigPlanStatusTag
} from "/build/_shared/chunk-W6KI7GPI.js";
import {
  isCompleted
} from "/build/_shared/chunk-P7WFXMQY.js";
import {
  IsKeyTag
} from "/build/_shared/chunk-NVWDLS2H.js";
import {
  ADateTag
} from "/build/_shared/chunk-NBD44M5V.js";
import {
  ClientOnly
} from "/build/_shared/chunk-Z3RPM676.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
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
  isWorkspaceFeatureAvailable
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  Chip_default,
  Divider_default,
  Stack_default,
  styled_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  ServicePropertiesContext
} from "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/big_plans/component/card.tsx
var import_webapi_client = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);

// ../core/jupiter/core/big_plans/component/done-pct-tag.tsx
function BigPlanDonePctTag(props) {
  const tagClass = donePctToClass(props.donePct);
  return /* @__PURE__ */ jsxDEV(SlimChip, { label: `[${props.donePct}%]`, color: tagClass }, void 0, false, {
    fileName: "../core/jupiter/core/big_plans/component/done-pct-tag.tsx",
    lineNumber: 9,
    columnNumber: 10
  }, this);
}
function donePctToClass(donePct) {
  if (donePct === 0) {
    return "error";
  } else if (donePct === 100) {
    return "success";
  } else {
    return "info";
  }
}

// ../core/jupiter/core/big_plans/sub/milestones/component/left-tag.tsx
function BigPlanMilestonesLeftTag(props) {
  const milestonePlural = props.milestonesLeft === 1 ? "milestone" : "milestones";
  return /* @__PURE__ */ jsxDEV(
    SlimChip,
    {
      label: `${props.milestonesLeft} ${milestonePlural} left`,
      color: "info"
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/big_plans/sub/milestones/component/left-tag.tsx",
      lineNumber: 11,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/big_plans/component/card.tsx
function BigPlanCard(props) {
  const milestonesLeft = props.bigPlanMilestones?.filter(
    (m) => aDateToDate(m.date) > aDateToDate(props.topLevelInfo.today)
  ).length ?? 0;
  return /* @__PURE__ */ jsxDEV(
    EntityCard,
    {
      entityId: `big-plan-${props.bigPlan.ref_id}`,
      allowSwipe: props.allowSwipe,
      allowSelect: props.allowSelect,
      selected: props.selected,
      allowMarkDone: props.showOptions.showHandleMarkDone,
      allowMarkNotDone: props.showOptions.showHandleMarkNotDone,
      onClick: props.onClick ? () => props.onClick && props.onClick(props.bigPlan) : void 0,
      markButtonsStyle: "column",
      onMarkDone: props.onMarkDone ? () => props.onMarkDone && props.onMarkDone(props.bigPlan) : void 0,
      onMarkNotDone: props.onMarkNotDone ? () => props.onMarkNotDone && props.onMarkNotDone(props.bigPlan) : void 0,
      children: [
        /* @__PURE__ */ jsxDEV(
          OverdueWarning,
          {
            today: props.topLevelInfo.today,
            status: props.bigPlan.status,
            dueDate: props.bigPlan.due_date
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/big_plans/component/card.tsx",
            lineNumber: 99,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          EntityLink,
          {
            to: `/app/workspace/big-plans/${props.bigPlan.ref_id}`,
            block: props.onClick !== void 0,
            children: [
              /* @__PURE__ */ jsxDEV(IsKeyTag, { isKey: props.bigPlan.is_key }, void 0, false, {
                fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                lineNumber: 108,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV(
                EntityNameComponent,
                {
                  compact: props.compact,
                  name: props.bigPlan.name
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                  lineNumber: 109,
                  columnNumber: 9
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(Divider_default, {}, void 0, false, {
                fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                lineNumber: 113,
                columnNumber: 9
              }, this),
              props.showOptions.showDonePct && props.bigPlanStats && /* @__PURE__ */ jsxDEV(
                BigPlanDonePctTag,
                {
                  donePct: bigPlanDonePct(props.bigPlan, props.bigPlanStats)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                  lineNumber: 115,
                  columnNumber: 11
                },
                this
              ),
              props.showOptions.showMilestonesLeft && props.bigPlanMilestones && props.bigPlanMilestones.length > 0 && /* @__PURE__ */ jsxDEV(BigPlanMilestonesLeftTag, { milestonesLeft }, void 0, false, {
                fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                lineNumber: 122,
                columnNumber: 13
              }, this),
              props.showOptions.showStatus && /* @__PURE__ */ jsxDEV(BigPlanStatusTag, { status: props.bigPlan.status }, void 0, false, {
                fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                lineNumber: 125,
                columnNumber: 11
              }, this),
              props.showOptions.showLifePlan && isWorkspaceFeatureAvailable(
                props.topLevelInfo.workspace,
                import_webapi_client.WorkspaceFeature.LIFE_PLAN
              ) && props.parent && /* @__PURE__ */ jsxDEV(AspectTag, { aspect: props.parent.aspect }, void 0, false, {
                fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                lineNumber: 132,
                columnNumber: 27
              }, this),
              props.showOptions.showLifePlan && isWorkspaceFeatureAvailable(
                props.topLevelInfo.workspace,
                import_webapi_client.WorkspaceFeature.LIFE_PLAN
              ) && props.parent?.chapter && /* @__PURE__ */ jsxDEV(ChapterTag, { chapter: props.parent.chapter }, void 0, false, {
                fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                lineNumber: 139,
                columnNumber: 13
              }, this),
              props.showOptions.showLifePlan && isWorkspaceFeatureAvailable(
                props.topLevelInfo.workspace,
                import_webapi_client.WorkspaceFeature.LIFE_PLAN
              ) && props.parent?.goal && /* @__PURE__ */ jsxDEV(GoalTag, { goal: props.parent.goal }, void 0, false, {
                fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                lineNumber: 147,
                columnNumber: 33
              }, this),
              props.showOptions.showEisen && /* @__PURE__ */ jsxDEV(EisenTag, { eisen: props.bigPlan.eisen }, void 0, false, {
                fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                lineNumber: 150,
                columnNumber: 11
              }, this),
              props.showOptions.showDifficulty && /* @__PURE__ */ jsxDEV(DifficultyTag, { difficulty: props.bigPlan.difficulty }, void 0, false, {
                fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                lineNumber: 153,
                columnNumber: 11
              }, this),
              props.showOptions.showActionableDate && props.bigPlan.actionable_date && /* @__PURE__ */ jsxDEV(
                ADateTag,
                {
                  label: "Actionable Date",
                  date: props.bigPlan.actionable_date
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                  lineNumber: 158,
                  columnNumber: 13
                },
                this
              ),
              props.showOptions.showDueDate && props.bigPlan.due_date && /* @__PURE__ */ jsxDEV(ADateTag, { label: "Due Date", date: props.bigPlan.due_date }, void 0, false, {
                fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                lineNumber: 164,
                columnNumber: 11
              }, this),
              props.parent?.tags?.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
                fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                lineNumber: 168,
                columnNumber: 11
              }, this)),
              props.parent?.contacts?.map((contact) => /* @__PURE__ */ jsxDEV(ContactTag, { contact }, contact.ref_id, false, {
                fileName: "../core/jupiter/core/big_plans/component/card.tsx",
                lineNumber: 171,
                columnNumber: 11
              }, this))
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/big_plans/component/card.tsx",
            lineNumber: 104,
            columnNumber: 7
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "../core/jupiter/core/big_plans/component/card.tsx",
      lineNumber: 75,
      columnNumber: 5
    },
    this
  );
}
function OverdueWarning({ today, status, dueDate }) {
  const serviceProperties = (0, import_react.useContext)(ServicePropertiesContext);
  if (isCompleted(status)) {
    return null;
  }
  if (!dueDate) {
    return null;
  }
  const theToday = aDateToDate(today);
  const theDueDate = aDateToDate(dueDate);
  return /* @__PURE__ */ jsxDEV(ClientOnly, { fallback: /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
    fileName: "../core/jupiter/core/big_plans/component/card.tsx",
    lineNumber: 199,
    columnNumber: 27
  }, this), children: () => {
    if (theDueDate <= theToday.minus({ days: serviceProperties.overdueDangerDays })) {
      return /* @__PURE__ */ jsxDEV(OverdueWarningChip, { label: "Overdue", color: "error" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/card.tsx",
        lineNumber: 205,
        columnNumber: 18
      }, this);
    } else if (theDueDate <= theToday.minus({ days: serviceProperties.overdueWarningDays })) {
      return /* @__PURE__ */ jsxDEV(OverdueWarningChip, { label: "Overdue", color: "warning" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/card.tsx",
        lineNumber: 210,
        columnNumber: 18
      }, this);
    } else if (theDueDate <= theToday.minus({ days: serviceProperties.overdueInfoDays })) {
      return /* @__PURE__ */ jsxDEV(OverdueWarningChip, { label: "Overdue", color: "info" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/card.tsx",
        lineNumber: 215,
        columnNumber: 18
      }, this);
    }
    return null;
  } }, void 0, false, {
    fileName: "../core/jupiter/core/big_plans/component/card.tsx",
    lineNumber: 199,
    columnNumber: 5
  }, this);
}
var OverdueWarningChip = styled_default(Chip_default)(() => ({
  position: "absolute",
  top: "0px",
  fontSize: "0.75rem",
  height: "1rem",
  left: "0px",
  paddingTop: "0.05rem",
  paddingBottom: "0.05rem",
  paddingRight: "0.5rem",
  paddingLeft: "0.5rem",
  borderRadius: "0px",
  borderBottomRightRadius: "4px"
}));

// ../core/jupiter/core/big_plans/component/stack.tsx
function BigPlanStack(props) {
  return /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 0.5, children: [
    props.label && /* @__PURE__ */ jsxDEV(StandardDivider, { title: props.label, size: "large" }, void 0, false, {
      fileName: "../core/jupiter/core/big_plans/component/stack.tsx",
      lineNumber: 34,
      columnNumber: 23
    }, this),
    props.bigPlans.map((entry) => {
      return /* @__PURE__ */ jsxDEV(
        BigPlanCard,
        {
          topLevelInfo: props.topLevelInfo,
          allowSwipe: props.allowSwipe,
          compact: props.compact,
          allowSelect: props.allowSelect,
          bigPlan: entry,
          bigPlanMilestones: props.bigPlanMilestonesByRefId?.get(
            entry.ref_id
          ),
          bigPlanStats: props.bigPlanStatsByRefId?.get(entry.ref_id),
          selected: props.selectedPredicate?.(entry),
          showOptions: props.showOptions,
          parent: props.entriesByRefId?.get(entry.ref_id),
          onClick: props.onClick ? () => props.onClick && props.onClick(entry) : void 0,
          onMarkDone: props.onCardMarkDone ? () => props.onCardMarkDone && props.onCardMarkDone(entry) : void 0,
          onMarkNotDone: props.onCardMarkNotDone ? () => props.onCardMarkNotDone && props.onCardMarkNotDone(entry) : void 0
        },
        `big-plan-${entry.ref_id}`,
        false,
        {
          fileName: "../core/jupiter/core/big_plans/component/stack.tsx",
          lineNumber: 38,
          columnNumber: 11
        },
        this
      );
    })
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/big_plans/component/stack.tsx",
    lineNumber: 33,
    columnNumber: 5
  }, this);
}

export {
  BigPlanDonePctTag,
  BigPlanStack
};
//# sourceMappingURL=/build/_shared/chunk-32S7BKKT.js.map
