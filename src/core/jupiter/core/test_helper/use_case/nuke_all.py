"""The command for destroying all users, workspaces, and user workspace links."""

from jupiter.core.config import (
    JupiterGuestMutationContext,
    JupiterGuestMutationUseCase,
)
from jupiter.core.env import Env
from jupiter.core.user_workspace_link.user_workspace_link import UserWorkspaceLink
from jupiter.core.users.root import User
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_destroyer import generic_destroyer


@use_case_args
class NukeAllArgs(UseCaseArgsBase):
    """Nuke all args."""


class NukeAllUseCase(JupiterGuestMutationUseCase[NukeAllArgs, None]):
    """Destroy every user, workspace, and user-workspace link in the database."""

    async def _execute(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterGuestMutationContext,
        args: NukeAllArgs,
    ) -> None:
        """Execute the command's action."""
        if self._global_properties.env == Env.PRODUCTION:
            raise Exception("Nuke all is not allowed in production")

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            users = await uow.get_for(User).find_all(allow_archived=True)
            workspaces = await uow.get_for(Workspace).find_all(allow_archived=True)
            user_workspace_links = await uow.get_for(UserWorkspaceLink).find_all(
                allow_archived=True
            )

        async with progress_reporter.section("Clearing search indexes"):
            for workspace in workspaces:
                async with (
                    self._ports.search_storage_engine.get_unit_of_work() as search_uow
                ):
                    await search_uow.search_repository.drop(workspace.ref_id)

                async with (
                    self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
                ):
                    await iuow.search_entity_indexing_map_repository.remove_all_for_workspace(
                        workspace.ref_id,
                    )
                    await iuow.search_mutation_log_repository.remove_all_for_workspace(
                        workspace.ref_id,
                    )

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            async with progress_reporter.section("Removing user workspace links"):
                for user_workspace_link in user_workspace_links:
                    await uow.get_for(UserWorkspaceLink).remove(
                        context.domain_context,
                        user_workspace_link.ref_id,
                    )

            async with progress_reporter.section("Destroying workspaces"):
                for workspace in workspaces:
                    await generic_destroyer(
                        context.domain_context,
                        uow,
                        Workspace,
                        workspace.ref_id,
                    )

            async with progress_reporter.section("Destroying users"):
                for user in users:
                    await generic_destroyer(
                        context.domain_context,
                        uow,
                        User,
                        user.ref_id,
                    )

        await self._invocation_recorder.clear_all(context.as_str())
