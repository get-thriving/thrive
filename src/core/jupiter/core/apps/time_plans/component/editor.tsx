import type {
  Aspect,
  AspectSummary,
  Chapter,
  ChapterSummary,
  Goal,
  GoalSummary,
  LifePlan,
  MilestoneSummary,
  Tag,
  TimePlan,
} from "@jupiter/webapi-client";
import { NamedEntityTag, WorkspaceFeature } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import { useMemo } from "react";

import { aDateToDate } from "#/core/common/adate";
import { entityLinkStd } from "#/core/common/entity-link";
import { PeriodSelect } from "#/core/common/component/period-select";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import type { ActionResult } from "#/core/infra/action-result";
import { FieldError } from "#/core/infra/component/errors";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { ChapterMultiSelect } from "#/core/apps/life_plan/sub/chapters/components/multi-select";
import { AspectMultiSelect } from "#/core/apps/life_plan/sub/aspects/component/multi-select";
import { lifePlanBirthdayDate } from "#/core/apps/life_plan/root";
import { GoalMultiSelect } from "#/core/apps/life_plan/sub/goals/components/multi-select";

interface TimePlanEditorProps {
  timePlan: TimePlan;
  tags: Array<Tag>;
  allTags: Array<Tag>;
  aspects: Array<Aspect>;
  chapters: Array<Chapter>;
  goals: Array<Goal>;
  lifePlan?: LifePlan;
  allAspects?: Array<AspectSummary>;
  allChapters?: Array<ChapterSummary>;
  allGoals?: Array<GoalSummary>;
  allMilestones?: Array<MilestoneSummary>;
  inputsEnabled: boolean;
  corePropertyEditable: boolean;
  topLevelInfo: TopLevelInfo;
  actionResult?: ActionResult<unknown>;
}

