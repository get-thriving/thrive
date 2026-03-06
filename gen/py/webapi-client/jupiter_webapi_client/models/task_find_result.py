from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.task import Task


T = TypeVar("T", bound="TaskFindResult")


@_attrs_define
class TaskFindResult:
    """TaskFind result.

    Attributes:
        tasks (list[Task]):
    """

    tasks: list[Task]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        tasks = []
        for tasks_item_data in self.tasks:
            tasks_item = tasks_item_data.to_dict()
            tasks.append(tasks_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "tasks": tasks,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.task import Task

        d = dict(src_dict)
        tasks = []
        _tasks = d.pop("tasks")
        for tasks_item_data in _tasks:
            tasks_item = Task.from_dict(tasks_item_data)

            tasks.append(tasks_item)

        task_find_result = cls(
            tasks=tasks,
        )

        task_find_result.additional_properties = d
        return task_find_result

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
