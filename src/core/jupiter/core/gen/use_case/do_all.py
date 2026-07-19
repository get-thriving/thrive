"""The command for doing task generation for all workspaces."""

import logging

from jupiter.core.config import (
    JupiterBackgroundMutationContext,
    JupiterBackgroundMutationUseCase,
)
from jupiter.core.gen.service.gen import GenService
from jupiter.core.infer_sync_targets import (
    infer_sync_targets_for_enabled_features,
)
from jupiter.core.user_workspace_link.user_workspace_link import (
    UserWorkspaceLink,
)
from jupiter.core.users.root import User
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args

LOGGER = logging.getLogger(__name__)


@use_case_args
class GenDoAllArgs(UseCaseArgsBase):
    """GenDoAllArgs."""


class GenDoAllUseCase(JupiterBackgroundMutationUseCase[GenDoAllArgs, None]):
    """The command for doing task generation for all workspaces."""

    async def _execute(
        self, context: JupiterBackgroundMutationContext, args: GenDoAllArgs
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

        gen_service = GenService(
            domain_storage_engine=self._ports.domain_storage_engine,
            concept_registry=self._concept_registry,
        )

        today = self._time_provider.get_current_date()

        LOGGER.info("gen_do_all starting workspace_count=%d", len(workspaces))
        processed = 0
        failed = 0

        for workspace in workspaces:
            LOGGER.info(
                "gen_do_all workspace ref_id=%s name=%s",
                workspace.ref_id.as_int(),
                workspace.name,
            )
            progress_reporter = self._progress_reporter_factory.new_reporter("nothing")
            user = users_by_id[users_id_by_workspace_id[workspace.ref_id]]
            gen_targets = infer_sync_targets_for_enabled_features(user, workspace, None)

            try:
                await gen_service.do_it(
                    ctx=context.domain_context,
                    user=user,
                    progress_reporter=progress_reporter,
                    workspace=workspace,
                    gen_even_if_not_modified=False,
                    today=today,
                    gen_targets=gen_targets,
                    period=None,
                    filter_aspect_ref_ids=None,
                    filter_habit_ref_ids=None,
                    filter_chore_ref_ids=None,
                    filter_metric_ref_ids=None,
                    filter_person_ref_ids=None,
                    filter_slack_task_ref_ids=None,
                    filter_email_task_ref_ids=None,
                )
                processed += 1
            except Exception:
                failed += 1
                LOGGER.exception(
                    "gen_do_all failed for workspace ref_id=%s; "
                    "skipping and continuing with remaining workspaces",
                    workspace.ref_id,
                )
                continue

        LOGGER.info(
            "gen_do_all finished workspace_count=%d processed=%d failed=%d",
            len(workspaces),
            processed,
            failed,
        )
