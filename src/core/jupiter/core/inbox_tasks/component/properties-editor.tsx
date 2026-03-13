import type {
  BigPlanSummary,
  ChapterSummary,
  GoalSummary,
  InboxTask,
  InboxTaskLoadResult,
  LifePlan,
  MilestoneSummary,
  AspectSummary,
  Tag,
  Contact,
} from "@jupiter/webapi-client";
import {
  InboxTaskSource,
  InboxTaskStatus,
  TagNamespace,
  ContactNamespace,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { Launch as LaunchIcon } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  CardActions,
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import { autocompleteSingleLineSx } from "#/core/common/component/autocomplete-sx";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { isInboxTaskCoreFieldEditable } from "#/core/inbox_tasks/root";
import {
  getSuggestedDatesForInboxTaskActionableDate,
  getSuggestedDatesForInboxTaskDueDate,
} from "#/core/common/suggested-date";
import type { SomeErrorNoData } from "#/core/infra/action-result";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { DifficultySelect } from "#/core/common/component/difficulty-select";
import { EisenhowerSelect } from "#/core/common/component/eisenhower-select";
import { InboxTaskSourceLink } from "#/core/inbox_tasks/component/source-link";
import { InboxTaskStatusBigTag } from "#/core/inbox_tasks/component/status-big-tag";
import { FieldError } from "#/core/infra/component/errors";
import { LifePlanAssociations } from "#/core/life_plan/components/life-plan-associations";
import {
  ActionSingle,
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import { IsKeySelect } from "#/core/common/component/is-key-select";
import {
  constructFieldErrorName,
  constructFieldName,
} from "#/core/infra/field-names";
import { DateInputWithSuggestions } from "#/core/infra/component/date-input-with-suggestions";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { aDateToDate } from "#/core/common/adate";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";

interface InboxTaskPropertiesEditorProps {
  title: string;
  showLinkToInboxTask?: boolean;
  intentPrefix?: string;
  namePrefix?: string;
  fieldsPrefix?: string;
  topLevelInfo: TopLevelInfo;
  lifePlan: LifePlan;
  rootAspect: AspectSummary;
  allAspects: AspectSummary[];
  allChapters: ChapterSummary[];
  allGoals: GoalSummary[];
  allMilestones: MilestoneSummary[];
  allBigPlans: BigPlanSummary[];
  allTags?: Array<Tag>;
  tags?: Array<Tag>;
  allContacts?: Array<Contact>;
  contacts?: Array<Contact>;
  inputsEnabled: boolean;
  inboxTask: InboxTask;
  inboxTaskInfo: InboxTaskLoadResult;
  actionData?: SomeErrorNoData;
}

type BigPlanACOption = {
  label: string;
  big_plan_id: string;
};

export function InboxTaskPropertiesEditor(
  props: InboxTaskPropertiesEditorProps,
) {
  const [selectedBigPlan, setSelectedBigPlan] = useState(
    props.inboxTaskInfo.big_plan
      ? {
          label: props.inboxTaskInfo.big_plan.name,
          big_plan_id: props.inboxTaskInfo.big_plan.ref_id,
        }
      : {
          label: "None",
          big_plan_id: "none",
        },
  );

  const [selectedAspect, setSelectedAspect] = useState(
    props.inboxTaskInfo.aspect.ref_id,
  );
  const [selectedChapter, setSelectedChapter] = useState(
    props.inboxTaskInfo.chapter?.ref_id ?? null,
  );
  const [selectedGoal, setSelectedGoal] = useState(
    props.inboxTaskInfo.goal?.ref_id ?? null,
  );
  const [blockedToSelectAspect, setBlockedToSelectAspect] = useState(
    props.inboxTask.source === InboxTaskSource.BIG_PLAN,
  );
  const corePropertyEditable = isInboxTaskCoreFieldEditable(
    props.inboxTask.source,
  );

  const allBigPlansById: { [k: string]: BigPlanSummary } = {};
  let allBigPlansAsOptions: Array<{ label: string; big_plan_id: string }> = [];

  if (
    isWorkspaceFeatureAvailable(
      props.topLevelInfo.workspace,
      WorkspaceFeature.BIG_PLANS,
    )
  ) {
    for (const bigPlan of props.allBigPlans) {
      allBigPlansById[bigPlan.ref_id] = bigPlan;
    }

    allBigPlansAsOptions = [
      {
        label: "None",
        big_plan_id: "none",
      },
    ].concat(
      props.allBigPlans.map((bp: BigPlanSummary) => ({
        label: bp.name,
        big_plan_id: bp.ref_id,
      })),
    );
  }

  function handleChangeBigPlan(
    e: React.SyntheticEvent,
    { label, big_plan_id }: BigPlanACOption,
  ) {
    setSelectedBigPlan({ label, big_plan_id });
    if (big_plan_id === "none") {
      setSelectedAspect(props.rootAspect.ref_id);
      setSelectedChapter(null);
      setSelectedGoal(null);
      setBlockedToSelectAspect(false);
    } else {
      setSelectedAspect(allBigPlansById[big_plan_id].aspect_ref_id);
      setSelectedChapter(allBigPlansById[big_plan_id].chapter_ref_id ?? null);
      setSelectedGoal(allBigPlansById[big_plan_id].goal_ref_id ?? null);
      setBlockedToSelectAspect(true);
    }
  }

  useEffect(() => {
    // Update states based on loader data. This is necessary because these
    // two are not otherwise updated when the loader data changes. Which happens
    // on a navigation event.
    setSelectedBigPlan(
      props.inboxTaskInfo.big_plan
        ? {
            label: props.inboxTaskInfo.big_plan.name,
            big_plan_id: props.inboxTaskInfo.big_plan.ref_id,
          }
        : {
            label: "None",
            big_plan_id: "none",
          },
    );

    setSelectedAspect(props.inboxTaskInfo.aspect.ref_id);
    setSelectedChapter(props.inboxTaskInfo.chapter?.ref_id ?? null);
    setSelectedGoal(props.inboxTaskInfo.goal?.ref_id ?? null);
  }, [props.inboxTaskInfo]);

  return (
    <SectionCard
      title={props.title}
      actions={
        <SectionActions
          id="inbox-task-editor"
          topLevelInfo={props.topLevelInfo}
          inputsEnabled={props.inputsEnabled}
          actions={
            props.showLinkToInboxTask
              ? [
                  NavSingle({
                    text: "Inbox Task",
                    icon: <LaunchIcon />,
                    link: `/app/workspace/inbox-tasks/${props.inboxTask.ref_id}`,
                  }),
                  ActionSingle({
                    id: "inbox-task-editor-save",
                    text: "Save",
                    value: constructIntentName(props.intentPrefix, "update"),
                    highlight: true,
                  }),
                ]
              : [
                  ActionSingle({
                    id: "inbox-task-editor-save",
                    text: "Save",
                    value: constructIntentName(props.intentPrefix, "update"),
                    highlight: true,
                  }),
                ]
          }
        />
      }
    >
      <Stack spacing={2} useFlexGap>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "0.25rem" }}>
          <input
            type="hidden"
            name={constructFieldName(props.namePrefix, "refId")}
            value={props.inboxTask.ref_id}
          />
          <FormControl sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name={constructFieldName(props.namePrefix, "name")}
              readOnly={!props.inputsEnabled || !corePropertyEditable}
              defaultValue={props.inboxTask.name}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(props.fieldsPrefix, "name")}
            />
            <input
              type="hidden"
              name={constructFieldName(props.namePrefix, "source")}
              value={props.inboxTask.source}
            />
          </FormControl>

          <FormControl sx={{ flexGrow: 1 }}>
            <IsKeySelect
              name={constructFieldName(props.namePrefix, "isKey")}
              defaultValue={props.inboxTask.is_key}
              inputsEnabled={props.inputsEnabled && corePropertyEditable}
            />
          </FormControl>
        </Box>

        <Stack direction="row" useFlexGap spacing={1}>
          {props.allTags && props.tags && (
            <FormControl sx={{ flexGrow: 2 }}>
              <TagsEditor
                name="tags_names"
                aloneOnLine
                allTags={props.allTags}
                defaultValue={props.tags.map((t) => t.ref_id)}
                inputsEnabled={props.inputsEnabled}
                namespace={TagNamespace.INBOX_TASK}
                sourceEntityRefId={props.inboxTask.ref_id}
              />
            </FormControl>
          )}

          {props.allContacts && props.contacts && (
            <FormControl sx={{ flexGrow: 2 }}>
              <ContactsEditor
                name="contacts_names"
                aloneOnLine
                allContacts={props.allContacts}
                defaultValue={props.contacts.map((c) => c.ref_id)}
                inputsEnabled={props.inputsEnabled}
                namespace={ContactNamespace.INBOX_TASK}
                sourceEntityRefId={props.inboxTask.ref_id}
              />
            </FormControl>
          )}
        </Stack>

        <Stack direction="row" useFlexGap spacing={1}>
          <FormControl sx={{ flexGrow: 1, minWidth: "unset" }}>
            <InboxTaskStatusBigTag status={props.inboxTask.status} />
            <input
              type="hidden"
              name={constructFieldName(props.namePrefix, "status")}
              value={props.inboxTask.status}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(props.fieldsPrefix, "status")}
            />
          </FormControl>

          {isWorkspaceFeatureAvailable(
            props.topLevelInfo.workspace,
            WorkspaceFeature.BIG_PLANS,
          ) &&
            (props.inboxTask.source === InboxTaskSource.USER ||
              props.inboxTask.source === InboxTaskSource.BIG_PLAN) && (
              <>
                <FormControl fullWidth>
                  <Autocomplete
                    disablePortal
                    autoHighlight
                    id="bigPlan"
                    options={allBigPlansAsOptions}
                    readOnly={!props.inputsEnabled}
                    value={selectedBigPlan}
                    disableClearable={true}
                    sx={autocompleteSingleLineSx}
                    onChange={handleChangeBigPlan}
                    isOptionEqualToValue={(o, v) =>
                      o.big_plan_id === v.big_plan_id
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Big Plan" />
                    )}
                  />

                  <FieldError
                    actionResult={props.actionData}
                    fieldName={constructFieldErrorName(
                      props.fieldsPrefix,
                      "big_plan_ref_id",
                    )}
                  />

                  <input
                    type="hidden"
                    name={constructFieldName(props.namePrefix, "bigPlan")}
                    value={selectedBigPlan.big_plan_id}
                  />
                </FormControl>
              </>
            )}

          <InboxTaskSourceLink inboxTaskResult={props.inboxTaskInfo} />
        </Stack>

        {isWorkspaceFeatureAvailable(
          props.topLevelInfo.workspace,
          WorkspaceFeature.LIFE_PLAN,
        ) && (
          <FormControl fullWidth>
            <LifePlanAssociations
              inputsEnabled={
                props.inputsEnabled &&
                corePropertyEditable &&
                !blockedToSelectAspect
              }
              aspectName={constructFieldName(props.namePrefix, "aspect")}
              chapterName={constructFieldName(props.namePrefix, "chapter")}
              goalName={constructFieldName(props.namePrefix, "goal")}
              allAspects={props.allAspects}
              aspectValue={selectedAspect}
              onAspectChange={setSelectedAspect}
              allChapters={props.allChapters}
              chapterValue={selectedChapter}
              onChapterChange={setSelectedChapter}
              allGoals={props.allGoals}
              goalValue={selectedGoal}
              onGoalChange={setSelectedGoal}
              birthday={lifePlanBirthdayDate(props.lifePlan)}
              today={aDateToDate(props.topLevelInfo.today)}
              allMilestones={props.allMilestones}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(
                props.fieldsPrefix,
                "aspect_ref_id",
              )}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(
                props.fieldsPrefix,
                "chapter_ref_id",
              )}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(
                props.fieldsPrefix,
                "goal_ref_id",
              )}
            />
          </FormControl>
        )}

        <FormControl fullWidth>
          <FormLabel id="eisen">Eisenhower</FormLabel>
          <EisenhowerSelect
            name={constructFieldName(props.namePrefix, "eisen")}
            inputsEnabled={props.inputsEnabled && corePropertyEditable}
            defaultValue={props.inboxTask.eisen}
          />
          <FieldError
            actionResult={props.actionData}
            fieldName={constructFieldErrorName(props.fieldsPrefix, "eisen")}
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="difficulty">Difficulty</FormLabel>
          <DifficultySelect
            name={constructFieldName(props.namePrefix, "difficulty")}
            inputsEnabled={props.inputsEnabled && corePropertyEditable}
            defaultValue={props.inboxTask.difficulty}
          />
          <FieldError
            actionResult={props.actionData}
            fieldName={constructFieldErrorName(
              props.fieldsPrefix,
              "difficulty",
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="actionableDate" shrink>
            Actionable From {corePropertyEditable ? "[Optional]" : ""}
          </InputLabel>
          <DateInputWithSuggestions
            name={constructFieldName(props.namePrefix, "actionableDate")}
            label="actionableDate"
            inputsEnabled={props.inputsEnabled && corePropertyEditable}
            defaultValue={props.inboxTask.actionable_date}
            suggestedDates={getSuggestedDatesForInboxTaskActionableDate(
              props.topLevelInfo.today,
              props.inboxTaskInfo.big_plan,
              props.inboxTaskInfo.time_plan,
            )}
          />

          <FieldError
            actionResult={props.actionData}
            fieldName={constructFieldErrorName(
              props.fieldsPrefix,
              "actionable_date",
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="dueDate" shrink margin="dense">
            Due At {corePropertyEditable ? "[Optional]" : ""}
          </InputLabel>
          <DateInputWithSuggestions
            name={constructFieldName(props.namePrefix, "dueDate")}
            label="dueDate"
            inputsEnabled={props.inputsEnabled && corePropertyEditable}
            defaultValue={props.inboxTask.due_date}
            suggestedDates={getSuggestedDatesForInboxTaskDueDate(
              props.topLevelInfo.today,
              props.inboxTaskInfo.big_plan,
              props.inboxTaskInfo.time_plan,
            )}
          />

          <FieldError
            actionResult={props.actionData}
            fieldName={constructFieldErrorName(props.fieldsPrefix, "due_date")}
          />
        </FormControl>
      </Stack>

      <CardActions sx={{ paddingLeft: "0px", paddingRight: "0px" }}>
        <Stack direction="column" spacing={1} sx={{ width: "100%" }}>
          {(props.inboxTask.status === InboxTaskStatus.NOT_STARTED ||
            props.inboxTask.status === InboxTaskStatus.NOT_STARTED_GEN) && (
            <ButtonGroup fullWidth>
              <Button
                size="small"
                variant="contained"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "mark-done")}
              >
                Mark Done
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "mark-not-done")}
              >
                Mark Not Done
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "start")}
              >
                Start
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "block")}
              >
                Block
              </Button>
            </ButtonGroup>
          )}

          {props.inboxTask.status === InboxTaskStatus.IN_PROGRESS && (
            <ButtonGroup fullWidth>
              <Button
                size="small"
                variant="contained"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "mark-done")}
              >
                Mark Done
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "mark-not-done")}
              >
                Mark Not Done
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "block")}
              >
                Block
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "stop")}
              >
                Stop
              </Button>
            </ButtonGroup>
          )}

          {props.inboxTask.status === InboxTaskStatus.BLOCKED && (
            <ButtonGroup fullWidth>
              <Button
                size="small"
                variant="contained"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "mark-done")}
              >
                Mark Done
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "mark-not-done")}
              >
                Mark Not Done
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "restart")}
              >
                Restart
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "stop")}
              >
                Stop
              </Button>
            </ButtonGroup>
          )}

          {(props.inboxTask.status === InboxTaskStatus.DONE ||
            props.inboxTask.status === InboxTaskStatus.NOT_DONE) && (
            <ButtonGroup fullWidth>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "reactivate")}
              >
                Reactivate
              </Button>
            </ButtonGroup>
          )}

          {corePropertyEditable && (
            <ButtonGroup fullWidth>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "delay-1-day")}
              >
                Delay by 1 Day
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "delay-1-week")}
              >
                Delay by 1 Week
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "delay-1-month")}
              >
                Delay by 1 Month
              </Button>
            </ButtonGroup>
          )}
        </Stack>
      </CardActions>
    </SectionCard>
  );
}

function constructIntentName(
  intentPrefix: string | undefined,
  intent: string,
): string {
  if (!intentPrefix) {
    return intent;
  }

  return `${intentPrefix}-${intent}`;
}
