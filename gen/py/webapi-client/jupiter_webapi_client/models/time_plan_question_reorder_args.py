from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.recurring_task_period import RecurringTaskPeriod

T = TypeVar("T", bound="TimePlanQuestionReorderArgs")


@_attrs_define
class TimePlanQuestionReorderArgs:
    """TimePlanQuestionReorder args.

    Attributes:
        period (RecurringTaskPeriod): A period for a particular task.
        order_of_questions (list[str]):
    """

    period: RecurringTaskPeriod
    order_of_questions: list[str]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        period = self.period.value

        order_of_questions = self.order_of_questions

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "period": period,
                "order_of_questions": order_of_questions,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        period = RecurringTaskPeriod(d.pop("period"))

        order_of_questions = cast(list[str], d.pop("order_of_questions"))

        time_plan_question_reorder_args = cls(
            period=period,
            order_of_questions=order_of_questions,
        )

        time_plan_question_reorder_args.additional_properties = d
        return time_plan_question_reorder_args

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
