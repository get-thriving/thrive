"""The command for doing garbage collection for all workspaces."""

from jupiter.core.config import (
    JupiterBackgroundMutationContext,
    JupiterBackgroundMutationUseCase,
)
from jupiter.core.gc.service.gc import GCService
from jupiter.core.infer_sync_targets import (
    infer_sync_targets_for_enabled_features,
)
from jupiter.core.user_workspace_link.user_workspace_link import (
    UserWorkspaceLink,
)
from jupiter.core.users.root import User
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class GCDoAllArgs(UseCaseArgsBase):
    """GCDoAllArgs."""


class GCDoAllUseCase(JupiterBackgroundMutationUseCase[GCDoAllArgs, None]):
    """The command for doing garbage collection for all workspaces."""

    async def _execute(
        self,
        context: JupiterBackgroundMutationContext,
        args: GCDoAllArgs,
    ) -> None:
        """Execute the command's action."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            workspaces = await uow.get_for(Workspace).find_all(allow_archived=False)
            users = await uow.get_for(User).find_all(allow_archived=False)
            users_by_id = {u.ref_id: u for u in users}
            user_workspace_links = await uow.get_for(UserWorkspaceLink).find_all(
                allow_archived=False
            )
            users_id_by_workspace_id = {
                uwl.workspace_ref_id: uwl.user_ref_id for uwl in user_workspace_links
            }

        gc_service = GCService(
            time_provider=self._time_provider,
            domain_storage_engine=self._ports.domain_storage_engine,
        )

        for workspace in workspaces:
            progress_reporter = self._progress_reporter_factory.new_reporter("nothing")
            user = users_by_id[users_id_by_workspace_id[workspace.ref_id]]
            gc_targets = infer_sync_targets_for_enabled_features(user, workspace, None)
            await gc_service.do_it(
                context.domain_context, progress_reporter, workspace, gc_targets
            )
