from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

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
        source_entity_name (None | str | Unset):
    """

    access_status: AccessStatus
    access_grant: AccessGrant
    source_entity_name: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        access_status = self.access_status.to_dict()

        access_grant = self.access_grant.to_dict()

        source_entity_name: None | str | Unset
        if isinstance(self.source_entity_name, Unset):
            source_entity_name = UNSET
        else:
            source_entity_name = self.source_entity_name

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "access_status": access_status,
                "access_grant": access_grant,
            }
        )
        if source_entity_name is not UNSET:
            field_dict["source_entity_name"] = source_entity_name

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.access_grant import AccessGrant  # noqa: PLC0415
        from ..models.access_status import AccessStatus  # noqa: PLC0415

        d = dict(src_dict)
        access_status = AccessStatus.from_dict(d.pop("access_status"))

        access_grant = AccessGrant.from_dict(d.pop("access_grant"))

        def _parse_source_entity_name(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        source_entity_name = _parse_source_entity_name(d.pop("source_entity_name", UNSET))

        get_access_for_entity_entry = cls(
            access_status=access_status,
            access_grant=access_grant,
            source_entity_name=source_entity_name,
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
