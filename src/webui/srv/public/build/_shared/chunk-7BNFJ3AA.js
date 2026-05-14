import {
  InboxTaskStatusBigTag
} from "/build/_shared/chunk-KWDUQM3W.js";
import {
  IsKeySelect
} from "/build/_shared/chunk-SWYHSSUT.js";
import {
  DateInputWithSuggestions,
  getSuggestedDatesForInboxTaskActionableDate,
  getSuggestedDatesForInboxTaskDueDate
} from "/build/_shared/chunk-EHMNDFHW.js";
import {
  constructFieldErrorName,
  constructFieldName
} from "/build/_shared/chunk-IYE5HYO4.js";
import {
  DifficultySelect,
  EisenhowerSelect
} from "/build/_shared/chunk-T6GSSEVE.js";
import {
  isInboxTaskCoreFieldEditable
} from "/build/_shared/chunk-RTB3GZDR.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionSingle,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  FieldError
} from "/build/_shared/chunk-ETVCQIGU.js";
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
  Launch_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Box_default,
  ButtonGroup_default,
  Button_default,
  CardActions_default,
  FormControl_default,
  FormLabel_default,
  InputLabel_default,
  OutlinedInput_default,
  Stack_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  Link
} from "/build/_shared/chunk-VVGD4GL7.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx
var import_webapi_client = __toESM(require_dist(), 1);

