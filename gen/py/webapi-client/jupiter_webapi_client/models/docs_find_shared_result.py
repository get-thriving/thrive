from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.docs_find_shared_dir_entry import DocsFindSharedDirEntry
    from ..models.docs_find_shared_doc_entry import DocsFindSharedDocEntry


T = TypeVar("T", bound="DocsFindSharedResult")


@_attrs_define
class DocsFindSharedResult:
    """Shared directories and docs that are entry points for the current user.

    Attributes:
        dirs (list[DocsFindSharedDirEntry]):
        docs (list[DocsFindSharedDocEntry]):
    """

    dirs: list[DocsFindSharedDirEntry]
    docs: list[DocsFindSharedDocEntry]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        dirs = []
        for dirs_item_data in self.dirs:
            dirs_item = dirs_item_data.to_dict()
            dirs.append(dirs_item)

        docs = []
        for docs_item_data in self.docs:
            docs_item = docs_item_data.to_dict()
            docs.append(docs_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "dirs": dirs,
                "docs": docs,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.docs_find_shared_dir_entry import DocsFindSharedDirEntry  # noqa: PLC0415
        from ..models.docs_find_shared_doc_entry import DocsFindSharedDocEntry  # noqa: PLC0415

        d = dict(src_dict)
        dirs = []
        _dirs = d.pop("dirs")
        for dirs_item_data in _dirs:
            dirs_item = DocsFindSharedDirEntry.from_dict(dirs_item_data)

            dirs.append(dirs_item)

        docs = []
        _docs = d.pop("docs")
        for docs_item_data in _docs:
            docs_item = DocsFindSharedDocEntry.from_dict(docs_item_data)

            docs.append(docs_item)

        docs_find_shared_result = cls(
            dirs=dirs,
            docs=docs,
        )

        docs_find_shared_result.additional_properties = d
        return docs_find_shared_result

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
