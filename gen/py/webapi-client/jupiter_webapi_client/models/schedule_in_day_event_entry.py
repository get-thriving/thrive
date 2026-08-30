from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.schedule_event_in_day import ScheduleEventInDay
    from ..models.schedule_stream import ScheduleStream
    from ..models.tag import Tag
    from ..models.time_event_in_day_block import TimeEventInDayBlock
    from ..models.user_light import UserLight


T = TypeVar("T", bound="ScheduleInDayEventEntry")


@_attrs_define
class ScheduleInDayEventEntry:
    """Result entry.

    Attributes:
        event (ScheduleEventInDay): An event in a schedule.
        tags (list[Tag]):
        time_event (TimeEventInDayBlock): Time event.
        stream (ScheduleStream): A schedule group or stream of events.
        owner (UserLight): A user's ref id, name, and email address.
    """

    event: ScheduleEventInDay
    tags: list[Tag]
    time_event: TimeEventInDayBlock
    stream: ScheduleStream
    owner: UserLight
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        event = self.event.to_dict()

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        time_event = self.time_event.to_dict()

        stream = self.stream.to_dict()

        owner = self.owner.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "event": event,
                "tags": tags,
                "time_event": time_event,
                "stream": stream,
                "owner": owner,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.schedule_event_in_day import ScheduleEventInDay  # noqa: PLC0415
        from ..models.schedule_stream import ScheduleStream  # noqa: PLC0415
        from ..models.tag import Tag  # noqa: PLC0415
        from ..models.time_event_in_day_block import TimeEventInDayBlock  # noqa: PLC0415
        from ..models.user_light import UserLight  # noqa: PLC0415

        d = dict(src_dict)
        event = ScheduleEventInDay.from_dict(d.pop("event"))

        tags = []
        _tags = d.pop("tags")
        for tags_item_data in _tags:
            tags_item = Tag.from_dict(tags_item_data)

            tags.append(tags_item)

        time_event = TimeEventInDayBlock.from_dict(d.pop("time_event"))

        stream = ScheduleStream.from_dict(d.pop("stream"))

        owner = UserLight.from_dict(d.pop("owner"))

        schedule_in_day_event_entry = cls(
            event=event,
            tags=tags,
            time_event=time_event,
            stream=stream,
            owner=owner,
        )

        schedule_in_day_event_entry.additional_properties = d
        return schedule_in_day_event_entry

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
