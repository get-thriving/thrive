from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.doc import Doc
    from ..models.note import Note
    from ..models.tag import Tag


T = TypeVar("T", bound="DirLoadResultEntry")


@_attrs_define
class DirLoadResultEntry:
    """One doc in the loaded directory.

    Attributes:
        doc (Doc): A doc in the docbook.
        tags (list[Tag]):
        note (Note): A note in the notebook.
    """

    doc: Doc
    tags: list[Tag]
    note: Note
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        doc = self.doc.to_dict()

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        note = self.note.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "doc": doc,
                "tags": tags,
                "note": note,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.doc import Doc
        from ..models.note import Note
        from ..models.tag import Tag

        d = dict(src_dict)
        doc = Doc.from_dict(d.pop("doc"))

        tags = []
        _tags = d.pop("tags")
        for tags_item_data in _tags:
            tags_item = Tag.from_dict(tags_item_data)

            tags.append(tags_item)

        note = Note.from_dict(d.pop("note"))

        dir_load_result_entry = cls(
            doc=doc,
            tags=tags,
            note=note,
        )

        dir_load_result_entry.additional_properties = d
        return dir_load_result_entry

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