// ../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx
function InboxTaskNamespaceLink(props) {
  const isBigScreen = useBigScreen();
  const ns = parentLinkNamespaceFromEntityLinkWire(
    props.inboxTaskResult.inbox_task.owner
  );
  switch (ns) {
    case WORKING_MEM_CLEANUP: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
            lineNumber: 38,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/working-mem`,
          sx: { flexGrow: 1 },
          children: isBigScreen ? "Working Mem" : "WM"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
          lineNumber: 37,
          columnNumber: 9
        },
        this
      );
    }
    case TIME_PLAN: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
            lineNumber: 53,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/time-plans/${props.inboxTaskResult.time_plan?.ref_id}`,
          sx: { flexGrow: 1 },
          children: isBigScreen ? "Time Plan" : "TP"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
          lineNumber: 52,
          columnNumber: 9
        },
        this
      );
    }
    case HABIT: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
            lineNumber: 68,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/habits/${props.inboxTaskResult.habit?.ref_id}`,
          sx: { flexGrow: 1 },
          children: isBigScreen ? "Habit" : "H"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
          lineNumber: 67,
          columnNumber: 9
        },
        this
      );
    }
    case CHORE: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
            lineNumber: 83,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/chores/${props.inboxTaskResult.chore?.ref_id}`,
          sx: { flexGrow: 1 },
          children: isBigScreen ? "Chore" : "C"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
          lineNumber: 82,
          columnNumber: 9
        },
        this
      );
    }
    case BIG_PLAN: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
            lineNumber: 98,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/big-plans/${props.inboxTaskResult.big_plan?.ref_id}`,
          sx: {
            flexGrow: 1,
            width: "2rem",
            minWidth: "unset",
            paddingRight: "3px"
          }
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
          lineNumber: 97,
          columnNumber: 9
        },
        this
      );
    }
    case JOURNAL: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
            lineNumber: 116,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/journals/${props.inboxTaskResult.journal?.ref_id}`,
          sx: { flexGrow: 1 },
          children: isBigScreen ? "Journal" : "J"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
          lineNumber: 115,
          columnNumber: 9
        },
        this
      );
    }
    case METRIC: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
            lineNumber: 131,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/metrics/${props.inboxTaskResult.metric?.ref_id}/details`,
          sx: { flexGrow: 1 },
          children: isBigScreen ? "Metric" : "M"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
          lineNumber: 130,
          columnNumber: 9
        },
        this
      );
    }
    case PERSON_CATCH_UP: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
            lineNumber: 146,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/prm/persons/${props.inboxTaskResult.person?.ref_id}`,
          sx: { flexGrow: 1 },
          children: isBigScreen ? "Person" : "P"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
          lineNumber: 145,
          columnNumber: 9
        },
        this
      );
    }
    case PERSON_OCCASION: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
            lineNumber: 161,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/prm/persons/${props.inboxTaskResult.person?.ref_id}/occasions/${props.inboxTaskResult.occasion?.ref_id}`,
          sx: { flexGrow: 1 },
          children: isBigScreen ? "Occasion" : "O"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
          lineNumber: 160,
          columnNumber: 9
        },
        this
      );
    }
    case SLACK_TASK: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
            lineNumber: 176,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/push-integration/slack-tasks/${props.inboxTaskResult.slack_task?.ref_id}`,
          sx: { flexGrow: 1 },
          children: isBigScreen ? "Slack Task" : "ST"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
          lineNumber: 175,
          columnNumber: 9
        },
        this
      );
    }
    case EMAIL_TASK: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
            lineNumber: 191,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/push-integration/email-tasks/${props.inboxTaskResult.email_task?.ref_id}`,
          sx: { flexGrow: 1 },
          children: isBigScreen ? "Email Task" : "ET"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
          lineNumber: 190,
          columnNumber: 9
        },
        this
      );
    }
    case TODO_TASK: {
      if (!props.inboxTaskResult.todo_task) {
        return null;
      }
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
            lineNumber: 209,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/todos/${props.inboxTaskResult.todo_task.ref_id}`,
          sx: { flexGrow: 1 },
          children: isBigScreen ? "Todo Task" : "TT"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
          lineNumber: 208,
          columnNumber: 9
        },
        this
      );
    }
    case LIFE_PLAN_EVAL: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
            lineNumber: 224,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/life-plan}`,
          children: isBigScreen ? "Life Plan Eval" : "LPE"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/namespace-link.tsx",
          lineNumber: 223,
          columnNumber: 9
        },
        this
      );
    }
    default: {
      return null;
    }
  }
}

// ../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx
function InboxTaskPropertiesEditor(props) {
  const ownerPln = parentLinkNamespaceFromEntityLinkWire(props.inboxTask.owner);
  const corePropertyEditable = isInboxTaskCoreFieldEditable(ownerPln);
  return /* @__PURE__ */ jsxDEV(
    SectionCard,
    {
      title: props.title,
      actions: /* @__PURE__ */ jsxDEV(
        SectionActions,
        {
          id: "inbox-task-editor",
          topLevelInfo: props.topLevelInfo,
          inputsEnabled: props.inputsEnabled,
          actions: props.showLinkToInboxTask ? [
            NavSingle({
              text: "Inbox Task",
              icon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 77,
                columnNumber: 27
              }, this),
              link: `/app/workspace/core/inbox-tasks/${props.inboxTask.ref_id}`
            }),
            ActionSingle({
              id: "inbox-task-editor-save",
              text: "Save",
              value: constructIntentName(props.intentPrefix, "update"),
              highlight: true
            })
          ] : [
            ActionSingle({
              id: "inbox-task-editor-save",
              text: "Save",
              value: constructIntentName(props.intentPrefix, "update"),
              highlight: true
            })
          ]
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
          lineNumber: 68,
          columnNumber: 9
        },
        this
      ),
      children: [
        /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: [
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { display: "flex", flexDirection: "row", gap: "0.25rem" }, children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "hidden",
                name: constructFieldName(props.namePrefix, "refId"),
                value: props.inboxTask.ref_id
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 101,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(FormControl_default, { sx: { flexGrow: 3 }, children: [
              /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 107,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(
                OutlinedInput_default,
                {
                  label: "Name",
                  name: constructFieldName(props.namePrefix, "name"),
                  readOnly: !props.inputsEnabled || !corePropertyEditable,
                  defaultValue: props.inboxTask.name
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                  lineNumber: 108,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                FieldError,
                {
                  actionResult: props.actionData,
                  fieldName: constructFieldErrorName(props.fieldsPrefix, "name")
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                  lineNumber: 114,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "hidden",
                  name: constructFieldName(props.namePrefix, "namespace"),
                  value: ownerPln
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                  lineNumber: 118,
                  columnNumber: 13
                },
                this
              )
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
              lineNumber: 106,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(FormControl_default, { sx: { flexGrow: 1 }, children: /* @__PURE__ */ jsxDEV(
              IsKeySelect,
              {
                name: constructFieldName(props.namePrefix, "isKey"),
                defaultValue: props.inboxTask.is_key,
                inputsEnabled: props.inputsEnabled && corePropertyEditable
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 126,
                columnNumber: 13
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
              lineNumber: 125,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
            lineNumber: 100,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", useFlexGap: true, spacing: 1, children: [
            /* @__PURE__ */ jsxDEV(FormControl_default, { sx: { flexGrow: 1, minWidth: "unset" }, children: [
              /* @__PURE__ */ jsxDEV(InboxTaskStatusBigTag, { status: props.inboxTask.status }, void 0, false, {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 136,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "hidden",
                  name: constructFieldName(props.namePrefix, "status"),
                  value: props.inboxTask.status
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                  lineNumber: 137,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                FieldError,
                {
                  actionResult: props.actionData,
                  fieldName: constructFieldErrorName(props.fieldsPrefix, "status")
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                  lineNumber: 142,
                  columnNumber: 13
                },
                this
              )
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
              lineNumber: 135,
              columnNumber: 11
            }, this),
            isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              import_webapi_client.WorkspaceFeature.BIG_PLANS
            ) && ownerPln === BIG_PLAN && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
              /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "bigPlan", shrink: true, children: "Big Plan" }, void 0, false, {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 154,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                OutlinedInput_default,
                {
                  label: "Big Plan",
                  readOnly: true,
                  value: props.inboxTaskInfo.big_plan?.name ?? "Unknown"
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                  lineNumber: 157,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
              lineNumber: 153,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(InboxTaskNamespaceLink, { inboxTaskResult: props.inboxTaskInfo }, void 0, false, {
              fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
              lineNumber: 165,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
            lineNumber: 134,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "eisen", children: "Eisenhower" }, void 0, false, {
              fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
              lineNumber: 169,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              EisenhowerSelect,
              {
                name: constructFieldName(props.namePrefix, "eisen"),
                inputsEnabled: props.inputsEnabled && corePropertyEditable,
                defaultValue: props.inboxTask.eisen
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 170,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(props.fieldsPrefix, "eisen")
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 175,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
            lineNumber: 168,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "difficulty", children: "Difficulty" }, void 0, false, {
              fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
              lineNumber: 182,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              DifficultySelect,
              {
                name: constructFieldName(props.namePrefix, "difficulty"),
                inputsEnabled: props.inputsEnabled && corePropertyEditable,
                defaultValue: props.inboxTask.difficulty
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 183,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(
                  props.fieldsPrefix,
                  "difficulty"
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 188,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
            lineNumber: 181,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "actionableDate", shrink: true, children: [
              "Actionable From ",
              corePropertyEditable ? "[Optional]" : ""
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
              lineNumber: 198,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              DateInputWithSuggestions,
              {
                name: constructFieldName(props.namePrefix, "actionableDate"),
                label: "actionableDate",
                inputsEnabled: props.inputsEnabled && corePropertyEditable,
                defaultValue: props.inboxTask.actionable_date,
                suggestedDates: getSuggestedDatesForInboxTaskActionableDate(
                  props.topLevelInfo.today,
                  props.inboxTaskInfo.big_plan,
                  props.inboxTaskInfo.time_plan
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 201,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(
                  props.fieldsPrefix,
                  "actionable_date"
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 213,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
            lineNumber: 197,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "dueDate", shrink: true, margin: "dense", children: [
              "Due At ",
              corePropertyEditable ? "[Optional]" : ""
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
              lineNumber: 223,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              DateInputWithSuggestions,
              {
                name: constructFieldName(props.namePrefix, "dueDate"),
                label: "dueDate",
                inputsEnabled: props.inputsEnabled && corePropertyEditable,
                defaultValue: props.inboxTask.due_date,
                suggestedDates: getSuggestedDatesForInboxTaskDueDate(
                  props.topLevelInfo.today,
                  props.inboxTaskInfo.big_plan,
                  props.inboxTaskInfo.time_plan
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 226,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(props.fieldsPrefix, "due_date")
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 238,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
            lineNumber: 222,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
          lineNumber: 99,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(CardActions_default, { sx: { paddingLeft: "0px", paddingRight: "0px" }, children: /* @__PURE__ */ jsxDEV(Stack_default, { direction: "column", spacing: 1, sx: { width: "100%" }, children: [
          props.inboxTask.status === import_webapi_client.InboxTaskStatus.NOT_STARTED && /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "contained",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "mark-done"),
                children: "Mark Done"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 249,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "outlined",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "mark-not-done"),
                children: "Mark Not Done"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 259,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "outlined",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "start"),
                children: "Start"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 269,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "outlined",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "block"),
                children: "Block"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 279,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
            lineNumber: 248,
            columnNumber: 13
          }, this),
          props.inboxTask.status === import_webapi_client.InboxTaskStatus.IN_PROGRESS && /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "contained",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "mark-done"),
                children: "Mark Done"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 294,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "outlined",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "mark-not-done"),
                children: "Mark Not Done"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 304,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "outlined",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "block"),
                children: "Block"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 314,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "outlined",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "stop"),
                children: "Stop"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 324,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
            lineNumber: 293,
            columnNumber: 13
          }, this),
          props.inboxTask.status === import_webapi_client.InboxTaskStatus.BLOCKED && /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "contained",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "mark-done"),
                children: "Mark Done"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 339,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "outlined",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "mark-not-done"),
                children: "Mark Not Done"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 349,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "outlined",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "restart"),
                children: "Restart"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 359,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "outlined",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "stop"),
                children: "Stop"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 369,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
            lineNumber: 338,
            columnNumber: 13
          }, this),
          (props.inboxTask.status === import_webapi_client.InboxTaskStatus.DONE || props.inboxTask.status === import_webapi_client.InboxTaskStatus.NOT_DONE) && /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: /* @__PURE__ */ jsxDEV(
            Button_default,
            {
              size: "small",
              variant: "outlined",
              disabled: !props.inputsEnabled,
              type: "submit",
              name: "intent",
              value: constructIntentName(props.intentPrefix, "reactivate"),
              children: "Reactivate"
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
              lineNumber: 385,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
            lineNumber: 384,
            columnNumber: 13
          }, this),
          corePropertyEditable && /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "outlined",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "delay-1-day"),
                children: "Delay by 1 Day"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 400,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "outlined",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "delay-1-week"),
                children: "Delay by 1 Week"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 410,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                size: "small",
                variant: "outlined",
                disabled: !props.inputsEnabled,
                type: "submit",
                name: "intent",
                value: constructIntentName(props.intentPrefix, "delay-1-month"),
                children: "Delay by 1 Month"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
                lineNumber: 420,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
            lineNumber: 399,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
          lineNumber: 246,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
          lineNumber: 245,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/properties-editor.tsx",
      lineNumber: 65,
      columnNumber: 5
    },
    this
  );
}
function constructIntentName(intentPrefix, intent) {
  if (!intentPrefix) {
    return intent;
  }
  return `${intentPrefix}-${intent}`;
}

export {
  InboxTaskPropertiesEditor
};
//# sourceMappingURL=/build/_shared/chunk-7BNFJ3AA.js.map
