import { Box, Stack, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import {
  KeyHabitStreak,
  limitKeyHabitResultsBasedOnScreenSize,
  selectKeyHabitStreakEntries,
} from "#/core/apps/habits/streak";
import {
  isWidgetDimensionKSized,
  widgetDimensionCols,
  widgetDimensionRows,
  keyHabitsStreaksHabitRefIds,
} from "#/core/home/sub/widget/root";
import {
  CELL_FULL_SIZE,
  HabitStreakCalendar,
} from "#/core/apps/habits/component/streak-calendar";
import { WidgetProps } from "#/core/home/component/common";
import { WidgetNotConfiguredCard } from "#/core/home/component/widget-not-configured-card";

const ANIMATION_DURATION_MS = 10_000;

type HabitStreakEntries = NonNullable<WidgetProps["habitStreak"]>["entries"];

export function HabitKeyHabitStreakWidget(props: WidgetProps) {
  const habitStreak = props.habitStreak!;
  const theme = useTheme();
  const widgetContainer = useRef<HTMLDivElement>(null);

  const dimensionCols = widgetDimensionCols(props.geometry.dimension);
  const dimensionRows = widgetDimensionRows(props.geometry.dimension);

  // A widget placed on a home tab shows the habits it was set up with, in the
  // order it was set up with. Anywhere else it shows everything it is given.
  const configuredHabitRefIds = props.properties
    ? keyHabitsStreaksHabitRefIds(props.properties)
    : undefined;
  const entries = useMemo(
    () =>
      configuredHabitRefIds === undefined
        ? habitStreak.entries
        : selectKeyHabitStreakEntries(
            habitStreak.entries,
            configuredHabitRefIds,
          ),
    [habitStreak.entries, configuredHabitRefIds],
  );

  const [keyHabitStreaks, setKeyHabitStreaks] = useState<KeyHabitStreak[]>([]);

  useEffect(() => {
    if (!widgetContainer.current) {
      return;
    }

    const containerWidth = widgetContainer.current.clientWidth;
    // Each cell has 1rem in width and 2px borders. Each column is 7 cells,
    // corresponding to a week, so we need to look at the below number of cells.
    const daysToInclude =
      (Math.floor(containerWidth / CELL_FULL_SIZE(theme)) - 1) * 7;

    setKeyHabitStreaks(
      limitKeyHabitResultsBasedOnScreenSize(
        entries.map((e) => ({
          habitRefId: e.habit.ref_id,
          streakMarkEarliestDate: habitStreak.earliestDate,
          streakMarkLatestDate: habitStreak.latestDate,
          streakMarks: e.streakMarks,
          inactivePeriods: e.streakInactivePeriods,
        })),
        daysToInclude,
      ),
    );
  }, [
    theme,
    habitStreak.earliestDate,
    entries,
    habitStreak.latestDate,
    theme.typography.htmlFontSize,
  ]);

  if (entries.length === 0) {
    return (
      <WidgetNotConfiguredCard
        title="No Habits To Show"
        message="This widget has no habits to show. Pick the habits it should track, and the order to show them in, in the widget's settings."
        settingsLocation={props.settingsLocation}
      />
    );
  }

  return (
    <Box id="habit-key-habit-streak-widget-container" ref={widgetContainer}>
      {!isWidgetDimensionKSized(props.geometry.dimension) &&
      dimensionRows === 1 &&
      dimensionCols >= 1 ? (
        <HorizontalStreak
          widgetProps={props}
          entries={entries}
          keyHabitStreak={keyHabitStreaks}
        />
      ) : (
        <VerticalStreak
          widgetProps={props}
          entries={entries}
          keyHabitStreak={keyHabitStreaks}
        />
      )}
    </Box>
  );
}

interface HorizontalStreakProps {
  widgetProps: WidgetProps;
  entries: HabitStreakEntries;
  keyHabitStreak: KeyHabitStreak[];
}

function HorizontalStreak({
  widgetProps,
  entries,
  keyHabitStreak,
}: HorizontalStreakProps) {
  const [selectedEntry, setSelectedEntry] = useState<number>(0);
  const habitStreak = widgetProps.habitStreak!;
  const habitsByRefId = new Map(entries.map((e) => [e.habit.ref_id, e.habit]));
  // The streaks are measured after a render, so right after the habits change
  // they can still be for the previous ones.
  const visibleStreaks = keyHabitStreak.filter((entry) =>
    habitsByRefId.has(entry.habitRefId),
  );
  const activeEntry = Math.min(selectedEntry, visibleStreaks.length - 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedEntry((entry) => (entry + 1) % entries.length);
    }, ANIMATION_DURATION_MS);
    return () => clearInterval(interval);
  }, [entries]);

  return (
    <>
      <Stack>
        <Tabs
          value={visibleStreaks.length > 0 ? activeEntry : false}
          onChange={(_, value) => setSelectedEntry(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ marginBottom: "0.5rem" }}
        >
          {visibleStreaks.map((entry, index) => (
            <Tab
              key={index}
              label={
                habitsByRefId.get(entry.habitRefId)?.name ?? "Unknown Habit"
              }
            />
          ))}
        </Tabs>
        {visibleStreaks.map((entry, index) => (
          <Fragment key={index}>
            {index === activeEntry && (
              <HabitStreakCalendar
                earliestDate={entry.streakMarkEarliestDate}
                latestDate={entry.streakMarkLatestDate}
                currentToday={habitStreak.currentToday}
                habit={habitsByRefId.get(entry.habitRefId)!}
                streakMarks={entry.streakMarks}
                inactivePeriods={entry.inactivePeriods}
                noLabel={habitStreak.noLabel}
                label={habitStreak.label}
                showNav={habitStreak.showNav}
                getNavUrl={habitStreak.getNavUrl}
              />
            )}
          </Fragment>
        ))}
      </Stack>
    </>
  );
}

interface VerticalStreakProps {
  widgetProps: WidgetProps;
  entries: HabitStreakEntries;
  keyHabitStreak: KeyHabitStreak[];
}

function VerticalStreak({
  widgetProps,
  entries,
  keyHabitStreak,
}: VerticalStreakProps) {
  const habitStreak = widgetProps.habitStreak!;
  const habitsByRefId = new Map(entries.map((e) => [e.habit.ref_id, e.habit]));
  // See HorizontalStreak: the measured streaks can lag behind the habits.
  const visibleStreaks = keyHabitStreak.filter((entry) =>
    habitsByRefId.has(entry.habitRefId),
  );

  return (
    <Stack spacing={2}>
      {visibleStreaks.map((entry, index) => (
        <Fragment key={index}>
          <Typography variant="h6" noWrap>
            {habitsByRefId.get(entry.habitRefId)?.name ?? "Unknown Habit"}
          </Typography>
          <HabitStreakCalendar
            earliestDate={entry.streakMarkEarliestDate}
            latestDate={entry.streakMarkLatestDate}
            currentToday={habitStreak.currentToday}
            habit={habitsByRefId.get(entry.habitRefId)!}
            streakMarks={entry.streakMarks}
            inactivePeriods={entry.inactivePeriods}
            noLabel={habitStreak.noLabel}
            label={habitStreak.label}
            showNav={habitStreak.showNav}
            getNavUrl={habitStreak.getNavUrl}
          />
        </Fragment>
      ))}
    </Stack>
  );
}
