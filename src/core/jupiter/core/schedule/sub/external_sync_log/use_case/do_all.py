"""The commnad for syncing a schedule once."""

from jupiter.core.config import (
    JupiterBackgroundMutationContext,
    JupiterBackgroundMutationUseCase,
)
from jupiter.core.crown_entity_writer import AclCrownEntityWriter
from jupiter.core.schedule.service.external_sync_service import (
    ScheduleExternalSyncService,
)
from jupiter.core.user_workspace_link.user_workspace_link import (
    UserWorkspaceLink,
)
from jupiter.core.users.root import User
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ScheduleExternalSyncDoAllArgs(UseCaseArgsBase):
    """ScheduleExternalSyncDoArgs."""


class ScheduleExternalSyncDoAllUseCase(
    JupiterBackgroundMutationUseCase[ScheduleExternalSyncDoAllArgs, None]
):
    """The command for doing a sync."""

    async def _execute(
        self,
        context: JupiterBackgroundMutationContext,
        args: ScheduleExternalSyncDoAllArgs,
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

        sync_service = ScheduleExternalSyncService(
            time_provider=self._time_provider,
            realm_codec_registry=self._realm_codec_registry,
            domain_storage_engine=self._ports.domain_storage_engine,
            crown_entity_writer=AclCrownEntityWriter(self._concept_registry),
        )

        for workspace in workspaces:
            progress_reporter = self._progress_reporter_factory.new_reporter("nothing")
            await sync_service.do_it(
                ctx=context.domain_context,
                progress_reporter=progress_reporter,
                workspace=workspace,
                user=users_by_id[users_id_by_workspace_id[workspace.ref_id]],
                today=self._time_provider.get_current_date(),
                sync_even_if_not_modified=False,
                filter_schedule_stream_ref_id=None,
            )
