"""Use case for finding journal questions."""

from jupiter.core.app import AppCore
from jupiter.core.apps.journals.collection import JournalCollection
from jupiter.core.apps.journals.sub.question.root import JournalQuestion
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
class JournalQuestionFindArgs(UseCaseArgsBase):
    """JournalQuestionFind args."""

    allow_archived: bool | None
    filter_ref_ids: list[EntityId] | None
    filter_periods: list[RecurringTaskPeriod] | None


@use_case_result
class JournalQuestionFindResult(UseCaseResultBase):
    """JournalQuestionFind result."""

    questions: list[JournalQuestion]
    order_of_questions: dict[RecurringTaskPeriod, list[EntityId]]


@readonly_use_case(
    WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class JournalQuestionFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        JournalQuestionFindArgs, JournalQuestionFindResult
    ]
):
    """Use case for finding journal questions."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: JournalQuestionFindArgs,
    ) -> JournalQuestionFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        workspace = context.workspace
        journal_collection = await uow.get_for(JournalCollection).load_by_parent(
            workspace.ref_id
        )

        questions = await uow.get_for(JournalQuestion).find_all_generic(
            parent_ref_id=journal_collection.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
            period=args.filter_periods or NoFilter(),
        )

        return JournalQuestionFindResult(
            questions=questions,
            order_of_questions=journal_collection.order_of_questions,
        )
