from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.dir_ import Dir
    from ..models.dir_load_result_entry import DirLoadResultEntry
    from ..models.dir_load_subdir_entry import DirLoadSubdirEntry


T = TypeVar("T", bound="DirLoadResult")


@_attrs_define
class DirLoadResult:
    """Loaded directory, its docs, and immediate child directories.

    Attributes:
        dir_ (Dir): A directory in the doc collection.
        entries (list[DirLoadResultEntry]):
        subdirs (list[DirLoadSubdirEntry]):
    """

    dir_: Dir
    entries: list[DirLoadResultEntry]
    subdirs: list[DirLoadSubdirEntry]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        dir_ = self.dir_.to_dict()

        entries = []
        for entries_item_data in self.entries:
            entries_item = entries_item_data.to_dict()
            entries.append(entries_item)

        subdirs = []
        for subdirs_item_data in self.subdirs:
            subdirs_item = subdirs_item_data.to_dict()
            subdirs.append(subdirs_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "dir": dir_,
                "entries": entries,
                "subdirs": subdirs,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.dir_ import Dir
        from ..models.dir_load_result_entry import DirLoadResultEntry
        from ..models.dir_load_subdir_entry import DirLoadSubdirEntry

        d = dict(src_dict)
        dir_ = Dir.from_dict(d.pop("dir"))

        entries = []
        _entries = d.pop("entries")
        for entries_item_data in _entries:
            entries_item = DirLoadResultEntry.from_dict(entries_item_data)

            entries.append(entries_item)

        subdirs = []
        _subdirs = d.pop("subdirs")
        for subdirs_item_data in _subdirs:
            subdirs_item = DirLoadSubdirEntry.from_dict(subdirs_item_data)

            subdirs.append(subdirs_item)

        dir_load_result = cls(
            dir_=dir_,
            entries=entries,
            subdirs=subdirs,
        )

        dir_load_result.additional_properties = d
        return dir_load_result

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
