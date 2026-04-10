from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="NoteLoadSettingsResult")


@_attrs_define
class NoteLoadSettingsResult:
    """NoteLoadSettings results.

    Attributes:
        allowed_note_owner_entity_types (list[str]):
    """

    allowed_note_owner_entity_types: list[str]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        allowed_note_owner_entity_types = self.allowed_note_owner_entity_types

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "allowed_note_owner_entity_types": allowed_note_owner_entity_types,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        allowed_note_owner_entity_types = cast(list[str], d.pop("allowed_note_owner_entity_types"))

        note_load_settings_result = cls(
            allowed_note_owner_entity_types=allowed_note_owner_entity_types,
        )

        note_load_settings_result.additional_properties = d
        return note_load_settings_result

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
