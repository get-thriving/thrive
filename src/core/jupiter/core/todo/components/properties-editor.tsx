import type {
  ChapterSummary,
  Contact,
  GoalSummary,
  InboxTask,
  LifePlan,
  MilestoneSummary,
  AspectSummary,
  Tag,
  TodoTask,
} from "@jupiter/webapi-client";
import {
  ContactNamespace,
  Difficulty,
  Eisen,
  InboxTaskStatus,
  TagNamespace,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import {
  Button,
  ButtonGroup,
  CardActions,
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { Launch as LaunchIcon } from "@mui/icons-material";

import { aDateToDate } from "#/core/common/adate";
import { DifficultySelect } from "#/core/common/component/difficulty-select";
import { EisenhowerSelect } from "#/core/common/component/eisenhower-select";
import { IsKeySelect } from "#/core/common/component/is-key-select";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import {
  getSuggestedDatesForTodoTaskActionableDate,
  getSuggestedDatesForTodoTaskDueDate,
} from "#/core/common/suggested-date";
import type { SomeErrorNoData } from "#/core/infra/action-result";
import { DateInputWithSuggestions } from "#/core/infra/component/date-input-with-suggestions";
import { FieldError } from "#/core/infra/component/errors";
import { constructFieldName } from "#/core/infra/field-names";
import {
  ActionSingle,
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { InboxTaskStatusBigTag } from "#/core/inbox_tasks/component/status-big-tag";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { LifePlanAssociations } from "#/core/life_plan/components/life-plan-associations";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";

interface TodoTaskPropertiesEditorProps {
  title: string;
  showLinkToTodoTask?: boolean;
  intentPrefix?: string;
  namePrefix?: string;
  topLevelInfo: TopLevelInfo;
  lifePlan: LifePlan | null;
  allAspects: AspectSummary[];
  allChapters: ChapterSummary[];
  allGoals: GoalSummary[];
  allMilestones: MilestoneSummary[];
  allTags: Array<Tag>;
  tags: Array<Tag>;
  allContacts: Array<Contact>;
  contacts: Array<Contact>;
  inputsEnabled: boolean;
  todoTask: TodoTask;
  inboxTask: InboxTask;
  actionData?: SomeErrorNoData;
}

export function TodoTaskPropertiesEditor(props: TodoTaskPropertiesEditorProps) {
  const birthdayDate = props.lifePlan
    ? lifePlanBirthdayDate(props.lifePlan)
    : null;
  const [selectedAspectRefId, setSelectedAspectRefId] = useState(
    props.todoTask.aspect_ref_id,
  );

  return (
    <SectionCard
      title={props.title}
      actions={
        <SectionActions
          id="todo-update"
          topLevelInfo={props.topLevelInfo}
          inputsEnabled={props.inputsEnabled}
          actions={[
            ActionSingle({
              id: "todo-update",
              text: "Save",
              value: constructIntentName(props.intentPrefix, "update"),
              highlight: true,
            }),
          ]}
          extraActions={
            props.showLinkToTodoTask
              ? [
                  NavSingle({
                    text: "Todo Task",
                    link: `/app/workspace/todos/${props.todoTask.ref_id}`,
                    icon: <LaunchIcon />,
                  }),
                ]
              : undefined
          }
        />
      }
    >
      <Stack spacing={2} useFlexGap>
        <Stack direction="row" useFlexGap spacing={1}>
          <input
            type="hidden"
            name={constructFieldName(props.namePrefix, "refId")}
            value={props.todoTask.ref_id}
          />
          <FormControl fullWidth sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="name"
              name={constructFieldName(props.namePrefix, "name")}
              readOnly={!props.inputsEnabled}
              disabled={!props.inputsEnabled}
              defaultValue={props.todoTask.name}
            />
            <FieldError actionResult={props.actionData} fieldName="/name" />
          </FormControl>

          <FormControl sx={{ flexGrow: 1, minWidth: "unset" }}>
            <InboxTaskStatusBigTag status={props.inboxTask.status} />
            <input
              type="hidden"
              name={constructFieldName(props.namePrefix, "status")}
              value={props.inboxTask.status}
            />
            <FieldError actionResult={props.actionData} fieldName="/status" />
          </FormControl>

          <FormControl sx={{ flexGrow: 1 }}>
            <IsKeySelect
              name={constructFieldName(props.namePrefix, "isKey")}
              defaultValue={props.inboxTask.is_key}
              inputsEnabled={props.inputsEnabled}
            />
            <FieldError actionResult={props.actionData} fieldName="/is_key" />
          </FormControl>
        </Stack>

        <Stack direction="row" useFlexGap spacing={1}>
          <FormControl fullWidth sx={{ flexGrow: 2 }}>
            <TagsEditor
              name="tags"
              aloneOnLine
              allTags={props.allTags}
              defaultValue={props.tags.map((tag) => tag.ref_id)}
              inputsEnabled={props.inputsEnabled}
              namespace={TagNamespace.TODO_TASK}
              sourceEntityRefId={props.todoTask.ref_id}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName="/tags_names"
            />
          </FormControl>

          <FormControl fullWidth sx={{ flexGrow: 2 }}>
            <ContactsEditor
              name="contacts_names"
              aloneOnLine
              allContacts={props.allContacts}
              defaultValue={props.contacts.map((contact) => contact.ref_id)}
              inputsEnabled={props.inputsEnabled}
              namespace={ContactNamespace.TODO_TASK}
              sourceEntityRefId={props.todoTask.ref_id}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName="/contacts_names"
            />
          </FormControl>
        </Stack>

        {isWorkspaceFeatureAvailable(
          props.topLevelInfo.workspace,
          WorkspaceFeature.LIFE_PLAN,
        ) && (
          <FormControl fullWidth>
            <LifePlanAssociations
              inputsEnabled={props.inputsEnabled}
              aspectName={constructFieldName(props.namePrefix, "aspect")}
              chapterName={constructFieldName(props.namePrefix, "chapter")}
              goalName={constructFieldName(props.namePrefix, "goal")}
              allAspects={props.allAspects}
              aspectValue={selectedAspectRefId}
              onAspectChange={setSelectedAspectRefId}
              aspectDefaultValue={props.todoTask.aspect_ref_id}
              allChapters={props.allChapters}
              chapterDefaultValue={props.todoTask.chapter_ref_id}
              allGoals={props.allGoals}
              goalDefaultValue={props.todoTask.goal_ref_id}
              birthday={birthdayDate!}
              today={aDateToDate(props.topLevelInfo.today)}
              allMilestones={props.allMilestones}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName="/aspect_ref_id"
            />
            <FieldError
              actionResult={props.actionData}
              fieldName="/chapter_ref_id"
            />
            <FieldError
              actionResult={props.actionData}
              fieldName="/goal_ref_id"
            />
          </FormControl>
        )}

        <FormControl fullWidth>
          <FormLabel id="eisen">Eisenhower</FormLabel>
          <EisenhowerSelect
            name={constructFieldName(props.namePrefix, "eisen")}
            defaultValue={props.inboxTask.eisen as Eisen}
            inputsEnabled={props.inputsEnabled}
          />
          <FieldError actionResult={props.actionData} fieldName="/eisen" />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="difficulty">Difficulty</FormLabel>
          <DifficultySelect
            name={constructFieldName(props.namePrefix, "difficulty")}
            defaultValue={props.inboxTask.difficulty as Difficulty}
            inputsEnabled={props.inputsEnabled}
          />
          <FieldError actionResult={props.actionData} fieldName="/difficulty" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="actionableDate" shrink margin="dense">
            Actionable From [Optional]
          </InputLabel>
          <DateInputWithSuggestions
            name={constructFieldName(props.namePrefix, "actionableDate")}
            label="actionableDate"
            inputsEnabled={props.inputsEnabled}
            defaultValue={props.inboxTask.actionable_date ?? undefined}
            suggestedDates={getSuggestedDatesForTodoTaskActionableDate(
              props.topLevelInfo.today,
            )}
          />
          <FieldError
            actionResult={props.actionData}
            fieldName="/actionable_date"
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="dueDate" shrink margin="dense">
            Due Date [Optional]
          </InputLabel>
          <DateInputWithSuggestions
            name={constructFieldName(props.namePrefix, "dueDate")}
            label="dueDate"
            inputsEnabled={props.inputsEnabled}
            defaultValue={props.inboxTask.due_date ?? undefined}
            suggestedDates={getSuggestedDatesForTodoTaskDueDate(
              props.topLevelInfo.today,
            )}
          />
          <FieldError actionResult={props.actionData} fieldName="/due_date" />
        </FormControl>
      </Stack>

      <CardActions sx={{ paddingLeft: "0px", paddingRight: "0px" }}>
        <Stack direction="column" spacing={1} sx={{ width: "100%" }}>
          {props.inboxTask.status === InboxTaskStatus.NOT_STARTED && (
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
