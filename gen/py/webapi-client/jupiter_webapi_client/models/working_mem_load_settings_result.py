from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.recurring_task_period import RecurringTaskPeriod

if TYPE_CHECKING:
    from ..models.aspect import Aspect
    from ..models.inbox_task import InboxTask


T = TypeVar("T", bound="WorkingMemLoadSettingsResult")


@_attrs_define
class WorkingMemLoadSettingsResult:
    """WorkingMemLoadSettings results.

    Attributes:
        generation_period (RecurringTaskPeriod): A period for a particular task.
        cleanup_aspect (Aspect): The aspect.
        clean_up_inbox_tasks (list[InboxTask]):
    """

    generation_period: RecurringTaskPeriod
    cleanup_aspect: Aspect
    clean_up_inbox_tasks: list[InboxTask]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        generation_period = self.generation_period.value

        cleanup_aspect = self.cleanup_aspect.to_dict()

        clean_up_inbox_tasks = []
        for clean_up_inbox_tasks_item_data in self.clean_up_inbox_tasks:
            clean_up_inbox_tasks_item = clean_up_inbox_tasks_item_data.to_dict()
            clean_up_inbox_tasks.append(clean_up_inbox_tasks_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "generation_period": generation_period,
                "cleanup_aspect": cleanup_aspect,
                "clean_up_inbox_tasks": clean_up_inbox_tasks,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.aspect import Aspect
        from ..models.inbox_task import InboxTask

        d = dict(src_dict)
        generation_period = RecurringTaskPeriod(d.pop("generation_period"))

        cleanup_aspect = Aspect.from_dict(d.pop("cleanup_aspect"))

        clean_up_inbox_tasks = []
        _clean_up_inbox_tasks = d.pop("clean_up_inbox_tasks")
        for clean_up_inbox_tasks_item_data in _clean_up_inbox_tasks:
            clean_up_inbox_tasks_item = InboxTask.from_dict(clean_up_inbox_tasks_item_data)

            clean_up_inbox_tasks.append(clean_up_inbox_tasks_item)

        working_mem_load_settings_result = cls(
            generation_period=generation_period,
            cleanup_aspect=cleanup_aspect,
            clean_up_inbox_tasks=clean_up_inbox_tasks,
        )

        working_mem_load_settings_result.additional_properties = d
        return working_mem_load_settings_result

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
