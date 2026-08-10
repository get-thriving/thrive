from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.access_grant import AccessGrant
    from ..models.entity_summary import EntitySummary
    from ..models.user_light import UserLight


T = TypeVar("T", bound="LoadAccessGrantResult")


@_attrs_define
class LoadAccessGrantResult:
    """LoadAccessGrant result.

    Attributes:
        access_grant (AccessGrant): A grant of access to a resource for a principal.
        entity (EntitySummary): Information about a particular entity very broadly.
        owner (UserLight): A user's ref id, name, and email address.
        grantee (UserLight): A user's ref id, name, and email address.
        can_update (bool):
        can_revoke (bool):
        can_forget (bool):
    """

    access_grant: AccessGrant
    entity: EntitySummary
    owner: UserLight
    grantee: UserLight
    can_update: bool
    can_revoke: bool
    can_forget: bool
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        access_grant = self.access_grant.to_dict()

        entity = self.entity.to_dict()

        owner = self.owner.to_dict()

        grantee = self.grantee.to_dict()

        can_update = self.can_update

        can_revoke = self.can_revoke

        can_forget = self.can_forget

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "access_grant": access_grant,
                "entity": entity,
                "owner": owner,
                "grantee": grantee,
                "can_update": can_update,
                "can_revoke": can_revoke,
                "can_forget": can_forget,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.access_grant import AccessGrant
        from ..models.entity_summary import EntitySummary
        from ..models.user_light import UserLight

        d = dict(src_dict)
        access_grant = AccessGrant.from_dict(d.pop("access_grant"))

        entity = EntitySummary.from_dict(d.pop("entity"))

        owner = UserLight.from_dict(d.pop("owner"))

        grantee = UserLight.from_dict(d.pop("grantee"))

        can_update = d.pop("can_update")

        can_revoke = d.pop("can_revoke")

        can_forget = d.pop("can_forget")

        load_access_grant_result = cls(
            access_grant=access_grant,
            entity=entity,
            owner=owner,
            grantee=grantee,
            can_update=can_update,
            can_revoke=can_revoke,
            can_forget=can_forget,
        )

        load_access_grant_result.additional_properties = d
        return load_access_grant_result

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
