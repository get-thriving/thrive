from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.project_update_args_actionable_date import ProjectUpdateArgsActionableDate
    from ..models.project_update_args_aspect_ref_id import ProjectUpdateArgsAspectRefId
    from ..models.project_update_args_chapter_ref_id import ProjectUpdateArgsChapterRefId
    from ..models.project_update_args_difficulty import ProjectUpdateArgsDifficulty
    from ..models.project_update_args_due_date import ProjectUpdateArgsDueDate
    from ..models.project_update_args_eisen import ProjectUpdateArgsEisen
    from ..models.project_update_args_goal_ref_id import ProjectUpdateArgsGoalRefId
    from ..models.project_update_args_is_key import ProjectUpdateArgsIsKey
    from ..models.project_update_args_name import ProjectUpdateArgsName
    from ..models.project_update_args_status import ProjectUpdateArgsStatus


T = TypeVar("T", bound="ProjectUpdateArgs")


@_attrs_define
class ProjectUpdateArgs:
    """PersonFindArgs.

    Attributes:
        ref_id (str): A generic entity id.
        name (ProjectUpdateArgsName):
        status (ProjectUpdateArgsStatus):
        aspect_ref_id (ProjectUpdateArgsAspectRefId):
        chapter_ref_id (ProjectUpdateArgsChapterRefId):
        goal_ref_id (ProjectUpdateArgsGoalRefId):
        is_key (ProjectUpdateArgsIsKey):
        eisen (ProjectUpdateArgsEisen):
        difficulty (ProjectUpdateArgsDifficulty):
        actionable_date (ProjectUpdateArgsActionableDate):
        due_date (ProjectUpdateArgsDueDate):
    """

    ref_id: str
    name: ProjectUpdateArgsName
    status: ProjectUpdateArgsStatus
    aspect_ref_id: ProjectUpdateArgsAspectRefId
    chapter_ref_id: ProjectUpdateArgsChapterRefId
    goal_ref_id: ProjectUpdateArgsGoalRefId
    is_key: ProjectUpdateArgsIsKey
    eisen: ProjectUpdateArgsEisen
    difficulty: ProjectUpdateArgsDifficulty
    actionable_date: ProjectUpdateArgsActionableDate
    due_date: ProjectUpdateArgsDueDate
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
        from ..models.project_update_args_actionable_date import ProjectUpdateArgsActionableDate
        from ..models.project_update_args_aspect_ref_id import ProjectUpdateArgsAspectRefId
        from ..models.project_update_args_chapter_ref_id import ProjectUpdateArgsChapterRefId
        from ..models.project_update_args_difficulty import ProjectUpdateArgsDifficulty
        from ..models.project_update_args_due_date import ProjectUpdateArgsDueDate
        from ..models.project_update_args_eisen import ProjectUpdateArgsEisen
        from ..models.project_update_args_goal_ref_id import ProjectUpdateArgsGoalRefId
        from ..models.project_update_args_is_key import ProjectUpdateArgsIsKey
        from ..models.project_update_args_name import ProjectUpdateArgsName
        from ..models.project_update_args_status import ProjectUpdateArgsStatus

        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        name = ProjectUpdateArgsName.from_dict(d.pop("name"))

        status = ProjectUpdateArgsStatus.from_dict(d.pop("status"))

        aspect_ref_id = ProjectUpdateArgsAspectRefId.from_dict(d.pop("aspect_ref_id"))

        chapter_ref_id = ProjectUpdateArgsChapterRefId.from_dict(d.pop("chapter_ref_id"))

        goal_ref_id = ProjectUpdateArgsGoalRefId.from_dict(d.pop("goal_ref_id"))

        is_key = ProjectUpdateArgsIsKey.from_dict(d.pop("is_key"))

        eisen = ProjectUpdateArgsEisen.from_dict(d.pop("eisen"))

        difficulty = ProjectUpdateArgsDifficulty.from_dict(d.pop("difficulty"))

        actionable_date = ProjectUpdateArgsActionableDate.from_dict(d.pop("actionable_date"))

        due_date = ProjectUpdateArgsDueDate.from_dict(d.pop("due_date"))

        project_update_args = cls(
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

        project_update_args.additional_properties = d
        return project_update_args

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
