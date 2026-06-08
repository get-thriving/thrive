import type {
  Aspect,
  Chapter,
  Contact,
  Goal,
  Habit,
  HabitStreakMark,
  Tag,
} from "@jupiter/webapi-client";
import {
  HabitRepeatsStrategy,
  NamedEntityTag,
  RecurringTaskPeriod,
} from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import { useState } from "react";

import { entityLinkStd } from "#/core/common/entity-link";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { RecurringTaskGenParamsBlock } from "#/core/common/component/recurring-task-gen-params-block";
import { IsKeySelect } from "#/core/common/component/is-key-select";
import { HabitRepeatStrategySelect } from "#/core/habits/component/repeat-strategy-select";
import { HabitStreakCalendar } from "#/core/habits/component/streak-calendar";
import { SlimChip } from "#/core/infra/component/chips";
import { SectionCard } from "#/core/infra/component/section-card";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface HabitEditorProps {
  habit: Habit;
  tags: Array<Tag>;
  contacts: Array<Contact>;
  allTags: Array<Tag>;
  allContacts: Array<Contact>;
  aspect: Aspect;
  chapter: Chapter | null;
  goal: Goal | null;
  inputsEnabled: boolean;
  topLevelInfo: TopLevelInfo;
  streakMarks?: Array<HabitStreakMark>;
  streakMarkEarliestDate?: string;
  streakMarkLatestDate?: string;
  showStreak?: boolean;
}

export function HabitEditor(props: HabitEditorProps) {
  const isBigScreen = useBigScreen();
  const { habit, tags, contacts, allTags, allContacts, aspect, chapter, goal } =
    props;

  const [selectedRepeatsStrategy, setSelectedRepeatsStrategy] = useState<
    HabitRepeatsStrategy | "none"
  >(habit.repeats_strategy || "none");

  return (
    <>
      <SectionCard title="Properties">
        <Stack direction="row" useFlexGap spacing={1}>
          <FormControl sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              readOnly={!props.inputsEnabled}
              defaultValue={habit.name}
            />
          </FormControl>

          <FormControl sx={{ flexGrow: 1 }}>
            <IsKeySelect
              name="isKey"
              defaultValue={habit.is_key}
              inputsEnabled={props.inputsEnabled}
            />
          </FormControl>
        </Stack>

        <Stack
          direction={isBigScreen ? "row" : "column"}
          useFlexGap
          spacing={1}
        >
          <FormControl fullWidth sx={{ flexGrow: 2 }}>
            <TagsEditor
              name="tags"
              aloneOnLine
              allTags={allTags}
              defaultValue={tags.map((tag) => tag.ref_id)}
              inputsEnabled={props.inputsEnabled}
              owner={entityLinkStd(NamedEntityTag.HABIT, habit.ref_id)}
            />
          </FormControl>

          <FormControl fullWidth sx={{ flexGrow: 2 }}>
            <ContactsEditor
              name="contacts_names"
              aloneOnLine
              allContacts={allContacts}
              defaultValue={contacts.map((contact) => contact.ref_id)}
              inputsEnabled={props.inputsEnabled}
              owner={entityLinkStd(NamedEntityTag.HABIT, habit.ref_id)}
            />
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <SlimChip label={`Aspect: ${aspect.name}`} color="default" />
          {chapter !== null && (
            <SlimChip label={`Chapter: ${chapter.name}`} color="default" />
          )}
          {goal !== null && (
            <SlimChip label={`Goal: ${goal.name}`} color="default" />
          )}
        </Stack>

        <RecurringTaskGenParamsBlock
          allowSkipRule
          inputsEnabled={props.inputsEnabled}
          period={habit.gen_params.period}
          eisen={habit.gen_params.eisen}
          difficulty={habit.gen_params.difficulty}
          actionableFromDay={habit.gen_params.actionable_from_day}
          actionableFromMonth={habit.gen_params.actionable_from_month}
          dueAtDay={habit.gen_params.due_at_day}
          dueAtMonth={habit.gen_params.due_at_month}
          skipRule={habit.gen_params.skip_rule}
        />

        {habit.gen_params.period !== RecurringTaskPeriod.DAILY && (
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ flexGrow: 3 }}>
              <HabitRepeatStrategySelect
                name="repeatsStrategy"
                inputsEnabled={props.inputsEnabled}
                allowNone
                value={selectedRepeatsStrategy}
                onChange={(newStrategy) =>
                  setSelectedRepeatsStrategy(newStrategy)
                }
              />
            </FormControl>

            {selectedRepeatsStrategy !== "none" && (
              <FormControl sx={{ flexGrow: 1 }}>
                <InputLabel id="repeatsInPeriodCount">
                  Repeats In Period [Optional]
                </InputLabel>
                <OutlinedInput
                  label="Repeats In Period"
                  name="repeatsInPeriodCount"
                  readOnly={!props.inputsEnabled}
                  defaultValue={habit.repeats_in_period_count}
                  sx={{ height: "100%" }}
                />
              </FormControl>
            )}
          </Stack>
        )}
      </SectionCard>

      {props.showStreak &&
        props.streakMarks !== undefined &&
        props.streakMarkEarliestDate !== undefined &&
        props.streakMarkLatestDate !== undefined && (
          <SectionCard title="Streak">
            <HabitStreakCalendar
              earliestDate={props.streakMarkEarliestDate}
              latestDate={props.streakMarkLatestDate}
              currentToday={props.topLevelInfo.today}
              habit={habit}
              streakMarks={props.streakMarks}
            />
          </SectionCard>
        )}
    </>
  );
}
