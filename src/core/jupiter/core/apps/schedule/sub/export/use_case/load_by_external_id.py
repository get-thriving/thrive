"""Guest readonly use case for loading a schedule export by external id."""

from collections import defaultdict
from typing import cast

from jupiter.core.apps.schedule.domain import ScheduleDomain
from jupiter.core.apps.schedule.sub.event_full_days.root import (
    ScheduleEventFullDays,
)
from jupiter.core.apps.schedule.sub.event_in_day.root import (
    ScheduleEventInDay,
)
from jupiter.core.apps.schedule.sub.export.root import (
    ScheduleExport,
    ScheduleExportRepository,
)
from jupiter.core.apps.schedule.sub.stream.root import ScheduleStream
from jupiter.core.calendar.service.load_for_date_and_period import (
    ScheduleFullDaysEventEntry,
    ScheduleInDayEventEntry,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.locations.sub.link.root import LocationLink
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.crown_entity_reader import UnrestrictedCrownEntityReader
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


async def _owners_for_schedule_events(
    uow: DomainUnitOfWork,
    entity_type: str,
    event_ref_ids: list[EntityId],
) -> dict[EntityId, UserLight]:
    """Bulk-resolve owner users for schedule events."""
    if not event_ref_ids:
        return {}
    owner_links = [
        EntityLink.std(entity_type, event_ref_id) for event_ref_id in event_ref_ids
    ]
    owner_ref_ids_by_event_ref_id = await OwnerUserRefIdsForEntitiesService().do_it(
        uow, owner_links
    )
    owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
        list(set(owner_ref_ids_by_event_ref_id.values()))
    )
    owners_by_ref_id = {owner.ref_id: owner for owner in owners}
    return {
        event_ref_id: owners_by_ref_id[owner_ref_ids_by_event_ref_id[event_ref_id]]
        for event_ref_id in event_ref_ids
    }


@use_case_args
class ScheduleExportLoadByExternalIdArgs(UseCaseArgsBase):
    """Args."""

    external_id: str


@use_case_result_part
class ScheduleExportLoadByExternalIdScheduleStreamEntry(UseCaseResultBase):
    """A schedule stream and the events included in the export."""

    schedule_stream: ScheduleStream
    schedule_event_full_days_entries: list[ScheduleFullDaysEventEntry]
    schedule_event_in_day_entries: list[ScheduleInDayEventEntry]


@use_case_result
class ScheduleExportLoadByExternalIdResult(UseCaseResultBase):
    """Result."""

    export: ScheduleExport
    entries: list[ScheduleExportLoadByExternalIdScheduleStreamEntry]


