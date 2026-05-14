import {
  LifePlanAssociations
} from "/build/_shared/chunk-OE7VPYTO.js";
import {
  findActiveChaptersForSuggestions
} from "/build/_shared/chunk-ZFN6H2GY.js";
import {
  lifePlanBirthdayDate
} from "/build/_shared/chunk-HQECWRQJ.js";
import {
  bigPlanDonePct
} from "/build/_shared/chunk-K2HUSH5I.js";
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
  IsKeySelect
} from "/build/_shared/chunk-SWYHSSUT.js";
import {
  DateInputWithSuggestions,
  getSuggestedDatesForBigPlanActionableDate,
  getSuggestedDatesForBigPlanDueDate
} from "/build/_shared/chunk-EHMNDFHW.js";
import {
  bigPlanStatusIcon,
  bigPlanStatusName
} from "/build/_shared/chunk-P7WFXMQY.js";
import {
  constructFieldErrorName,
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
  Box_default,
  ButtonGroup_default,
  Button_default,
  CardActions_default,
  FormControl_default,
  FormLabel_default,
  InputLabel_default,
  OutlinedInput_default,
  Stack_default,
  useTheme
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

// ../core/jupiter/core/big_plans/component/properties-editor.tsx
var import_webapi_client = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);

// ../core/jupiter/core/big_plans/component/status-big-tag.tsx
function BigPlanStatusBigTag(props) {
  const isBigScreen = useBigScreen();
  const tagName = bigPlanStatusName(props.status);
  const theme = useTheme();
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        display: "flex",
        flexWrap: "wrap",
        alignContent: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        borderRadius: "5px",
        padding: "0.5rem",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        height: "100%"
      },
      children: isBigScreen ? tagName : bigPlanStatusIcon(props.status)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/big_plans/component/status-big-tag.tsx",
      lineNumber: 17,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/big_plans/component/done-pct-big-tag.tsx
