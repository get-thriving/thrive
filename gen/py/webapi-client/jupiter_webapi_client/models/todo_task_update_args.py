from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.todo_task_update_args_actionable_date import TodoTaskUpdateArgsActionableDate
    from ..models.todo_task_update_args_aspect_ref_id import TodoTaskUpdateArgsAspectRefId
    from ..models.todo_task_update_args_chapter_ref_id import TodoTaskUpdateArgsChapterRefId
    from ..models.todo_task_update_args_difficulty import TodoTaskUpdateArgsDifficulty
    from ..models.todo_task_update_args_due_date import TodoTaskUpdateArgsDueDate
    from ..models.todo_task_update_args_eisen import TodoTaskUpdateArgsEisen
    from ..models.todo_task_update_args_goal_ref_id import TodoTaskUpdateArgsGoalRefId
    from ..models.todo_task_update_args_is_key import TodoTaskUpdateArgsIsKey
    from ..models.todo_task_update_args_name import TodoTaskUpdateArgsName
    from ..models.todo_task_update_args_status import TodoTaskUpdateArgsStatus


T = TypeVar("T", bound="TodoTaskUpdateArgs")


@_attrs_define
class TodoTaskUpdateArgs:
    """TodoTaskUpdate args.

    Attributes:
        ref_id (str): A generic entity id.
        name (TodoTaskUpdateArgsName):
        status (TodoTaskUpdateArgsStatus):
        aspect_ref_id (TodoTaskUpdateArgsAspectRefId):
        chapter_ref_id (TodoTaskUpdateArgsChapterRefId):
        goal_ref_id (TodoTaskUpdateArgsGoalRefId):
        is_key (TodoTaskUpdateArgsIsKey):
        eisen (TodoTaskUpdateArgsEisen):
        difficulty (TodoTaskUpdateArgsDifficulty):
        actionable_date (TodoTaskUpdateArgsActionableDate):
        due_date (TodoTaskUpdateArgsDueDate):
    """

    ref_id: str
    name: TodoTaskUpdateArgsName
    status: TodoTaskUpdateArgsStatus
    aspect_ref_id: TodoTaskUpdateArgsAspectRefId
    chapter_ref_id: TodoTaskUpdateArgsChapterRefId
    goal_ref_id: TodoTaskUpdateArgsGoalRefId
    is_key: TodoTaskUpdateArgsIsKey
    eisen: TodoTaskUpdateArgsEisen
    difficulty: TodoTaskUpdateArgsDifficulty
    actionable_date: TodoTaskUpdateArgsActionableDate
    due_date: TodoTaskUpdateArgsDueDate
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        name = self.name.to_dict()

        status = self.status.to_dict()

        aspect_ref_id = self.aspect_ref_id.to_dict()

        chapter_ref_id = self.chapter_ref_id.to_dict()

        goal_ref_id = self.goal_ref_id.to_dict()

        is_key = self.is_key.to_dict()

        eisen = self.eisen.to_dict()

        difficulty = self.difficulty.to_dict()

        actionable_date = self.actionable_date.to_dict()

        due_date = self.due_date.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
                "name": name,
                "status": status,
                "aspect_ref_id": aspect_ref_id,
                "chapter_ref_id": chapter_ref_id,
                "goal_ref_id": goal_ref_id,
                "is_key": is_key,
                "eisen": eisen,
                "difficulty": difficulty,
                "actionable_date": actionable_date,
                "due_date": due_date,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.todo_task_update_args_actionable_date import TodoTaskUpdateArgsActionableDate
        from ..models.todo_task_update_args_aspect_ref_id import TodoTaskUpdateArgsAspectRefId
        from ..models.todo_task_update_args_chapter_ref_id import TodoTaskUpdateArgsChapterRefId
        from ..models.todo_task_update_args_difficulty import TodoTaskUpdateArgsDifficulty
        from ..models.todo_task_update_args_due_date import TodoTaskUpdateArgsDueDate
        from ..models.todo_task_update_args_eisen import TodoTaskUpdateArgsEisen
        from ..models.todo_task_update_args_goal_ref_id import TodoTaskUpdateArgsGoalRefId
        from ..models.todo_task_update_args_is_key import TodoTaskUpdateArgsIsKey
        from ..models.todo_task_update_args_name import TodoTaskUpdateArgsName
        from ..models.todo_task_update_args_status import TodoTaskUpdateArgsStatus

        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        name = TodoTaskUpdateArgsName.from_dict(d.pop("name"))

        status = TodoTaskUpdateArgsStatus.from_dict(d.pop("status"))

        aspect_ref_id = TodoTaskUpdateArgsAspectRefId.from_dict(d.pop("aspect_ref_id"))

        chapter_ref_id = TodoTaskUpdateArgsChapterRefId.from_dict(d.pop("chapter_ref_id"))

        goal_ref_id = TodoTaskUpdateArgsGoalRefId.from_dict(d.pop("goal_ref_id"))

        is_key = TodoTaskUpdateArgsIsKey.from_dict(d.pop("is_key"))

        eisen = TodoTaskUpdateArgsEisen.from_dict(d.pop("eisen"))

        difficulty = TodoTaskUpdateArgsDifficulty.from_dict(d.pop("difficulty"))

        actionable_date = TodoTaskUpdateArgsActionableDate.from_dict(d.pop("actionable_date"))

        due_date = TodoTaskUpdateArgsDueDate.from_dict(d.pop("due_date"))

        todo_task_update_args = cls(
            ref_id=ref_id,
            name=name,
            status=status,
            aspect_ref_id=aspect_ref_id,
            chapter_ref_id=chapter_ref_id,
            goal_ref_id=goal_ref_id,
            is_key=is_key,
            eisen=eisen,
            difficulty=difficulty,
            actionable_date=actionable_date,
            due_date=due_date,
        )

        todo_task_update_args.additional_properties = d
        return todo_task_update_args

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
