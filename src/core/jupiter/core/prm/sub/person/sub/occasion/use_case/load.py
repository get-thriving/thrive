"""Use case for loading an occasion."""

from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.root import InboxTask, InboxTaskRepository
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
    TimeEventFullDaysBlockRepository,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.framework.utils.generic_loader import generic_loader


@use_case_args
class OccasionLoadArgs(UseCaseArgsBase):
    """OccasionLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class OccasionLoadResult(UseCaseResultBase):
    """OccasionLoadResult."""

    occasion: Occasion
    tags: list[Tag]
    note: Note | None
    occasion_time_event_blocks: list[TimeEventFullDaysBlock]
    occasion_tasks: list[InboxTask]


@readonly_use_case(WorkspaceFeature.PRM)
class OccasionLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[OccasionLoadArgs, OccasionLoadResult]
):
    """Use case for loading an occasion."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: OccasionLoadArgs,
    ) -> OccasionLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        workspace = context.workspace

        occasion, note = await generic_loader(
            uow,
            Occasion,
            args.ref_id,
            Occasion.note,
            allow_archived=allow_archived,
        )

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(NamedEntityTag.OCCASION.value, occasion.ref_id),
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        occasion_time_event_blocks = await uow.get(
            TimeEventFullDaysBlockRepository
        ).find_for_owner(
            EntityLink.std(NamedEntityTag.OCCASION.value, occasion.ref_id),
            allow_archived=False,
        )

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )

        occasion_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_owner_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            owner=EntityLink.std(NamedEntityTag.OCCASION.value, occasion.ref_id),
            retrieve_offset=0,
            retrieve_limit=10,
        )

        return OccasionLoadResult(
            occasion=occasion,
            tags=tags,
            note=note,
            occasion_time_event_blocks=occasion_time_event_blocks,
            occasion_tasks=occasion_tasks,
        )
