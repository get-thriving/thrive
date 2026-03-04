import type {
  BigPlan,
  BigPlanLoadResult,
  ChapterSummary,
  Contact,
  GoalSummary,
  LifePlan,
  MilestoneSummary,
  ProjectSummary,
  Tag,
} from "@jupiter/webapi-client";
import {
  BigPlanStatus,
  ContactNamespace,
  TagNamespace,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { Launch as LaunchIcon } from "@mui/icons-material";
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

import { aDateToDate } from "#/core/common/adate";
import {
  getSuggestedDatesForBigPlanActionableDate,
  getSuggestedDatesForBigPlanDueDate,
} from "#/core/common/suggested-date";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { bigPlanDonePct } from "#/core/big_plans/root";
import { BigPlanStatusBigTag } from "#/core/big_plans/component/status-big-tag";
import { BigPlanDonePctBigTag } from "#/core/big_plans/component/done-pct-big-tag";
import { DifficultySelect } from "#/core/common/component/difficulty-select";
import { EisenhowerSelect } from "#/core/common/component/eisenhower-select";
import { IsKeySelect } from "#/core/common/component/is-key-select";
import { DateInputWithSuggestions } from "#/core/infra/component/date-input-with-suggestions";
import { FieldError } from "#/core/infra/component/errors";
import { LifePlanAssociations } from "#/core/life_plan/components/life-plan-associations";
import {
  ActionSingle,
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import {
  constructFieldErrorName,
  constructFieldName,
} from "#/core/infra/field-names";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";
import type { SomeErrorNoData } from "#/core/infra/action-result";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface BigPlanPropertiesEditorProps {
  title: string;
  showLinkToBigPlan?: boolean;
  showRefreshStats?: boolean;
  intentPrefix?: string;
  namePrefix?: string;
  fieldsPrefix?: string;
  topLevelInfo: TopLevelInfo;
  lifePlan: LifePlan;
  allProjects: ProjectSummary[];
  allChapters: ChapterSummary[];
  allGoals: GoalSummary[];
  allMilestones: MilestoneSummary[];
  allTags?: Array<Tag>;
  tags?: Array<Tag>;
  allContacts?: Array<Contact>;
  contacts?: Array<Contact>;
  inputsEnabled: boolean;
  bigPlan: BigPlan;
  bigPlanInfo: BigPlanLoadResult;
  actionData?: SomeErrorNoData;
}

export function BigPlanPropertiesEditor(props: BigPlanPropertiesEditorProps) {
  const milestonesLeft = props.bigPlanInfo.milestones.filter(
    (m) => aDateToDate(m.date) > aDateToDate(props.topLevelInfo.today),
  ).length;

  const actions = [];
  if (props.showLinkToBigPlan) {
    actions.push(
      NavSingle({
        text: "Big Plan",
        icon: <LaunchIcon />,
        link: `/app/workspace/big-plans/${props.bigPlan.ref_id}`,
      }),
    );
  }
  actions.push(
    ActionSingle({
      id: "big-plan-editor-save",
      text: "Save",
      value: constructIntentName(props.intentPrefix, "update"),
      highlight: true,
    }),
  );
  if (props.showRefreshStats) {
    actions.push(
      ActionSingle({
        text: "Refresh Stats",
        value: constructIntentName(props.intentPrefix, "refresh-stats"),
      }),
    );
  }

  return (
    <SectionCard
      title={props.title}
      actions={
        <SectionActions
          id="big-plan-editor"
          topLevelInfo={props.topLevelInfo}
          inputsEnabled={props.inputsEnabled}
          actions={actions}
        />
      }
    >
      <Stack spacing={2} useFlexGap>
        <input
          type="hidden"
          name={constructFieldName(props.namePrefix, "refId")}
          value={props.bigPlan.ref_id}
        />

        <Stack direction="row" spacing={1}>
          <FormControl sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name={constructFieldName(props.namePrefix, "name")}
              readOnly={!props.inputsEnabled}
              defaultValue={props.bigPlan.name}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(props.fieldsPrefix, "name")}
            />
          </FormControl>

          <FormControl sx={{ flexGrow: 1 }}>
            <IsKeySelect
              name={constructFieldName(props.namePrefix, "isKey")}
              defaultValue={props.bigPlan.is_key}
              inputsEnabled={props.inputsEnabled}
            />
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2}>
          {props.allTags && props.tags && (
            <FormControl fullWidth sx={{ flexGrow: 2 }}>
              <TagsEditor
                name="tags"
                label={null}
                allTags={props.allTags}
                defaultValue={props.tags.map((tag) => tag.ref_id)}
                inputsEnabled={props.inputsEnabled}
                namespace={TagNamespace.BIG_PLAN}
                sourceEntityRefId={props.bigPlan.ref_id}
              />
            </FormControl>
          )}

          {props.allContacts && props.contacts && (
            <FormControl fullWidth sx={{ flexGrow: 2 }}>
              <ContactsEditor
                name="contacts_names"
                label={null}
                allContacts={props.allContacts}
                defaultValue={props.contacts.map((contact) => contact.ref_id)}
                inputsEnabled={props.inputsEnabled}
                namespace={ContactNamespace.BIG_PLAN}
                sourceEntityRefId={props.bigPlan.ref_id}
              />
            </FormControl>
          )}
        </Stack>

        <Stack direction="row" spacing={2}>
          <FormControl sx={{ flexGrow: 1 }}>
            <BigPlanStatusBigTag status={props.bigPlan.status} />
            <input
              type="hidden"
              name={constructFieldName(props.namePrefix, "status")}
              value={props.bigPlan.status}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(props.fieldsPrefix, "status")}
            />
          </FormControl>

          <FormControl sx={{ flexGrow: 1 }}>
            <BigPlanDonePctBigTag
              donePct={bigPlanDonePct(props.bigPlan, props.bigPlanInfo.stats)}
              shouldShowMilestonesLeft={props.bigPlanInfo.milestones.length > 0}
              milestonesLeft={milestonesLeft}
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
              projectName={constructFieldName(props.namePrefix, "project")}
              chapterName={constructFieldName(props.namePrefix, "chapter")}
              goalName={constructFieldName(props.namePrefix, "goal")}
              allProjects={props.allProjects}
              projectDefaultValue={props.bigPlanInfo.project.ref_id}
              allChapters={props.allChapters}
              chapterDefaultValue={props.bigPlanInfo.chapter?.ref_id}
              allGoals={props.allGoals}
              goalDefaultValue={props.bigPlanInfo.goal?.ref_id}
              birthday={lifePlanBirthdayDate(props.lifePlan)}
              today={aDateToDate(props.topLevelInfo.today)}
              allMilestones={props.allMilestones}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(
                props.fieldsPrefix,
                "project_ref_id",
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
            inputsEnabled={props.inputsEnabled}
            defaultValue={props.bigPlan.eisen}
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
            inputsEnabled={props.inputsEnabled}
            defaultValue={props.bigPlan.difficulty}
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
            Actionable From [Optional]
          </InputLabel>
          <DateInputWithSuggestions
            name={constructFieldName(props.namePrefix, "actionableDate")}
            label="actionableDate"
            inputsEnabled={props.inputsEnabled}
            defaultValue={props.bigPlan.actionable_date}
            suggestedDates={getSuggestedDatesForBigPlanActionableDate(
              props.topLevelInfo.today,
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
          <InputLabel id="dueDate" shrink>
            Due At [Optional]
          </InputLabel>
          <DateInputWithSuggestions
            name={constructFieldName(props.namePrefix, "dueDate")}
            label="dueDate"
            inputsEnabled={props.inputsEnabled}
            defaultValue={props.bigPlan.due_date}
            suggestedDates={getSuggestedDatesForBigPlanDueDate(
              props.topLevelInfo.today,
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
          {props.bigPlan.status === BigPlanStatus.NOT_STARTED && (
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

          {props.bigPlan.status === BigPlanStatus.IN_PROGRESS && (
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

          {props.bigPlan.status === BigPlanStatus.BLOCKED && (
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

          {(props.bigPlan.status === BigPlanStatus.DONE ||
            props.bigPlan.status === BigPlanStatus.NOT_DONE) && (
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
