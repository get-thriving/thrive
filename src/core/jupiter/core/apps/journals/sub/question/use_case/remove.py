"""Use case for removing a journal question."""

from jupiter.core.app import AppCore
from jupiter.core.apps.journals.collection import JournalCollection
from jupiter.core.apps.journals.sub.question.root import JournalQuestion
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
class JournalQuestionRemoveArgs(JupiterRemoveLeafSupportEntityArgs):
    """JournalQuestionRemove args."""

    ref_id: EntityId


@mutation_use_case(
    WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class JournalQuestionRemoveUseCase(
    JupiterRemoveLeafSupportEntityUseCase[JournalQuestionRemoveArgs, None]
):
    """Use case for removing a journal question."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: JournalQuestionRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        journal_collection, journal_question = await self.load_in_parent(
            uow,
            JournalCollection,
            JournalQuestion,
            args.ref_id,
            context.workspace.ref_id,
            allow_archived=True,
        )
        await uow.get_for(JournalQuestion).remove(context.domain_context, args.ref_id)

        journal_collection = journal_collection.remove_question(
            context.domain_context,
            journal_question.period,
            journal_question.ref_id,
        )
        await uow.get_for(JournalCollection).save(journal_collection)
