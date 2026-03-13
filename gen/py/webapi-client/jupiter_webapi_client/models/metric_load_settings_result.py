from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.aspect import Aspect


T = TypeVar("T", bound="MetricLoadSettingsResult")


@_attrs_define
class MetricLoadSettingsResult:
    """MetricLoadSettings results.

    Attributes:
        collection_aspect (Aspect): The aspect.
    """

    collection_aspect: Aspect
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        collection_aspect = self.collection_aspect.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "collection_aspect": collection_aspect,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.aspect import Aspect

        d = dict(src_dict)
        collection_aspect = Aspect.from_dict(d.pop("collection_aspect"))

        metric_load_settings_result = cls(
            collection_aspect=collection_aspect,
        )

        metric_load_settings_result.additional_properties = d
        return metric_load_settings_result

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
