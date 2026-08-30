from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.journal_question import JournalQuestion


T = TypeVar("T", bound="JournalQuestionLoadResult")


@_attrs_define
class JournalQuestionLoadResult:
    """JournalQuestionLoad result.

    Attributes:
        journal_question (JournalQuestion): A standard question attached to the journal collection.
    """

    journal_question: JournalQuestion
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        journal_question = self.journal_question.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "journal_question": journal_question,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.journal_question import JournalQuestion  # noqa: PLC0415

        d = dict(src_dict)
        journal_question = JournalQuestion.from_dict(d.pop("journal_question"))

        journal_question_load_result = cls(
            journal_question=journal_question,
        )

        journal_question_load_result.additional_properties = d
        return journal_question_load_result

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
