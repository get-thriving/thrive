from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.access_level import AccessLevel
from ..models.access_status_reason import AccessStatusReason

T = TypeVar("T", bound="AccessStatus")


@_attrs_define
class AccessStatus:
    """The effective access status of a principal over a resource.

    Attributes:
        created_time (str): A timestamp in the application.
        last_modified_time (str): A timestamp in the application.
        access_domain_ref_id (str):
        entity (str): A reference combining an entity kind, a purpose, and an entity id.
        user_ref_id (str): A generic entity id.
        access_level (AccessLevel): The level of access a principal has to a shared resource.
        reason (AccessStatusReason): The reason a principal has a particular access status over a resource.
        access_grant_ref_id (str): A generic entity id.
    """

    created_time: str
    last_modified_time: str
    access_domain_ref_id: str
    entity: str
    user_ref_id: str
    access_level: AccessLevel
    reason: AccessStatusReason
    access_grant_ref_id: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        created_time = self.created_time

        last_modified_time = self.last_modified_time

        access_domain_ref_id = self.access_domain_ref_id

        entity = self.entity

        user_ref_id = self.user_ref_id

        access_level = self.access_level.value

        reason = self.reason.value

        access_grant_ref_id = self.access_grant_ref_id

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "created_time": created_time,
                "last_modified_time": last_modified_time,
                "access_domain_ref_id": access_domain_ref_id,
                "entity": entity,
                "user_ref_id": user_ref_id,
                "access_level": access_level,
                "reason": reason,
                "access_grant_ref_id": access_grant_ref_id,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        created_time = d.pop("created_time")

        last_modified_time = d.pop("last_modified_time")

        access_domain_ref_id = d.pop("access_domain_ref_id")

        entity = d.pop("entity")

        user_ref_id = d.pop("user_ref_id")

        access_level = AccessLevel(d.pop("access_level"))

        reason = AccessStatusReason(d.pop("reason"))

        access_grant_ref_id = d.pop("access_grant_ref_id")

        access_status = cls(
            created_time=created_time,
            last_modified_time=last_modified_time,
            access_domain_ref_id=access_domain_ref_id,
            entity=entity,
            user_ref_id=user_ref_id,
            access_level=access_level,
            reason=reason,
            access_grant_ref_id=access_grant_ref_id,
        )

        access_status.additional_properties = d
        return access_status

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
