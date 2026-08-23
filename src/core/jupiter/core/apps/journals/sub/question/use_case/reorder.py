"""Use case for reordering journal questions."""

from jupiter.core.app import AppCore
from jupiter.core.apps.journals.collection import JournalCollection
from jupiter.core.apps.journals.sub.question.root import JournalQuestion
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
class JournalQuestionReorderArgs(UseCaseArgsBase):
    """JournalQuestionReorder args."""

    period: RecurringTaskPeriod
    order_of_questions: list[EntityId]


@mutation_use_case(
    WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class JournalQuestionReorderUseCase(
    JupiterTransactionalLoggedInMutationUseCase[JournalQuestionReorderArgs, None]
):
    """Use case for reordering journal questions."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: JournalQuestionReorderArgs,
    ) -> None:
        """Execute the use case."""
        workspace = context.workspace
        journal_collection = await uow.get_for(JournalCollection).load_by_parent(
            workspace.ref_id
        )

        questions = await uow.get_for(JournalQuestion).find_all_generic(
            parent_ref_id=journal_collection.ref_id,
            allow_archived=False,
            period=args.period,
        )

        question_ref_ids = {question.ref_id for question in questions}
        if set(args.order_of_questions) != question_ref_ids:
            raise InputValidationError(
                "The new order of questions does not match the actual questions."
            )

        journal_collection = journal_collection.reorder_questions(
            ctx=context.domain_context,
            period=args.period,
            order_of_questions=args.order_of_questions,
        )
        await uow.get_for(JournalCollection).save(journal_collection)
