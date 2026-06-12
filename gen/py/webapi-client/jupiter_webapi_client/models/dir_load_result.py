from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.dir_ import Dir
    from ..models.dir_load_result_entry import DirLoadResultEntry
    from ..models.dir_load_subdir_entry import DirLoadSubdirEntry
    from ..models.publish_entity import PublishEntity


T = TypeVar("T", bound="DirLoadResult")


@_attrs_define
class DirLoadResult:
    """Loaded directory, its docs, and immediate child directories.

    Attributes:
        dir_ (Dir): A directory in the doc collection.
        entries (list[DirLoadResultEntry]):
        subdirs (list[DirLoadSubdirEntry]):
        publish_entity (None | PublishEntity | Unset):
    """

    dir_: Dir
    entries: list[DirLoadResultEntry]
    subdirs: list[DirLoadSubdirEntry]
    publish_entity: None | PublishEntity | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.publish_entity import PublishEntity

        dir_ = self.dir_.to_dict()

        entries = []
        for entries_item_data in self.entries:
            entries_item = entries_item_data.to_dict()
            entries.append(entries_item)

        subdirs = []
        for subdirs_item_data in self.subdirs:
            subdirs_item = subdirs_item_data.to_dict()
            subdirs.append(subdirs_item)

        publish_entity: dict[str, Any] | None | Unset
        if isinstance(self.publish_entity, Unset):
            publish_entity = UNSET
        elif isinstance(self.publish_entity, PublishEntity):
            publish_entity = self.publish_entity.to_dict()
        else:
            publish_entity = self.publish_entity

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "dir": dir_,
                "entries": entries,
                "subdirs": subdirs,
            }
        )
        if publish_entity is not UNSET:
            field_dict["publish_entity"] = publish_entity

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.dir_ import Dir
        from ..models.dir_load_result_entry import DirLoadResultEntry
        from ..models.dir_load_subdir_entry import DirLoadSubdirEntry
        from ..models.publish_entity import PublishEntity

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

        def _parse_publish_entity(data: object) -> None | PublishEntity | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                publish_entity_type_0 = PublishEntity.from_dict(data)

                return publish_entity_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | PublishEntity | Unset, data)

        publish_entity = _parse_publish_entity(d.pop("publish_entity", UNSET))

        dir_load_result = cls(
            dir_=dir_,
            entries=entries,
            subdirs=subdirs,
            publish_entity=publish_entity,
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
