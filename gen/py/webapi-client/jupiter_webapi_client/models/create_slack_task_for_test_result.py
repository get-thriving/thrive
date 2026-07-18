from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.slack_task import SlackTask


T = TypeVar("T", bound="CreateSlackTaskForTestResult")


@_attrs_define
class CreateSlackTaskForTestResult:
    """Result of creating a slack task in tests.

    Attributes:
        new_slack_task (SlackTask): A Slack task which needs to be converted into an inbox task.
    """

    new_slack_task: SlackTask
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        new_slack_task = self.new_slack_task.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "new_slack_task": new_slack_task,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.slack_task import SlackTask

        d = dict(src_dict)
        new_slack_task = SlackTask.from_dict(d.pop("new_slack_task"))

        create_slack_task_for_test_result = cls(
            new_slack_task=new_slack_task,
        )

        create_slack_task_for_test_result.additional_properties = d
        return create_slack_task_for_test_result

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
