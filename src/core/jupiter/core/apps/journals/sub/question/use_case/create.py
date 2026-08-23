"""Use case for creating a journal question."""

from jupiter.core.app import AppCore
from jupiter.core.apps.journals.collection import JournalCollection
from jupiter.core.apps.journals.sub.question.root import JournalQuestion
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
class JournalQuestionCreateArgs(UseCaseArgsBase):
    """JournalQuestionCreate args."""

    name: EntityName
    period: RecurringTaskPeriod


@use_case_result
class JournalQuestionCreateResult(UseCaseResultBase):
    """JournalQuestionCreate result."""

    new_journal_question: JournalQuestion


@mutation_use_case(
    WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class JournalQuestionCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        JournalQuestionCreateArgs, JournalQuestionCreateResult
    ]
):
    """Use case for creating a journal question."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: JournalQuestionCreateArgs,
    ) -> JournalQuestionCreateResult:
        """Execute the command's action."""
        workspace = context.workspace
        journal_collection = await uow.get_for(JournalCollection).load_by_parent(
            workspace.ref_id
        )

        new_journal_question = JournalQuestion.new_journal_question(
            ctx=context.domain_context,
            journal_collection_ref_id=journal_collection.ref_id,
            name=args.name,
            period=args.period,
        )
        new_journal_question = await uow.get_for(JournalQuestion).create(
            new_journal_question
        )

        journal_collection = journal_collection.add_question(
            context.domain_context,
            args.period,
            new_journal_question.ref_id,
        )
        await uow.get_for(JournalCollection).save(journal_collection)

        return JournalQuestionCreateResult(new_journal_question=new_journal_question)
