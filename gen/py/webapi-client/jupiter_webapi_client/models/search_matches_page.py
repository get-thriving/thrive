from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.search_match import SearchMatch


T = TypeVar("T", bound="SearchMatchesPage")


@_attrs_define
class SearchMatchesPage:
    """One page of search hits plus the total number of matching entities.

    Attributes:
        matches (list[SearchMatch]):
        total_match_count (int):
    """

    matches: list[SearchMatch]
    total_match_count: int
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        matches = []
        for matches_item_data in self.matches:
            matches_item = matches_item_data.to_dict()
            matches.append(matches_item)

        total_match_count = self.total_match_count

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "matches": matches,
                "total_match_count": total_match_count,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.search_match import SearchMatch

        d = dict(src_dict)
        matches = []
        _matches = d.pop("matches")
        for matches_item_data in _matches:
            matches_item = SearchMatch.from_dict(matches_item_data)

            matches.append(matches_item)

        total_match_count = d.pop("total_match_count")

        search_matches_page = cls(
            matches=matches,
            total_match_count=total_match_count,
        )

        search_matches_page.additional_properties = d
        return search_matches_page

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
