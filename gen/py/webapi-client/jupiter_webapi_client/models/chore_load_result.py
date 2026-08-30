from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.access_status import AccessStatus
    from ..models.aspect import Aspect
    from ..models.chapter import Chapter
    from ..models.chore import Chore
    from ..models.contact import Contact
    from ..models.goal import Goal
    from ..models.inbox_task import InboxTask
    from ..models.location import Location
    from ..models.note import Note
    from ..models.publish_entity import PublishEntity
    from ..models.tag import Tag
    from ..models.time_event_in_day_block import TimeEventInDayBlock
    from ..models.user_light import UserLight


T = TypeVar("T", bound="ChoreLoadResult")


@_attrs_define
class ChoreLoadResult:
    """ChoreLoadResult.

    Attributes:
        chore (Chore): A chore.
        aspect (Aspect): The aspect.
        inbox_tasks (list[InboxTask]):
        inbox_tasks_total_cnt (int):
        inbox_tasks_page_size (int):
        tags (list[Tag]):
        contacts (list[Contact]):
        location (Location | None | Unset):
        time_event_blocks (list[TimeEventInDayBlock]):
        owner (UserLight): A user's ref id, name, and email address.
        chapter (Chapter | None | Unset):
        goal (Goal | None | Unset):
        note (None | Note | Unset):
        publish_entity (None | PublishEntity | Unset):
        access_status (AccessStatus | None | Unset):
    """

    chore: Chore
    aspect: Aspect
    inbox_tasks: list[InboxTask]
    inbox_tasks_total_cnt: int
    inbox_tasks_page_size: int
    tags: list[Tag]
    contacts: list[Contact]
    time_event_blocks: list[TimeEventInDayBlock]
    owner: UserLight
    location: Location | None | Unset = UNSET
    chapter: Chapter | None | Unset = UNSET
    goal: Goal | None | Unset = UNSET
    note: None | Note | Unset = UNSET
    publish_entity: None | PublishEntity | Unset = UNSET
    access_status: AccessStatus | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.access_status import AccessStatus  # noqa: PLC0415
        from ..models.chapter import Chapter  # noqa: PLC0415
        from ..models.goal import Goal  # noqa: PLC0415
        from ..models.location import Location  # noqa: PLC0415
        from ..models.note import Note  # noqa: PLC0415
        from ..models.publish_entity import PublishEntity  # noqa: PLC0415

        chore = self.chore.to_dict()

        aspect = self.aspect.to_dict()

        inbox_tasks = []
        for inbox_tasks_item_data in self.inbox_tasks:
            inbox_tasks_item = inbox_tasks_item_data.to_dict()
            inbox_tasks.append(inbox_tasks_item)

        inbox_tasks_total_cnt = self.inbox_tasks_total_cnt

        inbox_tasks_page_size = self.inbox_tasks_page_size

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        contacts = []
        for contacts_item_data in self.contacts:
            contacts_item = contacts_item_data.to_dict()
            contacts.append(contacts_item)

        time_event_blocks = []
        for time_event_blocks_item_data in self.time_event_blocks:
            time_event_blocks_item = time_event_blocks_item_data.to_dict()
            time_event_blocks.append(time_event_blocks_item)

        owner = self.owner.to_dict()

        chapter: dict[str, Any] | None | Unset
        if isinstance(self.chapter, Unset):
            chapter = UNSET
        elif isinstance(self.chapter, Chapter):
            chapter = self.chapter.to_dict()
        else:
            chapter = self.chapter

        goal: dict[str, Any] | None | Unset
        if isinstance(self.goal, Unset):
            goal = UNSET
        elif isinstance(self.goal, Goal):
            goal = self.goal.to_dict()
        else:
            goal = self.goal

        note: dict[str, Any] | None | Unset
        if isinstance(self.note, Unset):
            note = UNSET
        elif isinstance(self.note, Note):
            note = self.note.to_dict()
        else:
            note = self.note

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

        location: dict[str, Any] | None | Unset
        if isinstance(self.location, Unset):
            location = UNSET
        elif isinstance(self.location, Location):
            location = self.location.to_dict()
        else:
            location = self.location

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "chore": chore,
                "aspect": aspect,
                "inbox_tasks": inbox_tasks,
                "inbox_tasks_total_cnt": inbox_tasks_total_cnt,
                "inbox_tasks_page_size": inbox_tasks_page_size,
                "tags": tags,
                "contacts": contacts,
                "time_event_blocks": time_event_blocks,
                "owner": owner,
            }
        )
        if chapter is not UNSET:
            field_dict["chapter"] = chapter
        if goal is not UNSET:
            field_dict["goal"] = goal
        if note is not UNSET:
            field_dict["note"] = note
        if publish_entity is not UNSET:
            field_dict["publish_entity"] = publish_entity
        if access_status is not UNSET:
            field_dict["access_status"] = access_status

        if location is not UNSET:
            field_dict["location"] = location

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.access_status import AccessStatus  # noqa: PLC0415
        from ..models.aspect import Aspect  # noqa: PLC0415
        from ..models.chapter import Chapter  # noqa: PLC0415
        from ..models.chore import Chore  # noqa: PLC0415
        from ..models.contact import Contact  # noqa: PLC0415
        from ..models.goal import Goal  # noqa: PLC0415
        from ..models.inbox_task import InboxTask  # noqa: PLC0415
        from ..models.location import Location  # noqa: PLC0415
        from ..models.note import Note  # noqa: PLC0415
        from ..models.publish_entity import PublishEntity  # noqa: PLC0415
        from ..models.tag import Tag  # noqa: PLC0415
        from ..models.time_event_in_day_block import TimeEventInDayBlock  # noqa: PLC0415
        from ..models.user_light import UserLight  # noqa: PLC0415

        d = dict(src_dict)
        chore = Chore.from_dict(d.pop("chore"))

        aspect = Aspect.from_dict(d.pop("aspect"))

        inbox_tasks = []
        _inbox_tasks = d.pop("inbox_tasks")
        for inbox_tasks_item_data in _inbox_tasks:
            inbox_tasks_item = InboxTask.from_dict(inbox_tasks_item_data)

            inbox_tasks.append(inbox_tasks_item)

        inbox_tasks_total_cnt = d.pop("inbox_tasks_total_cnt")

        inbox_tasks_page_size = d.pop("inbox_tasks_page_size")

        tags = []
        _tags = d.pop("tags")
        for tags_item_data in _tags:
            tags_item = Tag.from_dict(tags_item_data)

            tags.append(tags_item)

        contacts = []
        _contacts = d.pop("contacts")
        for contacts_item_data in _contacts:
            contacts_item = Contact.from_dict(contacts_item_data)

            contacts.append(contacts_item)

        time_event_blocks = []
        _time_event_blocks = d.pop("time_event_blocks")
        for time_event_blocks_item_data in _time_event_blocks:
            time_event_blocks_item = TimeEventInDayBlock.from_dict(time_event_blocks_item_data)

            time_event_blocks.append(time_event_blocks_item)

        owner = UserLight.from_dict(d.pop("owner"))

        def _parse_chapter(data: object) -> Chapter | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                chapter_type_0 = Chapter.from_dict(data)

                return chapter_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Chapter | None | Unset, data)

        chapter = _parse_chapter(d.pop("chapter", UNSET))

        def _parse_goal(data: object) -> Goal | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                goal_type_0 = Goal.from_dict(data)

                return goal_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Goal | None | Unset, data)

        goal = _parse_goal(d.pop("goal", UNSET))

        def _parse_note(data: object) -> None | Note | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                note_type_0 = Note.from_dict(data)

                return note_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Note | Unset, data)

        note = _parse_note(d.pop("note", UNSET))

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

        def _parse_location(data: object) -> Location | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                location_type_0 = Location.from_dict(data)

                return location_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Location | None | Unset, data)

        location = _parse_location(d.pop("location", UNSET))

        chore_load_result = cls(
            chore=chore,
            aspect=aspect,
            inbox_tasks=inbox_tasks,
            inbox_tasks_total_cnt=inbox_tasks_total_cnt,
            inbox_tasks_page_size=inbox_tasks_page_size,
            tags=tags,
            contacts=contacts,
            time_event_blocks=time_event_blocks,
            owner=owner,
            chapter=chapter,
            goal=goal,
            note=note,
            publish_entity=publish_entity,
            access_status=access_status,
            location=location,

        )

        chore_load_result.additional_properties = d
        return chore_load_result

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
