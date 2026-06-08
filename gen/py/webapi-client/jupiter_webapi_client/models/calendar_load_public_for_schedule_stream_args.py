from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.recurring_task_period import RecurringTaskPeriod
from ..types import UNSET, Unset

T = TypeVar("T", bound="CalendarLoadPublicForScheduleStreamArgs")


@_attrs_define
class CalendarLoadPublicForScheduleStreamArgs:
    """CalendarLoadPublicForScheduleStream args.

    Attributes:
        external_id (str): A GUID external id for a publish entity.
        right_now (str): A date or possibly a datetime for the application.
        period (RecurringTaskPeriod): A period for a particular task.
        stats_subperiod (None | RecurringTaskPeriod | Unset):
    """

    external_id: str
    right_now: str
    period: RecurringTaskPeriod
    stats_subperiod: None | RecurringTaskPeriod | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        external_id = self.external_id

        right_now = self.right_now

        period = self.period.value

        stats_subperiod: None | str | Unset
        if isinstance(self.stats_subperiod, Unset):
            stats_subperiod = UNSET
        elif isinstance(self.stats_subperiod, RecurringTaskPeriod):
            stats_subperiod = self.stats_subperiod.value
        else:
            stats_subperiod = self.stats_subperiod

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "external_id": external_id,
                "right_now": right_now,
                "period": period,
            }
        )
        if stats_subperiod is not UNSET:
            field_dict["stats_subperiod"] = stats_subperiod

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        external_id = d.pop("external_id")

        right_now = d.pop("right_now")

        period = RecurringTaskPeriod(d.pop("period"))

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

        calendar_load_public_for_schedule_stream_args = cls(
            external_id=external_id,
            right_now=right_now,
            period=period,
            stats_subperiod=stats_subperiod,
        )

        calendar_load_public_for_schedule_stream_args.additional_properties = d
        return calendar_load_public_for_schedule_stream_args

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
