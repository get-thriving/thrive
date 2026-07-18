from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.email_task import EmailTask


T = TypeVar("T", bound="CreateEmailTaskForTestResult")


@_attrs_define
class CreateEmailTaskForTestResult:
    """Result of creating an email task in tests.

    Attributes:
        new_email_task (EmailTask): An email task which needs to be converted into an inbox task.
    """

    new_email_task: EmailTask
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        new_email_task = self.new_email_task.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "new_email_task": new_email_task,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.email_task import EmailTask

        d = dict(src_dict)
        new_email_task = EmailTask.from_dict(d.pop("new_email_task"))

        create_email_task_for_test_result = cls(
            new_email_task=new_email_task,
        )

        create_email_task_for_test_result.additional_properties = d
        return create_email_task_for_test_result

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
