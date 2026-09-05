from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.gps_coordinates import GpsCoordinates


T = TypeVar("T", bound="LocationUpdateArgsGps")


@_attrs_define
class LocationUpdateArgsGps:
    """
    Attributes:
        should_change (bool):
        value (GpsCoordinates | None | Unset):
    """

    should_change: bool
    value: GpsCoordinates | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.gps_coordinates import GpsCoordinates  # noqa: PLC0415

        should_change = self.should_change

        value: dict[str, Any] | None | Unset
        if isinstance(self.value, Unset):
            value = UNSET
        elif isinstance(self.value, GpsCoordinates):
            value = self.value.to_dict()
        else:
            value = self.value

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "should_change": should_change,
            }
        )
        if value is not UNSET:
            field_dict["value"] = value

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.gps_coordinates import GpsCoordinates  # noqa: PLC0415

        d = dict(src_dict)
        should_change = d.pop("should_change")

        def _parse_value(data: object) -> GpsCoordinates | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                value_type_0 = GpsCoordinates.from_dict(data)

                return value_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(GpsCoordinates | None | Unset, data)

        value = _parse_value(d.pop("value", UNSET))

        location_update_args_gps = cls(
            should_change=should_change,
            value=value,
        )

        location_update_args_gps.additional_properties = d
        return location_update_args_gps

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
