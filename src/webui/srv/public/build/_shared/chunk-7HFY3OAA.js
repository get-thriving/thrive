import {
  LifePlanAssociations
} from "/build/_shared/chunk-OE7VPYTO.js";
import {
  lifePlanBirthdayDate
} from "/build/_shared/chunk-HQECWRQJ.js";
import {
  ContactsEditor
} from "/build/_shared/chunk-VGTT4RYC.js";
import {
  TagsEditor
} from "/build/_shared/chunk-FTLY2H2V.js";
import {
  entityLinkStd
} from "/build/_shared/chunk-HDJTYRJL.js";
import {
  InboxTaskStatusBigTag
} from "/build/_shared/chunk-KWDUQM3W.js";
import {
  IsKeySelect
} from "/build/_shared/chunk-SWYHSSUT.js";
import {
  DateInputWithSuggestions,
  getSuggestedDatesForTodoTaskActionableDate,
  getSuggestedDatesForTodoTaskDueDate
} from "/build/_shared/chunk-EHMNDFHW.js";
import {
  constructFieldName
} from "/build/_shared/chunk-IYE5HYO4.js";
import {
  DifficultySelect,
  EisenhowerSelect
} from "/build/_shared/chunk-T6GSSEVE.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionSingle,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  FieldError
} from "/build/_shared/chunk-ETVCQIGU.js";
import {
  isWorkspaceFeatureAvailable
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  Launch_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
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
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/todo/components/properties-editor.tsx
var import_webapi_client = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);
function TodoTaskPropertiesEditor(props) {
  const birthdayDate = props.lifePlan ? lifePlanBirthdayDate(props.lifePlan) : null;
  const [selectedAspectRefId, setSelectedAspectRefId] = (0, import_react.useState)(
    props.todoTask.aspect_ref_id
  );
  const isBigScreen = useBigScreen();
  return /* @__PURE__ */ jsxDEV(
    SectionCard,
    {
      title: props.title,
      actions: /* @__PURE__ */ jsxDEV(
        SectionActions,
        {
          id: "todo-update",
          topLevelInfo: props.topLevelInfo,
          inputsEnabled: props.inputsEnabled,
          actions: [
            ActionSingle({
              id: "todo-update",
              text: "Save",
              value: constructIntentName(props.intentPrefix, "update"),
              highlight: true
            })
          ],
          extraActions: props.showLinkToTodoTask ? [
            NavSingle({
              text: "Todo Task",
              link: `/app/workspace/todos/${props.todoTask.ref_id}`,
              icon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 112,
                columnNumber: 27
              }, this)
            })
          ] : void 0
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
          lineNumber: 94,
          columnNumber: 9
        },
        this
      ),
      children: [
        /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: [
          /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", useFlexGap: true, spacing: 1, children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "hidden",
                name: constructFieldName(props.namePrefix, "refId"),
                value: props.todoTask.ref_id
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 122,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: { flexGrow: 3 }, children: [
              /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 128,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(
                OutlinedInput_default,
                {
                  label: "name",
                  name: constructFieldName(props.namePrefix, "name"),
                  readOnly: !props.inputsEnabled,
                  disabled: !props.inputsEnabled,
                  defaultValue: props.todoTask.name
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                  lineNumber: 129,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(FieldError, { actionResult: props.actionData, fieldName: "/name" }, void 0, false, {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 136,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
              lineNumber: 127,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(FormControl_default, { sx: { flexGrow: 1, minWidth: "unset" }, children: [
              /* @__PURE__ */ jsxDEV(InboxTaskStatusBigTag, { status: props.inboxTask.status }, void 0, false, {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 140,
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
                  fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                  lineNumber: 141,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(FieldError, { actionResult: props.actionData, fieldName: "/status" }, void 0, false, {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 146,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
              lineNumber: 139,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(FormControl_default, { sx: { flexGrow: 1 }, children: [
              /* @__PURE__ */ jsxDEV(
                IsKeySelect,
                {
                  name: constructFieldName(props.namePrefix, "isKey"),
                  defaultValue: props.inboxTask.is_key,
                  inputsEnabled: props.inputsEnabled
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                  lineNumber: 150,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(FieldError, { actionResult: props.actionData, fieldName: "/is_key" }, void 0, false, {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 155,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
              lineNumber: 149,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
            lineNumber: 121,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(
            Stack_default,
            {
              direction: isBigScreen ? "row" : "column",
              useFlexGap: true,
              spacing: 1,
              children: [
                /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: { flexGrow: 2 }, children: [
                  /* @__PURE__ */ jsxDEV(
                    TagsEditor,
                    {
                      name: "tags",
                      aloneOnLine: true,
                      allTags: props.allTags,
                      defaultValue: props.tags.map((tag) => tag.ref_id),
                      inputsEnabled: props.inputsEnabled,
                      owner: entityLinkStd(
                        import_webapi_client.NamedEntityTag.TODO_TASK,
                        props.todoTask.ref_id
                      )
                    },
                    void 0,
                    false,
                    {
                      fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                      lineNumber: 165,
                      columnNumber: 13
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    FieldError,
                    {
                      actionResult: props.actionData,
                      fieldName: "/tags_names"
                    },
                    void 0,
                    false,
                    {
                      fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                      lineNumber: 176,
                      columnNumber: 13
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                  lineNumber: 164,
                  columnNumber: 11
                }, this),
                /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: { flexGrow: 2 }, children: [
                  /* @__PURE__ */ jsxDEV(
                    ContactsEditor,
                    {
                      name: "contacts_names",
                      aloneOnLine: true,
                      allContacts: props.allContacts,
                      defaultValue: props.contacts.map((contact) => contact.ref_id),
                      inputsEnabled: props.inputsEnabled,
                      owner: entityLinkStd(
                        import_webapi_client.NamedEntityTag.TODO_TASK,
                        props.todoTask.ref_id
                      )
                    },
                    void 0,
                    false,
                    {
                      fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                      lineNumber: 183,
                      columnNumber: 13
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    FieldError,
                    {
                      actionResult: props.actionData,
                      fieldName: "/contacts_names"
                    },
                    void 0,
                    false,
                    {
                      fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                      lineNumber: 194,
                      columnNumber: 13
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                  lineNumber: 182,
                  columnNumber: 11
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
              lineNumber: 159,
              columnNumber: 9
            },
            this
          ),
          isWorkspaceFeatureAvailable(
            props.topLevelInfo.workspace,
            import_webapi_client.WorkspaceFeature.LIFE_PLAN
          ) && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(
              LifePlanAssociations,
              {
                inputsEnabled: props.inputsEnabled,
                aspectName: constructFieldName(props.namePrefix, "aspect"),
                chapterName: constructFieldName(props.namePrefix, "chapter"),
                goalName: constructFieldName(props.namePrefix, "goal"),
                allAspects: props.allAspects,
                aspectValue: selectedAspectRefId,
                onAspectChange: setSelectedAspectRefId,
                aspectDefaultValue: props.todoTask.aspect_ref_id,
                allChapters: props.allChapters,
                chapterDefaultValue: props.todoTask.chapter_ref_id,
                allGoals: props.allGoals,
                goalDefaultValue: props.todoTask.goal_ref_id,
                birthday: birthdayDate,
                today: aDateToDate(props.topLevelInfo.today),
                allMilestones: props.allMilestones
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 206,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: "/aspect_ref_id"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 223,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: "/chapter_ref_id"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 227,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: "/goal_ref_id"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 231,
                columnNumber: 13
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
            lineNumber: 205,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "eisen", children: "Eisenhower" }, void 0, false, {
              fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
              lineNumber: 239,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              EisenhowerSelect,
              {
                name: constructFieldName(props.namePrefix, "eisen"),
                defaultValue: props.inboxTask.eisen,
                inputsEnabled: props.inputsEnabled
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 240,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: props.actionData, fieldName: "/eisen" }, void 0, false, {
              fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
              lineNumber: 245,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
            lineNumber: 238,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "difficulty", children: "Difficulty" }, void 0, false, {
              fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
              lineNumber: 249,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              DifficultySelect,
              {
                name: constructFieldName(props.namePrefix, "difficulty"),
                defaultValue: props.inboxTask.difficulty,
                inputsEnabled: props.inputsEnabled
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 250,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: props.actionData, fieldName: "/difficulty" }, void 0, false, {
              fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
              lineNumber: 255,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
            lineNumber: 248,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "actionableDate", shrink: true, margin: "dense", children: "Actionable From [Optional]" }, void 0, false, {
              fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
              lineNumber: 259,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              DateInputWithSuggestions,
              {
                name: constructFieldName(props.namePrefix, "actionableDate"),
                label: "actionableDate",
                inputsEnabled: props.inputsEnabled,
                defaultValue: props.inboxTask.actionable_date ?? void 0,
                suggestedDates: getSuggestedDatesForTodoTaskActionableDate(
                  props.topLevelInfo.today
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 262,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: "/actionable_date"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 271,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
            lineNumber: 258,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "dueDate", shrink: true, margin: "dense", children: "Due Date [Optional]" }, void 0, false, {
              fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
              lineNumber: 278,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              DateInputWithSuggestions,
              {
                name: constructFieldName(props.namePrefix, "dueDate"),
                label: "dueDate",
                inputsEnabled: props.inputsEnabled,
                defaultValue: props.inboxTask.due_date ?? void 0,
                suggestedDates: getSuggestedDatesForTodoTaskDueDate(
                  props.topLevelInfo.today
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 281,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: props.actionData, fieldName: "/due_date" }, void 0, false, {
              fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
              lineNumber: 290,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
            lineNumber: 277,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
          lineNumber: 120,
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 298,
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 308,
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 318,
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 328,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
            lineNumber: 297,
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 343,
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 353,
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 363,
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 373,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
            lineNumber: 342,
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 388,
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 398,
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 408,
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 418,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
            lineNumber: 387,
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
              fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
              lineNumber: 434,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
            lineNumber: 433,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: [
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 448,
                columnNumber: 13
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 458,
                columnNumber: 13
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
                fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
                lineNumber: 468,
                columnNumber: 13
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
            lineNumber: 447,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
          lineNumber: 295,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
          lineNumber: 294,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "../core/jupiter/core/todo/components/properties-editor.tsx",
      lineNumber: 91,
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
  TodoTaskPropertiesEditor
};
//# sourceMappingURL=/build/_shared/chunk-7HFY3OAA.js.map