class ScheduleExportLoadByExternalIdUseCase(
    JupiterGuestReadonlyUseCase[
        ScheduleExportLoadByExternalIdArgs, ScheduleExportLoadByExternalIdResult
    ]
):
    """Load a schedule export and its stream events from an external id."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: ScheduleExportLoadByExternalIdArgs,
    ) -> ScheduleExportLoadByExternalIdResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            schedule_export = await uow.get(ScheduleExportRepository).load_by_guid(
                args.external_id
            )
            crown_entity_reader = UnrestrictedCrownEntityReader(uow)

            schedule_streams = await crown_entity_reader.load_all_entities(
                ScheduleStream,
                schedule_export.schedule_stream_ref_ids,
                allow_archived=False,
            )
            schedule_streams_by_ref_id: dict[EntityId, ScheduleStream] = {
                stream.ref_id: stream for stream in schedule_streams
            }
            schedule_stream_ref_ids = list(schedule_streams_by_ref_id.keys())

            schedule_events_in_day = await crown_entity_reader.find_all_entities(
                ScheduleEventInDay,
                allow_archived=False,
                parent_ref_id=schedule_export.schedule_domain.ref_id,
                schedule_stream_ref_id=schedule_stream_ref_ids,
            )
            schedule_events_full_days = await crown_entity_reader.find_all_entities(
                ScheduleEventFullDays,
                allow_archived=False,
                parent_ref_id=schedule_export.schedule_domain.ref_id,
                schedule_stream_ref_id=schedule_stream_ref_ids,
            )

            schedule_domain = await uow.get_for(ScheduleDomain).load_by_id(
                schedule_export.schedule_domain.ref_id
            )
            workspace_ref_id = schedule_domain.workspace.ref_id
            time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
                workspace_ref_id
            )
            tag_domain = await uow.get_for(TagDomain).load_by_parent(workspace_ref_id)

            schedule_event_in_day_ref_ids = [
                event.ref_id for event in schedule_events_in_day
            ]
            schedule_event_full_days_ref_ids = [
                event.ref_id for event in schedule_events_full_days
            ]

            schedule_in_day_owner_links = [
                EntityLink.std(NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value, rid)
                for rid in schedule_event_in_day_ref_ids
            ]
            time_events_in_day = await uow.get_for(
                TimeEventInDayBlock
            ).find_all_generic(
                parent_ref_id=time_event_domain.ref_id,
                allow_archived=False,
                owner=schedule_in_day_owner_links,
            )
            time_events_in_day_by_source_ref_id: dict[EntityId, TimeEventInDayBlock] = {
                event.owner.ref_id: event for event in time_events_in_day
            }

            full_days_owners = [
                EntityLink.std(
                    NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
                    rid,
                )
                for rid in schedule_event_full_days_ref_ids
            ]
            time_events_full_days = await uow.get_for(
                TimeEventFullDaysBlock
            ).find_all_generic(
                parent_ref_id=time_event_domain.ref_id,
                allow_archived=False,
                owner=full_days_owners,
            )
            time_events_full_days_by_source_ref_id: dict[
                EntityId, TimeEventFullDaysBlock
            ] = {event.owner.ref_id: event for event in time_events_full_days}

            in_day_tag_links = await uow.get(TagLinkRepository).find_all_generic(
                parent_ref_id=tag_domain.ref_id,
                allow_archived=False,
                owner=[
                    EntityLink.std(NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value, rid)
                    for rid in schedule_event_in_day_ref_ids
                ],
            )
            all_in_day_tag_ref_ids: list[EntityId] = []
            for tl in in_day_tag_links:
                all_in_day_tag_ref_ids.extend(tl.ref_ids)
            if all_in_day_tag_ref_ids:
                all_in_day_tags = await uow.get_for(Tag).find_all_generic(
                    parent_ref_id=tag_domain.ref_id,
                    allow_archived=False,
                    ref_id=list(set(all_in_day_tag_ref_ids)),
                )
                all_in_day_tags_by_ref_id = {tag.ref_id: tag for tag in all_in_day_tags}
            else:
                all_in_day_tags_by_ref_id = {}
            in_day_tags_by_schedule_event_ref_id: dict[EntityId, list[Tag]] = {}
            for tag_link in in_day_tag_links:
                in_day_tags_by_schedule_event_ref_id[
                    cast(EntityId, tag_link.owner.ref_id)
                ] = [
                    all_in_day_tags_by_ref_id[rid]
                    for rid in tag_link.ref_ids
                    if rid in all_in_day_tags_by_ref_id
                ]

            full_days_tag_links = await uow.get(TagLinkRepository).find_all_generic(
                parent_ref_id=tag_domain.ref_id,
                allow_archived=False,
                owner=[
                    EntityLink.std(
                        NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value, rid
                    )
                    for rid in schedule_event_full_days_ref_ids
                ],
            )
            all_full_days_tag_ref_ids: list[EntityId] = []
            for tl in full_days_tag_links:
                all_full_days_tag_ref_ids.extend(tl.ref_ids)
            if all_full_days_tag_ref_ids:
                all_full_days_tags = await uow.get_for(Tag).find_all_generic(
                    parent_ref_id=tag_domain.ref_id,
                    allow_archived=False,
                    ref_id=list(set(all_full_days_tag_ref_ids)),
                )
                all_full_days_tags_by_ref_id = {
                    tag.ref_id: tag for tag in all_full_days_tags
                }
            else:
                all_full_days_tags_by_ref_id = {}
            full_days_tags_by_schedule_event_ref_id: dict[EntityId, list[Tag]] = {}
            for tag_link in full_days_tag_links:
                full_days_tags_by_schedule_event_ref_id[
                    cast(EntityId, tag_link.owner.ref_id)
                ] = [
                    all_full_days_tags_by_ref_id[rid]
                    for rid in tag_link.ref_ids
                    if rid in all_full_days_tags_by_ref_id
                ]

            in_day_owners_by_event_ref_id = await _owners_for_schedule_events(
                uow,
                NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
                schedule_event_in_day_ref_ids,
            )
            full_days_owners_by_event_ref_id = await _owners_for_schedule_events(
                uow,
                NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
                schedule_event_full_days_ref_ids,
            )

            location_owner_links = [
                EntityLink.std(NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value, rid)
                for rid in schedule_event_in_day_ref_ids
            ] + [
                EntityLink.std(
                    NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value, rid
                )
                for rid in schedule_event_full_days_ref_ids
            ]
            in_day_locations_by_event_ref_id: dict[EntityId, Location] = {}
            full_days_locations_by_event_ref_id: dict[EntityId, Location] = {}
            if location_owner_links:
                location_links = await uow.get_for(LocationLink).find_all_generic(
                    allow_archived=False,
                    owner=location_owner_links,
                )
                event_location_ref_id = {
                    (link.owner.the_type, link.owner.ref_id): location_ref_id
                    for link in location_links
                    if (location_ref_id := link.location_ref_id) is not None
                }
                all_location_ref_ids = list(event_location_ref_id.values())
                if all_location_ref_ids:
                    locations = await uow.get_for(Location).find_all_generic(
                        allow_archived=False,
                        ref_id=list(set(all_location_ref_ids)),
                    )
                    locations_by_ref_id = {loc.ref_id: loc for loc in locations}
                    in_day_locations_by_event_ref_id = {
                        event_ref_id: locations_by_ref_id[location_ref_id]
                        for (
                            entity_type,
                            event_ref_id,
                        ), location_ref_id in event_location_ref_id.items()
                        if entity_type == NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value
                        and location_ref_id in locations_by_ref_id
                    }
                    full_days_locations_by_event_ref_id = {
                        event_ref_id: locations_by_ref_id[location_ref_id]
                        for (
                            entity_type,
                            event_ref_id,
                        ), location_ref_id in event_location_ref_id.items()
                        if entity_type
                        == NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value
                        and location_ref_id in locations_by_ref_id
                    }

            in_day_entries_by_stream_ref_id: defaultdict[
                EntityId, list[ScheduleInDayEventEntry]
            ] = defaultdict(list)
            for event_in_day in schedule_events_in_day:
                if event_in_day.ref_id not in time_events_in_day_by_source_ref_id:
                    continue
                stream = schedule_streams_by_ref_id.get(
                    event_in_day.schedule_stream_ref_id
                )
                if stream is None:
                    continue
                in_day_entries_by_stream_ref_id[
                    event_in_day.schedule_stream_ref_id
                ].append(
                    ScheduleInDayEventEntry(
                        event=event_in_day,
                        tags=in_day_tags_by_schedule_event_ref_id.get(
                            event_in_day.ref_id, []
                        ),
                        location=in_day_locations_by_event_ref_id.get(
                            event_in_day.ref_id
                        ),
                        time_event=time_events_in_day_by_source_ref_id[
                            event_in_day.ref_id
                        ],
                        stream=stream,
                        owner=in_day_owners_by_event_ref_id[event_in_day.ref_id],
                    )
                )

            full_days_entries_by_stream_ref_id: defaultdict[
                EntityId, list[ScheduleFullDaysEventEntry]
            ] = defaultdict(list)
            for event_full_day in schedule_events_full_days:
                if event_full_day.ref_id not in time_events_full_days_by_source_ref_id:
                    continue
                stream = schedule_streams_by_ref_id.get(
                    event_full_day.schedule_stream_ref_id
                )
                if stream is None:
                    continue
                full_days_entries_by_stream_ref_id[
                    event_full_day.schedule_stream_ref_id
                ].append(
                    ScheduleFullDaysEventEntry(
                        event=event_full_day,
                        tags=full_days_tags_by_schedule_event_ref_id.get(
                            event_full_day.ref_id, []
                        ),
                        location=full_days_locations_by_event_ref_id.get(
                            event_full_day.ref_id
                        ),
                        time_event=time_events_full_days_by_source_ref_id[
                            event_full_day.ref_id
                        ],
                        stream=stream,
                        owner=full_days_owners_by_event_ref_id[event_full_day.ref_id],
                    )
                )

            schedule_stream_entries = [
                ScheduleExportLoadByExternalIdScheduleStreamEntry(
                    schedule_stream=stream,
                    schedule_event_full_days_entries=full_days_entries_by_stream_ref_id.get(
                        stream.ref_id, []
                    ),
                    schedule_event_in_day_entries=in_day_entries_by_stream_ref_id.get(
                        stream.ref_id, []
                    ),
                )
                for stream in schedule_streams
            ]

            return ScheduleExportLoadByExternalIdResult(
                export=schedule_export,
                entries=schedule_stream_entries,
            )
