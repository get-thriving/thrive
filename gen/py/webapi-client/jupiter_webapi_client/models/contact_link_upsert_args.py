from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.contact_namespace import ContactNamespace

T = TypeVar("T", bound="ContactLinkUpsertArgs")


@_attrs_define
class ContactLinkUpsertArgs:
    """ContactLinkUpsert args.

    Attributes:
        namespace (ContactNamespace): The namespace of a contact link.
        source_entity_ref_id (str): A generic entity id.
        contact_names (list[str]):
    """

    namespace: ContactNamespace
    source_entity_ref_id: str
    contact_names: list[str]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        namespace = self.namespace.value

        source_entity_ref_id = self.source_entity_ref_id

        contact_names = self.contact_names

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "namespace": namespace,
                "source_entity_ref_id": source_entity_ref_id,
                "contact_names": contact_names,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        namespace = ContactNamespace(d.pop("namespace"))

        source_entity_ref_id = d.pop("source_entity_ref_id")

        contact_names = cast(list[str], d.pop("contact_names"))

        contact_link_upsert_args = cls(
            namespace=namespace,
            source_entity_ref_id=source_entity_ref_id,
            contact_names=contact_names,
        )

        contact_link_upsert_args.additional_properties = d
        return contact_link_upsert_args

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
