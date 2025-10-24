"""Update a time plan activity."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.app import AppCore
from jupiter.core.domain.concept.time_plans.time_plan_activity import TimePlanActivity
from jupiter.core.domain.concept.time_plans.time_plan_activity_feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.domain.concept.time_plans.time_plan_activity_kind import (
    TimePlanActivityKind,
)
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.update_action import UpdateAction
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


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
