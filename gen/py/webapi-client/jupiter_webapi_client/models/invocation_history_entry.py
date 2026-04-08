from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="InvocationHistoryEntry")


@_attrs_define
class InvocationHistoryEntry:
    """A single mutation invocation history entry.

    Attributes:
        mutation_id (str): A mutation id for a particular user action.
        mutation_name (str):
        timestamp (str): A timestamp in the application.
        source (str):
        user_ref_id (str): A generic entity id.
        result (str):
        args_str (str):
        error_str (None | str | Unset):
    """

    mutation_id: str
    mutation_name: str
    timestamp: str
    source: str
    user_ref_id: str
    result: str
    args_str: str
    error_str: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        mutation_id = self.mutation_id

        mutation_name = self.mutation_name

        timestamp = self.timestamp

        source = self.source

        user_ref_id = self.user_ref_id

        result = self.result

        args_str = self.args_str

        error_str: None | str | Unset
        if isinstance(self.error_str, Unset):
            error_str = UNSET
        else:
            error_str = self.error_str

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "mutation_id": mutation_id,
                "mutation_name": mutation_name,
                "timestamp": timestamp,
                "source": source,
                "user_ref_id": user_ref_id,
                "result": result,
                "args_str": args_str,
            }
        )
        if error_str is not UNSET:
            field_dict["error_str"] = error_str

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        mutation_id = d.pop("mutation_id")

        mutation_name = d.pop("mutation_name")

        timestamp = d.pop("timestamp")

        source = d.pop("source")

        user_ref_id = d.pop("user_ref_id")

        result = d.pop("result")

        args_str = d.pop("args_str")

        def _parse_error_str(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        error_str = _parse_error_str(d.pop("error_str", UNSET))

        invocation_history_entry = cls(
            mutation_id=mutation_id,
            mutation_name=mutation_name,
            timestamp=timestamp,
            source=source,
            user_ref_id=user_ref_id,
            result=result,
            args_str=args_str,
            error_str=error_str,
        )

        invocation_history_entry.additional_properties = d
        return invocation_history_entry

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
