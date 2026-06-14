from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.access_level import AccessLevel
from ..models.principal_type import PrincipalType
from ..types import UNSET, Unset

T = TypeVar("T", bound="AccessGrant")


@_attrs_define
class AccessGrant:
    """A grant of access to a resource for a principal.

    Attributes:
        ref_id (str): A generic entity id.
        version (int):
        archived (bool):
        created_time (str): A timestamp in the application.
        last_modified_time (str): A timestamp in the application.
        name (str): The name for an entity which acts as both name and unique identifier.
        access_domain_ref_id (str):
        entity (str): A reference combining an entity kind, a purpose, and an entity id.
        principal (PrincipalType): The type of principal an access grant is given to.
        user_ref_id (str): A generic entity id.
        access_level (AccessLevel): The level of access a principal has to a shared resource.
        archival_reason (None | str | Unset):
        archived_time (None | str | Unset):
    """

    ref_id: str
    version: int
    archived: bool
    created_time: str
    last_modified_time: str
    name: str
    access_domain_ref_id: str
    entity: str
    principal: PrincipalType
    user_ref_id: str
    access_level: AccessLevel
    archival_reason: None | str | Unset = UNSET
    archived_time: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        version = self.version

        archived = self.archived

        created_time = self.created_time

        last_modified_time = self.last_modified_time

        name = self.name

        access_domain_ref_id = self.access_domain_ref_id

        entity = self.entity

        principal = self.principal.value

        user_ref_id = self.user_ref_id

        access_level = self.access_level.value

        archival_reason: None | str | Unset
        if isinstance(self.archival_reason, Unset):
            archival_reason = UNSET
        else:
            archival_reason = self.archival_reason

        archived_time: None | str | Unset
        if isinstance(self.archived_time, Unset):
            archived_time = UNSET
        else:
            archived_time = self.archived_time

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
                "version": version,
                "archived": archived,
                "created_time": created_time,
                "last_modified_time": last_modified_time,
                "name": name,
                "access_domain_ref_id": access_domain_ref_id,
                "entity": entity,
                "principal": principal,
                "user_ref_id": user_ref_id,
                "access_level": access_level,
            }
        )
        if archival_reason is not UNSET:
            field_dict["archival_reason"] = archival_reason
        if archived_time is not UNSET:
            field_dict["archived_time"] = archived_time

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        version = d.pop("version")

        archived = d.pop("archived")

        created_time = d.pop("created_time")

        last_modified_time = d.pop("last_modified_time")

        name = d.pop("name")

        access_domain_ref_id = d.pop("access_domain_ref_id")

        entity = d.pop("entity")

        principal = PrincipalType(d.pop("principal"))

        user_ref_id = d.pop("user_ref_id")

        access_level = AccessLevel(d.pop("access_level"))

        def _parse_archival_reason(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        archival_reason = _parse_archival_reason(d.pop("archival_reason", UNSET))

        def _parse_archived_time(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        archived_time = _parse_archived_time(d.pop("archived_time", UNSET))

        access_grant = cls(
            ref_id=ref_id,
            version=version,
            archived=archived,
            created_time=created_time,
            last_modified_time=last_modified_time,
            name=name,
            access_domain_ref_id=access_domain_ref_id,
            entity=entity,
            principal=principal,
            user_ref_id=user_ref_id,
            access_level=access_level,
            archival_reason=archival_reason,
            archived_time=archived_time,
        )

        access_grant.additional_properties = d
        return access_grant

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
