"""Use case for creating a schedule stream from an external iCal."""

import requests
from icalendar import Calendar
from jupiter.core.common.url import URL
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.stream.color import (
    ScheduleStreamColor,
)
from jupiter.core.schedule.sub.stream.name import ScheduleStreamName
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.framework.utils.generic_creator import generic_creator


@use_case_args
class ScheduleStreamCreateForExternalIcalArgs(UseCaseArgsBase):
    """Args."""

    source_ical_url: URL
    color: ScheduleStreamColor


@use_case_result
class ScheduleStreamCreateForExternalIcalResult(UseCaseResultBase):
    """Result."""

    new_schedule_stream: ScheduleStream


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleStreamCreateForExternalIcalUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        ScheduleStreamCreateForExternalIcalArgs,
        ScheduleStreamCreateForExternalIcalResult,
    ]
):
    """Use case for creating a schedule stream from an external iCal."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleStreamCreateForExternalIcalArgs,
    ) -> ScheduleStreamCreateForExternalIcalResult:
        """Perform the transactional mutation."""
        workspace = context.workspace
        schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
            workspace.ref_id
        )

        try:
            calendar_ical_response = requests.get(
                args.source_ical_url.the_url, timeout=10
            )
            if calendar_ical_response.status_code != 200:
                raise InputValidationError(
                    f"Failed to fetch iCal from {args.source_ical_url} (error {calendar_ical_response.status_code})"
                )
            calendar_ical = calendar_ical_response.text
        except requests.exceptions.Timeout as err:
            raise InputValidationError(
                f"Failed to fetch iCal from {args.source_ical_url} (timeout)"
            ) from err
        except requests.RequestException as err:
            raise InputValidationError(
                f"Failed to fetch iCal from {args.source_ical_url} ({err})"
            ) from err

        try:
            calendar = Calendar.from_ical(calendar_ical)
        except ValueError as err:
            raise InputValidationError(
                f"Failed to parse iCal from {args.source_ical_url} ({err})"
            ) from err

        name = self._realm_codec_registry.db_decode(
            ScheduleStreamName, calendar.get("X-WR-CALNAME")
        )

        schedule_stream = ScheduleStream.new_schedule_stream_from_external_ical(
            context.domain_context,
            schedule_domain_ref_id=schedule_domain.ref_id,
            name=name,
            color=args.color,
            source_ical_url=args.source_ical_url,
        )
        schedule_stream = await generic_creator(uow, progress_reporter, schedule_stream)
        return ScheduleStreamCreateForExternalIcalResult(
            new_schedule_stream=schedule_stream
        )
