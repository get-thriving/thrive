from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.inbox_task import InboxTask
    from ..models.journal import Journal
    from ..models.journal_stats import JournalStats
    from ..models.note import Note
    from ..models.publish_entity import PublishEntity
    from ..models.tag import Tag


T = TypeVar("T", bound="JournalLoadResult")


@_attrs_define
class JournalLoadResult:
    """JournalLoadResult.

    Attributes:
        journal (Journal): A journal for a particular range.
        tags (list[Tag]):
        note (Note): A note in the notebook.
        journal_stats (JournalStats): Stats about a journal.
        sub_period_journals (list[Journal]):
        writing_task (InboxTask | None | Unset):
        publish_entity (None | PublishEntity | Unset):
    """

    journal: Journal
    tags: list[Tag]
    note: Note
    journal_stats: JournalStats
    sub_period_journals: list[Journal]
    writing_task: InboxTask | None | Unset = UNSET
    publish_entity: None | PublishEntity | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.inbox_task import InboxTask
        from ..models.publish_entity import PublishEntity

        journal = self.journal.to_dict()

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        note = self.note.to_dict()

        journal_stats = self.journal_stats.to_dict()

        sub_period_journals = []
        for sub_period_journals_item_data in self.sub_period_journals:
            sub_period_journals_item = sub_period_journals_item_data.to_dict()
            sub_period_journals.append(sub_period_journals_item)

        writing_task: dict[str, Any] | None | Unset
        if isinstance(self.writing_task, Unset):
            writing_task = UNSET
        elif isinstance(self.writing_task, InboxTask):
            writing_task = self.writing_task.to_dict()
        else:
            writing_task = self.writing_task

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
                "journal": journal,
                "tags": tags,
                "note": note,
                "journal_stats": journal_stats,
                "sub_period_journals": sub_period_journals,
            }
        )
        if writing_task is not UNSET:
            field_dict["writing_task"] = writing_task
        if publish_entity is not UNSET:
            field_dict["publish_entity"] = publish_entity

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.inbox_task import InboxTask
        from ..models.journal import Journal
        from ..models.journal_stats import JournalStats
        from ..models.note import Note
        from ..models.publish_entity import PublishEntity
        from ..models.tag import Tag

        d = dict(src_dict)
        journal = Journal.from_dict(d.pop("journal"))

        tags = []
        _tags = d.pop("tags")
        for tags_item_data in _tags:
            tags_item = Tag.from_dict(tags_item_data)

            tags.append(tags_item)

        note = Note.from_dict(d.pop("note"))

        journal_stats = JournalStats.from_dict(d.pop("journal_stats"))

        sub_period_journals = []
        _sub_period_journals = d.pop("sub_period_journals")
        for sub_period_journals_item_data in _sub_period_journals:
            sub_period_journals_item = Journal.from_dict(sub_period_journals_item_data)

            sub_period_journals.append(sub_period_journals_item)

        def _parse_writing_task(data: object) -> InboxTask | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                writing_task_type_0 = InboxTask.from_dict(data)

                return writing_task_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(InboxTask | None | Unset, data)

        writing_task = _parse_writing_task(d.pop("writing_task", UNSET))

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

        journal_load_result = cls(
            journal=journal,
            tags=tags,
            note=note,
            journal_stats=journal_stats,
            sub_period_journals=sub_period_journals,
            writing_task=writing_task,
            publish_entity=publish_entity,
        )

        journal_load_result.additional_properties = d
        return journal_load_result

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
