from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="MetricLoadArgs")


@_attrs_define
class MetricLoadArgs:
    """MetricLoadArgs.

    Attributes:
        ref_id (str): A generic entity id.
        allow_archived (bool | None | Unset):
        allow_archived_entries (bool | None | Unset):
        collection_task_retrieve_offset (int | None | Unset):
        include_entry_tags_and_contacts (bool | None | Unset):
    """

    ref_id: str
    allow_archived: bool | None | Unset = UNSET
    allow_archived_entries: bool | None | Unset = UNSET
    collection_task_retrieve_offset: int | None | Unset = UNSET
    include_entry_tags_and_contacts: bool | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        allow_archived: bool | None | Unset
        if isinstance(self.allow_archived, Unset):
            allow_archived = UNSET
        else:
            allow_archived = self.allow_archived

        allow_archived_entries: bool | None | Unset
        if isinstance(self.allow_archived_entries, Unset):
            allow_archived_entries = UNSET
        else:
            allow_archived_entries = self.allow_archived_entries

        collection_task_retrieve_offset: int | None | Unset
        if isinstance(self.collection_task_retrieve_offset, Unset):
            collection_task_retrieve_offset = UNSET
        else:
            collection_task_retrieve_offset = self.collection_task_retrieve_offset

        include_entry_tags_and_contacts: bool | None | Unset
        if isinstance(self.include_entry_tags_and_contacts, Unset):
            include_entry_tags_and_contacts = UNSET
        else:
            include_entry_tags_and_contacts = self.include_entry_tags_and_contacts

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
            }
        )
        if allow_archived is not UNSET:
            field_dict["allow_archived"] = allow_archived
        if allow_archived_entries is not UNSET:
            field_dict["allow_archived_entries"] = allow_archived_entries
        if collection_task_retrieve_offset is not UNSET:
            field_dict["collection_task_retrieve_offset"] = collection_task_retrieve_offset
        if include_entry_tags_and_contacts is not UNSET:
            field_dict["include_entry_tags_and_contacts"] = include_entry_tags_and_contacts

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

        def _parse_allow_archived_entries(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        allow_archived_entries = _parse_allow_archived_entries(d.pop("allow_archived_entries", UNSET))

        def _parse_collection_task_retrieve_offset(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        collection_task_retrieve_offset = _parse_collection_task_retrieve_offset(
            d.pop("collection_task_retrieve_offset", UNSET)
        )

        def _parse_include_entry_tags_and_contacts(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_entry_tags_and_contacts = _parse_include_entry_tags_and_contacts(
            d.pop("include_entry_tags_and_contacts", UNSET)
        )

        metric_load_args = cls(
            ref_id=ref_id,
            allow_archived=allow_archived,
            allow_archived_entries=allow_archived_entries,
            collection_task_retrieve_offset=collection_task_retrieve_offset,
            include_entry_tags_and_contacts=include_entry_tags_and_contacts,
        )

        metric_load_args.additional_properties = d
        return metric_load_args

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
