"""Use case for removing a time plan question."""

from jupiter.core.app import AppCore
from jupiter.core.apps.time_plans.domain import TimePlanDomain
from jupiter.core.apps.time_plans.sub.question.root import TimePlanQuestion
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.leaf_support_entity_support import (
    JupiterRemoveLeafSupportEntityArgs,
    JupiterRemoveLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class TimePlanQuestionRemoveArgs(JupiterRemoveLeafSupportEntityArgs):
    """TimePlanQuestionRemove args."""

    ref_id: EntityId


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanQuestionRemoveUseCase(
    JupiterRemoveLeafSupportEntityUseCase[TimePlanQuestionRemoveArgs, None]
):
    """Use case for removing a time plan question."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanQuestionRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        time_plan_domain, time_plan_question = await self.load_in_parent(
            uow,
            TimePlanDomain,
            TimePlanQuestion,
            args.ref_id,
            context.workspace.ref_id,
            allow_archived=True,
        )
        await uow.get_for(TimePlanQuestion).remove(context.domain_context, args.ref_id)

        time_plan_domain = time_plan_domain.remove_question(
            context.domain_context,
            time_plan_question.period,
            time_plan_question.ref_id,
        )
        await uow.get_for(TimePlanDomain).save(time_plan_domain)
