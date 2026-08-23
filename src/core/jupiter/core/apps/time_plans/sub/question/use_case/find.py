"""Use case for finding time plan questions."""

from jupiter.core.app import AppCore
from jupiter.core.apps.time_plans.domain import TimePlanDomain
from jupiter.core.apps.time_plans.sub.question.root import TimePlanQuestion
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TimePlanQuestionFindArgs(UseCaseArgsBase):
    """TimePlanQuestionFind args."""

    allow_archived: bool | None
    filter_ref_ids: list[EntityId] | None
    filter_periods: list[RecurringTaskPeriod] | None


@use_case_result
class TimePlanQuestionFindResult(UseCaseResultBase):
    """TimePlanQuestionFind result."""

    questions: list[TimePlanQuestion]
    order_of_questions: dict[RecurringTaskPeriod, list[EntityId]]


@readonly_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanQuestionFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        TimePlanQuestionFindArgs, TimePlanQuestionFindResult
    ]
):
    """Use case for finding time plan questions."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TimePlanQuestionFindArgs,
    ) -> TimePlanQuestionFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        workspace = context.workspace
        time_plan_domain = await uow.get_for(TimePlanDomain).load_by_parent(
            workspace.ref_id
        )

        questions = await uow.get_for(TimePlanQuestion).find_all_generic(
            parent_ref_id=time_plan_domain.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
            period=args.filter_periods or NoFilter(),
        )

        return TimePlanQuestionFindResult(
            questions=questions,
            order_of_questions=time_plan_domain.order_of_questions,
        )
