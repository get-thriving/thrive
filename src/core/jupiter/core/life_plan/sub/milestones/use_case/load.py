"""Use case for loading a particular milestone."""

from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class MilestoneLoadArgs(JupiterLoadCrownEntityArgs):
    """MilestoneLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class MilestoneLoadResult(UseCaseResultBase):
    """MilestoneLoadResult."""

    milestone: Milestone
    tags: list[Tag]
    note: Note | None


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class MilestoneLoadUseCase(
    JupiterLoadCrownEntityUseCase[MilestoneLoadArgs, MilestoneLoadResult]
):
    """Use case for loading a particular milestone."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: MilestoneLoadArgs,
    ) -> MilestoneLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        milestone = await self.load_entity(
            uow,
            context.user.ref_id,
            Milestone,
            args.ref_id,
            allow_archived,
        )

        note = await uow.get(NoteRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.MILESTONE.value, milestone.ref_id),
            allow_archived=allow_archived,
        )

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(NamedEntityTag.MILESTONE.value, milestone.ref_id),
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        return MilestoneLoadResult(milestone=milestone, tags=tags, note=note)
