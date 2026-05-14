import {
  inboxTaskNamespaceName
} from "/build/_shared/chunk-ZNIVMWFF.js";
import {
  emailTaskNiceName
} from "/build/_shared/chunk-BOZSZ6DZ.js";
import {
  slackTaskNiceName
} from "/build/_shared/chunk-Q4OQDEZG.js";
import {
  DifficultyTag,
  EisenTag
} from "/build/_shared/chunk-U5MVWZEK.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  InboxTaskStatusTag
} from "/build/_shared/chunk-5CBAK2HS.js";
import {
  IsKeyTag
} from "/build/_shared/chunk-NVWDLS2H.js";
import {
  isCompleted
} from "/build/_shared/chunk-4TWETDNJ.js";
import {
  ADateTag
} from "/build/_shared/chunk-NBD44M5V.js";
import {
  ClientOnly
} from "/build/_shared/chunk-Z3RPM676.js";
import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  motion,
  useMotionValue,
  useTransform
} from "/build/_shared/chunk-A6MOWSJE.js";
import {
  BIG_PLAN,
  CHORE,
  EMAIL_TASK,
  HABIT,
  JOURNAL,
  LIFE_PLAN_EVAL,
  METRIC,
  PERSON_CATCH_UP,
  PERSON_OCCASION,
  SLACK_TASK,
  TIME_PLAN,
  TODO_TASK,
  WORKING_MEM_CLEANUP,
  isWorkspaceFeatureAvailable,
  parentLinkNamespaceFromEntityLinkWire
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  CheckCircle_default,
  Delete_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Box_default,
  CardActions_default,
  CardContent_default,
  Card_default,
  Chip_default,
  IconButton_default,
  styled_default,
  useTheme
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

// ../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx
var import_webapi_client = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);

// ../core/jupiter/core/infra/component/link-tag.tsx
function LinkTag(props) {
  return /* @__PURE__ */ jsxDEV(SlimChip, { label: props.label, color: props.color, size: "small" }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/link-tag.tsx",
    lineNumber: 16,
    columnNumber: 10
  }, this);
}

// ../core/jupiter/core/big_plans/component/tag.tsx
function BigPlanTag(props) {
  return /* @__PURE__ */ jsxDEV(LinkTag, { label: props.bigPlan.name, color: "primary" }, void 0, false, {
    fileName: "../core/jupiter/core/big_plans/component/tag.tsx",
    lineNumber: 10,
    columnNumber: 10
  }, this);
}

// ../core/jupiter/core/chores/component/tag.tsx
function ChoreTag(props) {
  return /* @__PURE__ */ jsxDEV(LinkTag, { label: props.chore.name, color: "primary" }, void 0, false, {
    fileName: "../core/jupiter/core/chores/component/tag.tsx",
    lineNumber: 10,
    columnNumber: 10
  }, this);
}

// ../core/jupiter/core/push_integrations/sub/email/component/tag.tsx
function EmailTaskTag(props) {
  return /* @__PURE__ */ jsxDEV(LinkTag, { label: emailTaskNiceName(props.emailTask), color: "primary" }, void 0, false, {
    fileName: "../core/jupiter/core/push_integrations/sub/email/component/tag.tsx",
    lineNumber: 11,
    columnNumber: 10
  }, this);
}

// ../core/jupiter/core/habits/component/habit-tag.tsx
function HabitTag(props) {
  return /* @__PURE__ */ jsxDEV(LinkTag, { label: props.habit.name, color: "primary" }, void 0, false, {
    fileName: "../core/jupiter/core/habits/component/habit-tag.tsx",
    lineNumber: 10,
    columnNumber: 10
  }, this);
}

