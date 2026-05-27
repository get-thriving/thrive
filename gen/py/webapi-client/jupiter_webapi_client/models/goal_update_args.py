from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.goal_update_args_aspect_ref_id import GoalUpdateArgsAspectRefId
    from ..models.goal_update_args_name import GoalUpdateArgsName
    from ..models.goal_update_args_parent_goal_ref_id import GoalUpdateArgsParentGoalRefId


T = TypeVar("T", bound="GoalUpdateArgs")


@_attrs_define
class GoalUpdateArgs:
    """Goal update args.

    Attributes:
        ref_id (str): A generic entity id.
        name (GoalUpdateArgsName):
        aspect_ref_id (GoalUpdateArgsAspectRefId):
        parent_goal_ref_id (GoalUpdateArgsParentGoalRefId):
    """

    ref_id: str
    name: GoalUpdateArgsName
    aspect_ref_id: GoalUpdateArgsAspectRefId
    parent_goal_ref_id: GoalUpdateArgsParentGoalRefId
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        name = self.name.to_dict()

        aspect_ref_id = self.aspect_ref_id.to_dict()

        parent_goal_ref_id = self.parent_goal_ref_id.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
                "name": name,
                "aspect_ref_id": aspect_ref_id,
                "parent_goal_ref_id": parent_goal_ref_id,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.goal_update_args_aspect_ref_id import GoalUpdateArgsAspectRefId
        from ..models.goal_update_args_name import GoalUpdateArgsName
        from ..models.goal_update_args_parent_goal_ref_id import GoalUpdateArgsParentGoalRefId

        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        name = GoalUpdateArgsName.from_dict(d.pop("name"))

        aspect_ref_id = GoalUpdateArgsAspectRefId.from_dict(d.pop("aspect_ref_id"))

        parent_goal_ref_id = GoalUpdateArgsParentGoalRefId.from_dict(d.pop("parent_goal_ref_id"))

        goal_update_args = cls(
            ref_id=ref_id,
            name=name,
            aspect_ref_id=aspect_ref_id,
            parent_goal_ref_id=parent_goal_ref_id,
        )

        goal_update_args.additional_properties = d
        return goal_update_args

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
