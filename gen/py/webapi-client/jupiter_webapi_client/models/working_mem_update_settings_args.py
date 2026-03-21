from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.working_mem_update_settings_args_generation_period import WorkingMemUpdateSettingsArgsGenerationPeriod


T = TypeVar("T", bound="WorkingMemUpdateSettingsArgs")


@_attrs_define
class WorkingMemUpdateSettingsArgs:
    """PersonFindArgs.

    Attributes:
        generation_period (WorkingMemUpdateSettingsArgsGenerationPeriod):
    """

    generation_period: WorkingMemUpdateSettingsArgsGenerationPeriod
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        generation_period = self.generation_period.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "generation_period": generation_period,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.working_mem_update_settings_args_generation_period import (
            WorkingMemUpdateSettingsArgsGenerationPeriod,
        )

        d = dict(src_dict)
        generation_period = WorkingMemUpdateSettingsArgsGenerationPeriod.from_dict(d.pop("generation_period"))

        working_mem_update_settings_args = cls(
            generation_period=generation_period,
        )

        working_mem_update_settings_args.additional_properties = d
        return working_mem_update_settings_args

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
