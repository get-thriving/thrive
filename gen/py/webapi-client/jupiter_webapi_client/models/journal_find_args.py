from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="JournalFindArgs")


@_attrs_define
class JournalFindArgs:
    """Args.

    Attributes:
        allow_archived (bool):
        include_notes (bool):
        include_journal_stats (bool):
        include_writing_tasks (bool):
        include_tags (bool):
        filter_ref_ids (list[str] | None | Unset):
    """

    allow_archived: bool
    include_notes: bool
    include_journal_stats: bool
    include_writing_tasks: bool
    include_tags: bool
    filter_ref_ids: list[str] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        allow_archived = self.allow_archived

        include_notes = self.include_notes

        include_journal_stats = self.include_journal_stats

        include_writing_tasks = self.include_writing_tasks

        include_tags = self.include_tags

        filter_ref_ids: list[str] | None | Unset
        if isinstance(self.filter_ref_ids, Unset):
            filter_ref_ids = UNSET
        elif isinstance(self.filter_ref_ids, list):
            filter_ref_ids = self.filter_ref_ids

        else:
            filter_ref_ids = self.filter_ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "allow_archived": allow_archived,
                "include_notes": include_notes,
                "include_journal_stats": include_journal_stats,
                "include_writing_tasks": include_writing_tasks,
                "include_tags": include_tags,
            }
        )
        if filter_ref_ids is not UNSET:
            field_dict["filter_ref_ids"] = filter_ref_ids

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        allow_archived = d.pop("allow_archived")

        include_notes = d.pop("include_notes")

        include_journal_stats = d.pop("include_journal_stats")

        include_writing_tasks = d.pop("include_writing_tasks")

        include_tags = d.pop("include_tags")

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

        journal_find_args = cls(
            allow_archived=allow_archived,
            include_notes=include_notes,
            include_journal_stats=include_journal_stats,
            include_writing_tasks=include_writing_tasks,
            include_tags=include_tags,
            filter_ref_ids=filter_ref_ids,
        )

        journal_find_args.additional_properties = d
        return journal_find_args

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
