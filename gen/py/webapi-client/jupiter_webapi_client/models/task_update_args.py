from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.task_update_args_actionable_date import TaskUpdateArgsActionableDate
    from ..models.task_update_args_difficulty import TaskUpdateArgsDifficulty
    from ..models.task_update_args_due_date import TaskUpdateArgsDueDate
    from ..models.task_update_args_eisen import TaskUpdateArgsEisen
    from ..models.task_update_args_is_key import TaskUpdateArgsIsKey
    from ..models.task_update_args_name import TaskUpdateArgsName
    from ..models.task_update_args_recurring_gen_right_now import TaskUpdateArgsRecurringGenRightNow
    from ..models.task_update_args_recurring_repeat_index import TaskUpdateArgsRecurringRepeatIndex
    from ..models.task_update_args_recurring_timeline import TaskUpdateArgsRecurringTimeline
    from ..models.task_update_args_status import TaskUpdateArgsStatus


T = TypeVar("T", bound="TaskUpdateArgs")


@_attrs_define
class TaskUpdateArgs:
    """TaskUpdate args.

    Attributes:
        ref_id (str): A generic entity id.
        name (TaskUpdateArgsName):
        status (TaskUpdateArgsStatus):
        is_key (TaskUpdateArgsIsKey):
        eisen (TaskUpdateArgsEisen):
        difficulty (TaskUpdateArgsDifficulty):
        actionable_date (TaskUpdateArgsActionableDate):
        due_date (TaskUpdateArgsDueDate):
        recurring_timeline (TaskUpdateArgsRecurringTimeline):
        recurring_repeat_index (TaskUpdateArgsRecurringRepeatIndex):
        recurring_gen_right_now (TaskUpdateArgsRecurringGenRightNow):
    """

    ref_id: str
    name: TaskUpdateArgsName
    status: TaskUpdateArgsStatus
    is_key: TaskUpdateArgsIsKey
    eisen: TaskUpdateArgsEisen
    difficulty: TaskUpdateArgsDifficulty
    actionable_date: TaskUpdateArgsActionableDate
    due_date: TaskUpdateArgsDueDate
    recurring_timeline: TaskUpdateArgsRecurringTimeline
    recurring_repeat_index: TaskUpdateArgsRecurringRepeatIndex
    recurring_gen_right_now: TaskUpdateArgsRecurringGenRightNow
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        name = self.name.to_dict()

        status = self.status.to_dict()

        is_key = self.is_key.to_dict()

        eisen = self.eisen.to_dict()

        difficulty = self.difficulty.to_dict()

        actionable_date = self.actionable_date.to_dict()

        due_date = self.due_date.to_dict()

        recurring_timeline = self.recurring_timeline.to_dict()

        recurring_repeat_index = self.recurring_repeat_index.to_dict()

        recurring_gen_right_now = self.recurring_gen_right_now.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
                "name": name,
                "status": status,
                "is_key": is_key,
                "eisen": eisen,
                "difficulty": difficulty,
                "actionable_date": actionable_date,
                "due_date": due_date,
                "recurring_timeline": recurring_timeline,
                "recurring_repeat_index": recurring_repeat_index,
                "recurring_gen_right_now": recurring_gen_right_now,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.task_update_args_actionable_date import TaskUpdateArgsActionableDate
        from ..models.task_update_args_difficulty import TaskUpdateArgsDifficulty
        from ..models.task_update_args_due_date import TaskUpdateArgsDueDate
        from ..models.task_update_args_eisen import TaskUpdateArgsEisen
        from ..models.task_update_args_is_key import TaskUpdateArgsIsKey
        from ..models.task_update_args_name import TaskUpdateArgsName
        from ..models.task_update_args_recurring_gen_right_now import TaskUpdateArgsRecurringGenRightNow
        from ..models.task_update_args_recurring_repeat_index import TaskUpdateArgsRecurringRepeatIndex
        from ..models.task_update_args_recurring_timeline import TaskUpdateArgsRecurringTimeline
        from ..models.task_update_args_status import TaskUpdateArgsStatus

        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        name = TaskUpdateArgsName.from_dict(d.pop("name"))

        status = TaskUpdateArgsStatus.from_dict(d.pop("status"))

        is_key = TaskUpdateArgsIsKey.from_dict(d.pop("is_key"))

        eisen = TaskUpdateArgsEisen.from_dict(d.pop("eisen"))

        difficulty = TaskUpdateArgsDifficulty.from_dict(d.pop("difficulty"))

        actionable_date = TaskUpdateArgsActionableDate.from_dict(d.pop("actionable_date"))

        due_date = TaskUpdateArgsDueDate.from_dict(d.pop("due_date"))

        recurring_timeline = TaskUpdateArgsRecurringTimeline.from_dict(d.pop("recurring_timeline"))

        recurring_repeat_index = TaskUpdateArgsRecurringRepeatIndex.from_dict(d.pop("recurring_repeat_index"))

        recurring_gen_right_now = TaskUpdateArgsRecurringGenRightNow.from_dict(d.pop("recurring_gen_right_now"))

        task_update_args = cls(
            ref_id=ref_id,
            name=name,
            status=status,
            is_key=is_key,
            eisen=eisen,
            difficulty=difficulty,
            actionable_date=actionable_date,
            due_date=due_date,
            recurring_timeline=recurring_timeline,
            recurring_repeat_index=recurring_repeat_index,
            recurring_gen_right_now=recurring_gen_right_now,
        )

        task_update_args.additional_properties = d
        return task_update_args

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
