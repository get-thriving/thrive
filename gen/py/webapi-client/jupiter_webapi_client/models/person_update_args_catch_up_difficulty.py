from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.difficulty import Difficulty
from ..types import UNSET, Unset

T = TypeVar("T", bound="PersonUpdateArgsCatchUpDifficulty")


@_attrs_define
class PersonUpdateArgsCatchUpDifficulty:
    """
    Attributes:
        should_change (bool):
        value (Difficulty | None | Unset):
    """

    should_change: bool
    value: Difficulty | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        should_change = self.should_change

        value: None | str | Unset
        if isinstance(self.value, Unset):
            value = UNSET
        elif isinstance(self.value, Difficulty):
            value = self.value.value
        else:
            value = self.value

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "should_change": should_change,
            }
        )
        if value is not UNSET:
            field_dict["value"] = value

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        should_change = d.pop("should_change")

        def _parse_value(data: object) -> Difficulty | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, str):
                    raise TypeError()
                value_type_0 = Difficulty(data)

                return value_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Difficulty | None | Unset, data)

        value = _parse_value(d.pop("value", UNSET))

        person_update_args_catch_up_difficulty = cls(
            should_change=should_change,
            value=value,
        )

        person_update_args_catch_up_difficulty.additional_properties = d
        return person_update_args_catch_up_difficulty

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
