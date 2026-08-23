"""Use case for reordering time plan questions."""

from jupiter.core.app import AppCore
from jupiter.core.apps.time_plans.domain import TimePlanDomain
from jupiter.core.apps.time_plans.sub.question.root import TimePlanQuestion
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TimePlanQuestionReorderArgs(UseCaseArgsBase):
    """TimePlanQuestionReorder args."""

    period: RecurringTaskPeriod
    order_of_questions: list[EntityId]


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanQuestionReorderUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TimePlanQuestionReorderArgs, None]
):
    """Use case for reordering time plan questions."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanQuestionReorderArgs,
    ) -> None:
        """Execute the use case."""
        workspace = context.workspace
        time_plan_domain = await uow.get_for(TimePlanDomain).load_by_parent(
            workspace.ref_id
        )

        questions = await uow.get_for(TimePlanQuestion).find_all_generic(
            parent_ref_id=time_plan_domain.ref_id,
            allow_archived=False,
            period=args.period,
        )

        question_ref_ids = {question.ref_id for question in questions}
        if set(args.order_of_questions) != question_ref_ids:
            raise InputValidationError(
                "The new order of questions does not match the actual questions."
            )

        time_plan_domain = time_plan_domain.reorder_questions(
            ctx=context.domain_context,
            period=args.period,
            order_of_questions=args.order_of_questions,
        )
        await uow.get_for(TimePlanDomain).save(time_plan_domain)
