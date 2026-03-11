from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.life_plan_eval_approach import LifePlanEvalApproach
from ..models.recurring_task_period import RecurringTaskPeriod
from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.inbox_task import InboxTask
    from ..models.life_plan_load_eval_settings_result_eval_task_generation_in_advance_days import (
        LifePlanLoadEvalSettingsResultEvalTaskGenerationInAdvanceDays,
    )
    from ..models.recurring_task_gen_params import RecurringTaskGenParams


T = TypeVar("T", bound="LifePlanLoadEvalSettingsResult")


@_attrs_define
class LifePlanLoadEvalSettingsResult:
    """LifePlanLoadEvalSettings results.

    Attributes:
        eval_periods (list[RecurringTaskPeriod]):
        eval_approach (LifePlanEvalApproach): The approach to generate life plan eval tasks.
        eval_task_generation_in_advance_days (LifePlanLoadEvalSettingsResultEvalTaskGenerationInAdvanceDays):
        eval_tasks (list[InboxTask]):
        eval_task_gen_params (None | RecurringTaskGenParams | Unset):
    """

    eval_periods: list[RecurringTaskPeriod]
    eval_approach: LifePlanEvalApproach
    eval_task_generation_in_advance_days: LifePlanLoadEvalSettingsResultEvalTaskGenerationInAdvanceDays
    eval_tasks: list[InboxTask]
    eval_task_gen_params: None | RecurringTaskGenParams | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.recurring_task_gen_params import RecurringTaskGenParams

        eval_periods = []
        for eval_periods_item_data in self.eval_periods:
            eval_periods_item = eval_periods_item_data.value
            eval_periods.append(eval_periods_item)

        eval_approach = self.eval_approach.value

        eval_task_generation_in_advance_days = self.eval_task_generation_in_advance_days.to_dict()

        eval_tasks = []
        for eval_tasks_item_data in self.eval_tasks:
            eval_tasks_item = eval_tasks_item_data.to_dict()
            eval_tasks.append(eval_tasks_item)

        eval_task_gen_params: dict[str, Any] | None | Unset
        if isinstance(self.eval_task_gen_params, Unset):
            eval_task_gen_params = UNSET
        elif isinstance(self.eval_task_gen_params, RecurringTaskGenParams):
            eval_task_gen_params = self.eval_task_gen_params.to_dict()
        else:
            eval_task_gen_params = self.eval_task_gen_params

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "eval_periods": eval_periods,
                "eval_approach": eval_approach,
                "eval_task_generation_in_advance_days": eval_task_generation_in_advance_days,
                "eval_tasks": eval_tasks,
            }
        )
        if eval_task_gen_params is not UNSET:
            field_dict["eval_task_gen_params"] = eval_task_gen_params

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.inbox_task import InboxTask
        from ..models.life_plan_load_eval_settings_result_eval_task_generation_in_advance_days import (
            LifePlanLoadEvalSettingsResultEvalTaskGenerationInAdvanceDays,
        )
        from ..models.recurring_task_gen_params import RecurringTaskGenParams

        d = dict(src_dict)
        eval_periods = []
        _eval_periods = d.pop("eval_periods")
        for eval_periods_item_data in _eval_periods:
            eval_periods_item = RecurringTaskPeriod(eval_periods_item_data)

            eval_periods.append(eval_periods_item)

        eval_approach = LifePlanEvalApproach(d.pop("eval_approach"))

        eval_task_generation_in_advance_days = LifePlanLoadEvalSettingsResultEvalTaskGenerationInAdvanceDays.from_dict(
            d.pop("eval_task_generation_in_advance_days")
        )

        eval_tasks = []
        _eval_tasks = d.pop("eval_tasks")
        for eval_tasks_item_data in _eval_tasks:
            eval_tasks_item = InboxTask.from_dict(eval_tasks_item_data)

            eval_tasks.append(eval_tasks_item)

        def _parse_eval_task_gen_params(data: object) -> None | RecurringTaskGenParams | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                eval_task_gen_params_type_0 = RecurringTaskGenParams.from_dict(data)

                return eval_task_gen_params_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | RecurringTaskGenParams | Unset, data)

        eval_task_gen_params = _parse_eval_task_gen_params(d.pop("eval_task_gen_params", UNSET))

        life_plan_load_eval_settings_result = cls(
            eval_periods=eval_periods,
            eval_approach=eval_approach,
            eval_task_generation_in_advance_days=eval_task_generation_in_advance_days,
            eval_tasks=eval_tasks,
            eval_task_gen_params=eval_task_gen_params,
        )

        life_plan_load_eval_settings_result.additional_properties = d
        return life_plan_load_eval_settings_result

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
