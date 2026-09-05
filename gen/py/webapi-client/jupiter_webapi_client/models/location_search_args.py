from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="LocationSearchArgs")


@_attrs_define
class LocationSearchArgs:
    """LocationSearch args.

    Attributes:
        query (str): A search query parameter for searches.
        limit (int | None | Unset):
        include_archived (bool | None | Unset):
        include_candidates (bool | None | Unset):
    """

    query: str
    limit: int | None | Unset = UNSET
    include_archived: bool | None | Unset = UNSET
    include_candidates: bool | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        query = self.query

        limit: int | None | Unset
        if isinstance(self.limit, Unset):
            limit = UNSET
        else:
            limit = self.limit

        include_archived: bool | None | Unset
        if isinstance(self.include_archived, Unset):
            include_archived = UNSET
        else:
            include_archived = self.include_archived

        include_candidates: bool | None | Unset
        if isinstance(self.include_candidates, Unset):
            include_candidates = UNSET
        else:
            include_candidates = self.include_candidates

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "query": query,
            }
        )
        if limit is not UNSET:
            field_dict["limit"] = limit
        if include_archived is not UNSET:
            field_dict["include_archived"] = include_archived
        if include_candidates is not UNSET:
            field_dict["include_candidates"] = include_candidates

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        query = d.pop("query")

        def _parse_limit(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        limit = _parse_limit(d.pop("limit", UNSET))

        def _parse_include_archived(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_archived = _parse_include_archived(d.pop("include_archived", UNSET))

        def _parse_include_candidates(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_candidates = _parse_include_candidates(d.pop("include_candidates", UNSET))

        location_search_args = cls(
            query=query,
            limit=limit,
            include_archived=include_archived,
            include_candidates=include_candidates,
        )

        location_search_args.additional_properties = d
        return location_search_args

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
