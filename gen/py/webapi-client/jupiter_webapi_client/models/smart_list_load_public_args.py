from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="SmartListLoadPublicArgs")


@_attrs_define
class SmartListLoadPublicArgs:
    """SmartListLoadPublic args.

    Attributes:
        external_id (str): A GUID external id for a publish entity.
        include_item_tags_and_notes (bool | None | Unset):
    """

    external_id: str
    include_item_tags_and_notes: bool | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        external_id = self.external_id

        include_item_tags_and_notes: bool | None | Unset
        if isinstance(self.include_item_tags_and_notes, Unset):
            include_item_tags_and_notes = UNSET
        else:
            include_item_tags_and_notes = self.include_item_tags_and_notes

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "external_id": external_id,
            }
        )
        if include_item_tags_and_notes is not UNSET:
            field_dict["include_item_tags_and_notes"] = include_item_tags_and_notes

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        external_id = d.pop("external_id")

        def _parse_include_item_tags_and_notes(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_item_tags_and_notes = _parse_include_item_tags_and_notes(d.pop("include_item_tags_and_notes", UNSET))

        smart_list_load_public_args = cls(
            external_id=external_id,
            include_item_tags_and_notes=include_item_tags_and_notes,
        )

        smart_list_load_public_args.additional_properties = d
        return smart_list_load_public_args

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
