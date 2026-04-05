from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="HistoryEntry")


@_attrs_define
class HistoryEntry:
    """A single mutation invocation history entry.

    Attributes:
        mutation_name (str):
        timestamp (str): A timestamp in the application.
        source (str):
        result (str):
        error_str (None | str | Unset):
    """

    mutation_name: str
    timestamp: str
    source: str
    result: str
    error_str: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        mutation_name = self.mutation_name

        timestamp = self.timestamp

        source = self.source

        result = self.result

        error_str: None | str | Unset
        if isinstance(self.error_str, Unset):
            error_str = UNSET
        else:
            error_str = self.error_str

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "mutation_name": mutation_name,
                "timestamp": timestamp,
                "source": source,
                "result": result,
            }
        )
        if error_str is not UNSET:
            field_dict["error_str"] = error_str

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        mutation_name = d.pop("mutation_name")

        timestamp = d.pop("timestamp")

        source = d.pop("source")

        result = d.pop("result")

        def _parse_error_str(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        error_str = _parse_error_str(d.pop("error_str", UNSET))

        history_entry = cls(
            mutation_name=mutation_name,
            timestamp=timestamp,
            source=source,
            result=result,
            error_str=error_str,
        )

        history_entry.additional_properties = d
        return history_entry

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
