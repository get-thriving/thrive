from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.jupiter_web_api_location_resolver import JupiterWebApiLocationResolver
from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.gps_coordinates import GpsCoordinates


T = TypeVar("T", bound="LocationResolverCandidate")


@_attrs_define
class LocationResolverCandidate:
    """A location suggested by a resolver, not yet stored in the workspace.

    Attributes:
        name (str): The name of a location.
        source (JupiterWebApiLocationResolver): External location suggestion backend.
        address_line (None | str | Unset):
        country (None | str | Unset):
        gps (GpsCoordinates | None | Unset):
        source_id (None | str | Unset):
    """

    name: str
    source: JupiterWebApiLocationResolver
    address_line: None | str | Unset = UNSET
    country: None | str | Unset = UNSET
    gps: GpsCoordinates | None | Unset = UNSET
    source_id: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.gps_coordinates import GpsCoordinates  # noqa: PLC0415

        name = self.name

        source = self.source.value

        address_line: None | str | Unset
        if isinstance(self.address_line, Unset):
            address_line = UNSET
        else:
            address_line = self.address_line

        country: None | str | Unset
        if isinstance(self.country, Unset):
            country = UNSET
        else:
            country = self.country

        gps: dict[str, Any] | None | Unset
        if isinstance(self.gps, Unset):
            gps = UNSET
        elif isinstance(self.gps, GpsCoordinates):
            gps = self.gps.to_dict()
        else:
            gps = self.gps

        source_id: None | str | Unset
        if isinstance(self.source_id, Unset):
            source_id = UNSET
        else:
            source_id = self.source_id

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "name": name,
                "source": source,
            }
        )
        if address_line is not UNSET:
            field_dict["address_line"] = address_line
        if country is not UNSET:
            field_dict["country"] = country
        if gps is not UNSET:
            field_dict["gps"] = gps
        if source_id is not UNSET:
            field_dict["source_id"] = source_id

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.gps_coordinates import GpsCoordinates  # noqa: PLC0415

        d = dict(src_dict)
        name = d.pop("name")

        source = JupiterWebApiLocationResolver(d.pop("source"))

        def _parse_address_line(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        address_line = _parse_address_line(d.pop("address_line", UNSET))

        def _parse_country(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        country = _parse_country(d.pop("country", UNSET))

        def _parse_gps(data: object) -> GpsCoordinates | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                gps_type_0 = GpsCoordinates.from_dict(data)

                return gps_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(GpsCoordinates | None | Unset, data)

        gps = _parse_gps(d.pop("gps", UNSET))

        def _parse_source_id(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        source_id = _parse_source_id(d.pop("source_id", UNSET))

        location_resolver_candidate = cls(
            name=name,
            source=source,
            address_line=address_line,
            country=country,
            gps=gps,
            source_id=source_id,
        )

        location_resolver_candidate.additional_properties = d
        return location_resolver_candidate

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
