from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="CRMEntityIndexingRecord")


@_attrs_define
class CRMEntityIndexingRecord:
    """One row in ``crm_entity_indexing_map``.

    Attributes:
        created_time (str): A timestamp in the application.
        last_modified_time (str): A timestamp in the application.
        crm_domain_ref_id (str):
        entity_type (str):
        entity_ref_id (str): A generic entity id.
        object_id (str):
        revision (int):
        index_method_version (int):
    """

    created_time: str
    last_modified_time: str
    crm_domain_ref_id: str
    entity_type: str
    entity_ref_id: str
    object_id: str
    revision: int
    index_method_version: int
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        created_time = self.created_time

        last_modified_time = self.last_modified_time

        crm_domain_ref_id = self.crm_domain_ref_id

        entity_type = self.entity_type

        entity_ref_id = self.entity_ref_id

        object_id = self.object_id

        revision = self.revision

        index_method_version = self.index_method_version

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "created_time": created_time,
                "last_modified_time": last_modified_time,
                "crm_domain_ref_id": crm_domain_ref_id,
                "entity_type": entity_type,
                "entity_ref_id": entity_ref_id,
                "object_id": object_id,
                "revision": revision,
                "index_method_version": index_method_version,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        created_time = d.pop("created_time")

        last_modified_time = d.pop("last_modified_time")

        crm_domain_ref_id = d.pop("crm_domain_ref_id")

        entity_type = d.pop("entity_type")

        entity_ref_id = d.pop("entity_ref_id")

        object_id = d.pop("object_id")

        revision = d.pop("revision")

        index_method_version = d.pop("index_method_version")

        crm_entity_indexing_record = cls(
            created_time=created_time,
            last_modified_time=last_modified_time,
            crm_domain_ref_id=crm_domain_ref_id,
            entity_type=entity_type,
            entity_ref_id=entity_ref_id,
            object_id=object_id,
            revision=revision,
            index_method_version=index_method_version,
        )

        crm_entity_indexing_record.additional_properties = d
        return crm_entity_indexing_record

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
