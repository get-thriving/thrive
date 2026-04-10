"""Use case for loading a particular stream."""

from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ScheduleStreamLoadArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class ScheduleStreamLoadResult(UseCaseResultBase):
    """Result."""

    schedule_stream: ScheduleStream
    note: Note | None
    tags: list[Tag]


@readonly_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleStreamLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        ScheduleStreamLoadArgs, ScheduleStreamLoadResult
    ]
):
    """Use case for loading a particular stream."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ScheduleStreamLoadArgs,
    ) -> ScheduleStreamLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        schedule_stream = await uow.get_for(ScheduleStream).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )

        note = await uow.get(NoteRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.SCHEDULE_STREAM.value, schedule_stream.ref_id),
            allow_archived=allow_archived,
        )

        tag_link = await uow.get(
            TagLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=TagNamespace.SCHEDULE_STREAM,
            source_entity_ref_id=schedule_stream.ref_id,
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        return ScheduleStreamLoadResult(
            schedule_stream=schedule_stream, note=note, tags=tags
        )
