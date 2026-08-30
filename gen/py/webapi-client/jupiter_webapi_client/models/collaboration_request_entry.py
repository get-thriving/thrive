from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.access_request import AccessRequest
    from ..models.entity_summary import EntitySummary
    from ..models.user_light import UserLight


T = TypeVar("T", bound="CollaborationRequestEntry")


@_attrs_define
class CollaborationRequestEntry:
    """One access request involving the current user.

    Attributes:
        entity (EntitySummary): Information about a particular entity very broadly.
        access_request (AccessRequest): A request for access to a resource by a principal.
        subject (UserLight): A user's ref id, name, and email address.
    """

    entity: EntitySummary
    access_request: AccessRequest
    subject: UserLight
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        entity = self.entity.to_dict()

        access_request = self.access_request.to_dict()

        subject = self.subject.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "entity": entity,
                "access_request": access_request,
                "subject": subject,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.access_request import AccessRequest  # noqa: PLC0415
        from ..models.entity_summary import EntitySummary  # noqa: PLC0415
        from ..models.user_light import UserLight  # noqa: PLC0415

        d = dict(src_dict)
        entity = EntitySummary.from_dict(d.pop("entity"))

        access_request = AccessRequest.from_dict(d.pop("access_request"))

        subject = UserLight.from_dict(d.pop("subject"))

        collaboration_request_entry = cls(
            entity=entity,
            access_request=access_request,
            subject=subject,
        )

        collaboration_request_entry.additional_properties = d
        return collaboration_request_entry

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
