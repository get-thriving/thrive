"""Shared service for loading a schedule stream."""

from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.publish.sub.entity.root import (
    PublishEntity,
    PublishEntityRepository,
)
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result


@use_case_result
class ScheduleStreamLoadResult(UseCaseResultBase):
    """ScheduleStreamLoadResult."""

    schedule_stream: ScheduleStream
    note: Note | None
    tags: list[Tag]
    publish_entity: PublishEntity | None


class ScheduleStreamLoadService:
    """Shared service for loading a schedule stream."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        schedule_stream: ScheduleStream,
        *,
        allow_archived: bool = False,
        include_publish_entity: bool = True,
    ) -> ScheduleStreamLoadResult:
        """Load a schedule stream and its dependent entities."""
        schedule_stream = await uow.get_for(ScheduleStream).load_by_id(
            schedule_stream.ref_id,
            allow_archived=allow_archived,
        )

        note = await uow.get(NoteRepository).load_optional_for_owner(
            EntityLink.std(
                NamedEntityTag.SCHEDULE_STREAM.value, schedule_stream.ref_id
            ),
            allow_archived=allow_archived,
        )

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(
                NamedEntityTag.SCHEDULE_STREAM.value, schedule_stream.ref_id
            ),
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        publish_entity = None
        if include_publish_entity:
            publish_entity = await uow.get(
                PublishEntityRepository
            ).load_optional_for_owner(
                EntityLink.std(
                    NamedEntityTag.SCHEDULE_STREAM.value, schedule_stream.ref_id
                ),
                allow_archived=allow_archived,
            )

        return ScheduleStreamLoadResult(
            schedule_stream=schedule_stream,
            note=note,
            tags=tags,
            publish_entity=publish_entity,
        )
