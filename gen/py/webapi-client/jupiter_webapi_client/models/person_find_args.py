from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="PersonFindArgs")


@_attrs_define
class PersonFindArgs:
    """PersonFindArgs.

    Attributes:
        allow_archived (bool | None | Unset):
        include_occasions (bool | None | Unset):
        include_circle_ref_ids (bool | None | Unset):
        include_notes (bool | None | Unset):
        include_occasion_time_event_blocks (bool | None | Unset):
        include_catch_up_inbox_tasks (bool | None | Unset):
        include_occasion_inbox_tasks (bool | None | Unset):
        include_tags (bool | None | Unset):
        filter_person_ref_ids (list[str] | None | Unset):
    """

    allow_archived: bool | None | Unset = UNSET
    include_occasions: bool | None | Unset = UNSET
    include_circle_ref_ids: bool | None | Unset = UNSET
    include_notes: bool | None | Unset = UNSET
    include_occasion_time_event_blocks: bool | None | Unset = UNSET
    include_catch_up_inbox_tasks: bool | None | Unset = UNSET
    include_occasion_inbox_tasks: bool | None | Unset = UNSET
    include_tags: bool | None | Unset = UNSET
    filter_person_ref_ids: list[str] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        allow_archived: bool | None | Unset
        if isinstance(self.allow_archived, Unset):
            allow_archived = UNSET
        else:
            allow_archived = self.allow_archived

        include_occasions: bool | None | Unset
        if isinstance(self.include_occasions, Unset):
            include_occasions = UNSET
        else:
            include_occasions = self.include_occasions

        include_circle_ref_ids: bool | None | Unset
        if isinstance(self.include_circle_ref_ids, Unset):
            include_circle_ref_ids = UNSET
        else:
            include_circle_ref_ids = self.include_circle_ref_ids

        include_notes: bool | None | Unset
        if isinstance(self.include_notes, Unset):
            include_notes = UNSET
        else:
            include_notes = self.include_notes

        include_occasion_time_event_blocks: bool | None | Unset
        if isinstance(self.include_occasion_time_event_blocks, Unset):
            include_occasion_time_event_blocks = UNSET
        else:
            include_occasion_time_event_blocks = self.include_occasion_time_event_blocks

        include_catch_up_inbox_tasks: bool | None | Unset
        if isinstance(self.include_catch_up_inbox_tasks, Unset):
            include_catch_up_inbox_tasks = UNSET
        else:
            include_catch_up_inbox_tasks = self.include_catch_up_inbox_tasks

        include_occasion_inbox_tasks: bool | None | Unset
        if isinstance(self.include_occasion_inbox_tasks, Unset):
            include_occasion_inbox_tasks = UNSET
        else:
            include_occasion_inbox_tasks = self.include_occasion_inbox_tasks

        include_tags: bool | None | Unset
        if isinstance(self.include_tags, Unset):
            include_tags = UNSET
        else:
            include_tags = self.include_tags

        filter_person_ref_ids: list[str] | None | Unset
        if isinstance(self.filter_person_ref_ids, Unset):
            filter_person_ref_ids = UNSET
        elif isinstance(self.filter_person_ref_ids, list):
            filter_person_ref_ids = self.filter_person_ref_ids

        else:
            filter_person_ref_ids = self.filter_person_ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if allow_archived is not UNSET:
            field_dict["allow_archived"] = allow_archived
        if include_occasions is not UNSET:
            field_dict["include_occasions"] = include_occasions
        if include_circle_ref_ids is not UNSET:
            field_dict["include_circle_ref_ids"] = include_circle_ref_ids
        if include_notes is not UNSET:
            field_dict["include_notes"] = include_notes
        if include_occasion_time_event_blocks is not UNSET:
            field_dict["include_occasion_time_event_blocks"] = include_occasion_time_event_blocks
        if include_catch_up_inbox_tasks is not UNSET:
            field_dict["include_catch_up_inbox_tasks"] = include_catch_up_inbox_tasks
        if include_occasion_inbox_tasks is not UNSET:
            field_dict["include_occasion_inbox_tasks"] = include_occasion_inbox_tasks
        if include_tags is not UNSET:
            field_dict["include_tags"] = include_tags
        if filter_person_ref_ids is not UNSET:
            field_dict["filter_person_ref_ids"] = filter_person_ref_ids

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)

        def _parse_allow_archived(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        allow_archived = _parse_allow_archived(d.pop("allow_archived", UNSET))

        def _parse_include_occasions(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_occasions = _parse_include_occasions(d.pop("include_occasions", UNSET))

        def _parse_include_circle_ref_ids(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_circle_ref_ids = _parse_include_circle_ref_ids(d.pop("include_circle_ref_ids", UNSET))

        def _parse_include_notes(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_notes = _parse_include_notes(d.pop("include_notes", UNSET))

        def _parse_include_occasion_time_event_blocks(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_occasion_time_event_blocks = _parse_include_occasion_time_event_blocks(
            d.pop("include_occasion_time_event_blocks", UNSET)
        )

        def _parse_include_catch_up_inbox_tasks(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_catch_up_inbox_tasks = _parse_include_catch_up_inbox_tasks(d.pop("include_catch_up_inbox_tasks", UNSET))

        def _parse_include_occasion_inbox_tasks(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_occasion_inbox_tasks = _parse_include_occasion_inbox_tasks(d.pop("include_occasion_inbox_tasks", UNSET))

        def _parse_include_tags(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_tags = _parse_include_tags(d.pop("include_tags", UNSET))

        def _parse_filter_person_ref_ids(data: object) -> list[str] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                filter_person_ref_ids_type_0 = cast(list[str], data)

                return filter_person_ref_ids_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[str] | None | Unset, data)

        filter_person_ref_ids = _parse_filter_person_ref_ids(d.pop("filter_person_ref_ids", UNSET))

        person_find_args = cls(
            allow_archived=allow_archived,
            include_occasions=include_occasions,
            include_circle_ref_ids=include_circle_ref_ids,
            include_notes=include_notes,
            include_occasion_time_event_blocks=include_occasion_time_event_blocks,
            include_catch_up_inbox_tasks=include_catch_up_inbox_tasks,
            include_occasion_inbox_tasks=include_occasion_inbox_tasks,
            include_tags=include_tags,
            filter_person_ref_ids=filter_person_ref_ids,
        )

        person_find_args.additional_properties = d
        return person_find_args

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
