import type { InboxTask, InboxTaskLoadResult } from "@jupiter/webapi-client";
import {
  InboxTaskSource,
  InboxTaskStatus,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { Launch as LaunchIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  CardActions,
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";

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
interface InboxTaskPropertiesEditorProps {
  title: string;
  showLinkToInboxTask?: boolean;
  intentPrefix?: string;
  namePrefix?: string;
  fieldsPrefix?: string;
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  inboxTask: InboxTask;
  inboxTaskInfo: InboxTaskLoadResult;
  actionData?: SomeErrorNoData;
}

export function InboxTaskPropertiesEditor(
  props: InboxTaskPropertiesEditorProps,
) {
  const corePropertyEditable = isInboxTaskCoreFieldEditable(
    props.inboxTask.source,
  );

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
            props.inboxTask.source === InboxTaskSource.BIG_PLAN && (
              <FormControl fullWidth>
                <InputLabel id="bigPlan" shrink>
                  Big Plan
                </InputLabel>
                <OutlinedInput
                  label="Big Plan"
                  readOnly
                  value={props.inboxTaskInfo.big_plan?.name ?? "Unknown"}
                />
              </FormControl>
            )}

          <InboxTaskSourceLink inboxTaskResult={props.inboxTaskInfo} />
        </Stack>

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
