from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.access_status import AccessStatus
    from ..models.dir_ import Dir
    from ..models.dir_load_result_entry import DirLoadResultEntry
    from ..models.dir_load_subdir_entry import DirLoadSubdirEntry
    from ..models.publish_entity import PublishEntity
    from ..models.user_light import UserLight


T = TypeVar("T", bound="DirLoadResult")


@_attrs_define
class DirLoadResult:
    """Loaded directory, its docs, and immediate child directories.

    Attributes:
        dir_ (Dir): A directory in the doc collection.
        entries (list[DirLoadResultEntry]):
        subdirs (list[DirLoadSubdirEntry]):
        owner (UserLight): A user's ref id, name, and email address.
        publish_entity (None | PublishEntity | Unset):
        access_status (AccessStatus | None | Unset):
        parent_dir (Dir | None | Unset):
        parent_dir_access_status (AccessStatus | None | Unset):
    """

    dir_: Dir
    entries: list[DirLoadResultEntry]
    subdirs: list[DirLoadSubdirEntry]
    owner: UserLight
    publish_entity: None | PublishEntity | Unset = UNSET
    access_status: AccessStatus | None | Unset = UNSET
    parent_dir: Dir | None | Unset = UNSET
    parent_dir_access_status: AccessStatus | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.access_status import AccessStatus
        from ..models.dir_ import Dir
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

        owner = self.owner.to_dict()

        publish_entity: dict[str, Any] | None | Unset
        if isinstance(self.publish_entity, Unset):
            publish_entity = UNSET
        elif isinstance(self.publish_entity, PublishEntity):
            publish_entity = self.publish_entity.to_dict()
        else:
            publish_entity = self.publish_entity

        access_status: dict[str, Any] | None | Unset
        if isinstance(self.access_status, Unset):
            access_status = UNSET
        elif isinstance(self.access_status, AccessStatus):
            access_status = self.access_status.to_dict()
        else:
            access_status = self.access_status

        parent_dir: dict[str, Any] | None | Unset
        if isinstance(self.parent_dir, Unset):
            parent_dir = UNSET
        elif isinstance(self.parent_dir, Dir):
            parent_dir = self.parent_dir.to_dict()
        else:
            parent_dir = self.parent_dir

        parent_dir_access_status: dict[str, Any] | None | Unset
        if isinstance(self.parent_dir_access_status, Unset):
            parent_dir_access_status = UNSET
        elif isinstance(self.parent_dir_access_status, AccessStatus):
            parent_dir_access_status = self.parent_dir_access_status.to_dict()
        else:
            parent_dir_access_status = self.parent_dir_access_status

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "dir": dir_,
                "entries": entries,
                "subdirs": subdirs,
                "owner": owner,
            }
        )
        if publish_entity is not UNSET:
            field_dict["publish_entity"] = publish_entity
        if access_status is not UNSET:
            field_dict["access_status"] = access_status
        if parent_dir is not UNSET:
            field_dict["parent_dir"] = parent_dir
        if parent_dir_access_status is not UNSET:
            field_dict["parent_dir_access_status"] = parent_dir_access_status

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.access_status import AccessStatus
        from ..models.dir_ import Dir
        from ..models.dir_load_result_entry import DirLoadResultEntry
        from ..models.dir_load_subdir_entry import DirLoadSubdirEntry
        from ..models.publish_entity import PublishEntity
        from ..models.user_light import UserLight

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

        owner = UserLight.from_dict(d.pop("owner"))

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

        def _parse_access_status(data: object) -> AccessStatus | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                access_status_type_0 = AccessStatus.from_dict(data)

                return access_status_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(AccessStatus | None | Unset, data)

        access_status = _parse_access_status(d.pop("access_status", UNSET))

        def _parse_parent_dir(data: object) -> Dir | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                parent_dir_type_0 = Dir.from_dict(data)

                return parent_dir_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Dir | None | Unset, data)

        parent_dir = _parse_parent_dir(d.pop("parent_dir", UNSET))

        def _parse_parent_dir_access_status(data: object) -> AccessStatus | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                parent_dir_access_status_type_0 = AccessStatus.from_dict(data)

                return parent_dir_access_status_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(AccessStatus | None | Unset, data)

        parent_dir_access_status = _parse_parent_dir_access_status(d.pop("parent_dir_access_status", UNSET))

        dir_load_result = cls(
            dir_=dir_,
            entries=entries,
            subdirs=subdirs,
            owner=owner,
            publish_entity=publish_entity,
            access_status=access_status,
            parent_dir=parent_dir,
            parent_dir_access_status=parent_dir_access_status,
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
