from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="ContactLinkUpsertArgs")


@_attrs_define
class ContactLinkUpsertArgs:
    """ContactLinkUpsert args.

    Attributes:
        owner (str): A reference combining an entity kind with an entity id and a purpose.
        contact_names (list[str]):
    """

    owner: str
    contact_names: list[str]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        owner = self.owner

        contact_names = self.contact_names

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "owner": owner,
                "contact_names": contact_names,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        owner = d.pop("owner")

        contact_names = cast(list[str], d.pop("contact_names"))

        contact_link_upsert_args = cls(
            owner=owner,
            contact_names=contact_names,
        )

        contact_link_upsert_args.additional_properties = d
        return contact_link_upsert_args

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
