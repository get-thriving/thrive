from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="IndexedLocation")


@_attrs_define
class IndexedLocation:
    """Searchable location properties plus location ref ids for filtering.

    Attributes:
        name (str):
        address (str):
        country (str):
        gps (str):
        ref_ids (list[str]):
    """

    name: str
    address: str
    country: str
    gps: str
    ref_ids: list[str]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        name = self.name

        address = self.address

        country = self.country

        gps = self.gps

        ref_ids = self.ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "name": name,
                "address": address,
                "country": country,
                "gps": gps,
                "ref_ids": ref_ids,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        name = d.pop("name")

        address = d.pop("address")

        country = d.pop("country")

        gps = d.pop("gps")

        ref_ids = cast(list[str], d.pop("ref_ids"))

        indexed_location = cls(
            name=name,
            address=address,
            country=country,
            gps=gps,
            ref_ids=ref_ids,
        )

        indexed_location.additional_properties = d
        return indexed_location

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
