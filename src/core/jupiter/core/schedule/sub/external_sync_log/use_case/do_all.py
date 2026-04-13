"""The commnad for syncing a schedule once."""

from typing import cast

from jupiter.core.app import AppComponent
from jupiter.core.config import (
    JupiterBackgroundMutationUseCase,
    JupiterComponentProperties,
    JupiterGlobalProperties,
)
from jupiter.core.schedule.service.external_sync_service import (
    ScheduleExternalSyncService,
)
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.use_case import EmptyContext
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ScheduleExternalSyncDoAllArgs(UseCaseArgsBase):
    """ScheduleExternalSyncDoArgs."""


class ScheduleExternalSyncDoAllUseCase(
    JupiterBackgroundMutationUseCase[ScheduleExternalSyncDoAllArgs, None]
):
    """The command for doing a sync."""

    async def _execute(
        self, context: EmptyContext, args: ScheduleExternalSyncDoAllArgs
    ) -> None:
        """Execute the command's action."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            workspaces = await uow.get_for(Workspace).find_all(allow_archived=False)

        # TODO(horia141): params
        ctx = DomainContext.build_with_no_context_str(
            JupiterComponentProperties.for_cron(
                component=AppComponent.SCHEDULE_EXTERNAL_SYNC_CRON,
                version=cast(JupiterGlobalProperties, self._global_properties).version,
            ),
            TraceId.new(),
            self._time_provider.get_current_time(),
        )

        sync_service = ScheduleExternalSyncService(
            time_provider=self._time_provider,
            realm_codec_registry=self._realm_codec_registry,
            domain_storage_engine=self._ports.domain_storage_engine,
        )

        for workspace in workspaces:
            progress_reporter = self._progress_reporter_factory.new_reporter("nothing")
            await sync_service.do_it(
                ctx=ctx,
                progress_reporter=progress_reporter,
                workspace=workspace,
                today=self._time_provider.get_current_date(),
                sync_even_if_not_modified=False,
                filter_schedule_stream_ref_id=None,
            )

            async with (
                self._ports.search_storage_engine.get_unit_of_work() as search_uow
            ):
                for created_entity in progress_reporter.created_entities:
                    await search_uow.search_repository.upsert(
                        workspace.ref_id,
                        created_entity,
                        None,
                    )

                for updated_entity in progress_reporter.updated_entities:
                    await search_uow.search_repository.upsert(
                        workspace.ref_id,
                        updated_entity,
                        None,
                    )

                for deleted_entity in progress_reporter.removed_entities:
                    await search_uow.search_repository.remove(
                        workspace.ref_id, deleted_entity
                    )
