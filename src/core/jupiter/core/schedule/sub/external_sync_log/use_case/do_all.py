"""The commnad for syncing a schedule once."""

from jupiter.core.config import (
    JupiterBackgroundMutationContext,
    JupiterBackgroundMutationUseCase,
)
from jupiter.core.schedule.service.external_sync_service import (
    ScheduleExternalSyncService,
)
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

        sync_service = ScheduleExternalSyncService(
            time_provider=self._time_provider,
            realm_codec_registry=self._realm_codec_registry,
            domain_storage_engine=self._ports.domain_storage_engine,
        )

        for workspace in workspaces:
            progress_reporter = self._progress_reporter_factory.new_reporter("nothing")
            await sync_service.do_it(
                ctx=context.domain_context,
                progress_reporter=progress_reporter,
                workspace=workspace,
                today=self._time_provider.get_current_date(),
                sync_even_if_not_modified=False,
                filter_schedule_stream_ref_id=None,
            )
