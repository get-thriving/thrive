from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="SmartListLoadArgs")


@_attrs_define
class SmartListLoadArgs:
    """SmartListLoadArgs.

    Attributes:
        ref_id (str): A generic entity id.
        allow_archived (bool | None | Unset):
        allow_archived_items (bool | None | Unset):
        allow_archived_tags (bool | None | Unset):
        include_item_tags_and_notes (bool | None | Unset):
    """

    ref_id: str
    allow_archived: bool | None | Unset = UNSET
    allow_archived_items: bool | None | Unset = UNSET
    allow_archived_tags: bool | None | Unset = UNSET
    include_item_tags_and_notes: bool | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        allow_archived: bool | None | Unset
        if isinstance(self.allow_archived, Unset):
            allow_archived = UNSET
        else:
            allow_archived = self.allow_archived

        allow_archived_items: bool | None | Unset
        if isinstance(self.allow_archived_items, Unset):
            allow_archived_items = UNSET
        else:
            allow_archived_items = self.allow_archived_items

        allow_archived_tags: bool | None | Unset
        if isinstance(self.allow_archived_tags, Unset):
            allow_archived_tags = UNSET
        else:
            allow_archived_tags = self.allow_archived_tags

        include_item_tags_and_notes: bool | None | Unset
        if isinstance(self.include_item_tags_and_notes, Unset):
            include_item_tags_and_notes = UNSET
        else:
            include_item_tags_and_notes = self.include_item_tags_and_notes

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
            }
        )
        if allow_archived is not UNSET:
            field_dict["allow_archived"] = allow_archived
        if allow_archived_items is not UNSET:
            field_dict["allow_archived_items"] = allow_archived_items
        if allow_archived_tags is not UNSET:
            field_dict["allow_archived_tags"] = allow_archived_tags
        if include_item_tags_and_notes is not UNSET:
            field_dict["include_item_tags_and_notes"] = include_item_tags_and_notes

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        def _parse_allow_archived(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        allow_archived = _parse_allow_archived(d.pop("allow_archived", UNSET))

        def _parse_allow_archived_items(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        allow_archived_items = _parse_allow_archived_items(d.pop("allow_archived_items", UNSET))

        def _parse_allow_archived_tags(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        allow_archived_tags = _parse_allow_archived_tags(d.pop("allow_archived_tags", UNSET))

        def _parse_include_item_tags_and_notes(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_item_tags_and_notes = _parse_include_item_tags_and_notes(d.pop("include_item_tags_and_notes", UNSET))

        smart_list_load_args = cls(
            ref_id=ref_id,
            allow_archived=allow_archived,
            allow_archived_items=allow_archived_items,
            allow_archived_tags=allow_archived_tags,
            include_item_tags_and_notes=include_item_tags_and_notes,
        )

        smart_list_load_args.additional_properties = d
        return smart_list_load_args

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
