"""Close an account and workspace."""

import logging

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.auth.service.urgent_clear_auth_info_for_user import (
    UrgentClearAuthInfoForUser,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.user_workspace_link.user_workspace_link import (
    UserWorkspaceLink,
    UserWorkspaceLinkRepository,
)
from jupiter.core.users.root import User
from jupiter.core.users.service.remove_user_image_objects import (
    RemoveUserImageObjectsService,
)
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_full_archiver import generic_full_archiver

LOGGER = logging.getLogger(__name__)


@use_case_args
class CloseAccountArgs(UseCaseArgsBase):
    """Close account args."""


@secure_class
@mutation_use_case()
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

        user_workspace_link = await uow.get(UserWorkspaceLinkRepository).load_by_user(
            user.ref_id
        )
        if not user_workspace_link.archived:
            await uow.get_for(UserWorkspaceLink).save(
                user_workspace_link.mark_archived(
                    context.domain_context, JupiterArchivalReason.USER
                )
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

    async def _perform_post_transactional_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: CloseAccountArgs,
        result: None,
    ) -> None:
        """Clear provider auth credentials after the account is archived."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            await UrgentClearAuthInfoForUser(self._ports.apple_oauth_client).do_it(
                uow, context.domain_context, context.user
            )

        # An archived account keeps its rows, but not a picture anyone can still
        # fetch. The account is closed either way, whatever the store says.
        try:
            await RemoveUserImageObjectsService(
                self._ports.domain_storage_engine, self._ports.image_store
            ).do_it(context.user.ref_id)
        except Exception:
            LOGGER.exception(
                "close_account could not remove the images of user ref_id=%s",
                context.user.ref_id,
            )
