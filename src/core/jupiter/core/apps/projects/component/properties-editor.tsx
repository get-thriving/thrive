import type {
  Aspect,
  AspectSummary,
  Project,
  ProjectLoadResult,
  ProjectSummary,
  Chapter,
  ChapterSummary,
  Contact,
  Goal,
  GoalSummary,
  LifePlan,
  MilestoneSummary,
  Tag,
  UserLight,
} from "@jupiter/webapi-client";
import {
  ProjectStatus,
  NamedEntityTag,
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
import { useMemo, useState } from "react";

import { aDateToDate } from "#/core/common/adate";
import {
  getSuggestedDatesForProjectActionableDate,
  getSuggestedDatesForProjectDueDate,
} from "#/core/common/suggested-date";
import { findActiveChaptersForSuggestions } from "#/core/apps/life_plan/sub/chapters/root";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { projectDonePct } from "#/core/apps/projects/root";
import { ProjectStatusBigTag } from "#/core/apps/projects/component/status-big-tag";
import { ProjectDonePctBigTag } from "#/core/apps/projects/component/done-pct-big-tag";
import { ProjectMultiSelect } from "#/core/apps/projects/component/multi-select";
import { DifficultySelect } from "#/core/common/component/difficulty-select";
import { EisenhowerSelect } from "#/core/common/component/eisenhower-select";
import { IsKeySelect } from "#/core/common/component/is-key-select";
import { DateInputWithSuggestions } from "#/core/infra/component/date-input-with-suggestions";
import { FieldError } from "#/core/infra/component/errors";
import { LifePlanAssociations } from "#/core/apps/life_plan/components/life-plan-associations";
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
import { lifePlanBirthdayDate } from "#/core/apps/life_plan/root";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";
import { entityLinkStd } from "#/core/common/entity-link";
import type { SomeErrorNoData } from "#/core/infra/action-result";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface ProjectPropertiesEditorProps {
  title: string;
  showLinkToProject?: boolean;
  showRefreshStats?: boolean;
  intentPrefix?: string;
  namePrefix?: string;
  fieldsPrefix?: string;
  topLevelInfo: TopLevelInfo;
  lifePlan: LifePlan | null;
  allAspects: AspectSummary[];
  allChapters: ChapterSummary[];
  allGoals: GoalSummary[];
  allMilestones: MilestoneSummary[];
  allProjects?: ProjectSummary[];
  allTags?: Array<Tag>;
  tags?: Array<Tag>;
  allContacts?: Array<Contact>;
  contacts?: Array<Contact>;
  inputsEnabled: boolean;
  entityOwner?: UserLight;
  project: Project;
  projectInfo: ProjectLoadResult;
  actionData?: SomeErrorNoData;
}

export function ProjectPropertiesEditor(props: ProjectPropertiesEditorProps) {
  const milestonesLeft = props.projectInfo.milestones.filter(
    (m) => aDateToDate(m.date) > aDateToDate(props.topLevelInfo.today),
  ).length;

  const birthday = props.lifePlan ? lifePlanBirthdayDate(props.lifePlan) : null;
  const today = aDateToDate(props.topLevelInfo.today);
  const [selectedAspectRefId, setSelectedAspectRefId] = useState(
    props.projectInfo.aspect?.ref_id ?? "",
  );

  // Shared projects may reference life-plan entities from another workspace.
  // Include those for display, but keep associations read-only.
  const lifePlanAssociationsInWorkspace = props.allAspects.some(
    (aspect) => aspect.ref_id === props.project.aspect_ref_id,
  );
  const allAspects = useMemo(
    () =>
      mergeForeignAspectSummary(
        props.allAspects,
        props.projectInfo.aspect,
        props.project.aspect_ref_id,
      ),
    [props.allAspects, props.projectInfo.aspect, props.project.aspect_ref_id],
  );
  const allChapters = useMemo(
    () =>
      mergeForeignChapterSummary(
        props.allChapters,
        props.projectInfo.chapter,
        props.project.chapter_ref_id,
      ),
    [
      props.allChapters,
      props.projectInfo.chapter,
      props.project.chapter_ref_id,
    ],
  );
  const allGoals = useMemo(
    () =>
      mergeForeignGoalSummary(
        props.allGoals,
        props.projectInfo.goal,
        props.project.goal_ref_id,
      ),
    [props.allGoals, props.projectInfo.goal, props.project.goal_ref_id],
  );

  const chaptersForSuggestions = useMemo(
    () =>
      birthday
        ? findActiveChaptersForSuggestions(
            allChapters.filter(
              (chapter) => chapter.aspect_ref_id === selectedAspectRefId,
            ),
            birthday,
            today,
            props.allMilestones,
          )
        : [],
    [allChapters, props.allMilestones, selectedAspectRefId, birthday, today],
  );

  const actions = [];
  if (props.showLinkToProject) {
    actions.push(
      NavSingle({
        text: "Project",
        icon: <LaunchIcon />,
        link: `/app/workspace/apps/projects/${props.project.ref_id}`,
      }),
    );
  }
  actions.push(
    ActionSingle({
      id: "project-editor-save",
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
          id="project-editor"
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
          value={props.project.ref_id}
        />

        <Stack direction="row" spacing={1}>
          <FormControl sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name={constructFieldName(props.namePrefix, "name")}
              readOnly={!props.inputsEnabled}
              disabled={!props.inputsEnabled}
              defaultValue={props.project.name}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(props.fieldsPrefix, "name")}
            />
          </FormControl>

          <FormControl sx={{ flexGrow: 1 }}>
            <IsKeySelect
              name={constructFieldName(props.namePrefix, "isKey")}
              defaultValue={props.project.is_key}
              inputsEnabled={props.inputsEnabled}
            />
          </FormControl>
        </Stack>

        <Stack direction="row" useFlexGap spacing={1}>
          {props.allTags && props.tags && (
            <FormControl sx={{ flexGrow: 2 }}>
              <TagsEditor
                name="tags"
                aloneOnLine
                allTags={props.allTags}
                defaultValue={props.tags.map((tag) => tag.ref_id)}
                inputsEnabled={props.inputsEnabled}
                entityOwnerRefId={props.entityOwner?.ref_id}
                owner={entityLinkStd(
                  NamedEntityTag.PROJECT,
                  props.project.ref_id,
                )}
              />
            </FormControl>
          )}

          {props.allContacts && props.contacts && (
            <FormControl sx={{ flexGrow: 2 }}>
              <ContactsEditor
                name="contacts_names"
                aloneOnLine
                allContacts={props.allContacts}
                defaultValue={props.contacts.map((contact) => contact.ref_id)}
                inputsEnabled={props.inputsEnabled}
                entityOwnerRefId={props.entityOwner?.ref_id}
                owner={entityLinkStd(
                  NamedEntityTag.PROJECT,
                  props.project.ref_id,
                )}
              />
            </FormControl>
          )}
        </Stack>

        <Stack direction="row" spacing={2}>
          <FormControl sx={{ flexGrow: 1 }}>
            <ProjectStatusBigTag status={props.project.status} />
            <input
              type="hidden"
              name={constructFieldName(props.namePrefix, "status")}
              value={props.project.status}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(props.fieldsPrefix, "status")}
            />
          </FormControl>

          <FormControl sx={{ flexGrow: 1 }}>
            <ProjectDonePctBigTag
              donePct={projectDonePct(props.project, props.projectInfo.stats)}
              shouldShowMilestonesLeft={props.projectInfo.milestones.length > 0}
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
              inputsEnabled={
                props.inputsEnabled && lifePlanAssociationsInWorkspace
              }
              aspectName={constructFieldName(props.namePrefix, "aspect")}
              chapterName={constructFieldName(props.namePrefix, "chapter")}
              goalName={constructFieldName(props.namePrefix, "goal")}
              allAspects={allAspects}
              aspectValue={selectedAspectRefId}
              onAspectChange={setSelectedAspectRefId}
              aspectDefaultValue={props.projectInfo.aspect?.ref_id ?? ""}
              allChapters={allChapters}
              chapterDefaultValue={props.projectInfo.chapter?.ref_id}
              allGoals={allGoals}
              goalDefaultValue={props.projectInfo.goal?.ref_id}
              birthday={birthday!}
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

        {props.allProjects && (
          <FormControl fullWidth>
            <ProjectMultiSelect
              name={constructFieldName(props.namePrefix, "dependencyRefIds")}
              label="Depends On"
              inputsEnabled={props.inputsEnabled}
              disabled={!props.inputsEnabled}
              allProjects={props.allProjects}
              exceptRefId={props.project.ref_id}
              defaultValue={props.project.dependency_ref_ids}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(
                props.fieldsPrefix,
                "dependency_ref_ids",
              )}
            />
          </FormControl>
        )}

        <FormControl fullWidth>
          <FormLabel id="eisen">Eisenhower</FormLabel>
          <EisenhowerSelect
            name={constructFieldName(props.namePrefix, "eisen")}
            inputsEnabled={props.inputsEnabled}
            defaultValue={props.project.eisen}
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
            defaultValue={props.project.difficulty}
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
            defaultValue={props.project.actionable_date}
            suggestedDates={getSuggestedDatesForProjectActionableDate(
              props.topLevelInfo.today,
              undefined,
              chaptersForSuggestions,
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
            defaultValue={props.project.due_date}
            suggestedDates={getSuggestedDatesForProjectDueDate(
              props.topLevelInfo.today,
              undefined,
              chaptersForSuggestions,
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
          {props.project.status === ProjectStatus.NOT_STARTED && (
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

          {props.project.status === ProjectStatus.IN_PROGRESS && (
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

          {props.project.status === ProjectStatus.BLOCKED && (
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

          {(props.project.status === ProjectStatus.DONE ||
            props.project.status === ProjectStatus.NOT_DONE) && (
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

function mergeForeignAspectSummary(
  allAspects: AspectSummary[],
  aspect: Aspect | null | undefined,
  aspectRefId: string,
): AspectSummary[] {
  if (allAspects.some((entry) => entry.ref_id === aspectRefId)) {
    return allAspects;
  }
  if (
    aspect === undefined ||
    aspect === null ||
    aspect.ref_id !== aspectRefId
  ) {
    return allAspects;
  }
  // Detach from the foreign parent chain so tree helpers can still render it.
  return [
    ...allAspects,
    {
      ref_id: aspect.ref_id,
      parent_aspect_ref_id: null,
      name: aspect.name,
      order_of_child_aspects: [],
    },
  ];
}

function mergeForeignChapterSummary(
  allChapters: ChapterSummary[],
  chapter: Chapter | null | undefined,
  chapterRefId: string | null | undefined,
): ChapterSummary[] {
  if (
    chapterRefId === undefined ||
    chapterRefId === null ||
    allChapters.some((entry) => entry.ref_id === chapterRefId)
  ) {
    return allChapters;
  }
  if (
    chapter === undefined ||
    chapter === null ||
    chapter.ref_id !== chapterRefId
  ) {
    return allChapters;
  }
  return [
    ...allChapters,
    {
      ref_id: chapter.ref_id,
      name: chapter.name,
      start_date: chapter.start_date,
      end_date: chapter.end_date,
      aspect_ref_id: chapter.aspect_ref_id,
    },
  ];
}

function mergeForeignGoalSummary(
  allGoals: GoalSummary[],
  goal: Goal | null | undefined,
  goalRefId: string | null | undefined,
): GoalSummary[] {
  if (
    goalRefId === undefined ||
    goalRefId === null ||
    allGoals.some((entry) => entry.ref_id === goalRefId)
  ) {
    return allGoals;
  }
  if (goal === undefined || goal === null || goal.ref_id !== goalRefId) {
    return allGoals;
  }
  return [
    ...allGoals,
    {
      ref_id: goal.ref_id,
      name: goal.name,
      aspect_ref_id: goal.aspect_ref_id,
      parent_goal_ref_id: goal.parent_goal_ref_id,
    },
  ];
}
