from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="GetMutationEntityEventsArgs")


@_attrs_define
class GetMutationEntityEventsArgs:
    """Arguments for getting entity events from a mutation.

    Attributes:
        mutation_id (str): A mutation id for a particular user action.
    """

    mutation_id: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        mutation_id = self.mutation_id

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "mutation_id": mutation_id,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        mutation_id = d.pop("mutation_id")

        get_mutation_entity_events_args = cls(
            mutation_id=mutation_id,
        )

        get_mutation_entity_events_args.additional_properties = d
        return get_mutation_entity_events_args

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
