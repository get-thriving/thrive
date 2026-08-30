from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.location_update_args_gps import LocationUpdateArgsGps
    from ..models.location_update_args_name import LocationUpdateArgsName


T = TypeVar("T", bound="LocationUpdateArgs")


@_attrs_define
class LocationUpdateArgs:
    """LocationUpdate args.

    Attributes:
        ref_id (str): A generic entity id.
        name (LocationUpdateArgsName):
        address_line (LocationUpdateArgsName):
        country (LocationUpdateArgsName):
        gps (LocationUpdateArgsGps):
    """

    ref_id: str
    name: LocationUpdateArgsName
    address_line: LocationUpdateArgsName
    country: LocationUpdateArgsName
    gps: LocationUpdateArgsGps
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": self.ref_id,
                "name": self.name.to_dict(),
                "address_line": self.address_line.to_dict(),
                "country": self.country.to_dict(),
                "gps": self.gps.to_dict(),
            }
        )
        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.location_update_args_gps import LocationUpdateArgsGps
        from ..models.location_update_args_name import LocationUpdateArgsName

        d = dict(src_dict)
        location_update_args = cls(
            ref_id=d.pop("ref_id"),
            name=LocationUpdateArgsName.from_dict(d.pop("name")),
            address_line=LocationUpdateArgsName.from_dict(d.pop("address_line")),
            country=LocationUpdateArgsName.from_dict(d.pop("country")),
            gps=LocationUpdateArgsGps.from_dict(d.pop("gps")),
        )
        location_update_args.additional_properties = d
        return location_update_args

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