function BigPlanDonePctBigTag(props) {
  const theme = useTheme();
  const milestonePlural = props.milestonesLeft === 1 ? "milestone" : "milestones";
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        display: "flex",
        flexWrap: "wrap",
        alignContent: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        borderRadius: "5px",
        padding: "0.5rem",
        backgroundColor: theme.palette.grey[500],
        color: theme.palette.primary.contrastText,
        height: "100%"
      },
      children: [
        "Done ",
        props.donePct,
        "%",
        props.shouldShowMilestonesLeft && props.milestonesLeft > 0 && ` (${props.milestonesLeft} ${milestonePlural} left)`
      ]
    },
    void 0,
    true,
    {
      fileName: "../core/jupiter/core/big_plans/component/done-pct-big-tag.tsx",
      lineNumber: 16,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/big_plans/component/properties-editor.tsx
function BigPlanPropertiesEditor(props) {
  const milestonesLeft = props.bigPlanInfo.milestones.filter(
    (m) => aDateToDate(m.date) > aDateToDate(props.topLevelInfo.today)
  ).length;
  const birthday = props.lifePlan ? lifePlanBirthdayDate(props.lifePlan) : null;
  const today = aDateToDate(props.topLevelInfo.today);
  const [selectedAspectRefId, setSelectedAspectRefId] = (0, import_react.useState)(
    props.bigPlanInfo.aspect?.ref_id ?? ""
  );
  const chaptersForSuggestions = (0, import_react.useMemo)(
    () => birthday ? findActiveChaptersForSuggestions(
      props.allChapters.filter(
        (chapter) => chapter.aspect_ref_id === selectedAspectRefId
      ),
      birthday,
      today,
      props.allMilestones
    ) : [],
    [
      props.allChapters,
      props.allMilestones,
      selectedAspectRefId,
      birthday,
      today
    ]
  );
  const actions = [];
  if (props.showLinkToBigPlan) {
    actions.push(
      NavSingle({
        text: "Big Plan",
        icon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
          fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
          lineNumber: 123,
          columnNumber: 15
        }, this),
        link: `/app/workspace/big-plans/${props.bigPlan.ref_id}`
      })
    );
  }
  actions.push(
    ActionSingle({
      id: "big-plan-editor-save",
      text: "Save",
      value: constructIntentName(props.intentPrefix, "update"),
      highlight: true
    })
  );
  if (props.showRefreshStats) {
    actions.push(
      ActionSingle({
        text: "Refresh Stats",
        value: constructIntentName(props.intentPrefix, "refresh-stats")
      })
    );
  }
  return /* @__PURE__ */ jsxDEV(
    SectionCard,
    {
      title: props.title,
      actions: /* @__PURE__ */ jsxDEV(
        SectionActions,
        {
          id: "big-plan-editor",
          topLevelInfo: props.topLevelInfo,
          inputsEnabled: props.inputsEnabled,
          actions
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
          lineNumber: 149,
          columnNumber: 9
        },
        this
      ),
      children: [
        /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "hidden",
              name: constructFieldName(props.namePrefix, "refId"),
              value: props.bigPlan.ref_id
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
              lineNumber: 158,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", spacing: 1, children: [
            /* @__PURE__ */ jsxDEV(FormControl_default, { sx: { flexGrow: 3 }, children: [
              /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 166,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(
                OutlinedInput_default,
                {
                  label: "Name",
                  name: constructFieldName(props.namePrefix, "name"),
                  readOnly: !props.inputsEnabled,
                  defaultValue: props.bigPlan.name
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                  lineNumber: 167,
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
                  fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                  lineNumber: 173,
                  columnNumber: 13
                },
                this
              )
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
              lineNumber: 165,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(FormControl_default, { sx: { flexGrow: 1 }, children: /* @__PURE__ */ jsxDEV(
              IsKeySelect,
              {
                name: constructFieldName(props.namePrefix, "isKey"),
                defaultValue: props.bigPlan.is_key,
                inputsEnabled: props.inputsEnabled
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 180,
                columnNumber: 13
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
              lineNumber: 179,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
            lineNumber: 164,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", useFlexGap: true, spacing: 1, children: [
            props.allTags && props.tags && /* @__PURE__ */ jsxDEV(FormControl_default, { sx: { flexGrow: 2 }, children: /* @__PURE__ */ jsxDEV(
              TagsEditor,
              {
                name: "tags",
                aloneOnLine: true,
                allTags: props.allTags,
                defaultValue: props.tags.map((tag) => tag.ref_id),
                inputsEnabled: props.inputsEnabled,
                owner: entityLinkStd(
                  import_webapi_client.NamedEntityTag.BIG_PLAN,
                  props.bigPlan.ref_id
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 191,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
              lineNumber: 190,
              columnNumber: 13
            }, this),
            props.allContacts && props.contacts && /* @__PURE__ */ jsxDEV(FormControl_default, { sx: { flexGrow: 2 }, children: /* @__PURE__ */ jsxDEV(
              ContactsEditor,
              {
                name: "contacts_names",
                aloneOnLine: true,
                allContacts: props.allContacts,
                defaultValue: props.contacts.map((contact) => contact.ref_id),
                inputsEnabled: props.inputsEnabled,
                owner: entityLinkStd(
                  import_webapi_client.NamedEntityTag.BIG_PLAN,
                  props.bigPlan.ref_id
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 207,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
              lineNumber: 206,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
            lineNumber: 188,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", spacing: 2, children: [
            /* @__PURE__ */ jsxDEV(FormControl_default, { sx: { flexGrow: 1 }, children: [
              /* @__PURE__ */ jsxDEV(BigPlanStatusBigTag, { status: props.bigPlan.status }, void 0, false, {
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 224,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "hidden",
                  name: constructFieldName(props.namePrefix, "status"),
                  value: props.bigPlan.status
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                  lineNumber: 225,
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
                  fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                  lineNumber: 230,
                  columnNumber: 13
                },
                this
              )
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
              lineNumber: 223,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(FormControl_default, { sx: { flexGrow: 1 }, children: /* @__PURE__ */ jsxDEV(
              BigPlanDonePctBigTag,
              {
                donePct: bigPlanDonePct(props.bigPlan, props.bigPlanInfo.stats),
                shouldShowMilestonesLeft: props.bigPlanInfo.milestones.length > 0,
                milestonesLeft
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 237,
                columnNumber: 13
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
              lineNumber: 236,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
            lineNumber: 222,
            columnNumber: 9
          }, this),
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
                aspectDefaultValue: props.bigPlanInfo.aspect?.ref_id ?? "",
                allChapters: props.allChapters,
                chapterDefaultValue: props.bigPlanInfo.chapter?.ref_id,
                allGoals: props.allGoals,
                goalDefaultValue: props.bigPlanInfo.goal?.ref_id,
                birthday,
                today: aDateToDate(props.topLevelInfo.today),
                allMilestones: props.allMilestones
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 250,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(
                  props.fieldsPrefix,
                  "aspect_ref_id"
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 267,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(
                  props.fieldsPrefix,
                  "chapter_ref_id"
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 274,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(
                  props.fieldsPrefix,
                  "goal_ref_id"
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 281,
                columnNumber: 13
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
            lineNumber: 249,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "eisen", children: "Eisenhower" }, void 0, false, {
              fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
              lineNumber: 292,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              EisenhowerSelect,
              {
                name: constructFieldName(props.namePrefix, "eisen"),
                inputsEnabled: props.inputsEnabled,
                defaultValue: props.bigPlan.eisen
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 293,
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 298,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
            lineNumber: 291,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "difficulty", children: "Difficulty" }, void 0, false, {
              fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
              lineNumber: 305,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              DifficultySelect,
              {
                name: constructFieldName(props.namePrefix, "difficulty"),
                inputsEnabled: props.inputsEnabled,
                defaultValue: props.bigPlan.difficulty
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 306,
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 311,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
            lineNumber: 304,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "actionableDate", shrink: true, children: "Actionable From [Optional]" }, void 0, false, {
              fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
              lineNumber: 321,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              DateInputWithSuggestions,
              {
                name: constructFieldName(props.namePrefix, "actionableDate"),
                label: "actionableDate",
                inputsEnabled: props.inputsEnabled,
                defaultValue: props.bigPlan.actionable_date,
                suggestedDates: getSuggestedDatesForBigPlanActionableDate(
                  props.topLevelInfo.today,
                  void 0,
                  chaptersForSuggestions
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 324,
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 335,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
            lineNumber: 320,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "dueDate", shrink: true, children: "Due At [Optional]" }, void 0, false, {
              fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
              lineNumber: 345,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              DateInputWithSuggestions,
              {
                name: constructFieldName(props.namePrefix, "dueDate"),
                label: "dueDate",
                inputsEnabled: props.inputsEnabled,
                defaultValue: props.bigPlan.due_date,
                suggestedDates: getSuggestedDatesForBigPlanDueDate(
                  props.topLevelInfo.today,
                  void 0,
                  chaptersForSuggestions
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 348,
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 359,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
            lineNumber: 344,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
          lineNumber: 157,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(CardActions_default, { sx: { paddingLeft: "0px", paddingRight: "0px" }, children: /* @__PURE__ */ jsxDEV(Stack_default, { direction: "column", spacing: 1, sx: { width: "100%" }, children: [
          props.bigPlan.status === import_webapi_client.BigPlanStatus.NOT_STARTED && /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: [
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 370,
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 380,
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 390,
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 400,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
            lineNumber: 369,
            columnNumber: 13
          }, this),
          props.bigPlan.status === import_webapi_client.BigPlanStatus.IN_PROGRESS && /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: [
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 415,
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 425,
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 435,
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 445,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
            lineNumber: 414,
            columnNumber: 13
          }, this),
          props.bigPlan.status === import_webapi_client.BigPlanStatus.BLOCKED && /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: [
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 460,
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 470,
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 480,
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
                fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
                lineNumber: 490,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
            lineNumber: 459,
            columnNumber: 13
          }, this),
          (props.bigPlan.status === import_webapi_client.BigPlanStatus.DONE || props.bigPlan.status === import_webapi_client.BigPlanStatus.NOT_DONE) && /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: /* @__PURE__ */ jsxDEV(
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
              fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
              lineNumber: 506,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
            lineNumber: 505,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
          lineNumber: 367,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
          lineNumber: 366,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "../core/jupiter/core/big_plans/component/properties-editor.tsx",
      lineNumber: 146,
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
  BigPlanPropertiesEditor
};
//# sourceMappingURL=/build/_shared/chunk-4DXHJQZK.js.map
