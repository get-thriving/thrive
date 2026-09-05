from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="LocationLinkUpsertArgs")


@_attrs_define
class LocationLinkUpsertArgs:
    """LocationLinkUpsert args.

    Attributes:
        owner (str): A reference combining an entity kind, a purpose, and an entity id.
        locations_ref_ids (list[str]):
    """

    owner: str
    locations_ref_ids: list[str]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        owner = self.owner

        locations_ref_ids = self.locations_ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "owner": owner,
                "locations_ref_ids": locations_ref_ids,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        owner = d.pop("owner")

        locations_ref_ids = cast(list[str], d.pop("locations_ref_ids"))

        location_link_upsert_args = cls(
            owner=owner,
            locations_ref_ids=locations_ref_ids,
        )

        location_link_upsert_args.additional_properties = d
        return location_link_upsert_args

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
