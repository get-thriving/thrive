from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.api_key_summary import APIKeySummary


T = TypeVar("T", bound="APIKeyLoadResult")


@_attrs_define
class APIKeyLoadResult:
    """APIKeyLoad result.

    Attributes:
        api_key (APIKeySummary): Summary of an API key, safe for web display.
    """

    api_key: APIKeySummary
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        api_key = self.api_key.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "api_key": api_key,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.api_key_summary import APIKeySummary

        d = dict(src_dict)
        api_key = APIKeySummary.from_dict(d.pop("api_key"))

        api_key_load_result = cls(
            api_key=api_key,
        )

        api_key_load_result.additional_properties = d
        return api_key_load_result

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
