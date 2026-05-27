from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.invocation_history_entry import InvocationHistoryEntry
    from ..models.user import User


T = TypeVar("T", bound="GetMutationInvocationHistoryResult")


@_attrs_define
class GetMutationInvocationHistoryResult:
    """Results for the mutation invocation history.

    Attributes:
        entries (list[InvocationHistoryEntry]):
        users (list[User]):
        total_cnt (int):
        page_size (int):
    """

    entries: list[InvocationHistoryEntry]
    users: list[User]
    total_cnt: int
    page_size: int
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

        total_cnt = self.total_cnt

        page_size = self.page_size

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "entries": entries,
                "users": users,
                "total_cnt": total_cnt,
                "page_size": page_size,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.invocation_history_entry import InvocationHistoryEntry
        from ..models.user import User

        d = dict(src_dict)
        entries = []
        _entries = d.pop("entries")
        for entries_item_data in _entries:
            entries_item = InvocationHistoryEntry.from_dict(entries_item_data)

            entries.append(entries_item)

        users = []
        _users = d.pop("users")
        for users_item_data in _users:
            users_item = User.from_dict(users_item_data)

            users.append(users_item)

        total_cnt = d.pop("total_cnt")

        page_size = d.pop("page_size")

        get_mutation_invocation_history_result = cls(
            entries=entries,
            users=users,
            total_cnt=total_cnt,
            page_size=page_size,
        )

        get_mutation_invocation_history_result.additional_properties = d
        return get_mutation_invocation_history_result

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
