from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.search_mutation_log_status import SearchMutationLogStatus

T = TypeVar("T", bound="SearchMutationLogRecord")


@_attrs_define
class SearchMutationLogRecord:
    """One deferred search indexing job keyed by mutation id.

    Attributes:
        created_time (str): A timestamp in the application.
        last_modified_time (str): A timestamp in the application.
        workspace_ref_id (str):
        mutation_id (str): A mutation id for a particular user action.
        status (SearchMutationLogStatus): Whether search indexing work for a mutation has been applied.
    """

    created_time: str
    last_modified_time: str
    workspace_ref_id: str
    mutation_id: str
    status: SearchMutationLogStatus
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        created_time = self.created_time

        last_modified_time = self.last_modified_time

        workspace_ref_id = self.workspace_ref_id

        mutation_id = self.mutation_id

        status = self.status.value

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "created_time": created_time,
                "last_modified_time": last_modified_time,
                "workspace_ref_id": workspace_ref_id,
                "mutation_id": mutation_id,
                "status": status,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        created_time = d.pop("created_time")

        last_modified_time = d.pop("last_modified_time")

        workspace_ref_id = d.pop("workspace_ref_id")

        mutation_id = d.pop("mutation_id")

        status = SearchMutationLogStatus(d.pop("status"))

        search_mutation_log_record = cls(
            created_time=created_time,
            last_modified_time=last_modified_time,
            workspace_ref_id=workspace_ref_id,
            mutation_id=mutation_id,
            status=status,
        )

        search_mutation_log_record.additional_properties = d
        return search_mutation_log_record

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
