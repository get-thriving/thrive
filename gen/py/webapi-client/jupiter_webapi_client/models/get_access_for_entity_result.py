from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.get_access_for_entity_entry import GetAccessForEntityEntry
    from ..models.user_light import UserLight


T = TypeVar("T", bound="GetAccessForEntityResult")


@_attrs_define
class GetAccessForEntityResult:
    """GetAccessForEntity result.

    Attributes:
        entries (list[GetAccessForEntityEntry]):
        users (list[UserLight]):
    """

    entries: list[GetAccessForEntityEntry]
    users: list[UserLight]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        entries = []
        for entries_item_data in self.entries:
            entries_item = entries_item_data.to_dict()
            entries.append(entries_item)

        users = []
        for users_item_data in self.users:
            users_item = users_item_data.to_dict()
            users.append(users_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "entries": entries,
                "users": users,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.get_access_for_entity_entry import GetAccessForEntityEntry
        from ..models.user_light import UserLight

        d = dict(src_dict)
        entries = []
        _entries = d.pop("entries")
        for entries_item_data in _entries:
            entries_item = GetAccessForEntityEntry.from_dict(entries_item_data)

            entries.append(entries_item)

        users = []
        _users = d.pop("users")
        for users_item_data in _users:
            users_item = UserLight.from_dict(users_item_data)

            users.append(users_item)

        get_access_for_entity_result = cls(
            entries=entries,
            users=users,
        )

        get_access_for_entity_result.additional_properties = d
        return get_access_for_entity_result

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
