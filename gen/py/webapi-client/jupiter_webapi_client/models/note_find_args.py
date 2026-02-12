from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.note_namespace import NoteNamespace
from ..types import UNSET, Unset

T = TypeVar("T", bound="NoteFindArgs")


@_attrs_define
class NoteFindArgs:
    """NoteFind args.

    Attributes:
        allow_archived (bool):
        filter_namespace (list[NoteNamespace] | None | Unset):
        filter_ref_ids (list[str] | None | Unset):
    """

    allow_archived: bool
    filter_namespace: list[NoteNamespace] | None | Unset = UNSET
    filter_ref_ids: list[str] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        allow_archived = self.allow_archived

        filter_namespace: list[str] | None | Unset
        if isinstance(self.filter_namespace, Unset):
            filter_namespace = UNSET
        elif isinstance(self.filter_namespace, list):
            filter_namespace = []
            for filter_namespace_type_0_item_data in self.filter_namespace:
                filter_namespace_type_0_item = filter_namespace_type_0_item_data.value
                filter_namespace.append(filter_namespace_type_0_item)

        else:
            filter_namespace = self.filter_namespace

        filter_ref_ids: list[str] | None | Unset
        if isinstance(self.filter_ref_ids, Unset):
            filter_ref_ids = UNSET
        elif isinstance(self.filter_ref_ids, list):
            filter_ref_ids = self.filter_ref_ids

        else:
            filter_ref_ids = self.filter_ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "allow_archived": allow_archived,
            }
        )
        if filter_namespace is not UNSET:
            field_dict["filter_namespace"] = filter_namespace
        if filter_ref_ids is not UNSET:
            field_dict["filter_ref_ids"] = filter_ref_ids

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        allow_archived = d.pop("allow_archived")

        def _parse_filter_namespace(data: object) -> list[NoteNamespace] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                filter_namespace_type_0 = []
                _filter_namespace_type_0 = data
                for filter_namespace_type_0_item_data in _filter_namespace_type_0:
                    filter_namespace_type_0_item = NoteNamespace(filter_namespace_type_0_item_data)

                    filter_namespace_type_0.append(filter_namespace_type_0_item)

                return filter_namespace_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[NoteNamespace] | None | Unset, data)

        filter_namespace = _parse_filter_namespace(d.pop("filter_namespace", UNSET))

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

        note_find_args = cls(
            allow_archived=allow_archived,
            filter_namespace=filter_namespace,
            filter_ref_ids=filter_ref_ids,
        )

        note_find_args.additional_properties = d
        return note_find_args

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
