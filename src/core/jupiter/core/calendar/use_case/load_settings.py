"""Use case for loading the settings of the calendar."""

from jupiter.core.app import AppCore
from jupiter.core.apps.schedule.domain import ScheduleDomain
from jupiter.core.common.timezone import Timezone
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class CalendarLoadSettingsArgs(UseCaseArgsBase):
    """CalendarLoadSettings args."""


@use_case_result
class CalendarLoadSettingsResult(UseCaseResultBase):
    """CalendarLoadSettings result."""

    additional_timezones: list[Timezone]


@readonly_use_case(
    WorkspaceFeature.SCHEDULE, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class CalendarLoadSettingsUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        CalendarLoadSettingsArgs, CalendarLoadSettingsResult
    ]
):
    """The command for loading the settings of the calendar."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: CalendarLoadSettingsArgs,
    ) -> CalendarLoadSettingsResult:
        """Execute the command's action."""
        schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
            context.workspace.ref_id
        )

        return CalendarLoadSettingsResult(
            additional_timezones=schedule_domain.additional_timezones,
        )
