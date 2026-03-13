from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="ChoreFindArgs")


@_attrs_define
class ChoreFindArgs:
    """PersonFindArgs.

    Attributes:
        allow_archived (bool | None | Unset):
        include_tags (bool | None | Unset):
        include_life_plan (bool | None | Unset):
        include_inbox_tasks (bool | None | Unset):
        include_notes (bool | None | Unset):
        filter_ref_ids (list[str] | None | Unset):
        filter_aspect_ref_ids (list[str] | None | Unset):
    """

    allow_archived: bool | None | Unset = UNSET
    include_tags: bool | None | Unset = UNSET
    include_life_plan: bool | None | Unset = UNSET
    include_inbox_tasks: bool | None | Unset = UNSET
    include_notes: bool | None | Unset = UNSET
    filter_ref_ids: list[str] | None | Unset = UNSET
    filter_aspect_ref_ids: list[str] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        allow_archived: bool | None | Unset
        if isinstance(self.allow_archived, Unset):
            allow_archived = UNSET
        else:
            allow_archived = self.allow_archived

        include_tags: bool | None | Unset
        if isinstance(self.include_tags, Unset):
            include_tags = UNSET
        else:
            include_tags = self.include_tags

        include_life_plan: bool | None | Unset
        if isinstance(self.include_life_plan, Unset):
            include_life_plan = UNSET
        else:
            include_life_plan = self.include_life_plan

        include_inbox_tasks: bool | None | Unset
        if isinstance(self.include_inbox_tasks, Unset):
            include_inbox_tasks = UNSET
        else:
            include_inbox_tasks = self.include_inbox_tasks

        include_notes: bool | None | Unset
        if isinstance(self.include_notes, Unset):
            include_notes = UNSET
        else:
            include_notes = self.include_notes

        filter_ref_ids: list[str] | None | Unset
        if isinstance(self.filter_ref_ids, Unset):
            filter_ref_ids = UNSET
        elif isinstance(self.filter_ref_ids, list):
            filter_ref_ids = self.filter_ref_ids

        else:
            filter_ref_ids = self.filter_ref_ids

        filter_aspect_ref_ids: list[str] | None | Unset
        if isinstance(self.filter_aspect_ref_ids, Unset):
            filter_aspect_ref_ids = UNSET
        elif isinstance(self.filter_aspect_ref_ids, list):
            filter_aspect_ref_ids = self.filter_aspect_ref_ids

        else:
            filter_aspect_ref_ids = self.filter_aspect_ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if allow_archived is not UNSET:
            field_dict["allow_archived"] = allow_archived
        if include_tags is not UNSET:
            field_dict["include_tags"] = include_tags
        if include_life_plan is not UNSET:
            field_dict["include_life_plan"] = include_life_plan
        if include_inbox_tasks is not UNSET:
            field_dict["include_inbox_tasks"] = include_inbox_tasks
        if include_notes is not UNSET:
            field_dict["include_notes"] = include_notes
        if filter_ref_ids is not UNSET:
            field_dict["filter_ref_ids"] = filter_ref_ids
        if filter_aspect_ref_ids is not UNSET:
            field_dict["filter_aspect_ref_ids"] = filter_aspect_ref_ids

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

        def _parse_include_tags(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_tags = _parse_include_tags(d.pop("include_tags", UNSET))

        def _parse_include_life_plan(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_life_plan = _parse_include_life_plan(d.pop("include_life_plan", UNSET))

        def _parse_include_inbox_tasks(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_inbox_tasks = _parse_include_inbox_tasks(d.pop("include_inbox_tasks", UNSET))

        def _parse_include_notes(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_notes = _parse_include_notes(d.pop("include_notes", UNSET))

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

        def _parse_filter_aspect_ref_ids(data: object) -> list[str] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                filter_aspect_ref_ids_type_0 = cast(list[str], data)

                return filter_aspect_ref_ids_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[str] | None | Unset, data)

        filter_aspect_ref_ids = _parse_filter_aspect_ref_ids(d.pop("filter_aspect_ref_ids", UNSET))

        chore_find_args = cls(
            allow_archived=allow_archived,
            include_tags=include_tags,
            include_life_plan=include_life_plan,
            include_inbox_tasks=include_inbox_tasks,
            include_notes=include_notes,
            filter_ref_ids=filter_ref_ids,
            filter_aspect_ref_ids=filter_aspect_ref_ids,
        )

        chore_find_args.additional_properties = d
        return chore_find_args

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
