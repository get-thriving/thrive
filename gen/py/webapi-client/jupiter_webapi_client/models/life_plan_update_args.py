from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.life_plan_update_args_birth_year import LifePlanUpdateArgsBirthYear
    from ..models.life_plan_update_args_birthday import LifePlanUpdateArgsBirthday


T = TypeVar("T", bound="LifePlanUpdateArgs")


@_attrs_define
class LifePlanUpdateArgs:
    """Life plan update args.

    Attributes:
        birthday (LifePlanUpdateArgsBirthday):
        birth_year (LifePlanUpdateArgsBirthYear):
    """

    birthday: LifePlanUpdateArgsBirthday
    birth_year: LifePlanUpdateArgsBirthYear
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        birthday = self.birthday.to_dict()

        birth_year = self.birth_year.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "birthday": birthday,
                "birth_year": birth_year,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.life_plan_update_args_birth_year import LifePlanUpdateArgsBirthYear
        from ..models.life_plan_update_args_birthday import LifePlanUpdateArgsBirthday

        d = dict(src_dict)
        birthday = LifePlanUpdateArgsBirthday.from_dict(d.pop("birthday"))

        birth_year = LifePlanUpdateArgsBirthYear.from_dict(d.pop("birth_year"))

        life_plan_update_args = cls(
            birthday=birthday,
            birth_year=birth_year,
        )

        life_plan_update_args.additional_properties = d
        return life_plan_update_args

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
