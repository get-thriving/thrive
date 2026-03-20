from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.inbox_task import InboxTask
    from ..models.todo_task import TodoTask


T = TypeVar("T", bound="TodoTaskCreateResult")


@_attrs_define
class TodoTaskCreateResult:
    """TodoTaskCreate result.

    Attributes:
        new_todo_task (TodoTask): A todo task.
        new_inbox_task (InboxTask): An inbox task.
    """

    new_todo_task: TodoTask
    new_inbox_task: InboxTask
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        new_todo_task = self.new_todo_task.to_dict()

        new_inbox_task = self.new_inbox_task.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "new_todo_task": new_todo_task,
                "new_inbox_task": new_inbox_task,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.inbox_task import InboxTask
        from ..models.todo_task import TodoTask

        d = dict(src_dict)
        new_todo_task = TodoTask.from_dict(d.pop("new_todo_task"))

        new_inbox_task = InboxTask.from_dict(d.pop("new_inbox_task"))

        todo_task_create_result = cls(
            new_todo_task=new_todo_task,
            new_inbox_task=new_inbox_task,
        )

        todo_task_create_result.additional_properties = d
        return todo_task_create_result

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
