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
    """LocationSearch result."""

    locations: list["Location"]
    candidates: list["LocationResolverCandidate"]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "locations": [item.to_dict() for item in self.locations],
            "candidates": [item.to_dict() for item in self.candidates],
            **self.additional_properties,
        }

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.location import Location
        from ..models.location_resolver_candidate import LocationResolverCandidate

        d = dict(src_dict)
        result = cls(
            locations=[
                Location.from_dict(item) for item in d.pop("locations")
            ],
            candidates=[
                LocationResolverCandidate.from_dict(item)
                for item in d.pop("candidates")
            ],
        )
        result.additional_properties = d
        return result
