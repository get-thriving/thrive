"""Background cleanup of users who never completed workspace setup."""

import logging
from datetime import timedelta

from jupiter.core.app import AppComponent
from jupiter.core.config import (
    JupiterBackgroundMutationUseCase,
    JupiterComponentProperties,
)
from jupiter.core.user_workspace_link.user_workspace_link import UserWorkspaceLink
from jupiter.core.users.root import User
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.use_case import EmptyContext, background_mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_destroyer import generic_destroyer

LOGGER = logging.getLogger(__name__)

# Users may still be in the post-signup workspace-creation flow; only remove older rows.
_ABANDONED_USER_MIN_AGE = timedelta(days=7)


@use_case_args
class ClearAbandonedUsersArgs(UseCaseArgsBase):
    """Args for the clear-abandoned-users cron."""


@background_mutation_use_case("0 4 * * *")
class ClearAbandonedUsersUseCase(
    JupiterBackgroundMutationUseCase[ClearAbandonedUsersArgs, None]
):
    """Remove users with no workspace link and all of their dependent entities."""

    async def _execute(
        self,
        context: EmptyContext,
        args: ClearAbandonedUsersArgs,
    ) -> None:
        """Execute the command's action."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            users = await uow.get_for(User).find_all(allow_archived=True)
            user_workspace_links = await uow.get_for(UserWorkspaceLink).find_all(
                allow_archived=True
            )
            user_ref_ids_with_workspace = {
                link.user_ref_id for link in user_workspace_links
            }

        now = self._time_provider.get_current_time()

        ctx = DomainContext.build_with_no_context_str(
            JupiterComponentProperties.for_cron(
                component=AppComponent.CLEAR_ABANDONED_USERS_CRON,
                version=self._global_properties.version,
            ),
            TraceId.new(),
            now,
        )

        for user in users:
            if user.ref_id in user_ref_ids_with_workspace:
                continue
            if now.the_ts - user.created_time.the_ts < _ABANDONED_USER_MIN_AGE:
                continue
            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                await generic_destroyer(ctx, uow, User, user.ref_id)
                LOGGER.info(
                    "clear_abandoned_users removed user ref_id=%s email=%s",
                    user.ref_id,
                    user.email_address,
                )
