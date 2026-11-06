from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.widget_dimension import WidgetDimension
from ..models.widget_type import WidgetType

if TYPE_CHECKING:
    from ..models.empty_home_widget_properties import EmptyHomeWidgetProperties
    from ..models.key_big_plans_progress_home_widget_properties import KeyBigPlansProgressHomeWidgetProperties
    from ..models.key_habits_streaks_home_widget_properties import KeyHabitsStreaksHomeWidgetProperties


T = TypeVar("T", bound="HomeWidgetCreateArgs")


@_attrs_define
class HomeWidgetCreateArgs:
    """The arguments for the create home widget use case.

    Attributes:
        home_tab_ref_id (str): A generic entity id.
        the_type (WidgetType): A type of widget.
        row (int):
        col (int):
        dimension (WidgetDimension): A dimension of a widget.
        properties (EmptyHomeWidgetProperties | KeyBigPlansProgressHomeWidgetProperties |
            KeyHabitsStreaksHomeWidgetProperties | None):
    """

    home_tab_ref_id: str
    the_type: WidgetType
    row: int
    col: int
    dimension: WidgetDimension
    properties: (
        EmptyHomeWidgetProperties
        | KeyBigPlansProgressHomeWidgetProperties
        | KeyHabitsStreaksHomeWidgetProperties
        | None
    )
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.empty_home_widget_properties import EmptyHomeWidgetProperties  # noqa: PLC0415
        from ..models.key_big_plans_progress_home_widget_properties import KeyBigPlansProgressHomeWidgetProperties  # noqa: PLC0415
        from ..models.key_habits_streaks_home_widget_properties import KeyHabitsStreaksHomeWidgetProperties  # noqa: PLC0415

        home_tab_ref_id = self.home_tab_ref_id

        the_type = self.the_type.value

        row = self.row

        col = self.col

        dimension = self.dimension.value

        properties: dict[str, Any] | None
        if isinstance(self.properties, KeyHabitsStreaksHomeWidgetProperties):
            properties = self.properties.to_dict()
        elif isinstance(self.properties, KeyBigPlansProgressHomeWidgetProperties):
            properties = self.properties.to_dict()
        elif isinstance(self.properties, EmptyHomeWidgetProperties):
            properties = self.properties.to_dict()
        else:
            properties = self.properties

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "home_tab_ref_id": home_tab_ref_id,
                "the_type": the_type,
                "row": row,
                "col": col,
                "dimension": dimension,
                "properties": properties,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.empty_home_widget_properties import EmptyHomeWidgetProperties  # noqa: PLC0415
        from ..models.key_big_plans_progress_home_widget_properties import KeyBigPlansProgressHomeWidgetProperties  # noqa: PLC0415
        from ..models.key_habits_streaks_home_widget_properties import KeyHabitsStreaksHomeWidgetProperties  # noqa: PLC0415

        d = dict(src_dict)
        home_tab_ref_id = d.pop("home_tab_ref_id")

        the_type = WidgetType(d.pop("the_type"))

        row = d.pop("row")

        col = d.pop("col")

        dimension = WidgetDimension(d.pop("dimension"))

        def _parse_properties(
            data: object,
        ) -> (
            EmptyHomeWidgetProperties
            | KeyBigPlansProgressHomeWidgetProperties
            | KeyHabitsStreaksHomeWidgetProperties
            | None
        ):
            if data is None:
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                properties_type_0 = KeyHabitsStreaksHomeWidgetProperties.from_dict(data)

                return properties_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                properties_type_1 = KeyBigPlansProgressHomeWidgetProperties.from_dict(data)

                return properties_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                properties_type_2 = EmptyHomeWidgetProperties.from_dict(data)

                return properties_type_2
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(
                EmptyHomeWidgetProperties
                | KeyBigPlansProgressHomeWidgetProperties
                | KeyHabitsStreaksHomeWidgetProperties
                | None,
                data,
            )

        properties = _parse_properties(d.pop("properties"))

        home_widget_create_args = cls(
            home_tab_ref_id=home_tab_ref_id,
            the_type=the_type,
            row=row,
            col=col,
            dimension=dimension,
            properties=properties,
        )

        home_widget_create_args.additional_properties = d
        return home_widget_create_args

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
