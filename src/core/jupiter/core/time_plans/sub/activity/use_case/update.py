"""Update a time plan activity."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.app import AppCore
from jupiter.core.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TimePlanActivityUpdateArgs(UseCaseArgsBase):
    """TimePlanActivityFindArgs."""

    ref_id: EntityId
    kind: UpdateAction[TimePlanActivityKind]
    feasability: UpdateAction[TimePlanActivityFeasability]


@mutation_use_case(WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI])
class TimePlanActivityUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TimePlanActivityUpdateArgs, None]
):
    """The command for updating a time plan activity."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanActivityUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        activity = await uow.get_for(TimePlanActivity).load_by_id(args.ref_id)
        activity = activity.update(
            context.domain_context, kind=args.kind, feasability=args.feasability
        )
        await uow.get_for(TimePlanActivity).save(activity)
        await progress_reporter.mark_updated(activity)
