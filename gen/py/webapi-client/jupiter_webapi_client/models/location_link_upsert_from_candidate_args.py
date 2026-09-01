from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.gps_coordinates import GpsCoordinates


T = TypeVar("T", bound="LocationLinkUpsertFromCandidateArgs")


@_attrs_define
class LocationLinkUpsertFromCandidateArgs:
    """LocationLinkUpsertFromCandidate args.

    Attributes:
        owner (str): A reference combining an entity kind, a purpose, and an entity id.
        name (None | str | Unset):
        address_line (None | str | Unset):
        country (None | str | Unset):
        gps (GpsCoordinates | None | Unset):
    """

    owner: str
    name: None | str | Unset = UNSET
    address_line: None | str | Unset = UNSET
    country: None | str | Unset = UNSET
    gps: GpsCoordinates | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.gps_coordinates import GpsCoordinates  # noqa: PLC0415

        owner = self.owner

        name: None | str | Unset
        if isinstance(self.name, Unset):
            name = UNSET
        else:
            name = self.name

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

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "owner": owner,
            }
        )
        if name is not UNSET:
            field_dict["name"] = name
        if address_line is not UNSET:
            field_dict["address_line"] = address_line
        if country is not UNSET:
            field_dict["country"] = country
        if gps is not UNSET:
            field_dict["gps"] = gps

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.gps_coordinates import GpsCoordinates  # noqa: PLC0415

        d = dict(src_dict)
        owner = d.pop("owner")

        def _parse_name(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        name = _parse_name(d.pop("name", UNSET))

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

        location_link_upsert_from_candidate_args = cls(
            owner=owner,
            name=name,
            address_line=address_line,
            country=country,
            gps=gps,
        )

        location_link_upsert_from_candidate_args.additional_properties = d
        return location_link_upsert_from_candidate_args

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
