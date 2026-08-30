"""Use case for updating the settings of the calendar."""

from jupiter.core.app import AppCore
from jupiter.core.apps.schedule.domain import ScheduleDomain
from jupiter.core.common.timezone import Timezone
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class CalendarUpdateSettingsArgs(UseCaseArgsBase):
    """CalendarUpdateSettings args."""

    additional_timezones: UpdateAction[list[Timezone]]


@mutation_use_case(
    WorkspaceFeature.SCHEDULE, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class CalendarUpdateSettingsUseCase(
    JupiterTransactionalLoggedInMutationUseCase[CalendarUpdateSettingsArgs, None]
):
    """The command for updating the settings of the calendar."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: CalendarUpdateSettingsArgs,
    ) -> None:
        """Execute the command's action."""
        schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
            context.workspace.ref_id
        )

        schedule_domain = schedule_domain.change_additional_timezones(
            context.domain_context,
            additional_timezones=args.additional_timezones,
        )

        await uow.get_for(ScheduleDomain).save(schedule_domain)
