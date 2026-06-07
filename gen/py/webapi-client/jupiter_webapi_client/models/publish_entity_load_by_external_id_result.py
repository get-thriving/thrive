from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.publish_entity import PublishEntity


T = TypeVar("T", bound="PublishEntityLoadByExternalIdResult")


@_attrs_define
class PublishEntityLoadByExternalIdResult:
    """PublishEntityLoadByExternalId result.

    Attributes:
        publish_entity (PublishEntity): A publish entity.
    """

    publish_entity: PublishEntity
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        publish_entity = self.publish_entity.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "publish_entity": publish_entity,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.publish_entity import PublishEntity

        d = dict(src_dict)
        publish_entity = PublishEntity.from_dict(d.pop("publish_entity"))

        publish_entity_load_by_external_id_result = cls(
            publish_entity=publish_entity,
        )

        publish_entity_load_by_external_id_result.additional_properties = d
        return publish_entity_load_by_external_id_result

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
