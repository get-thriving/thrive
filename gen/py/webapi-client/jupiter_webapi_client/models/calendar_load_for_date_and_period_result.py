from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.recurring_task_period import RecurringTaskPeriod
from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.calendar_events_entries import CalendarEventsEntries
    from ..models.calendar_events_stats import CalendarEventsStats


T = TypeVar("T", bound="CalendarLoadForDateAndPeriodResult")


@_attrs_define
class CalendarLoadForDateAndPeriodResult:
    """Result.

    Attributes:
        right_now (str): A date or possibly a datetime for the application.
        period (RecurringTaskPeriod): A period for a particular task.
        period_start_date (str): A date or possibly a datetime for the application.
        period_end_date (str): A date or possibly a datetime for the application.
        prev_period_start_date (str): A date or possibly a datetime for the application.
        next_period_start_date (str): A date or possibly a datetime for the application.
        stats_subperiod (None | RecurringTaskPeriod | Unset):
        entries (CalendarEventsEntries | None | Unset):
        stats (CalendarEventsStats | None | Unset):
    """

    right_now: str
    period: RecurringTaskPeriod
    period_start_date: str
    period_end_date: str
    prev_period_start_date: str
    next_period_start_date: str
    stats_subperiod: None | RecurringTaskPeriod | Unset = UNSET
    entries: CalendarEventsEntries | None | Unset = UNSET
    stats: CalendarEventsStats | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.calendar_events_entries import CalendarEventsEntries
        from ..models.calendar_events_stats import CalendarEventsStats

        right_now = self.right_now

        period = self.period.value

        period_start_date = self.period_start_date

        period_end_date = self.period_end_date

        prev_period_start_date = self.prev_period_start_date

        next_period_start_date = self.next_period_start_date

        stats_subperiod: None | str | Unset
        if isinstance(self.stats_subperiod, Unset):
            stats_subperiod = UNSET
        elif isinstance(self.stats_subperiod, RecurringTaskPeriod):
            stats_subperiod = self.stats_subperiod.value
        else:
            stats_subperiod = self.stats_subperiod

        entries: dict[str, Any] | None | Unset
        if isinstance(self.entries, Unset):
            entries = UNSET
        elif isinstance(self.entries, CalendarEventsEntries):
            entries = self.entries.to_dict()
        else:
            entries = self.entries

        stats: dict[str, Any] | None | Unset
        if isinstance(self.stats, Unset):
            stats = UNSET
        elif isinstance(self.stats, CalendarEventsStats):
            stats = self.stats.to_dict()
        else:
            stats = self.stats

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "right_now": right_now,
                "period": period,
                "period_start_date": period_start_date,
                "period_end_date": period_end_date,
                "prev_period_start_date": prev_period_start_date,
                "next_period_start_date": next_period_start_date,
            }
        )
        if stats_subperiod is not UNSET:
            field_dict["stats_subperiod"] = stats_subperiod
        if entries is not UNSET:
            field_dict["entries"] = entries
        if stats is not UNSET:
            field_dict["stats"] = stats

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.calendar_events_entries import CalendarEventsEntries
        from ..models.calendar_events_stats import CalendarEventsStats

        d = dict(src_dict)
        right_now = d.pop("right_now")

        period = RecurringTaskPeriod(d.pop("period"))

        period_start_date = d.pop("period_start_date")

        period_end_date = d.pop("period_end_date")

        prev_period_start_date = d.pop("prev_period_start_date")

        next_period_start_date = d.pop("next_period_start_date")

        def _parse_stats_subperiod(data: object) -> None | RecurringTaskPeriod | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, str):
                    raise TypeError()
                stats_subperiod_type_0 = RecurringTaskPeriod(data)

                return stats_subperiod_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | RecurringTaskPeriod | Unset, data)

        stats_subperiod = _parse_stats_subperiod(d.pop("stats_subperiod", UNSET))

        def _parse_entries(data: object) -> CalendarEventsEntries | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                entries_type_0 = CalendarEventsEntries.from_dict(data)

                return entries_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(CalendarEventsEntries | None | Unset, data)

        entries = _parse_entries(d.pop("entries", UNSET))

        def _parse_stats(data: object) -> CalendarEventsStats | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                stats_type_0 = CalendarEventsStats.from_dict(data)

                return stats_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(CalendarEventsStats | None | Unset, data)

        stats = _parse_stats(d.pop("stats", UNSET))

        calendar_load_for_date_and_period_result = cls(
            right_now=right_now,
            period=period,
            period_start_date=period_start_date,
            period_end_date=period_end_date,
            prev_period_start_date=prev_period_start_date,
            next_period_start_date=next_period_start_date,
            stats_subperiod=stats_subperiod,
            entries=entries,
            stats=stats,
        )

        calendar_load_for_date_and_period_result.additional_properties = d
        return calendar_load_for_date_and_period_result

    @property
    def additional_keys(self) -> list[str]:
        return list(self.additional_properties.keys())

    def __getitem__(self, key: str) -> Any:
        return self.additional_properties[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.additional_properties[key] = value

    def __delitem__(self, key: str) -> None:
        del self.additional_properties[key]

    def __contains__(self, key: str) -> bool:
        return key in self.additional_properties
