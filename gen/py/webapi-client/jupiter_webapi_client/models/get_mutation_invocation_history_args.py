from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="GetMutationInvocationHistoryArgs")


@_attrs_define
class GetMutationInvocationHistoryArgs:
    """Arguments for the mutation invocation history.

    Attributes:
        retrieve_offset (int | None | Unset):
        retrieve_limit (int | None | Unset):
    """

    retrieve_offset: int | None | Unset = UNSET
    retrieve_limit: int | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        retrieve_offset: int | None | Unset
        if isinstance(self.retrieve_offset, Unset):
            retrieve_offset = UNSET
        else:
            retrieve_offset = self.retrieve_offset

        retrieve_limit: int | None | Unset
        if isinstance(self.retrieve_limit, Unset):
            retrieve_limit = UNSET
        else:
            retrieve_limit = self.retrieve_limit

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if retrieve_offset is not UNSET:
            field_dict["retrieve_offset"] = retrieve_offset
        if retrieve_limit is not UNSET:
            field_dict["retrieve_limit"] = retrieve_limit

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)

        def _parse_retrieve_offset(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        retrieve_offset = _parse_retrieve_offset(d.pop("retrieve_offset", UNSET))

        def _parse_retrieve_limit(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        retrieve_limit = _parse_retrieve_limit(d.pop("retrieve_limit", UNSET))

        get_mutation_invocation_history_args = cls(
            retrieve_offset=retrieve_offset,
            retrieve_limit=retrieve_limit,
        )

        get_mutation_invocation_history_args.additional_properties = d
        return get_mutation_invocation_history_args

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
