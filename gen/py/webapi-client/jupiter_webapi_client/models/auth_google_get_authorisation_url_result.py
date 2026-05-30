from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="AuthGoogleGetAuthorisationUrlResult")


@_attrs_define
class AuthGoogleGetAuthorisationUrlResult:
    """Result with the Google OAuth authorisation URL and state.

    Attributes:
        authorisation_url (str): A URL in this domain.
        state (str):
    """

    authorisation_url: str
    state: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        authorisation_url = self.authorisation_url

        state = self.state

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "authorisation_url": authorisation_url,
                "state": state,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        authorisation_url = d.pop("authorisation_url")

        state = d.pop("state")

        auth_google_get_authorisation_url_result = cls(
            authorisation_url=authorisation_url,
            state=state,
        )

        auth_google_get_authorisation_url_result.additional_properties = d
        return auth_google_get_authorisation_url_result

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
