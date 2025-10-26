"""Close an account and workspace."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.user.user import User
from jupiter.core.domain.concept.user_workspace_link.user_workspace_link import (
    UserWorkspaceLink,
    UserWorkspaceLinkRepository,
)
from jupiter.core.domain.concept.workspaces.workspace import Workspace
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.infra.generic_full_archiver import generic_full_archiver
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class CloseAccountArgs(UseCaseArgsBase):
    """Close account args."""


@secure_class
class CloseAccountUseCase(
    JupiterTransactionalLoggedInMutationUseCase[CloseAccountArgs, None]
):
    """Close account use case."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: CloseAccountArgs,
    ) -> None:
        """Execute the command's action."""
        user = context.user
        workspace = context.workspace

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            user_workspace_link = await uow.get(
                UserWorkspaceLinkRepository
            ).load_by_user(user.ref_id)
            await generic_full_archiver(
                context.domain_context,
                uow,
                UserWorkspaceLink,
                user_workspace_link.ref_id,
                JupiterArchivalReason.USER,
            )

            await generic_full_archiver(
                context.domain_context,
                uow,
                Workspace,
                workspace.ref_id,
                JupiterArchivalReason.USER,
            )
            await generic_full_archiver(
                context.domain_context,
                uow,
                User,
                user.ref_id,
                JupiterArchivalReason.USER,
            )
