from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.named_entity_tag import NamedEntityTag

T = TypeVar("T", bound="GetEntityMutationHistoryArgs")


@_attrs_define
class GetEntityMutationHistoryArgs:
    """Arguments for the entity mutation history.

    Attributes:
        entity_type (NamedEntityTag): A tag for all known entities.
        entity_ref_id (str): A generic entity id.
    """

    entity_type: NamedEntityTag
    entity_ref_id: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        entity_type = self.entity_type.value

        entity_ref_id = self.entity_ref_id

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "entity_type": entity_type,
                "entity_ref_id": entity_ref_id,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        entity_type = NamedEntityTag(d.pop("entity_type"))

        entity_ref_id = d.pop("entity_ref_id")

        get_entity_mutation_history_args = cls(
            entity_type=entity_type,
            entity_ref_id=entity_ref_id,
        )

        get_entity_mutation_history_args.additional_properties = d
        return get_entity_mutation_history_args

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
