from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.empty_home_widget_properties import EmptyHomeWidgetProperties
    from ..models.key_habits_streaks_home_widget_properties import KeyHabitsStreaksHomeWidgetProperties


T = TypeVar("T", bound="HomeWidgetUpdatePropertiesArgs")


@_attrs_define
class HomeWidgetUpdatePropertiesArgs:
    """The arguments for changing the properties of a home widget.

    Attributes:
        ref_id (str): A generic entity id.
        properties (EmptyHomeWidgetProperties | KeyHabitsStreaksHomeWidgetProperties):
    """

    ref_id: str
    properties: EmptyHomeWidgetProperties | KeyHabitsStreaksHomeWidgetProperties
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.key_habits_streaks_home_widget_properties import KeyHabitsStreaksHomeWidgetProperties  # noqa: PLC0415

        ref_id = self.ref_id

        properties: dict[str, Any]
        if isinstance(self.properties, KeyHabitsStreaksHomeWidgetProperties):
            properties = self.properties.to_dict()
        else:
            properties = self.properties.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
                "properties": properties,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.empty_home_widget_properties import EmptyHomeWidgetProperties  # noqa: PLC0415
        from ..models.key_habits_streaks_home_widget_properties import KeyHabitsStreaksHomeWidgetProperties  # noqa: PLC0415

        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        def _parse_properties(data: object) -> EmptyHomeWidgetProperties | KeyHabitsStreaksHomeWidgetProperties:
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                properties_type_0 = KeyHabitsStreaksHomeWidgetProperties.from_dict(data)

                return properties_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            if not isinstance(data, dict):
                raise TypeError()
            properties_type_1 = EmptyHomeWidgetProperties.from_dict(data)

            return properties_type_1

        properties = _parse_properties(d.pop("properties"))

        home_widget_update_properties_args = cls(
            ref_id=ref_id,
            properties=properties,
        )

        home_widget_update_properties_args.additional_properties = d
        return home_widget_update_properties_args

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
