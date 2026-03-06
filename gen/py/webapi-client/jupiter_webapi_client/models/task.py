from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.difficulty import Difficulty
from ..models.eisen import Eisen
from ..models.task_namespace import TaskNamespace
from ..models.task_status import TaskStatus
from ..types import UNSET, Unset

T = TypeVar("T", bound="Task")


@_attrs_define
class Task:
    """A task in the task domain.

    Attributes:
        ref_id (str): A generic entity id.
        version (int):
        archived (bool):
        created_time (str): A timestamp in the application.
        last_modified_time (str): A timestamp in the application.
        name (str): The name for an entity which acts as both name and unique identifier.
        task_domain_ref_id (str):
        namespace (TaskNamespace): The namespace of a task.
        source_entity_ref_id (str): A generic entity id.
        status (TaskStatus): The status of a task.
        is_key (bool):
        eisen (Eisen): The Eisenhower status of a particular task.
        difficulty (Difficulty): The difficulty of a particular task.
        archival_reason (None | str | Unset):
        archived_time (None | str | Unset):
        actionable_date (None | str | Unset):
        due_date (None | str | Unset):
        recurring_timeline (None | str | Unset):
        recurring_repeat_index (int | None | Unset):
        recurring_gen_right_now (None | str | Unset):
        working_time (None | str | Unset):
        completed_time (None | str | Unset):
    """

    ref_id: str
    version: int
    archived: bool
    created_time: str
    last_modified_time: str
    name: str
    task_domain_ref_id: str
    namespace: TaskNamespace
    source_entity_ref_id: str
    status: TaskStatus
    is_key: bool
    eisen: Eisen
    difficulty: Difficulty
    archival_reason: None | str | Unset = UNSET
    archived_time: None | str | Unset = UNSET
    actionable_date: None | str | Unset = UNSET
    due_date: None | str | Unset = UNSET
    recurring_timeline: None | str | Unset = UNSET
    recurring_repeat_index: int | None | Unset = UNSET
    recurring_gen_right_now: None | str | Unset = UNSET
    working_time: None | str | Unset = UNSET
    completed_time: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        version = self.version

        archived = self.archived

        created_time = self.created_time

        last_modified_time = self.last_modified_time

        name = self.name

        task_domain_ref_id = self.task_domain_ref_id

        namespace = self.namespace.value

        source_entity_ref_id = self.source_entity_ref_id

        status = self.status.value

        is_key = self.is_key

        eisen = self.eisen.value

        difficulty = self.difficulty.value

        archival_reason: None | str | Unset
        if isinstance(self.archival_reason, Unset):
            archival_reason = UNSET
        else:
            archival_reason = self.archival_reason

        archived_time: None | str | Unset
        if isinstance(self.archived_time, Unset):
            archived_time = UNSET
        else:
            archived_time = self.archived_time

        actionable_date: None | str | Unset
        if isinstance(self.actionable_date, Unset):
            actionable_date = UNSET
        else:
            actionable_date = self.actionable_date

        due_date: None | str | Unset
        if isinstance(self.due_date, Unset):
            due_date = UNSET
        else:
            due_date = self.due_date

        recurring_timeline: None | str | Unset
        if isinstance(self.recurring_timeline, Unset):
            recurring_timeline = UNSET
        else:
            recurring_timeline = self.recurring_timeline

        recurring_repeat_index: int | None | Unset
        if isinstance(self.recurring_repeat_index, Unset):
            recurring_repeat_index = UNSET
        else:
            recurring_repeat_index = self.recurring_repeat_index

        recurring_gen_right_now: None | str | Unset
        if isinstance(self.recurring_gen_right_now, Unset):
            recurring_gen_right_now = UNSET
        else:
            recurring_gen_right_now = self.recurring_gen_right_now

        working_time: None | str | Unset
        if isinstance(self.working_time, Unset):
            working_time = UNSET
        else:
            working_time = self.working_time

        completed_time: None | str | Unset
        if isinstance(self.completed_time, Unset):
            completed_time = UNSET
        else:
            completed_time = self.completed_time

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
                "version": version,
                "archived": archived,
                "created_time": created_time,
                "last_modified_time": last_modified_time,
                "name": name,
                "task_domain_ref_id": task_domain_ref_id,
                "namespace": namespace,
                "source_entity_ref_id": source_entity_ref_id,
                "status": status,
                "is_key": is_key,
                "eisen": eisen,
                "difficulty": difficulty,
            }
        )
        if archival_reason is not UNSET:
            field_dict["archival_reason"] = archival_reason
        if archived_time is not UNSET:
            field_dict["archived_time"] = archived_time
        if actionable_date is not UNSET:
            field_dict["actionable_date"] = actionable_date
        if due_date is not UNSET:
            field_dict["due_date"] = due_date
        if recurring_timeline is not UNSET:
            field_dict["recurring_timeline"] = recurring_timeline
        if recurring_repeat_index is not UNSET:
            field_dict["recurring_repeat_index"] = recurring_repeat_index
        if recurring_gen_right_now is not UNSET:
            field_dict["recurring_gen_right_now"] = recurring_gen_right_now
        if working_time is not UNSET:
            field_dict["working_time"] = working_time
        if completed_time is not UNSET:
            field_dict["completed_time"] = completed_time

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        version = d.pop("version")

        archived = d.pop("archived")

        created_time = d.pop("created_time")

        last_modified_time = d.pop("last_modified_time")

        name = d.pop("name")

        task_domain_ref_id = d.pop("task_domain_ref_id")

        namespace = TaskNamespace(d.pop("namespace"))

        source_entity_ref_id = d.pop("source_entity_ref_id")

        status = TaskStatus(d.pop("status"))

        is_key = d.pop("is_key")

        eisen = Eisen(d.pop("eisen"))

        difficulty = Difficulty(d.pop("difficulty"))

        def _parse_archival_reason(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        archival_reason = _parse_archival_reason(d.pop("archival_reason", UNSET))

        def _parse_archived_time(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        archived_time = _parse_archived_time(d.pop("archived_time", UNSET))

        def _parse_actionable_date(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        actionable_date = _parse_actionable_date(d.pop("actionable_date", UNSET))

        def _parse_due_date(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        due_date = _parse_due_date(d.pop("due_date", UNSET))

        def _parse_recurring_timeline(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        recurring_timeline = _parse_recurring_timeline(d.pop("recurring_timeline", UNSET))

        def _parse_recurring_repeat_index(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        recurring_repeat_index = _parse_recurring_repeat_index(d.pop("recurring_repeat_index", UNSET))

        def _parse_recurring_gen_right_now(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        recurring_gen_right_now = _parse_recurring_gen_right_now(d.pop("recurring_gen_right_now", UNSET))

        def _parse_working_time(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        working_time = _parse_working_time(d.pop("working_time", UNSET))

        def _parse_completed_time(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        completed_time = _parse_completed_time(d.pop("completed_time", UNSET))

        task = cls(
            ref_id=ref_id,
            version=version,
            archived=archived,
            created_time=created_time,
            last_modified_time=last_modified_time,
            name=name,
            task_domain_ref_id=task_domain_ref_id,
            namespace=namespace,
            source_entity_ref_id=source_entity_ref_id,
            status=status,
            is_key=is_key,
            eisen=eisen,
            difficulty=difficulty,
            archival_reason=archival_reason,
            archived_time=archived_time,
            actionable_date=actionable_date,
            due_date=due_date,
            recurring_timeline=recurring_timeline,
            recurring_repeat_index=recurring_repeat_index,
            recurring_gen_right_now=recurring_gen_right_now,
            working_time=working_time,
            completed_time=completed_time,
        )

        task.additional_properties = d
        return task

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