// ../core/jupiter/core/common/sub/inbox_tasks/component/namespace-tag.tsx
function InboxTaskNamespaceTag(props) {
  const tagName = inboxTaskNamespaceName(props.namespace);
  const tagClass = namespaceToClass(props.namespace);
  return /* @__PURE__ */ jsxDEV(SlimChip, { label: tagName, color: tagClass }, void 0, false, {
    fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-tag.tsx",
    lineNumber: 26,
    columnNumber: 10
  }, this);
}
function namespaceToClass(namespace) {
  switch (namespace) {
    case TODO_TASK:
      return "info";
    case WORKING_MEM_CLEANUP:
      return "warning";
    case TIME_PLAN:
      return "info";
    case HABIT:
      return "warning";
    case CHORE:
      return "warning";
    case BIG_PLAN:
      return "info";
    case JOURNAL:
      return "info";
    case METRIC:
      return "warning";
    case PERSON_OCCASION:
      return "warning";
    case PERSON_CATCH_UP:
      return "warning";
    case SLACK_TASK:
      return "error";
    case EMAIL_TASK:
      return "error";
    case LIFE_PLAN_EVAL:
      return "info";
    default:
      return "info";
  }
}

// ../core/jupiter/core/metrics/component/tag.tsx
function MetricTag(props) {
  return /* @__PURE__ */ jsxDEV(LinkTag, { label: props.metric.name, color: "primary" }, void 0, false, {
    fileName: "../core/jupiter/core/metrics/component/tag.tsx",
    lineNumber: 10,
    columnNumber: 10
  }, this);
}

// ../core/jupiter/core/common/sub/contacts/sub/contact/component/tag.tsx
function ContactTag(props) {
  return /* @__PURE__ */ jsxDEV(LinkTag, { label: props.contact.name, color: "primary" }, void 0, false, {
    fileName: "../core/jupiter/core/common/sub/contacts/sub/contact/component/tag.tsx",
    lineNumber: 10,
    columnNumber: 10
  }, this);
}

// ../core/jupiter/core/push_integrations/sub/slack/component/tag.tsx
function SlackTaskTag(props) {
  return /* @__PURE__ */ jsxDEV(LinkTag, { label: slackTaskNiceName(props.slackTask), color: "primary" }, void 0, false, {
    fileName: "../core/jupiter/core/push_integrations/sub/slack/component/tag.tsx",
    lineNumber: 11,
    columnNumber: 10
  }, this);
}

// ../core/jupiter/core/todo/components/tag.tsx
function TodoTaskTag(props) {
  return /* @__PURE__ */ jsxDEV(LinkTag, { label: props.todoTask.name, color: "primary" }, void 0, false, {
    fileName: "../core/jupiter/core/todo/components/tag.tsx",
    lineNumber: 10,
    columnNumber: 10
  }, this);
}

