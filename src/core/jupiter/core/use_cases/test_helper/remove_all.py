"""The command for removeing all branch and leaf type entities."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.user.user import User
from jupiter.core.domain.concept.user_workspace_link.user_workspace_link import (
    UserWorkspaceLink,
    UserWorkspaceLinkRepository,
)
from jupiter.core.domain.concept.workspaces.workspace import Workspace
from jupiter.core.domain.env import Env
from jupiter.core.domain.infra.generic_destroyer import generic_destroyer
from jupiter.framework_new.progress_reporter import ProgressReporter
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


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

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            user_workspace_link = await uow.get(
                UserWorkspaceLinkRepository
            ).load_by_user(user.ref_id)
            await uow.get_for(UserWorkspaceLink).remove(user_workspace_link.ref_id)

            await generic_destroyer(
                context.domain_context, uow, Workspace, workspace.ref_id
            )
            await generic_destroyer(context.domain_context, uow, User, user.ref_id)

        async with self._use_case_storage_engine.get_unit_of_work() as uc_uow:
            await uc_uow.mutation_use_case_invocation_record_repository.clear_all(
                workspace.ref_id
            )

        async with self._ports.search_storage_engine.get_unit_of_work() as search_uow:
            await search_uow.search_repository.drop(workspace.ref_id)
