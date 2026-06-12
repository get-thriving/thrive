from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="MetricLoadPublicArgs")


@_attrs_define
class MetricLoadPublicArgs:
    """MetricLoadPublic args.

    Attributes:
        external_id (str): A GUID external id for a publish entity.
        include_entry_tags_and_contacts (bool | None | Unset):
    """

    external_id: str
    include_entry_tags_and_contacts: bool | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        external_id = self.external_id

        include_entry_tags_and_contacts: bool | None | Unset
        if isinstance(self.include_entry_tags_and_contacts, Unset):
            include_entry_tags_and_contacts = UNSET
        else:
            include_entry_tags_and_contacts = self.include_entry_tags_and_contacts

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "external_id": external_id,
            }
        )
        if include_entry_tags_and_contacts is not UNSET:
            field_dict["include_entry_tags_and_contacts"] = include_entry_tags_and_contacts

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        external_id = d.pop("external_id")

        def _parse_include_entry_tags_and_contacts(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_entry_tags_and_contacts = _parse_include_entry_tags_and_contacts(
            d.pop("include_entry_tags_and_contacts", UNSET)
        )

        metric_load_public_args = cls(
            external_id=external_id,
            include_entry_tags_and_contacts=include_entry_tags_and_contacts,
        )

        metric_load_public_args.additional_properties = d
        return metric_load_public_args

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
