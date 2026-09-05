from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.location import Location
    from ..models.location_resolver_candidate import LocationResolverCandidate


T = TypeVar("T", bound="LocationSearchResult")


@_attrs_define
class LocationSearchResult:
    """LocationSearch result.

    Attributes:
        locations (list[Location]):
        candidates (list[LocationResolverCandidate]):
    """

    locations: list[Location]
    candidates: list[LocationResolverCandidate]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        locations = []
        for locations_item_data in self.locations:
            locations_item = locations_item_data.to_dict()
            locations.append(locations_item)

        candidates = []
        for candidates_item_data in self.candidates:
            candidates_item = candidates_item_data.to_dict()
            candidates.append(candidates_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "locations": locations,
                "candidates": candidates,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.location import Location  # noqa: PLC0415
        from ..models.location_resolver_candidate import LocationResolverCandidate  # noqa: PLC0415

        d = dict(src_dict)
        locations = []
        _locations = d.pop("locations")
        for locations_item_data in _locations:
            locations_item = Location.from_dict(locations_item_data)

            locations.append(locations_item)

        candidates = []
        _candidates = d.pop("candidates")
        for candidates_item_data in _candidates:
            candidates_item = LocationResolverCandidate.from_dict(candidates_item_data)

            candidates.append(candidates_item)

        location_search_result = cls(
            locations=locations,
            candidates=candidates,
        )

        location_search_result.additional_properties = d
        return location_search_result

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
