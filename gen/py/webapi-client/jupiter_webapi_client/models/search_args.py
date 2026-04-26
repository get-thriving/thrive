from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.named_entity_tag import NamedEntityTag
from ..types import UNSET, Unset

T = TypeVar("T", bound="SearchArgs")


@_attrs_define
class SearchArgs:
    """Search args.

    Attributes:
        query (str): A search query parameter for searches.
        limit (int): A search limit parameter for searches.
        include_archived (bool):
        filter_entity_tags (list[NamedEntityTag] | None | Unset):
        filter_tag_ref_ids (list[str] | None | Unset):
        filter_contact_ref_ids (list[str] | None | Unset):
        filter_created_time_after (None | str | Unset):
        filter_created_time_before (None | str | Unset):
        filter_last_modified_time_after (None | str | Unset):
        filter_last_modified_time_before (None | str | Unset):
        filter_archived_time_after (None | str | Unset):
        filter_archived_time_before (None | str | Unset):
        offset (int | None | Unset):
    """

    query: str
    limit: int
    include_archived: bool
    filter_entity_tags: list[NamedEntityTag] | None | Unset = UNSET
    filter_tag_ref_ids: list[str] | None | Unset = UNSET
    filter_contact_ref_ids: list[str] | None | Unset = UNSET
    filter_created_time_after: None | str | Unset = UNSET
    filter_created_time_before: None | str | Unset = UNSET
    filter_last_modified_time_after: None | str | Unset = UNSET
    filter_last_modified_time_before: None | str | Unset = UNSET
    filter_archived_time_after: None | str | Unset = UNSET
    filter_archived_time_before: None | str | Unset = UNSET
    offset: int | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        query = self.query

        limit = self.limit

        include_archived = self.include_archived

        filter_entity_tags: list[str] | None | Unset
        if isinstance(self.filter_entity_tags, Unset):
            filter_entity_tags = UNSET
        elif isinstance(self.filter_entity_tags, list):
            filter_entity_tags = []
            for filter_entity_tags_type_0_item_data in self.filter_entity_tags:
                filter_entity_tags_type_0_item = filter_entity_tags_type_0_item_data.value
                filter_entity_tags.append(filter_entity_tags_type_0_item)

        else:
            filter_entity_tags = self.filter_entity_tags

        filter_tag_ref_ids: list[str] | None | Unset
        if isinstance(self.filter_tag_ref_ids, Unset):
            filter_tag_ref_ids = UNSET
        elif isinstance(self.filter_tag_ref_ids, list):
            filter_tag_ref_ids = self.filter_tag_ref_ids

        else:
            filter_tag_ref_ids = self.filter_tag_ref_ids

        filter_contact_ref_ids: list[str] | None | Unset
        if isinstance(self.filter_contact_ref_ids, Unset):
            filter_contact_ref_ids = UNSET
        elif isinstance(self.filter_contact_ref_ids, list):
            filter_contact_ref_ids = self.filter_contact_ref_ids

        else:
            filter_contact_ref_ids = self.filter_contact_ref_ids

        filter_created_time_after: None | str | Unset
        if isinstance(self.filter_created_time_after, Unset):
            filter_created_time_after = UNSET
        else:
            filter_created_time_after = self.filter_created_time_after

        filter_created_time_before: None | str | Unset
        if isinstance(self.filter_created_time_before, Unset):
            filter_created_time_before = UNSET
        else:
            filter_created_time_before = self.filter_created_time_before

        filter_last_modified_time_after: None | str | Unset
        if isinstance(self.filter_last_modified_time_after, Unset):
            filter_last_modified_time_after = UNSET
        else:
            filter_last_modified_time_after = self.filter_last_modified_time_after

        filter_last_modified_time_before: None | str | Unset
        if isinstance(self.filter_last_modified_time_before, Unset):
            filter_last_modified_time_before = UNSET
        else:
            filter_last_modified_time_before = self.filter_last_modified_time_before

        filter_archived_time_after: None | str | Unset
        if isinstance(self.filter_archived_time_after, Unset):
            filter_archived_time_after = UNSET
        else:
            filter_archived_time_after = self.filter_archived_time_after

        filter_archived_time_before: None | str | Unset
        if isinstance(self.filter_archived_time_before, Unset):
            filter_archived_time_before = UNSET
        else:
            filter_archived_time_before = self.filter_archived_time_before

        offset: int | None | Unset
        if isinstance(self.offset, Unset):
            offset = UNSET
        else:
            offset = self.offset

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "query": query,
                "limit": limit,
                "include_archived": include_archived,
            }
        )
        if filter_entity_tags is not UNSET:
            field_dict["filter_entity_tags"] = filter_entity_tags
        if filter_tag_ref_ids is not UNSET:
            field_dict["filter_tag_ref_ids"] = filter_tag_ref_ids
        if filter_contact_ref_ids is not UNSET:
            field_dict["filter_contact_ref_ids"] = filter_contact_ref_ids
        if filter_created_time_after is not UNSET:
            field_dict["filter_created_time_after"] = filter_created_time_after
        if filter_created_time_before is not UNSET:
            field_dict["filter_created_time_before"] = filter_created_time_before
        if filter_last_modified_time_after is not UNSET:
            field_dict["filter_last_modified_time_after"] = filter_last_modified_time_after
        if filter_last_modified_time_before is not UNSET:
            field_dict["filter_last_modified_time_before"] = filter_last_modified_time_before
        if filter_archived_time_after is not UNSET:
            field_dict["filter_archived_time_after"] = filter_archived_time_after
        if filter_archived_time_before is not UNSET:
            field_dict["filter_archived_time_before"] = filter_archived_time_before
        if offset is not UNSET:
            field_dict["offset"] = offset

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        query = d.pop("query")

        limit = d.pop("limit")

        include_archived = d.pop("include_archived")

        def _parse_filter_entity_tags(data: object) -> list[NamedEntityTag] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                filter_entity_tags_type_0 = []
                _filter_entity_tags_type_0 = data
                for filter_entity_tags_type_0_item_data in _filter_entity_tags_type_0:
                    filter_entity_tags_type_0_item = NamedEntityTag(filter_entity_tags_type_0_item_data)

                    filter_entity_tags_type_0.append(filter_entity_tags_type_0_item)

                return filter_entity_tags_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[NamedEntityTag] | None | Unset, data)

        filter_entity_tags = _parse_filter_entity_tags(d.pop("filter_entity_tags", UNSET))

        def _parse_filter_tag_ref_ids(data: object) -> list[str] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                filter_tag_ref_ids_type_0 = cast(list[str], data)

                return filter_tag_ref_ids_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[str] | None | Unset, data)

        filter_tag_ref_ids = _parse_filter_tag_ref_ids(d.pop("filter_tag_ref_ids", UNSET))

        def _parse_filter_contact_ref_ids(data: object) -> list[str] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                filter_contact_ref_ids_type_0 = cast(list[str], data)

                return filter_contact_ref_ids_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[str] | None | Unset, data)

        filter_contact_ref_ids = _parse_filter_contact_ref_ids(d.pop("filter_contact_ref_ids", UNSET))

        def _parse_filter_created_time_after(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        filter_created_time_after = _parse_filter_created_time_after(d.pop("filter_created_time_after", UNSET))

        def _parse_filter_created_time_before(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        filter_created_time_before = _parse_filter_created_time_before(d.pop("filter_created_time_before", UNSET))

        def _parse_filter_last_modified_time_after(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        filter_last_modified_time_after = _parse_filter_last_modified_time_after(
            d.pop("filter_last_modified_time_after", UNSET)
        )

        def _parse_filter_last_modified_time_before(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        filter_last_modified_time_before = _parse_filter_last_modified_time_before(
            d.pop("filter_last_modified_time_before", UNSET)
        )

        def _parse_filter_archived_time_after(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        filter_archived_time_after = _parse_filter_archived_time_after(d.pop("filter_archived_time_after", UNSET))

        def _parse_filter_archived_time_before(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        filter_archived_time_before = _parse_filter_archived_time_before(d.pop("filter_archived_time_before", UNSET))

        def _parse_offset(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        offset = _parse_offset(d.pop("offset", UNSET))

        search_args = cls(
            query=query,
            limit=limit,
            include_archived=include_archived,
            filter_entity_tags=filter_entity_tags,
            filter_tag_ref_ids=filter_tag_ref_ids,
            filter_contact_ref_ids=filter_contact_ref_ids,
            filter_created_time_after=filter_created_time_after,
            filter_created_time_before=filter_created_time_before,
            filter_last_modified_time_after=filter_last_modified_time_after,
            filter_last_modified_time_before=filter_last_modified_time_before,
            filter_archived_time_after=filter_archived_time_after,
            filter_archived_time_before=filter_archived_time_before,
            offset=offset,
        )

        search_args.additional_properties = d
        return search_args

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
