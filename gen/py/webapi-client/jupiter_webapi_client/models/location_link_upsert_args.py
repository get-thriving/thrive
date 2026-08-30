from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="LocationLinkUpsertArgs")


@_attrs_define
class LocationLinkUpsertArgs:
    """LocationLinkUpsert args.

    Attributes:
        owner (str): A reference combining an entity kind, a purpose, and an entity id.
        location_ref_id (None | str | Unset):
    """

    owner: str
    location_ref_id: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "owner": self.owner,
            }
        )

        location_ref_id: None | str | Unset
        if isinstance(self.location_ref_id, Unset):
            location_ref_id = UNSET
        else:
            location_ref_id = self.location_ref_id
        if location_ref_id is not UNSET:
            field_dict["location_ref_id"] = location_ref_id

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)

        def _parse_location_ref_id(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        location_link_upsert_args = cls(
            owner=d.pop("owner"),
            location_ref_id=_parse_location_ref_id(d.pop("location_ref_id", UNSET)),
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