export function TimePlanEditor(props: TimePlanEditorProps) {
  const isBigScreen = useBigScreen();
  const { timePlan, tags, allTags, aspects, chapters, goals } = props;
  const timeConfigEditable = props.inputsEnabled && props.corePropertyEditable;
  const changeTimeConfigIntent = props.corePropertyEditable
    ? "change-time-config"
    : "change-time-config-for-generated";

  // Shared time plans may reference life-plan entities from another workspace.
  // Include those for display, but keep associations read-only.
  const lifePlanAssociationsInWorkspace = aspects.every((aspect) =>
    (props.allAspects ?? []).some((entry) => entry.ref_id === aspect.ref_id),
  );
  const allAspects = useMemo(
    () => mergeForeignAspectSummaries(props.allAspects ?? [], aspects),
    [props.allAspects, aspects],
  );
  const allChapters = useMemo(
    () => mergeForeignChapterSummaries(props.allChapters ?? [], chapters),
    [props.allChapters, chapters],
  );
  const allGoals = useMemo(
    () => mergeForeignGoalSummaries(props.allGoals ?? [], goals),
    [props.allGoals, goals],
  );
  const lifePlanInputsEnabled =
    props.inputsEnabled && lifePlanAssociationsInWorkspace;

  return (
    <SectionCard
      title="Properties"
      actions={
        <SectionActions
          id="time-plan-properties"
          topLevelInfo={props.topLevelInfo}
          inputsEnabled={props.inputsEnabled}
          actions={[
            ActionSingle({
              id: "time-plan-change-time-config",
              text: "Change Time Config",
              value: changeTimeConfigIntent,
              disabled: !props.inputsEnabled,
              highlight: true,
            }),
          ]}
        />
      }
    >
      <Stack direction={isBigScreen ? "row" : "column"} spacing={2} useFlexGap>
        <FormControl fullWidth={!isBigScreen}>
          <InputLabel id="rightNow" shrink margin="dense">
            The Date
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="rightNow"
            name="rightNow"
            readOnly={!timeConfigEditable}
            disabled={!timeConfigEditable}
            defaultValue={timePlan.right_now}
          />

          <FieldError actionResult={props.actionResult} fieldName="/rightNow" />
        </FormControl>

        <FormControl fullWidth={!isBigScreen}>
          <PeriodSelect
            labelId="period"
            label="Period"
            name="period"
            inputsEnabled={timeConfigEditable}
            defaultValue={timePlan.period}
            compact
          />
          <FieldError actionResult={props.actionResult} fieldName="/period" />
          <FieldError actionResult={props.actionResult} fieldName="/status" />
        </FormControl>

        <FormControl fullWidth={!isBigScreen}>
          <TagsEditor
            name="tags_names"
            allTags={allTags}
            defaultValue={tags.map((t) => t.ref_id)}
            inputsEnabled={props.inputsEnabled}
            owner={entityLinkStd(NamedEntityTag.TIME_PLAN, timePlan.ref_id)}
            aloneOnLine={!isBigScreen}
          />
        </FormControl>

        {props.lifePlan &&
          isWorkspaceFeatureAvailable(
            props.topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) && (
            <>
              <FormControl
                fullWidth={!isBigScreen}
                sx={{ width: isBigScreen ? "15%" : "100%" }}
              >
                <AspectMultiSelect
                  name="aspectRefIds"
                  label="Aspect"
                  inputsEnabled={lifePlanInputsEnabled}
                  disabled={!lifePlanAssociationsInWorkspace}
                  allAspects={allAspects}
                  maxSelections={props.lifePlan.time_plan_max_life_plan_links}
                  defaultValue={aspects.map((p) => p.ref_id)}
                />
                <FieldError
                  actionResult={props.actionResult}
                  fieldName="/aspectRefIds"
                />
              </FormControl>

              <FormControl
                fullWidth={!isBigScreen}
                sx={{ width: isBigScreen ? "15%" : "100%" }}
              >
                <ChapterMultiSelect
                  name="chapterRefIds"
                  label="Chapter"
                  inputsEnabled={lifePlanInputsEnabled}
                  disabled={!lifePlanAssociationsInWorkspace}
                  allChapters={allChapters}
                  maxSelections={props.lifePlan.time_plan_max_life_plan_links}
                  defaultValue={chapters.map((c) => c.ref_id)}
                  birthday={lifePlanBirthdayDate(props.lifePlan)}
                  today={aDateToDate(props.topLevelInfo.today)}
                  allMilestones={props.allMilestones ?? []}
                  allAspects={allAspects}
                />
                <FieldError
                  actionResult={props.actionResult}
                  fieldName="/chapterRefIds"
                />
              </FormControl>

              <FormControl
                fullWidth={!isBigScreen}
                sx={{ width: isBigScreen ? "15%" : "100%" }}
              >
                <GoalMultiSelect
                  name="goalRefIds"
                  label="Goal"
                  inputsEnabled={lifePlanInputsEnabled}
                  disabled={!lifePlanAssociationsInWorkspace}
                  allGoals={allGoals}
                  maxSelections={props.lifePlan.time_plan_max_life_plan_links}
                  defaultValue={goals.map((g) => g.ref_id)}
                />
                <FieldError
                  actionResult={props.actionResult}
                  fieldName="/goalRefIds"
                />
              </FormControl>
            </>
          )}
      </Stack>
    </SectionCard>
  );
}

function mergeForeignAspectSummaries(
  allAspects: AspectSummary[],
  aspects: Aspect[],
): AspectSummary[] {
  let result = allAspects;
  for (const aspect of aspects) {
    if (result.some((entry) => entry.ref_id === aspect.ref_id)) {
      continue;
    }
    result = [
      ...result,
      {
        ref_id: aspect.ref_id,
        parent_aspect_ref_id: null,
        name: aspect.name,
        order_of_child_aspects: [],
      },
    ];
  }
  return result;
}

function mergeForeignChapterSummaries(
  allChapters: ChapterSummary[],
  chapters: Chapter[],
): ChapterSummary[] {
  let result = allChapters;
  for (const chapter of chapters) {
    if (result.some((entry) => entry.ref_id === chapter.ref_id)) {
      continue;
    }
    result = [
      ...result,
      {
        ref_id: chapter.ref_id,
        name: chapter.name,
        start_date: chapter.start_date,
        end_date: chapter.end_date,
        aspect_ref_id: chapter.aspect_ref_id,
      },
    ];
  }
  return result;
}

function mergeForeignGoalSummaries(
  allGoals: GoalSummary[],
  goals: Goal[],
): GoalSummary[] {
  let result = allGoals;
  for (const goal of goals) {
    if (result.some((entry) => entry.ref_id === goal.ref_id)) {
      continue;
    }
    result = [
      ...result,
      {
        ref_id: goal.ref_id,
        name: goal.name,
        aspect_ref_id: goal.aspect_ref_id,
        parent_goal_ref_id: goal.parent_goal_ref_id,
      },
    ];
  }
  return result;
}
