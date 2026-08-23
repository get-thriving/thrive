"""Use case for creating a time plan question."""

from jupiter.core.app import AppCore
from jupiter.core.apps.time_plans.domain import TimePlanDomain
from jupiter.core.apps.time_plans.sub.question.root import TimePlanQuestion
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TimePlanQuestionCreateArgs(UseCaseArgsBase):
    """TimePlanQuestionCreate args."""

    name: EntityName
    period: RecurringTaskPeriod


@use_case_result
class TimePlanQuestionCreateResult(UseCaseResultBase):
    """TimePlanQuestionCreate result."""

    new_time_plan_question: TimePlanQuestion


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanQuestionCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        TimePlanQuestionCreateArgs, TimePlanQuestionCreateResult
    ]
):
    """Use case for creating a time plan question."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanQuestionCreateArgs,
    ) -> TimePlanQuestionCreateResult:
        """Execute the command's action."""
        workspace = context.workspace
        time_plan_domain = await uow.get_for(TimePlanDomain).load_by_parent(
            workspace.ref_id
        )

        new_time_plan_question = TimePlanQuestion.new_time_plan_question(
            ctx=context.domain_context,
            time_plan_domain_ref_id=time_plan_domain.ref_id,
            name=args.name,
            period=args.period,
        )
        new_time_plan_question = await uow.get_for(TimePlanQuestion).create(
            new_time_plan_question
        )

        time_plan_domain = time_plan_domain.add_question(
            context.domain_context,
            args.period,
            new_time_plan_question.ref_id,
        )
        await uow.get_for(TimePlanDomain).save(time_plan_domain)

        return TimePlanQuestionCreateResult(
            new_time_plan_question=new_time_plan_question
        )
