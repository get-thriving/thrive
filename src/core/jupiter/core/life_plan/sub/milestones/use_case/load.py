"""Use case for loading a particular milestone."""

from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class MilestoneLoadArgs(UseCaseArgsBase):
    """MilestoneLoadArgs."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class MilestoneLoadResult(UseCaseResultBase):
    """MilestoneLoadResult."""

    milestone: Milestone
    note: Note | None


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class MilestoneLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[MilestoneLoadArgs, MilestoneLoadResult]
):
    """Use case for loading a particular milestone."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: MilestoneLoadArgs,
    ) -> MilestoneLoadResult:
        """Execute the command's action."""
        milestone = await uow.get_for(Milestone).load_by_id(
            args.ref_id, allow_archived=args.allow_archived
        )

        note = await uow.get(NoteRepository).load_optional_for_source(
            NoteNamespace.MILESTONE,
            milestone.ref_id,
            allow_archived=args.allow_archived,
        )

        return MilestoneLoadResult(milestone=milestone, note=note)
