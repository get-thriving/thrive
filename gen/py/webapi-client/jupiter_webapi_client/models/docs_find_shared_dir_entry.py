from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.access_status import AccessStatus
    from ..models.dir_ import Dir
    from ..models.tag import Tag
    from ..models.user_light import UserLight


T = TypeVar("T", bound="DocsFindSharedDirEntry")


@_attrs_define
class DocsFindSharedDirEntry:
    """A directory shared directly with the current user.

    Attributes:
        dir_ (Dir): A directory in the doc collection.
        tags (list[Tag]):
        owner (UserLight): A user's ref id, name, and email address.
        access_status (AccessStatus): The effective access status of a principal over a resource.
    """

    dir_: Dir
    tags: list[Tag]
    owner: UserLight
    access_status: AccessStatus
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        dir_ = self.dir_.to_dict()

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        owner = self.owner.to_dict()

        access_status = self.access_status.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "dir": dir_,
                "tags": tags,
                "owner": owner,
                "access_status": access_status,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.access_status import AccessStatus
        from ..models.dir_ import Dir
        from ..models.tag import Tag
        from ..models.user_light import UserLight

        d = dict(src_dict)
        dir_ = Dir.from_dict(d.pop("dir"))

        tags = []
        _tags = d.pop("tags")
        for tags_item_data in _tags:
            tags_item = Tag.from_dict(tags_item_data)

            tags.append(tags_item)

        owner = UserLight.from_dict(d.pop("owner"))

        access_status = AccessStatus.from_dict(d.pop("access_status"))

        docs_find_shared_dir_entry = cls(
            dir_=dir_,
            tags=tags,
            owner=owner,
            access_status=access_status,
        )

        docs_find_shared_dir_entry.additional_properties = d
        return docs_find_shared_dir_entry

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
