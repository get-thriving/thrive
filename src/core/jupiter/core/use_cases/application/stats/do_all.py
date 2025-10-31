"""The command for computing stats for all workspaces."""

from typing import cast

from jupiter.core.app import AppComponent
from jupiter.core.config import (
    JupiterBackgroundMutationUseCase,
    JupiterComponentProperties,
    JupiterGlobalProperties,
)
from jupiter.core.domainx.application.stats.service.stats_service import StatsService
from jupiter.core.infer_sync_targets import (
    infer_sync_targets_for_enabled_features,
)
from jupiter.core.user_workspace_link.user_workspace_link import (
    UserWorkspaceLink,
)
from jupiter.core.users.root import User
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.context import MutationContext
from jupiter.framework.use_case import (
    EmptyContext,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class StatsDoAllArgs(UseCaseArgsBase):
    """StatsDoAllArgs."""


class StatsDoAllUseCase(JupiterBackgroundMutationUseCase[StatsDoAllArgs, None]):
    """The command for computing stats for all workspaces."""

    async def _execute(
        self,
        context: EmptyContext,
        args: StatsDoAllArgs,
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

        ctx = MutationContext.build(
            JupiterComponentProperties.for_cron(
                component=AppComponent.STATS_CRON,
                version=cast(JupiterGlobalProperties, self._global_properties).version,
            ),
            self._time_provider.get_current_time(),
        )

        stats_service = StatsService(
            domain_storage_engine=self._ports.domain_storage_engine,
        )

        for workspace in workspaces:
            progress_reporter = self._progress_reporter_factory.new_reporter("nothing")
            user = users_by_id[users_id_by_workspace_id[workspace.ref_id]]
            stats_targets = infer_sync_targets_for_enabled_features(
                user, workspace, None
            )

            await stats_service.do_it(
                ctx=ctx,
                progress_reporter=progress_reporter,
                user=user,
                workspace=workspace,
                today=self._time_provider.get_current_date(),
                stats_targets=stats_targets,
                filter_habit_ref_ids=None,
                filter_big_plan_ref_ids=None,
                filter_journal_ref_ids=None,
            )

            async with self._ports.search_storage_engine.get_unit_of_work() as search_uow:
                for updated_entity in progress_reporter.updated_entities:
                    await search_uow.search_repository.upsert(
                        workspace.ref_id, updated_entity
                    )
