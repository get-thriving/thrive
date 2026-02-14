from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="APIKeySummary")


@_attrs_define
class APIKeySummary:
    """Summary of an API key, safe for web display.

    Attributes:
        ref_id (str): A generic entity id.
        name (str): The name of an API key.
        last_four_digits (str):
        archived (bool):
    """

    ref_id: str
    name: str
    last_four_digits: str
    archived: bool
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        name = self.name

        last_four_digits = self.last_four_digits

        archived = self.archived

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
                "name": name,
                "last_four_digits": last_four_digits,
                "archived": archived,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        name = d.pop("name")

        last_four_digits = d.pop("last_four_digits")

        archived = d.pop("archived")

        api_key_summary = cls(
            ref_id=ref_id,
            name=name,
            last_four_digits=last_four_digits,
            archived=archived,
        )

        api_key_summary.additional_properties = d
        return api_key_summary

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
