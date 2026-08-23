"""Use case for loading a time plan question."""

from jupiter.core.app import AppCore
from jupiter.core.apps.time_plans.domain import TimePlanDomain
from jupiter.core.apps.time_plans.sub.question.root import TimePlanQuestion
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.leaf_support_entity_support import (
    JupiterLoadLeafSupportEntityArgs,
    JupiterLoadLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TimePlanQuestionLoadArgs(JupiterLoadLeafSupportEntityArgs):
    """TimePlanQuestionLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class TimePlanQuestionLoadResult(UseCaseResultBase):
    """TimePlanQuestionLoad result."""

    time_plan_question: TimePlanQuestion


@readonly_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanQuestionLoadUseCase(
    JupiterLoadLeafSupportEntityUseCase[
        TimePlanQuestionLoadArgs, TimePlanQuestionLoadResult
    ]
):
    """Use case for loading a time plan question."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TimePlanQuestionLoadArgs,
    ) -> TimePlanQuestionLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        _, time_plan_question = await self.load_in_parent(
            uow,
            TimePlanDomain,
            TimePlanQuestion,
            args.ref_id,
            context.workspace.ref_id,
            allow_archived=allow_archived,
        )
        return TimePlanQuestionLoadResult(time_plan_question=time_plan_question)
