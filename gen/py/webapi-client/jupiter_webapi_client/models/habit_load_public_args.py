from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="HabitLoadPublicArgs")


@_attrs_define
class HabitLoadPublicArgs:
    """HabitLoadPublic args.

    Attributes:
        external_id (str): A GUID external id for a publish entity.
        inbox_task_retrieve_offset (int | None | Unset):
        include_streak_marks_earliest_date (None | str | Unset):
        include_streak_marks_latest_date (None | str | Unset):
    """

    external_id: str
    inbox_task_retrieve_offset: int | None | Unset = UNSET
    include_streak_marks_earliest_date: None | str | Unset = UNSET
    include_streak_marks_latest_date: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        external_id = self.external_id

        inbox_task_retrieve_offset: int | None | Unset
        if isinstance(self.inbox_task_retrieve_offset, Unset):
            inbox_task_retrieve_offset = UNSET
        else:
            inbox_task_retrieve_offset = self.inbox_task_retrieve_offset

        include_streak_marks_earliest_date: None | str | Unset
        if isinstance(self.include_streak_marks_earliest_date, Unset):
            include_streak_marks_earliest_date = UNSET
        else:
            include_streak_marks_earliest_date = self.include_streak_marks_earliest_date

        include_streak_marks_latest_date: None | str | Unset
        if isinstance(self.include_streak_marks_latest_date, Unset):
            include_streak_marks_latest_date = UNSET
        else:
            include_streak_marks_latest_date = self.include_streak_marks_latest_date

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "external_id": external_id,
            }
        )
        if inbox_task_retrieve_offset is not UNSET:
            field_dict["inbox_task_retrieve_offset"] = inbox_task_retrieve_offset
        if include_streak_marks_earliest_date is not UNSET:
            field_dict["include_streak_marks_earliest_date"] = include_streak_marks_earliest_date
        if include_streak_marks_latest_date is not UNSET:
            field_dict["include_streak_marks_latest_date"] = include_streak_marks_latest_date

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        external_id = d.pop("external_id")

        def _parse_inbox_task_retrieve_offset(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        inbox_task_retrieve_offset = _parse_inbox_task_retrieve_offset(d.pop("inbox_task_retrieve_offset", UNSET))

        def _parse_include_streak_marks_earliest_date(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        include_streak_marks_earliest_date = _parse_include_streak_marks_earliest_date(
            d.pop("include_streak_marks_earliest_date", UNSET)
        )

        def _parse_include_streak_marks_latest_date(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        include_streak_marks_latest_date = _parse_include_streak_marks_latest_date(
            d.pop("include_streak_marks_latest_date", UNSET)
        )

        habit_load_public_args = cls(
            external_id=external_id,
            inbox_task_retrieve_offset=inbox_task_retrieve_offset,
            include_streak_marks_earliest_date=include_streak_marks_earliest_date,
            include_streak_marks_latest_date=include_streak_marks_latest_date,
        )

        habit_load_public_args.additional_properties = d
        return habit_load_public_args

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
