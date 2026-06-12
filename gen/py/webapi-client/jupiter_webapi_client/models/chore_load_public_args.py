from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="ChoreLoadPublicArgs")


@_attrs_define
class ChoreLoadPublicArgs:
    """ChoreLoadPublic args.

    Attributes:
        external_id (str): A GUID external id for a publish entity.
        inbox_task_retrieve_offset (int | None | Unset):
    """

    external_id: str
    inbox_task_retrieve_offset: int | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        external_id = self.external_id

        inbox_task_retrieve_offset: int | None | Unset
        if isinstance(self.inbox_task_retrieve_offset, Unset):
            inbox_task_retrieve_offset = UNSET
        else:
            inbox_task_retrieve_offset = self.inbox_task_retrieve_offset

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "external_id": external_id,
            }
        )
        if inbox_task_retrieve_offset is not UNSET:
            field_dict["inbox_task_retrieve_offset"] = inbox_task_retrieve_offset

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        external_id = d.pop("external_id")

        def _parse_inbox_task_retrieve_offset(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        inbox_task_retrieve_offset = _parse_inbox_task_retrieve_offset(d.pop("inbox_task_retrieve_offset", UNSET))

        chore_load_public_args = cls(
            external_id=external_id,
            inbox_task_retrieve_offset=inbox_task_retrieve_offset,
        )

        chore_load_public_args.additional_properties = d
        return chore_load_public_args

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
