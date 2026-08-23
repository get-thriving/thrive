from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.time_plan_question import TimePlanQuestion
    from ..models.time_plan_question_find_result_order_of_questions import TimePlanQuestionFindResultOrderOfQuestions


T = TypeVar("T", bound="TimePlanQuestionFindResult")


@_attrs_define
class TimePlanQuestionFindResult:
    """TimePlanQuestionFind result.

    Attributes:
        questions (list[TimePlanQuestion]):
        order_of_questions (TimePlanQuestionFindResultOrderOfQuestions):
    """

    questions: list[TimePlanQuestion]
    order_of_questions: TimePlanQuestionFindResultOrderOfQuestions
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        questions = []
        for questions_item_data in self.questions:
            questions_item = questions_item_data.to_dict()
            questions.append(questions_item)

        order_of_questions = self.order_of_questions.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "questions": questions,
                "order_of_questions": order_of_questions,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.time_plan_question import TimePlanQuestion
        from ..models.time_plan_question_find_result_order_of_questions import (
            TimePlanQuestionFindResultOrderOfQuestions,
        )

        d = dict(src_dict)
        questions = []
        _questions = d.pop("questions")
        for questions_item_data in _questions:
            questions_item = TimePlanQuestion.from_dict(questions_item_data)

            questions.append(questions_item)

        order_of_questions = TimePlanQuestionFindResultOrderOfQuestions.from_dict(d.pop("order_of_questions"))

        time_plan_question_find_result = cls(
            questions=questions,
            order_of_questions=order_of_questions,
        )

        time_plan_question_find_result.additional_properties = d
        return time_plan_question_find_result

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
