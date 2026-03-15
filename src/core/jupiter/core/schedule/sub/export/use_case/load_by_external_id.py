"""Guest readonly use case for loading a schedule export by external id."""

from collections import defaultdict

from jupiter.core.calendar.use_case.load_for_date_and_period import (
    ScheduleFullDaysEventEntry,
    ScheduleInDayEventEntry,
)
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.namespace import TimeEventNamespace
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
    TimeEventFullDaysBlockRepository,
)
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.event_full_days.root import (
    ScheduleEventFullDays,
)
from jupiter.core.schedule.sub.event_in_day.root import (
    ScheduleEventInDay,
)
from jupiter.core.schedule.sub.export.root import (
    ScheduleExport,
    ScheduleExportRepository,
)
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


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

            schedule_streams = await uow.get_for(ScheduleStream).find_all_generic(
                parent_ref_id=schedule_export.schedule_domain.ref_id,
                allow_archived=False,
                ref_id=schedule_export.schedule_stream_ref_ids,
            )
            schedule_streams_by_ref_id: dict[EntityId, ScheduleStream] = {
                stream.ref_id: stream for stream in schedule_streams
            }
            schedule_stream_ref_ids = list(schedule_streams_by_ref_id.keys())

            schedule_events_in_day = await uow.get_for(
                ScheduleEventInDay
            ).find_all_generic(
                parent_ref_id=schedule_export.schedule_domain.ref_id,
                allow_archived=False,
                schedule_stream_ref_id=schedule_stream_ref_ids,
            )
            schedule_events_full_days = await uow.get_for(
                ScheduleEventFullDays
            ).find_all_generic(
                parent_ref_id=schedule_export.schedule_domain.ref_id,
                allow_archived=False,
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

            time_events_in_day = await uow.get_for(
                TimeEventInDayBlock
            ).find_all_generic(
                parent_ref_id=time_event_domain.ref_id,
                allow_archived=False,
                namespace=TimeEventNamespace.SCHEDULE_EVENT_IN_DAY,
                source_entity_ref_id=schedule_event_in_day_ref_ids,
            )
            time_events_in_day_by_source_ref_id: dict[EntityId, TimeEventInDayBlock] = {
                event.source_entity_ref_id: event for event in time_events_in_day
            }

            time_events_full_days = await uow.get(
                TimeEventFullDaysBlockRepository
            ).find_for_namespace(
                namespace=TimeEventNamespace.SCHEDULE_FULL_DAYS_BLOCK,
                source_entity_ref_id=schedule_event_full_days_ref_ids,
                allow_archived=False,
            )
            time_events_full_days_by_source_ref_id: dict[
                EntityId, TimeEventFullDaysBlock
            ] = {event.source_entity_ref_id: event for event in time_events_full_days}

            all_in_day_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tag_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.SCHEDULE_EVENT_IN_DAY,
            )
            all_in_day_tags_by_ref_id = {tag.ref_id: tag for tag in all_in_day_tags}
            in_day_tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.SCHEDULE_EVENT_IN_DAY,
                source_entity_ref_id=schedule_event_in_day_ref_ids,
            )
            in_day_tags_by_schedule_event_ref_id: dict[EntityId, list[Tag]] = {}
            for tag_link in in_day_tag_links:
                in_day_tags_by_schedule_event_ref_id[tag_link.source_entity_ref_id] = [
                    all_in_day_tags_by_ref_id[rid]
                    for rid in tag_link.ref_ids
                    if rid in all_in_day_tags_by_ref_id
                ]

            all_full_days_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tag_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.SCHEDULE_EVENT_FULL_DAYS_BLOCK,
            )
            all_full_days_tags_by_ref_id = {
                tag.ref_id: tag for tag in all_full_days_tags
            }
            full_days_tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.SCHEDULE_EVENT_FULL_DAYS_BLOCK,
                source_entity_ref_id=schedule_event_full_days_ref_ids,
            )
            full_days_tags_by_schedule_event_ref_id: dict[EntityId, list[Tag]] = {}
            for tag_link in full_days_tag_links:
                full_days_tags_by_schedule_event_ref_id[
                    tag_link.source_entity_ref_id
                ] = [
                    all_full_days_tags_by_ref_id[rid]
                    for rid in tag_link.ref_ids
                    if rid in all_full_days_tags_by_ref_id
                ]

            in_day_entries_by_stream_ref_id: defaultdict[
                EntityId, list[ScheduleInDayEventEntry]
            ] = defaultdict(list)
            for event in schedule_events_in_day:
                if event.ref_id not in time_events_in_day_by_source_ref_id:
                    continue
                stream = schedule_streams_by_ref_id.get(event.schedule_stream_ref_id)
                if stream is None:
                    continue
                in_day_entries_by_stream_ref_id[event.schedule_stream_ref_id].append(
                    ScheduleInDayEventEntry(
                        event=event,
                        tags=in_day_tags_by_schedule_event_ref_id.get(event.ref_id, []),
                        time_event=time_events_in_day_by_source_ref_id[event.ref_id],
                        stream=stream,
                    )
                )

            full_days_entries_by_stream_ref_id: defaultdict[
                EntityId, list[ScheduleFullDaysEventEntry]
            ] = defaultdict(list)
            for event in schedule_events_full_days:
                if event.ref_id not in time_events_full_days_by_source_ref_id:
                    continue
                stream = schedule_streams_by_ref_id.get(event.schedule_stream_ref_id)
                if stream is None:
                    continue
                full_days_entries_by_stream_ref_id[event.schedule_stream_ref_id].append(
                    ScheduleFullDaysEventEntry(
                        event=event,
                        tags=full_days_tags_by_schedule_event_ref_id.get(
                            event.ref_id, []
                        ),
                        time_event=time_events_full_days_by_source_ref_id[event.ref_id],
                        stream=stream,
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
