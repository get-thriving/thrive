from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="TimePlanLoadArgs")


@_attrs_define
class TimePlanLoadArgs:
    """Args.

    Attributes:
        ref_id (str): A generic entity id.
        allow_archived (bool | None | Unset):
        include_targets (bool | None | Unset):
        include_completed_nontarget (bool | None | Unset):
        include_other_time_plans (bool | None | Unset):
    """

    ref_id: str
    allow_archived: bool | None | Unset = UNSET
    include_targets: bool | None | Unset = UNSET
    include_completed_nontarget: bool | None | Unset = UNSET
    include_other_time_plans: bool | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        allow_archived: bool | None | Unset
        if isinstance(self.allow_archived, Unset):
            allow_archived = UNSET
        else:
            allow_archived = self.allow_archived

        include_targets: bool | None | Unset
        if isinstance(self.include_targets, Unset):
            include_targets = UNSET
        else:
            include_targets = self.include_targets

        include_completed_nontarget: bool | None | Unset
        if isinstance(self.include_completed_nontarget, Unset):
            include_completed_nontarget = UNSET
        else:
            include_completed_nontarget = self.include_completed_nontarget

        include_other_time_plans: bool | None | Unset
        if isinstance(self.include_other_time_plans, Unset):
            include_other_time_plans = UNSET
        else:
            include_other_time_plans = self.include_other_time_plans

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
            }
        )
        if allow_archived is not UNSET:
            field_dict["allow_archived"] = allow_archived
        if include_targets is not UNSET:
            field_dict["include_targets"] = include_targets
        if include_completed_nontarget is not UNSET:
            field_dict["include_completed_nontarget"] = include_completed_nontarget
        if include_other_time_plans is not UNSET:
            field_dict["include_other_time_plans"] = include_other_time_plans

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        def _parse_allow_archived(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        allow_archived = _parse_allow_archived(d.pop("allow_archived", UNSET))

        def _parse_include_targets(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_targets = _parse_include_targets(d.pop("include_targets", UNSET))

        def _parse_include_completed_nontarget(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_completed_nontarget = _parse_include_completed_nontarget(d.pop("include_completed_nontarget", UNSET))

        def _parse_include_other_time_plans(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_other_time_plans = _parse_include_other_time_plans(d.pop("include_other_time_plans", UNSET))

        time_plan_load_args = cls(
            ref_id=ref_id,
            allow_archived=allow_archived,
            include_targets=include_targets,
            include_completed_nontarget=include_completed_nontarget,
            include_other_time_plans=include_other_time_plans,
        )

        time_plan_load_args.additional_properties = d
        return time_plan_load_args

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
