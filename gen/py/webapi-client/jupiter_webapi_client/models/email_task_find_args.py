from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="EmailTaskFindArgs")


@_attrs_define
class EmailTaskFindArgs:
    """PersonFindArgs.

    Attributes:
        allow_archived (bool | None | Unset):
        include_inbox_task (bool | None | Unset):
        filter_ref_ids (list[str] | None | Unset):
    """

    allow_archived: bool | None | Unset = UNSET
    include_inbox_task: bool | None | Unset = UNSET
    filter_ref_ids: list[str] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        allow_archived: bool | None | Unset
        if isinstance(self.allow_archived, Unset):
            allow_archived = UNSET
        else:
            allow_archived = self.allow_archived

        include_inbox_task: bool | None | Unset
        if isinstance(self.include_inbox_task, Unset):
            include_inbox_task = UNSET
        else:
            include_inbox_task = self.include_inbox_task

        filter_ref_ids: list[str] | None | Unset
        if isinstance(self.filter_ref_ids, Unset):
            filter_ref_ids = UNSET
        elif isinstance(self.filter_ref_ids, list):
            filter_ref_ids = self.filter_ref_ids

        else:
            filter_ref_ids = self.filter_ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if allow_archived is not UNSET:
            field_dict["allow_archived"] = allow_archived
        if include_inbox_task is not UNSET:
            field_dict["include_inbox_task"] = include_inbox_task
        if filter_ref_ids is not UNSET:
            field_dict["filter_ref_ids"] = filter_ref_ids

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)

        def _parse_allow_archived(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        allow_archived = _parse_allow_archived(d.pop("allow_archived", UNSET))

        def _parse_include_inbox_task(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_inbox_task = _parse_include_inbox_task(d.pop("include_inbox_task", UNSET))

        def _parse_filter_ref_ids(data: object) -> list[str] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                filter_ref_ids_type_0 = cast(list[str], data)

                return filter_ref_ids_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[str] | None | Unset, data)

        filter_ref_ids = _parse_filter_ref_ids(d.pop("filter_ref_ids", UNSET))

        email_task_find_args = cls(
            allow_archived=allow_archived,
            include_inbox_task=include_inbox_task,
            filter_ref_ids=filter_ref_ids,
        )

        email_task_find_args.additional_properties = d
        return email_task_find_args

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