// ../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx
var SWIPE_THRESHOLD = 200;
var SWIPE_COMPLETE_THRESHOLD = 150;
function InboxTaskCard(props) {
  const isBigScreen = useBigScreen();
  const theme = useTheme();
  const [handlerInProgress, setHandlerInProgress] = (0, import_react.useState)(false);
  function markDoneHandler() {
    setHandlerInProgress(true);
    setTimeout(() => {
      if (props.onMarkDone) {
        props.onMarkDone(props.inboxTask);
      }
      setHandlerInProgress(false);
    }, 0);
  }
  function markNotDoneHandler() {
    setHandlerInProgress(true);
    setTimeout(() => {
      if (props.onMarkNotDone) {
        props.onMarkNotDone(props.inboxTask);
      }
      setHandlerInProgress(false);
    }, 0);
  }
  function onDragEnd(event, info) {
    if (info.offset.x < -SWIPE_COMPLETE_THRESHOLD) {
      setTimeout(() => {
        if (props.onMarkDone) {
          props.onMarkDone(props.inboxTask);
        }
      }, 0);
    } else if (info.offset.x < SWIPE_COMPLETE_THRESHOLD) {
    } else {
      setTimeout(() => {
        if (props.onMarkNotDone) {
          props.onMarkNotDone(props.inboxTask);
        }
      }, 0);
    }
  }
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-SWIPE_COMPLETE_THRESHOLD, 0, SWIPE_COMPLETE_THRESHOLD],
    [
      theme.palette.success.light,
      theme.palette.background.paper,
      theme.palette.warning.light
    ]
  );
  const inputsEnabled = props.inboxTask.archived === false && !handlerInProgress;
  const targetLink = props.linkResolver ? props.linkResolver(props.inboxTask, props.parent) : `/app/workspace/core/inbox-tasks/${props.inboxTask.ref_id}`;
  return /* @__PURE__ */ jsxDEV(
    motion.div,
    {
      drag: inputsEnabled && props.allowSwipe ? "x" : false,
      whileDrag: { scale: 1.1 },
      dragSnapToOrigin: true,
      dragElastic: 0.1,
      dragConstraints: { left: -SWIPE_THRESHOLD, right: SWIPE_THRESHOLD },
      onDragEnd,
      style: { x, background },
      animate: { opacity: 1 },
      exit: { opacity: 0, height: "0px", marginTop: "0px" },
      transition: { duration: 1 },
      children: /* @__PURE__ */ jsxDEV(
        StyledCard,
        {
          id: `inbox-task-${props.inboxTask.ref_id}`,
          isselected: (props.allowSelect && props.selected || false).toString(),
          enabled: inputsEnabled.toString(),
          onClick: () => props.onClick && props.onClick(props.inboxTask),
          children: [
            /* @__PURE__ */ jsxDEV(
              OverdueWarning,
              {
                today: props.topLevelInfo.today,
                status: props.inboxTask.status,
                dueDate: props.inboxTask.due_date
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                lineNumber: 176,
                columnNumber: 9
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              CardContent_default,
              {
                sx: {
                  paddingTop: isBigScreen ? "0.5rem" : "1rem",
                  paddingLeft: "0.5rem",
                  paddingBottom: "0.5rem"
                },
                children: [
                  /* @__PURE__ */ jsxDEV(
                    EntityLink,
                    {
                      to: targetLink,
                      block: props.onClick !== void 0,
                      inline: true,
                      children: [
                        /* @__PURE__ */ jsxDEV(IsKeyTag, { isKey: props.inboxTask.is_key }, void 0, false, {
                          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                          lineNumber: 193,
                          columnNumber: 13
                        }, this),
                        /* @__PURE__ */ jsxDEV(
                          EntityNameComponent,
                          {
                            compact: props.compact,
                            name: props.inboxTask.name
                          },
                          void 0,
                          false,
                          {
                            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                            lineNumber: 194,
                            columnNumber: 13
                          },
                          this
                        )
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                      lineNumber: 188,
                      columnNumber: 11
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(TagsContained, { children: [
                    props.showOptions.showStatus && /* @__PURE__ */ jsxDEV(
                      InboxTaskStatusTag,
                      {
                        status: props.optimisticState?.status ?? props.inboxTask.status
                      },
                      void 0,
                      false,
                      {
                        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                        lineNumber: 201,
                        columnNumber: 15
                      },
                      this
                    ),
                    props.showOptions.showSource && /* @__PURE__ */ jsxDEV(
                      InboxTaskNamespaceTag,
                      {
                        namespace: parentLinkNamespaceFromEntityLinkWire(
                          props.inboxTask.owner
                        )
                      },
                      void 0,
                      false,
                      {
                        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                        lineNumber: 206,
                        columnNumber: 15
                      },
                      this
                    ),
                    props.showOptions.showEisen && /* @__PURE__ */ jsxDEV(
                      EisenTag,
                      {
                        eisen: props.optimisticState?.eisen ?? props.inboxTask.eisen
                      },
                      void 0,
                      false,
                      {
                        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                        lineNumber: 213,
                        columnNumber: 15
                      },
                      this
                    ),
                    props.showOptions.showDifficulty && /* @__PURE__ */ jsxDEV(DifficultyTag, { difficulty: props.inboxTask.difficulty }, void 0, false, {
                      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                      lineNumber: 218,
                      columnNumber: 15
                    }, this),
                    props.showOptions.showActionableDate && props.inboxTask.actionable_date && /* @__PURE__ */ jsxDEV(
                      ADateTag,
                      {
                        label: "Actionable from",
                        date: props.inboxTask.actionable_date
                      },
                      void 0,
                      false,
                      {
                        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                        lineNumber: 222,
                        columnNumber: 17
                      },
                      this
                    ),
                    props.showOptions.showDueDate && props.inboxTask.due_date && /* @__PURE__ */ jsxDEV(ADateTag, { label: "Due at", date: props.inboxTask.due_date }, void 0, false, {
                      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                      lineNumber: 228,
                      columnNumber: 15
                    }, this),
                    props.showOptions.showParent && /* @__PURE__ */ jsxDEV(Fragment, { children: [
                      isWorkspaceFeatureAvailable(
                        props.topLevelInfo.workspace,
                        import_webapi_client.WorkspaceFeature.BIG_PLANS
                      ) && props.parent && props.parent.bigPlan && /* @__PURE__ */ jsxDEV(BigPlanTag, { bigPlan: props.parent.bigPlan }, void 0, false, {
                        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                        lineNumber: 238,
                        columnNumber: 21
                      }, this),
                      isWorkspaceFeatureAvailable(
                        props.topLevelInfo.workspace,
                        import_webapi_client.WorkspaceFeature.TODO_TASK
                      ) && props.parent && props.parent.todoTask && /* @__PURE__ */ jsxDEV(TodoTaskTag, { todoTask: props.parent.todoTask }, void 0, false, {
                        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                        lineNumber: 246,
                        columnNumber: 21
                      }, this),
                      isWorkspaceFeatureAvailable(
                        props.topLevelInfo.workspace,
                        import_webapi_client.WorkspaceFeature.HABITS
                      ) && props.parent && props.parent.habit && /* @__PURE__ */ jsxDEV(HabitTag, { habit: props.parent.habit }, void 0, false, {
                        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                        lineNumber: 254,
                        columnNumber: 21
                      }, this),
                      isWorkspaceFeatureAvailable(
                        props.topLevelInfo.workspace,
                        import_webapi_client.WorkspaceFeature.CHORES
                      ) && props.parent && props.parent.chore && /* @__PURE__ */ jsxDEV(ChoreTag, { chore: props.parent.chore }, void 0, false, {
                        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                        lineNumber: 262,
                        columnNumber: 21
                      }, this),
                      isWorkspaceFeatureAvailable(
                        props.topLevelInfo.workspace,
                        import_webapi_client.WorkspaceFeature.METRICS
                      ) && props.parent && props.parent.metric && /* @__PURE__ */ jsxDEV(MetricTag, { metric: props.parent.metric }, void 0, false, {
                        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                        lineNumber: 270,
                        columnNumber: 21
                      }, this),
                      isWorkspaceFeatureAvailable(
                        props.topLevelInfo.workspace,
                        import_webapi_client.WorkspaceFeature.PRM
                      ) && props.parent && props.parent.contact && /* @__PURE__ */ jsxDEV(
                        ContactTag,
                        {
                          contact: props.parent.contact
                        },
                        void 0,
                        false,
                        {
                          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                          lineNumber: 278,
                          columnNumber: 21
                        },
                        this
                      ),
                      isWorkspaceFeatureAvailable(
                        props.topLevelInfo.workspace,
                        import_webapi_client.WorkspaceFeature.SLACK_TASKS
                      ) && props.parent && props.parent.slackTask && /* @__PURE__ */ jsxDEV(
                        SlackTaskTag,
                        {
                          slackTask: props.parent.slackTask
                        },
                        void 0,
                        false,
                        {
                          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                          lineNumber: 288,
                          columnNumber: 21
                        },
                        this
                      ),
                      isWorkspaceFeatureAvailable(
                        props.topLevelInfo.workspace,
                        import_webapi_client.WorkspaceFeature.EMAIL_TASKS
                      ) && props.parent && props.parent.emailTask && /* @__PURE__ */ jsxDEV(
                        EmailTaskTag,
                        {
                          emailTask: props.parent.emailTask
                        },
                        void 0,
                        false,
                        {
                          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                          lineNumber: 298,
                          columnNumber: 21
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                      lineNumber: 231,
                      columnNumber: 15
                    }, this)
                  ] }, void 0, true, {
                    fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                    lineNumber: 199,
                    columnNumber: 11
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                lineNumber: 181,
                columnNumber: 9
              },
              this
            ),
            isBigScreen && (props.showOptions.showHandleMarkDone || props.showOptions.showHandleMarkNotDone) && /* @__PURE__ */ jsxDEV(
              CardActions_default,
              {
                sx: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end"
                },
                children: [
                  props.showOptions.showHandleMarkDone && /* @__PURE__ */ jsxDEV(
                    IconButton_default,
                    {
                      disabled: !inputsEnabled,
                      size: "medium",
                      color: "success",
                      onClick: markDoneHandler,
                      children: /* @__PURE__ */ jsxDEV(CheckCircle_default, { fontSize: "medium" }, void 0, false, {
                        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                        lineNumber: 323,
                        columnNumber: 19
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                      lineNumber: 317,
                      columnNumber: 17
                    },
                    this
                  ),
                  props.showOptions.showHandleMarkNotDone && /* @__PURE__ */ jsxDEV(
                    IconButton_default,
                    {
                      disabled: !inputsEnabled,
                      size: "medium",
                      color: "warning",
                      onClick: markNotDoneHandler,
                      children: /* @__PURE__ */ jsxDEV(Delete_default, { fontSize: "medium" }, void 0, false, {
                        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                        lineNumber: 333,
                        columnNumber: 19
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                      lineNumber: 327,
                      columnNumber: 17
                    },
                    this
                  )
                ]
              },
              void 0,
              true,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
                lineNumber: 309,
                columnNumber: 13
              },
              this
            )
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
          lineNumber: 170,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
      lineNumber: 158,
      columnNumber: 5
    },
    this
  );
}
var StyledCard = styled_default(Card_default)(
  ({ theme, enabled, isselected }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    touchAction: "pan-y",
    position: "relative",
    boxShadow: isselected === "true" ? `inset 0 0 4px ${theme.palette.primary.main};` : void 0,
    backgroundColor: enabled === "true" ? "transparent" : theme.palette.action.hover
  })
);
var TagsContained = styled_default(Box_default)({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "0.25rem",
  paddingTop: "0.25rem"
});
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
    fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
    lineNumber: 393,
    columnNumber: 27
  }, this), children: () => {
    if (theDueDate <= theToday.minus({ days: serviceProperties.overdueDangerDays })) {
      return /* @__PURE__ */ jsxDEV(OverdueWarningChip, { label: "Overdue", color: "error" }, void 0, false, {
        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
        lineNumber: 399,
        columnNumber: 18
      }, this);
    } else if (theDueDate <= theToday.minus({ days: serviceProperties.overdueWarningDays })) {
      return /* @__PURE__ */ jsxDEV(OverdueWarningChip, { label: "Overdue", color: "warning" }, void 0, false, {
        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
        lineNumber: 404,
        columnNumber: 18
      }, this);
    } else if (theDueDate <= theToday.minus({ days: serviceProperties.overdueInfoDays })) {
      return /* @__PURE__ */ jsxDEV(OverdueWarningChip, { label: "Overdue", color: "info" }, void 0, false, {
        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
        lineNumber: 409,
        columnNumber: 18
      }, this);
    }
    return null;
  } }, void 0, false, {
    fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/card.tsx",
    lineNumber: 393,
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

export {
  InboxTaskCard
};
//# sourceMappingURL=/build/_shared/chunk-YVDLHOTH.js.map
