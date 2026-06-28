"""The command for removeing all branch and leaf type entities."""

from jupiter.core.common.access.root import (
    THE_ACCESS_DOMAIN_REF_ID,
    AccessDomain,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.core.crm.root import (
    THE_CRM_DOMAIN_REF_ID,
    CRMDomain,
)
from jupiter.core.env import Env
from jupiter.core.search.domain import SearchDomain
from jupiter.core.user_workspace_link.user_workspace_link import (
    UserWorkspaceLink,
    UserWorkspaceLinkNotFoundError,
    UserWorkspaceLinkRepository,
)
from jupiter.core.users.root import User
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_destroyer import generic_destroyer
from jupiter.framework.utils.generic_root_remover import generic_root_remover


@use_case_args
class RemoveAllArgs(UseCaseArgsBase):
    """PersonFindArgs."""


@mutation_use_case(exclude_globally=[Env.PRODUCTION])
class RemoveAllUseCase(JupiterLoggedInMutationUseCase[RemoveAllArgs, None]):
    """The command for removeing all branch and leaf type entities."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: RemoveAllArgs,
    ) -> None:
        """Execute the command's action."""
        user = context.user
        workspace = context.workspace

        # Search tables FK workspace — drop derived search state before deleting the workspace row.
        async with self._ports.search_storage_engine.get_unit_of_work() as search_uow:
            await search_uow.search_repository.drop(workspace.ref_id)

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            search_domain = await uow.get_for(SearchDomain).load_by_parent(
                workspace.ref_id
            )

        async with (
            self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
        ):
            await iuow.search_entity_indexing_record_repository.remove_all_for_search_domain(
                search_domain.ref_id,
            )
            await iuow.search_mutation_log_record_repository.remove_all_for_search_domain(
                search_domain.ref_id,
            )

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            try:
                user_workspace_link = await uow.get(
                    UserWorkspaceLinkRepository
                ).load_by_user(user.ref_id)
            except UserWorkspaceLinkNotFoundError:
                user_workspace_link = None

            if user_workspace_link is not None:
                await uow.get_for(UserWorkspaceLink).remove(
                    context.domain_context,
                    user_workspace_link.ref_id,
                )

            await generic_destroyer(
                context.domain_context, uow, Workspace, workspace.ref_id
            )
            await generic_destroyer(context.domain_context, uow, User, user.ref_id)

            await generic_root_remover(
                context.domain_context,
                uow,
                progress_reporter,
                AccessDomain,
                THE_ACCESS_DOMAIN_REF_ID,
            )

        async with self._ports.crm_indexing_storage_engine.get_unit_of_work() as iuow:
            await iuow.crm_entity_indexing_record_repository.remove_all_for_crm_domain(
                THE_CRM_DOMAIN_REF_ID,
            )

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            await generic_root_remover(
                context.domain_context,
                uow,
                progress_reporter,
                CRMDomain,
                THE_CRM_DOMAIN_REF_ID,
            )

        await self._invocation_recorder.clear_all(context.as_str())
