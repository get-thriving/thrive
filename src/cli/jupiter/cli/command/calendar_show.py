"""Command for loading a calendar."""

from jupiter.cli.command.rendering import (
    date_with_label_to_rich_text,
    entity_name_to_rich_text,
    occasion_date_to_rich_text,
    period_to_rich_text,
    time_in_day_to_rich_text,
)
from jupiter.cli.config import JupiterLoggedInReadonlyCommand
from jupiter.core.calendar.use_case.load_for_date_and_period import (
    CalendarEventsEntries,
    CalendarEventsStats,
    CalendarLoadForDateAndPeriodResult,
    CalendarLoadForDateAndPeriodUseCase,
)
from jupiter.core.config import JupiterLoggedInReadonlyContext
from rich.console import Console
from rich.text import Text
from rich.tree import Tree


class CalendarShow(
    JupiterLoggedInReadonlyCommand[
        CalendarLoadForDateAndPeriodUseCase, CalendarLoadForDateAndPeriodResult
    ]
):
    """Command for loading a calendar."""

    def _render_result(
        self,
        console: Console,
        context: JupiterLoggedInReadonlyContext,
        result: CalendarLoadForDateAndPeriodResult,
    ) -> None:
        header_text = Text("📅 ")
        header_text.append(period_to_rich_text(result.period))
        header_text.append(" calendar for")
        header_text.append(date_with_label_to_rich_text(result.right_now, ""))

        rich_tree = Tree(header_text)

        if result.entries:
            # Process the full days events

            full_day_events_tree = Tree(
                "Full Days Events", guide_style="bold bright_blue"
            )

            self._build_occasions(result.entries, full_day_events_tree)

            self._build_schedule_full_days(result.entries, full_day_events_tree)

            rich_tree.add(full_day_events_tree)

            # Process the in day events

            in_day_events_tree = Tree("In Day Events", guide_style="bold bright_blue")

            self._build_schedule_in_day(result.entries, in_day_events_tree)

            rich_tree.add(in_day_events_tree)

        if result.stats:
            # Process the stats

            stats_tree = self._build_stats(result.stats)

            rich_tree.add(stats_tree)

        console.print(rich_tree)

    def _build_occasions(
        self, entries: CalendarEventsEntries, full_day_events_tree: Tree
    ) -> None:
        for person_entry in sorted(
            entries.person_occasion_entries,
            key=lambda pe: (
                pe.occasion_time_event.start_date,
                pe.occasion_time_event.end_date,
            ),
        ):
            person = person_entry.contact
            occasion = person_entry.occasion

            person_text = Text("")
            person_text.append(entity_name_to_rich_text(person.name))
            person_text.append(": ")
            person_text.append(occasion_date_to_rich_text(occasion.kind, occasion.date))

            full_day_events_tree.add(person_text)

    def _build_schedule_full_days(
        self, entries: CalendarEventsEntries, full_day_events_tree: Tree
    ) -> None:
        for schedule_event_full_days_entry in sorted(
            entries.schedule_event_full_days_entries,
            key=lambda se: (se.time_event.start_date, se.time_event.end_date),
        ):
            schedule_event_full_days = schedule_event_full_days_entry.event
            time_event = schedule_event_full_days_entry.time_event
            shcedule_stream = schedule_event_full_days_entry.stream

            schedule_event_full_days_text = Text("")
            schedule_event_full_days_text.append(
                entity_name_to_rich_text(schedule_event_full_days.name)
            )
            schedule_event_full_days_text.append(" ")
            schedule_event_full_days_text.append(
                date_with_label_to_rich_text(time_event.start_date, "from")
            )
            schedule_event_full_days_text.append(" ")
            schedule_event_full_days_text.append(
                date_with_label_to_rich_text(time_event.end_date, "to")
            )
            schedule_event_full_days_text.append(" for stream ")
            schedule_event_full_days_text.append(
                entity_name_to_rich_text(shcedule_stream.name)
            )

            full_day_events_tree.add(schedule_event_full_days_text)

    def _build_schedule_in_day(
        self, entries: CalendarEventsEntries, in_day_events_tree: Tree
    ) -> None:
        for schedule_event_in_day_entry in sorted(
            entries.schedule_event_in_day_entries,
            key=lambda se: (
                se.time_event.start_date,
                se.time_event.start_time_in_day,
                se.time_event.duration_mins,
            ),
        ):
            schedule_event_in_day = schedule_event_in_day_entry.event
            time_event = schedule_event_in_day_entry.time_event
            schedule_stream = schedule_event_in_day_entry.stream

            schedule_event_in_day_text = Text("")
            schedule_event_in_day_text.append(
                entity_name_to_rich_text(schedule_event_in_day.name)
            )
            schedule_event_in_day_text.append(" ")
            schedule_event_in_day_text.append(
                date_with_label_to_rich_text(time_event.start_date, "from")
            )
            schedule_event_in_day_text.append(" at ")
            schedule_event_in_day_text.append(
                time_in_day_to_rich_text(time_event.start_time_in_day)
            )
            schedule_event_in_day_text.append(
                f" that lasts for {time_event.duration_mins} minutes"
            )

            schedule_event_in_day_text.append(" for stream ")
            schedule_event_in_day_text.append(
                entity_name_to_rich_text(schedule_stream.name)
            )

            in_day_events_tree.add(schedule_event_in_day_text)

    def _build_stats(self, stats: CalendarEventsStats) -> Tree:
        stats_tree = Tree("Stats", guide_style="bold bright_blue")

        for stat in stats.per_subperiod:
            per_subperiod_text = Text("")
            per_subperiod_text.append(
                date_with_label_to_rich_text(stat.period_start_date, "From")
            )

            per_subperiod_tree = Tree(per_subperiod_text)

            per_subperiod_tree.add(
                Text(
                    f"{stat.schedule_event_full_days_cnt} scheduled full day events",
                    style=(
                        "gray62"
                        if stat.schedule_event_full_days_cnt == 0
                        else "default"
                    ),
                )
            )
            per_subperiod_tree.add(
                Text(
                    f"{stat.schedule_event_in_day_cnt} scheduled in day events",
                    style=(
                        "gray62" if stat.schedule_event_in_day_cnt == 0 else "default"
                    ),
                )
            )
            per_subperiod_tree.add(
                Text(
                    f"{stat.person_birthday_cnt} birthday events",
                    style="gray62" if stat.person_birthday_cnt == 0 else "default",
                )
            )

            stats_tree.add(per_subperiod_tree)

        return stats_tree
