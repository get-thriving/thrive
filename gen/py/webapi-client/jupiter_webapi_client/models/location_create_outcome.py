from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.location import Location


T = TypeVar("T", bound="LocationCreateOutcome")


@_attrs_define
class LocationCreateOutcome:
    """A newly created location, or an existing one reused by dedup.

    Attributes:
        location (Location): A location.
        deduped (bool):
    """

    location: Location
    deduped: bool
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        location = self.location.to_dict()

        deduped = self.deduped

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "location": location,
                "deduped": deduped,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.location import Location  # noqa: PLC0415

        d = dict(src_dict)
        location = Location.from_dict(d.pop("location"))

        deduped = d.pop("deduped")

        location_create_outcome = cls(
            location=location,
            deduped=deduped,
        )

        location_create_outcome.additional_properties = d
        return location_create_outcome

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
