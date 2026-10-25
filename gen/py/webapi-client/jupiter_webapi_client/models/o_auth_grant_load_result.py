from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.o_auth_grant_summary import OAuthGrantSummary


T = TypeVar("T", bound="OAuthGrantLoadResult")


@_attrs_define
class OAuthGrantLoadResult:
    """OAuth grant load result.

    Attributes:
        oauth_grant (OAuthGrantSummary): Summary of an OAuth grant, safe for web display.
    """

    oauth_grant: OAuthGrantSummary
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        oauth_grant = self.oauth_grant.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "oauth_grant": oauth_grant,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.o_auth_grant_summary import OAuthGrantSummary  # noqa: PLC0415

        d = dict(src_dict)
        oauth_grant = OAuthGrantSummary.from_dict(d.pop("oauth_grant"))

        o_auth_grant_load_result = cls(
            oauth_grant=oauth_grant,
        )

        o_auth_grant_load_result.additional_properties = d
        return o_auth_grant_load_result

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
