from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.location_link import LocationLink


T = TypeVar("T", bound="LocationLinkUpsertResult")


@_attrs_define
class LocationLinkUpsertResult:
    """LocationLinkUpsert result.

    Attributes:
        location_link (LocationLink): A link between an entity and its locations.
    """

    location_link: LocationLink
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        location_link = self.location_link.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "location_link": location_link,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.location_link import LocationLink  # noqa: PLC0415

        d = dict(src_dict)
        location_link = LocationLink.from_dict(d.pop("location_link"))

        location_link_upsert_result = cls(
            location_link=location_link,
        )

        location_link_upsert_result.additional_properties = d
        return location_link_upsert_result

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
