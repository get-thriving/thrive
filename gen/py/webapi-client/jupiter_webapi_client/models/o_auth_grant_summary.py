from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.o_auth_grant_status import OAuthGrantStatus
from ..types import UNSET, Unset

T = TypeVar("T", bound="OAuthGrantSummary")


@_attrs_define
class OAuthGrantSummary:
    """Summary of an OAuth grant, safe for web display.

    Attributes:
        ref_id (str): A generic entity id.
        client_id (str): The identifier an OAuth client uses to identify itself.

            For apps that describe themselves this is the URL of their metadata document.
            Until those documents are fetched, any visible text without spaces is allowed.
        redirect_uri (str): A system URL that may point at localhost.
        status (OAuthGrantStatus): Where an OAuth grant is in its life.
        created_time (str): A timestamp in the application.
        archived (bool):
        refresh_issued_time (None | str | Unset):
        expires_time (None | str | Unset):
    """

    ref_id: str
    client_id: str
    redirect_uri: str
    status: OAuthGrantStatus
    created_time: str
    archived: bool
    refresh_issued_time: None | str | Unset = UNSET
    expires_time: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        client_id = self.client_id

        redirect_uri = self.redirect_uri

        status = self.status.value

        created_time = self.created_time

        archived = self.archived

        refresh_issued_time: None | str | Unset
        if isinstance(self.refresh_issued_time, Unset):
            refresh_issued_time = UNSET
        else:
            refresh_issued_time = self.refresh_issued_time

        expires_time: None | str | Unset
        if isinstance(self.expires_time, Unset):
            expires_time = UNSET
        else:
            expires_time = self.expires_time

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
                "client_id": client_id,
                "redirect_uri": redirect_uri,
                "status": status,
                "created_time": created_time,
                "archived": archived,
            }
        )
        if refresh_issued_time is not UNSET:
            field_dict["refresh_issued_time"] = refresh_issued_time
        if expires_time is not UNSET:
            field_dict["expires_time"] = expires_time

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        client_id = d.pop("client_id")

        redirect_uri = d.pop("redirect_uri")

        status = OAuthGrantStatus(d.pop("status"))

        created_time = d.pop("created_time")

        archived = d.pop("archived")

        def _parse_refresh_issued_time(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        refresh_issued_time = _parse_refresh_issued_time(d.pop("refresh_issued_time", UNSET))

        def _parse_expires_time(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        expires_time = _parse_expires_time(d.pop("expires_time", UNSET))

        o_auth_grant_summary = cls(
            ref_id=ref_id,
            client_id=client_id,
            redirect_uri=redirect_uri,
            status=status,
            created_time=created_time,
            archived=archived,
            refresh_issued_time=refresh_issued_time,
            expires_time=expires_time,
        )

        o_auth_grant_summary.additional_properties = d
        return o_auth_grant_summary

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
