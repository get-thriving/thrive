from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="SearchEntityIndexingRecord")


@_attrs_define
class SearchEntityIndexingRecord:
    """One row in ``search_entity_indexing_map``.

    Attributes:
        created_time (str): A timestamp in the application.
        last_modified_time (str): A timestamp in the application.
        workspace_ref_id (str):
        entity_type (str):
        entity_ref_id (str): A generic entity id.
        object_id (str):
    """

    created_time: str
    last_modified_time: str
    workspace_ref_id: str
    entity_type: str
    entity_ref_id: str
    object_id: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        created_time = self.created_time

        last_modified_time = self.last_modified_time

        workspace_ref_id = self.workspace_ref_id

        entity_type = self.entity_type

        entity_ref_id = self.entity_ref_id

        object_id = self.object_id

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "created_time": created_time,
                "last_modified_time": last_modified_time,
                "workspace_ref_id": workspace_ref_id,
                "entity_type": entity_type,
                "entity_ref_id": entity_ref_id,
                "object_id": object_id,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        created_time = d.pop("created_time")

        last_modified_time = d.pop("last_modified_time")

        workspace_ref_id = d.pop("workspace_ref_id")

        entity_type = d.pop("entity_type")

        entity_ref_id = d.pop("entity_ref_id")

        object_id = d.pop("object_id")

        search_entity_indexing_record = cls(
            created_time=created_time,
            last_modified_time=last_modified_time,
            workspace_ref_id=workspace_ref_id,
            entity_type=entity_type,
            entity_ref_id=entity_ref_id,
            object_id=object_id,
        )

        search_entity_indexing_record.additional_properties = d
        return search_entity_indexing_record

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
