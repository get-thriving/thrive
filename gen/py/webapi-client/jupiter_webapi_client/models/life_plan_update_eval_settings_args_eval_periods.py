from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.recurring_task_period import RecurringTaskPeriod
from ..types import UNSET, Unset

T = TypeVar("T", bound="LifePlanUpdateEvalSettingsArgsEvalPeriods")


@_attrs_define
class LifePlanUpdateEvalSettingsArgsEvalPeriods:
    """
    Attributes:
        should_change (bool):
        value (list[RecurringTaskPeriod] | Unset):
    """

    should_change: bool
    value: list[RecurringTaskPeriod] | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        should_change = self.should_change

        value: list[str] | Unset = UNSET
        if not isinstance(self.value, Unset):
            value = []
            for value_item_data in self.value:
                value_item = value_item_data.value
                value.append(value_item)

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
        d = dict(src_dict)
        should_change = d.pop("should_change")

        _value = d.pop("value", UNSET)
        value: list[RecurringTaskPeriod] | Unset = UNSET
        if _value is not UNSET:
            value = []
            for value_item_data in _value:
                value_item = RecurringTaskPeriod(value_item_data)

                value.append(value_item)

        life_plan_update_eval_settings_args_eval_periods = cls(
            should_change=should_change,
            value=value,
        )

        life_plan_update_eval_settings_args_eval_periods.additional_properties = d
        return life_plan_update_eval_settings_args_eval_periods

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
