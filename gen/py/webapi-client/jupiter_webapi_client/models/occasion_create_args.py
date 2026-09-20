from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.occasion_kind import OccasionKind
from ..models.schedulability import Schedulability
from ..types import UNSET, Unset

T = TypeVar("T", bound="OccasionCreateArgs")


@_attrs_define
class OccasionCreateArgs:
    """OccasionCreate args.

    Attributes:
        person_ref_id (str): A generic entity id.
        kind (OccasionKind): The kind of an occasion.
        name (str): The name of an occasion.
        date (str): The birthday of a person.
        schedulability (None | Schedulability | Unset):
        scheduling_event_duration_mins (int | None | Unset):
        scheduling_event_count (int | None | Unset):
    """

    person_ref_id: str
    kind: OccasionKind
    name: str
    date: str
    schedulability: None | Schedulability | Unset = UNSET
    scheduling_event_duration_mins: int | None | Unset = UNSET
    scheduling_event_count: int | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        person_ref_id = self.person_ref_id

        kind = self.kind.value

        name = self.name

        date = self.date

        schedulability: None | str | Unset
        if isinstance(self.schedulability, Unset):
            schedulability = UNSET
        elif isinstance(self.schedulability, Schedulability):
            schedulability = self.schedulability.value
        else:
            schedulability = self.schedulability

        scheduling_event_duration_mins: int | None | Unset
        if isinstance(self.scheduling_event_duration_mins, Unset):
            scheduling_event_duration_mins = UNSET
        else:
            scheduling_event_duration_mins = self.scheduling_event_duration_mins

        scheduling_event_count: int | None | Unset
        if isinstance(self.scheduling_event_count, Unset):
            scheduling_event_count = UNSET
        else:
            scheduling_event_count = self.scheduling_event_count

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
        if schedulability is not UNSET:
            field_dict["schedulability"] = schedulability
        if scheduling_event_duration_mins is not UNSET:
            field_dict["scheduling_event_duration_mins"] = scheduling_event_duration_mins
        if scheduling_event_count is not UNSET:
            field_dict["scheduling_event_count"] = scheduling_event_count

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        person_ref_id = d.pop("person_ref_id")

        kind = OccasionKind(d.pop("kind"))

        name = d.pop("name")

        date = d.pop("date")

        def _parse_schedulability(data: object) -> None | Schedulability | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, str):
                    raise TypeError()
                schedulability_type_0 = Schedulability(data)

                return schedulability_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Schedulability | Unset, data)

        schedulability = _parse_schedulability(d.pop("schedulability", UNSET))

        def _parse_scheduling_event_duration_mins(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        scheduling_event_duration_mins = _parse_scheduling_event_duration_mins(
            d.pop("scheduling_event_duration_mins", UNSET)
        )

        def _parse_scheduling_event_count(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        scheduling_event_count = _parse_scheduling_event_count(d.pop("scheduling_event_count", UNSET))

        occasion_create_args = cls(
            person_ref_id=person_ref_id,
            kind=kind,
            name=name,
            date=date,
            schedulability=schedulability,
            scheduling_event_duration_mins=scheduling_event_duration_mins,
            scheduling_event_count=scheduling_event_count,
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
