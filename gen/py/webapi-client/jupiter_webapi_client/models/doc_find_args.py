from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="DocFindArgs")


@_attrs_define
class DocFindArgs:
    """DocFind args.

    Attributes:
        include_notes (bool | None | Unset):
        allow_archived (bool | None | Unset):
        include_subdocs (bool | None | Unset):
        include_tags (bool | None | Unset):
        filter_ref_ids (list[str] | None | Unset):
    """

    include_notes: bool | None | Unset = UNSET
    allow_archived: bool | None | Unset = UNSET
    include_subdocs: bool | None | Unset = UNSET
    include_tags: bool | None | Unset = UNSET
    filter_ref_ids: list[str] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        include_notes: bool | None | Unset
        if isinstance(self.include_notes, Unset):
            include_notes = UNSET
        else:
            include_notes = self.include_notes

        allow_archived: bool | None | Unset
        if isinstance(self.allow_archived, Unset):
            allow_archived = UNSET
        else:
            allow_archived = self.allow_archived

        include_subdocs: bool | None | Unset
        if isinstance(self.include_subdocs, Unset):
            include_subdocs = UNSET
        else:
            include_subdocs = self.include_subdocs

        include_tags: bool | None | Unset
        if isinstance(self.include_tags, Unset):
            include_tags = UNSET
        else:
            include_tags = self.include_tags

        filter_ref_ids: list[str] | None | Unset
        if isinstance(self.filter_ref_ids, Unset):
            filter_ref_ids = UNSET
        elif isinstance(self.filter_ref_ids, list):
            filter_ref_ids = self.filter_ref_ids

        else:
            filter_ref_ids = self.filter_ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if include_notes is not UNSET:
            field_dict["include_notes"] = include_notes
        if allow_archived is not UNSET:
            field_dict["allow_archived"] = allow_archived
        if include_subdocs is not UNSET:
            field_dict["include_subdocs"] = include_subdocs
        if include_tags is not UNSET:
            field_dict["include_tags"] = include_tags
        if filter_ref_ids is not UNSET:
            field_dict["filter_ref_ids"] = filter_ref_ids

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)

        def _parse_include_notes(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_notes = _parse_include_notes(d.pop("include_notes", UNSET))

        def _parse_allow_archived(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        allow_archived = _parse_allow_archived(d.pop("allow_archived", UNSET))

        def _parse_include_subdocs(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_subdocs = _parse_include_subdocs(d.pop("include_subdocs", UNSET))

        def _parse_include_tags(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_tags = _parse_include_tags(d.pop("include_tags", UNSET))

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

        doc_find_args = cls(
            include_notes=include_notes,
            allow_archived=allow_archived,
            include_subdocs=include_subdocs,
            include_tags=include_tags,
            filter_ref_ids=filter_ref_ids,
        )

        doc_find_args.additional_properties = d
        return doc_find_args

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
