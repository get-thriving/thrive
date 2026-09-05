from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.location import Location
    from ..models.location_link import LocationLink


T = TypeVar("T", bound="LocationLinkUpsertFromCandidateResult")


@_attrs_define
class LocationLinkUpsertFromCandidateResult:
    """LocationLinkUpsertFromCandidate result.

    Attributes:
        new_location (Location): A location.
        location_link (LocationLink): A link between an entity and its locations.
        deduped (bool):
    """

    new_location: Location
    location_link: LocationLink
    deduped: bool
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        new_location = self.new_location.to_dict()

        location_link = self.location_link.to_dict()

        deduped = self.deduped

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "new_location": new_location,
                "location_link": location_link,
                "deduped": deduped,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.location import Location  # noqa: PLC0415
        from ..models.location_link import LocationLink  # noqa: PLC0415

        d = dict(src_dict)
        new_location = Location.from_dict(d.pop("new_location"))

        location_link = LocationLink.from_dict(d.pop("location_link"))

        deduped = d.pop("deduped")

        location_link_upsert_from_candidate_result = cls(
            new_location=new_location,
            location_link=location_link,
            deduped=deduped,
        )

        location_link_upsert_from_candidate_result.additional_properties = d
        return location_link_upsert_from_candidate_result

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
