from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.occasion_kind import OccasionKind

T = TypeVar("T", bound="OccasionCreateArgs")


@_attrs_define
class OccasionCreateArgs:
    """OccasionCreate args.

    Attributes:
        person_ref_id (str): A generic entity id.
        kind (OccasionKind): The kind of an occasion.
        name (str): The name of an occasion.
        date (str): The birthday of a person.
    """

    person_ref_id: str
    kind: OccasionKind
    name: str
    date: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        person_ref_id = self.person_ref_id

        kind = self.kind.value

        name = self.name

        date = self.date

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "person_ref_id": person_ref_id,
                "kind": kind,
                "name": name,
                "date": date,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        person_ref_id = d.pop("person_ref_id")

        kind = OccasionKind(d.pop("kind"))

        name = d.pop("name")

        date = d.pop("date")

        occasion_create_args = cls(
            person_ref_id=person_ref_id,
            kind=kind,
            name=name,
            date=date,
        )

        occasion_create_args.additional_properties = d
        return occasion_create_args

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
