from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="HabitFindStreaksArgs")


@_attrs_define
class HabitFindStreaksArgs:
    """HabitFindStreaksArgs.

    Attributes:
        filter_ref_ids (list[str] | None | Unset):
        filter_only_key (bool | None | Unset):
        include_streak_marks_earliest_date (None | str | Unset):
        include_streak_marks_latest_date (None | str | Unset):
    """

    filter_ref_ids: list[str] | None | Unset = UNSET
    filter_only_key: bool | None | Unset = UNSET
    include_streak_marks_earliest_date: None | str | Unset = UNSET
    include_streak_marks_latest_date: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        filter_ref_ids: list[str] | None | Unset
        if isinstance(self.filter_ref_ids, Unset):
            filter_ref_ids = UNSET
        elif isinstance(self.filter_ref_ids, list):
            filter_ref_ids = self.filter_ref_ids

        else:
            filter_ref_ids = self.filter_ref_ids

        filter_only_key: bool | None | Unset
        if isinstance(self.filter_only_key, Unset):
            filter_only_key = UNSET
        else:
            filter_only_key = self.filter_only_key

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
        field_dict.update({})
        if filter_ref_ids is not UNSET:
            field_dict["filter_ref_ids"] = filter_ref_ids
        if filter_only_key is not UNSET:
            field_dict["filter_only_key"] = filter_only_key
        if include_streak_marks_earliest_date is not UNSET:
            field_dict["include_streak_marks_earliest_date"] = include_streak_marks_earliest_date
        if include_streak_marks_latest_date is not UNSET:
            field_dict["include_streak_marks_latest_date"] = include_streak_marks_latest_date

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)

        def _parse_filter_ref_ids(data: object) -> list[str] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                filter_ref_ids_type_0 = cast(list[str], data)

                return filter_ref_ids_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[str] | None | Unset, data)

        filter_ref_ids = _parse_filter_ref_ids(d.pop("filter_ref_ids", UNSET))

        def _parse_filter_only_key(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        filter_only_key = _parse_filter_only_key(d.pop("filter_only_key", UNSET))

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

        habit_find_streaks_args = cls(
            filter_ref_ids=filter_ref_ids,
            filter_only_key=filter_only_key,
            include_streak_marks_earliest_date=include_streak_marks_earliest_date,
            include_streak_marks_latest_date=include_streak_marks_latest_date,
        )

        habit_find_streaks_args.additional_properties = d
        return habit_find_streaks_args

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
