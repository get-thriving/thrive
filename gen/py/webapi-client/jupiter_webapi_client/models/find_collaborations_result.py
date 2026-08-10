from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.collaboration_entry import CollaborationEntry
    from ..models.collaboration_invite_entry import CollaborationInviteEntry
    from ..models.collaboration_request_entry import CollaborationRequestEntry
    from ..models.user_light import UserLight


T = TypeVar("T", bound="FindCollaborationsResult")


@_attrs_define
class FindCollaborationsResult:
    """Collaboration lists for the current user.

    Attributes:
        invites (list[CollaborationInviteEntry]):
        shared_with_me (list[CollaborationEntry]):
        shared_by_me (list[CollaborationEntry]):
        incoming_requests (list[CollaborationRequestEntry]):
        outgoing_requests (list[CollaborationRequestEntry]):
        users (list[UserLight]):
    """

    invites: list[CollaborationInviteEntry]
    shared_with_me: list[CollaborationEntry]
    shared_by_me: list[CollaborationEntry]
    incoming_requests: list[CollaborationRequestEntry]
    outgoing_requests: list[CollaborationRequestEntry]
    users: list[UserLight]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        invites = []
        for invites_item_data in self.invites:
            invites_item = invites_item_data.to_dict()
            invites.append(invites_item)

        shared_with_me = []
        for shared_with_me_item_data in self.shared_with_me:
            shared_with_me_item = shared_with_me_item_data.to_dict()
            shared_with_me.append(shared_with_me_item)

        shared_by_me = []
        for shared_by_me_item_data in self.shared_by_me:
            shared_by_me_item = shared_by_me_item_data.to_dict()
            shared_by_me.append(shared_by_me_item)

        incoming_requests = []
        for incoming_requests_item_data in self.incoming_requests:
            incoming_requests_item = incoming_requests_item_data.to_dict()
            incoming_requests.append(incoming_requests_item)

        outgoing_requests = []
        for outgoing_requests_item_data in self.outgoing_requests:
            outgoing_requests_item = outgoing_requests_item_data.to_dict()
            outgoing_requests.append(outgoing_requests_item)

        users = []
        for users_item_data in self.users:
            users_item = users_item_data.to_dict()
            users.append(users_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "invites": invites,
                "shared_with_me": shared_with_me,
                "shared_by_me": shared_by_me,
                "incoming_requests": incoming_requests,
                "outgoing_requests": outgoing_requests,
                "users": users,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.collaboration_entry import CollaborationEntry
        from ..models.collaboration_invite_entry import CollaborationInviteEntry
        from ..models.collaboration_request_entry import CollaborationRequestEntry
        from ..models.user_light import UserLight

        d = dict(src_dict)
        invites = []
        _invites = d.pop("invites")
        for invites_item_data in _invites:
            invites_item = CollaborationInviteEntry.from_dict(invites_item_data)

            invites.append(invites_item)

        shared_with_me = []
        _shared_with_me = d.pop("shared_with_me")
        for shared_with_me_item_data in _shared_with_me:
            shared_with_me_item = CollaborationEntry.from_dict(shared_with_me_item_data)

            shared_with_me.append(shared_with_me_item)

        shared_by_me = []
        _shared_by_me = d.pop("shared_by_me")
        for shared_by_me_item_data in _shared_by_me:
            shared_by_me_item = CollaborationEntry.from_dict(shared_by_me_item_data)

            shared_by_me.append(shared_by_me_item)

        incoming_requests = []
        _incoming_requests = d.pop("incoming_requests")
        for incoming_requests_item_data in _incoming_requests:
            incoming_requests_item = CollaborationRequestEntry.from_dict(incoming_requests_item_data)

            incoming_requests.append(incoming_requests_item)

        outgoing_requests = []
        _outgoing_requests = d.pop("outgoing_requests")
        for outgoing_requests_item_data in _outgoing_requests:
            outgoing_requests_item = CollaborationRequestEntry.from_dict(outgoing_requests_item_data)

            outgoing_requests.append(outgoing_requests_item)

        users = []
        _users = d.pop("users")
        for users_item_data in _users:
            users_item = UserLight.from_dict(users_item_data)

            users.append(users_item)

        find_collaborations_result = cls(
            invites=invites,
            shared_with_me=shared_with_me,
            shared_by_me=shared_by_me,
            incoming_requests=incoming_requests,
            outgoing_requests=outgoing_requests,
            users=users,
        )

        find_collaborations_result.additional_properties = d
        return find_collaborations_result

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
