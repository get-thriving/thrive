from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.access_grant import AccessGrant
    from ..models.access_status import AccessStatus


T = TypeVar("T", bound="GetAccessForEntityEntry")


@_attrs_define
class GetAccessForEntityEntry:
    """A single access status and grant for an entity.

    Attributes:
        access_status (AccessStatus): The effective access status of a principal over a resource.
        access_grant (AccessGrant): A grant of access to a resource for a principal.
    """

    access_status: AccessStatus
    access_grant: AccessGrant
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        access_status = self.access_status.to_dict()

        access_grant = self.access_grant.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "access_status": access_status,
                "access_grant": access_grant,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.access_grant import AccessGrant
        from ..models.access_status import AccessStatus

        d = dict(src_dict)
        access_status = AccessStatus.from_dict(d.pop("access_status"))

        access_grant = AccessGrant.from_dict(d.pop("access_grant"))

        get_access_for_entity_entry = cls(
            access_status=access_status,
            access_grant=access_grant,
        )

        get_access_for_entity_entry.additional_properties = d
        return get_access_for_entity_entry

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
