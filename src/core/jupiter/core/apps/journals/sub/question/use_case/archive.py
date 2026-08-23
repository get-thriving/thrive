"""Use case for archiving a journal question."""

from jupiter.core.app import AppCore
from jupiter.core.apps.journals.collection import JournalCollection
from jupiter.core.apps.journals.sub.question.root import JournalQuestion
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.leaf_support_entity_support import (
    JupiterArchiveLeafSupportEntityArgs,
    JupiterArchiveLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class JournalQuestionArchiveArgs(JupiterArchiveLeafSupportEntityArgs):
    """JournalQuestionArchive args."""

    ref_id: EntityId


@mutation_use_case(
    WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class JournalQuestionArchiveUseCase(
    JupiterArchiveLeafSupportEntityUseCase[JournalQuestionArchiveArgs, None]
):
    """Use case for archiving a journal question."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: JournalQuestionArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        journal_collection, journal_question = await self.load_in_parent(
            uow,
            JournalCollection,
            JournalQuestion,
            args.ref_id,
            context.workspace.ref_id,
        )
        journal_question = journal_question.mark_archived(
            context.domain_context, JupiterArchivalReason.USER
        )
        await uow.get_for(JournalQuestion).save(journal_question)

        journal_collection = journal_collection.remove_question(
            context.domain_context,
            journal_question.period,
            journal_question.ref_id,
        )
        await uow.get_for(JournalCollection).save(journal_collection)
