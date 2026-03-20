from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.difficulty import Difficulty
from ..models.eisen import Eisen
from ..types import UNSET, Unset

T = TypeVar("T", bound="TodoTaskCreateArgs")


@_attrs_define
class TodoTaskCreateArgs:
    """TodoTaskCreate args.

    Attributes:
        name (str): The name of an inbox task.
        is_key (bool):
        eisen (Eisen): The Eisenhower status of a particular task.
        difficulty (Difficulty): The difficulty of a particular task.
        aspect_ref_id (None | str | Unset):
        chapter_ref_id (None | str | Unset):
        goal_ref_id (None | str | Unset):
        actionable_date (None | str | Unset):
        due_date (None | str | Unset):
    """

    name: str
    is_key: bool
    eisen: Eisen
    difficulty: Difficulty
    aspect_ref_id: None | str | Unset = UNSET
    chapter_ref_id: None | str | Unset = UNSET
    goal_ref_id: None | str | Unset = UNSET
    actionable_date: None | str | Unset = UNSET
    due_date: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        name = self.name

        is_key = self.is_key

        eisen = self.eisen.value

        difficulty = self.difficulty.value

        aspect_ref_id: None | str | Unset
        if isinstance(self.aspect_ref_id, Unset):
            aspect_ref_id = UNSET
        else:
            aspect_ref_id = self.aspect_ref_id

        chapter_ref_id: None | str | Unset
        if isinstance(self.chapter_ref_id, Unset):
            chapter_ref_id = UNSET
        else:
            chapter_ref_id = self.chapter_ref_id

        goal_ref_id: None | str | Unset
        if isinstance(self.goal_ref_id, Unset):
            goal_ref_id = UNSET
        else:
            goal_ref_id = self.goal_ref_id

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

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "name": name,
                "is_key": is_key,
                "eisen": eisen,
                "difficulty": difficulty,
            }
        )
        if aspect_ref_id is not UNSET:
            field_dict["aspect_ref_id"] = aspect_ref_id
        if chapter_ref_id is not UNSET:
            field_dict["chapter_ref_id"] = chapter_ref_id
        if goal_ref_id is not UNSET:
            field_dict["goal_ref_id"] = goal_ref_id
        if actionable_date is not UNSET:
            field_dict["actionable_date"] = actionable_date
        if due_date is not UNSET:
            field_dict["due_date"] = due_date

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        name = d.pop("name")

        is_key = d.pop("is_key")

        eisen = Eisen(d.pop("eisen"))

        difficulty = Difficulty(d.pop("difficulty"))

        def _parse_aspect_ref_id(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        aspect_ref_id = _parse_aspect_ref_id(d.pop("aspect_ref_id", UNSET))

        def _parse_chapter_ref_id(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        chapter_ref_id = _parse_chapter_ref_id(d.pop("chapter_ref_id", UNSET))

        def _parse_goal_ref_id(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        goal_ref_id = _parse_goal_ref_id(d.pop("goal_ref_id", UNSET))

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

        todo_task_create_args = cls(
            name=name,
            is_key=is_key,
            eisen=eisen,
            difficulty=difficulty,
            aspect_ref_id=aspect_ref_id,
            chapter_ref_id=chapter_ref_id,
            goal_ref_id=goal_ref_id,
            actionable_date=actionable_date,
            due_date=due_date,
        )

        todo_task_create_args.additional_properties = d
        return todo_task_create_args

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
