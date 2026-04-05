from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="EventEntry")


@_attrs_define
class EventEntry:
    """A single entity event produced by a mutation.

    Attributes:
        entity_name (str):
        event_kind (str):
        event_name (str):
        timestamp (str): A timestamp in the application.
        source (str):
        user_ref_id (str): A generic entity id.
        entity_version (int):
        data (str):
    """

    entity_name: str
    event_kind: str
    event_name: str
    timestamp: str
    source: str
    user_ref_id: str
    entity_version: int
    data: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        entity_name = self.entity_name

        event_kind = self.event_kind

        event_name = self.event_name

        timestamp = self.timestamp

        source = self.source

        user_ref_id = self.user_ref_id

        entity_version = self.entity_version

        data = self.data

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "entity_name": entity_name,
                "event_kind": event_kind,
                "event_name": event_name,
                "timestamp": timestamp,
                "source": source,
                "user_ref_id": user_ref_id,
                "entity_version": entity_version,
                "data": data,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        entity_name = d.pop("entity_name")

        event_kind = d.pop("event_kind")

        event_name = d.pop("event_name")

        timestamp = d.pop("timestamp")

        source = d.pop("source")

        user_ref_id = d.pop("user_ref_id")

        entity_version = d.pop("entity_version")

        data = d.pop("data")

        event_entry = cls(
            entity_name=entity_name,
            event_kind=event_kind,
            event_name=event_name,
            timestamp=timestamp,
            source=source,
            user_ref_id=user_ref_id,
            entity_version=entity_version,
            data=data,
        )

        event_entry.additional_properties = d
        return event_entry

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
