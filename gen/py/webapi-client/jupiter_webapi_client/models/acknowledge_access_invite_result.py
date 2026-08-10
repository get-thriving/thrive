from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="AcknowledgeAccessInviteResult")


@_attrs_define
class AcknowledgeAccessInviteResult:
    """AcknowledgeAccessInvite result.

    Attributes:
        access_invite_ref_id (str): A generic entity id.
    """

    access_invite_ref_id: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        access_invite_ref_id = self.access_invite_ref_id

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "access_invite_ref_id": access_invite_ref_id,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        access_invite_ref_id = d.pop("access_invite_ref_id")

        acknowledge_access_invite_result = cls(
            access_invite_ref_id=access_invite_ref_id,
        )

        acknowledge_access_invite_result.additional_properties = d
        return acknowledge_access_invite_result

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
