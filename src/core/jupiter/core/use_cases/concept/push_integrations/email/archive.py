"""The command for archiving a email task."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.push_integrations.email.email_task import EmailTask
from jupiter.core.domain.concept.push_integrations.email.service.archive_service import (
    EmailTaskArchiveService,
)
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.progress_reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class EmailTaskArchiveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.EMAIL_TASKS)
class EmailTaskArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[EmailTaskArchiveArgs, None]
):
    """The command for archiving a email task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: EmailTaskArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        email_task = await uow.get_for(EmailTask).load_by_id(ref_id=args.ref_id)

        email_task_archive_service = EmailTaskArchiveService()

        await email_task_archive_service.do_it(
            context.domain_context,
            uow,
            progress_reporter,
            email_task,
            JupiterArchivalReason.USER,
        )
