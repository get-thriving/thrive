from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.location import Location
    from ..models.schedule_event_full_days import ScheduleEventFullDays
    from ..models.schedule_stream import ScheduleStream
    from ..models.tag import Tag
    from ..models.time_event_full_days_block import TimeEventFullDaysBlock
    from ..models.user_light import UserLight


T = TypeVar("T", bound="ScheduleFullDaysEventEntry")


@_attrs_define
class ScheduleFullDaysEventEntry:
    """Result entry.

    Attributes:
        event (ScheduleEventFullDays): A full day block in a schedule.
        tags (list[Tag]):
        time_event (TimeEventFullDaysBlock): A full day block of time.
        stream (ScheduleStream): A schedule group or stream of events.
        owner (UserLight): A user's ref id, name, and email address.
        location (Location | None | Unset):
    """

    event: ScheduleEventFullDays
    tags: list[Tag]
    time_event: TimeEventFullDaysBlock
    stream: ScheduleStream
    owner: UserLight
    location: Location | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.location import Location  # noqa: PLC0415

        event = self.event.to_dict()

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        time_event = self.time_event.to_dict()

        stream = self.stream.to_dict()

        owner = self.owner.to_dict()

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
                "event": event,
                "tags": tags,
                "time_event": time_event,
                "stream": stream,
                "owner": owner,
            }
        )
        if location is not UNSET:
            field_dict["location"] = location

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.location import Location  # noqa: PLC0415
        from ..models.schedule_event_full_days import ScheduleEventFullDays  # noqa: PLC0415
        from ..models.schedule_stream import ScheduleStream  # noqa: PLC0415
        from ..models.tag import Tag  # noqa: PLC0415
        from ..models.time_event_full_days_block import TimeEventFullDaysBlock  # noqa: PLC0415
        from ..models.user_light import UserLight  # noqa: PLC0415

        d = dict(src_dict)
        event = ScheduleEventFullDays.from_dict(d.pop("event"))

        tags = []
        _tags = d.pop("tags")
        for tags_item_data in _tags:
            tags_item = Tag.from_dict(tags_item_data)

            tags.append(tags_item)

        time_event = TimeEventFullDaysBlock.from_dict(d.pop("time_event"))

        stream = ScheduleStream.from_dict(d.pop("stream"))

        owner = UserLight.from_dict(d.pop("owner"))

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

        schedule_full_days_event_entry = cls(
            event=event,
            tags=tags,
            time_event=time_event,
            stream=stream,
            owner=owner,
            location=location,
        )

        schedule_full_days_event_entry.additional_properties = d
        return schedule_full_days_event_entry

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
