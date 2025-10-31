"""The command for hard removing a email task."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.push_integrations.sub.email.service.remove import (
    EmailTaskRemoveService,
)
from jupiter.core.push_integrations.sub.email.task import EmailTask
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class EmailTaskRemoveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.EMAIL_TASKS)
class EmailTaskRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[EmailTaskRemoveArgs, None]
):
    """The command for archiving a email task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: EmailTaskRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        email_task = await uow.get_for(EmailTask).load_by_id(ref_id=args.ref_id)

        email_task_remove_service = EmailTaskRemoveService()

        await email_task_remove_service.do_it(
            context.domain_context, uow, progress_reporter, email_task
        )
