from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.publish_entity import PublishEntity


T = TypeVar("T", bound="PublishEntityFindResult")


@_attrs_define
class PublishEntityFindResult:
    """PublishEntityFind result.

    Attributes:
        publish_entities (list[PublishEntity]):
    """

    publish_entities: list[PublishEntity]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        publish_entities = []
        for publish_entities_item_data in self.publish_entities:
            publish_entities_item = publish_entities_item_data.to_dict()
            publish_entities.append(publish_entities_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "publish_entities": publish_entities,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.publish_entity import PublishEntity

        d = dict(src_dict)
        publish_entities = []
        _publish_entities = d.pop("publish_entities")
        for publish_entities_item_data in _publish_entities:
            publish_entities_item = PublishEntity.from_dict(publish_entities_item_data)

            publish_entities.append(publish_entities_item)

        publish_entity_find_result = cls(
            publish_entities=publish_entities,
        )

        publish_entity_find_result.additional_properties = d
        return publish_entity_find_result

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
