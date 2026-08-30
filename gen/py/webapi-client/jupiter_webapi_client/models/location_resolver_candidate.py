from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.gps_coordinates import GpsCoordinates

T = TypeVar("T", bound="LocationResolverCandidate")


@_attrs_define
class LocationResolverCandidate:
    """A location suggested by a resolver, not yet stored in the workspace."""

    name: str
    source: str
    address_line: None | str | Unset = UNSET
    country: None | str | Unset = UNSET
    gps: "GpsCoordinates | None | Unset" = UNSET
    source_id: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.gps_coordinates import GpsCoordinates

        field_dict: dict[str, Any] = {
            "name": self.name,
            "source": self.source,
        }
        if not isinstance(self.address_line, Unset):
            field_dict["address_line"] = self.address_line
        if not isinstance(self.country, Unset):
            field_dict["country"] = self.country
        if not isinstance(self.gps, Unset):
            field_dict["gps"] = (
                self.gps.to_dict() if isinstance(self.gps, GpsCoordinates) else self.gps
            )
        if not isinstance(self.source_id, Unset):
            field_dict["source_id"] = self.source_id
        field_dict.update(self.additional_properties)
        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.gps_coordinates import GpsCoordinates

        d = dict(src_dict)
        gps_data = d.pop("gps", UNSET)
        gps: GpsCoordinates | None | Unset
        if gps_data is None or isinstance(gps_data, Unset):
            gps = gps_data
        else:
            gps = GpsCoordinates.from_dict(cast(dict[str, Any], gps_data))
        candidate = cls(
            name=d.pop("name"),
            source=d.pop("source"),
            address_line=d.pop("address_line", UNSET),
            country=d.pop("country", UNSET),
            gps=gps,
            source_id=d.pop("source_id", UNSET),
        )
        candidate.additional_properties = d
        return candidate
