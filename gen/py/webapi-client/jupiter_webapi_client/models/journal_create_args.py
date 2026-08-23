from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.recurring_task_period import RecurringTaskPeriod
from ..types import UNSET, Unset

T = TypeVar("T", bound="JournalCreateArgs")


@_attrs_define
class JournalCreateArgs:
    """JournalCreate args.

    Attributes:
        right_now (str): A date or possibly a datetime for the application.
        period (RecurringTaskPeriod): A period for a particular task.
        question_ref_ids (list[str] | None | Unset):
    """

    right_now: str
    period: RecurringTaskPeriod
    question_ref_ids: list[str] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        right_now = self.right_now

        period = self.period.value

        question_ref_ids: list[str] | None | Unset
        if isinstance(self.question_ref_ids, Unset):
            question_ref_ids = UNSET
        elif isinstance(self.question_ref_ids, list):
            question_ref_ids = self.question_ref_ids

        else:
            question_ref_ids = self.question_ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "right_now": right_now,
                "period": period,
            }
        )
        if question_ref_ids is not UNSET:
            field_dict["question_ref_ids"] = question_ref_ids

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        right_now = d.pop("right_now")

        period = RecurringTaskPeriod(d.pop("period"))

        def _parse_question_ref_ids(data: object) -> list[str] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                question_ref_ids_type_0 = cast(list[str], data)

                return question_ref_ids_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[str] | None | Unset, data)

        question_ref_ids = _parse_question_ref_ids(d.pop("question_ref_ids", UNSET))

        journal_create_args = cls(
            right_now=right_now,
            period=period,
            question_ref_ids=question_ref_ids,
        )

        journal_create_args.additional_properties = d
        return journal_create_args

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
