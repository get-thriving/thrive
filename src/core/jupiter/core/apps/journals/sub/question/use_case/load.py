"""Use case for loading a journal question."""

from jupiter.core.app import AppCore
from jupiter.core.apps.journals.collection import JournalCollection
from jupiter.core.apps.journals.sub.question.root import JournalQuestion
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
class JournalQuestionLoadArgs(JupiterLoadLeafSupportEntityArgs):
    """JournalQuestionLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class JournalQuestionLoadResult(UseCaseResultBase):
    """JournalQuestionLoad result."""

    journal_question: JournalQuestion


@readonly_use_case(
    WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class JournalQuestionLoadUseCase(
    JupiterLoadLeafSupportEntityUseCase[
        JournalQuestionLoadArgs, JournalQuestionLoadResult
    ]
):
    """Use case for loading a journal question."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: JournalQuestionLoadArgs,
    ) -> JournalQuestionLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        _, journal_question = await self.load_in_parent(
            uow,
            JournalCollection,
            JournalQuestion,
            args.ref_id,
            context.workspace.ref_id,
            allow_archived=allow_archived,
        )
        return JournalQuestionLoadResult(journal_question=journal_question)
