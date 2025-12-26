"""The command for updating a milestone."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.milestones.name import MilestoneName
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class MilestoneUpdateArgs(UseCaseArgsBase):
    """Milestone update args."""

    ref_id: EntityId
    name: UpdateAction[MilestoneName]
    date: UpdateAction[ADate]
    project_ref_id: UpdateAction[EntityId]


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class MilestoneUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[MilestoneUpdateArgs, None]
):
    """The command for updating a milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: MilestoneUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        milestone = await uow.get_for(Milestone).load_by_id(args.ref_id)

        _ = await uow.get_for(Project).load_by_id(
            args.project_ref_id.or_else(milestone.project_ref_id)
        )

        milestone = milestone.update(
            ctx=context.domain_context,
            name=args.name,
            date=args.date,
            project_ref_id=args.project_ref_id,
        )

        await uow.get_for(Milestone).save(milestone)
        await progress_reporter.mark_updated(milestone)
