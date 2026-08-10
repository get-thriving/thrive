from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.access_request import AccessRequest
    from ..models.entity_summary import EntitySummary
    from ..models.user_light import UserLight


T = TypeVar("T", bound="AccessRequestLoadResult")


@_attrs_define
class AccessRequestLoadResult:
    """AccessRequestLoad result.

    Attributes:
        access_request (AccessRequest): A request for access to a resource by a principal.
        entity (EntitySummary): Information about a particular entity very broadly.
        requester (UserLight): A user's ref id, name, and email address.
        owner (UserLight): A user's ref id, name, and email address.
        can_accept (bool):
        can_reject (bool):
        can_cancel (bool):
    """

    access_request: AccessRequest
    entity: EntitySummary
    requester: UserLight
    owner: UserLight
    can_accept: bool
    can_reject: bool
    can_cancel: bool
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        access_request = self.access_request.to_dict()

        entity = self.entity.to_dict()

        requester = self.requester.to_dict()

        owner = self.owner.to_dict()

        can_accept = self.can_accept

        can_reject = self.can_reject

        can_cancel = self.can_cancel

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "access_request": access_request,
                "entity": entity,
                "requester": requester,
                "owner": owner,
                "can_accept": can_accept,
                "can_reject": can_reject,
                "can_cancel": can_cancel,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.access_request import AccessRequest
        from ..models.entity_summary import EntitySummary
        from ..models.user_light import UserLight

        d = dict(src_dict)
        access_request = AccessRequest.from_dict(d.pop("access_request"))

        entity = EntitySummary.from_dict(d.pop("entity"))

        requester = UserLight.from_dict(d.pop("requester"))

        owner = UserLight.from_dict(d.pop("owner"))

        can_accept = d.pop("can_accept")

        can_reject = d.pop("can_reject")

        can_cancel = d.pop("can_cancel")

        access_request_load_result = cls(
            access_request=access_request,
            entity=entity,
            requester=requester,
            owner=owner,
            can_accept=can_accept,
            can_reject=can_reject,
            can_cancel=can_cancel,
        )

        access_request_load_result.additional_properties = d
        return access_request_load_result

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
