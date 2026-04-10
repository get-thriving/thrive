"""Use case for loading a particular goal."""

from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class GoalLoadArgs(UseCaseArgsBase):
    """GoalLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class GoalLoadResult(UseCaseResultBase):
    """GoalLoadResult."""

    goal: Goal
    tags: list[Tag]
    note: Note | None


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class GoalLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[GoalLoadArgs, GoalLoadResult]
):
    """Use case for loading a particular goal."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: GoalLoadArgs,
    ) -> GoalLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        goal = await uow.get_for(Goal).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )

        note = await uow.get(NoteRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.GOAL.value, goal.ref_id),
            allow_archived=allow_archived,
        )

        tag_link = await uow.get(
            TagLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=TagNamespace.GOAL,
            source_entity_ref_id=goal.ref_id,
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        return GoalLoadResult(goal=goal, tags=tags, note=note)
