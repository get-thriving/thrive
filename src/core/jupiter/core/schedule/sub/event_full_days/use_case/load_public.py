"""Guest readonly use case for loading a published schedule full days event."""

from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntityRepository
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.event_full_days.root import ScheduleEventFullDays
from jupiter.core.schedule.sub.event_full_days.service.load import (
    ScheduleEventFullDaysLoadResult,
    ScheduleEventFullDaysLoadService,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ScheduleEventFullDaysLoadPublicArgs(UseCaseArgsBase):
    """ScheduleEventFullDaysLoadPublic args."""

    external_id: PublishExternalId


class ScheduleEventFullDaysLoadPublicUseCase(
    JupiterGuestReadonlyUseCase[
        ScheduleEventFullDaysLoadPublicArgs, ScheduleEventFullDaysLoadResult
    ]
):
    """Load a published schedule full days event by publish external id."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: ScheduleEventFullDaysLoadPublicArgs,
    ) -> ScheduleEventFullDaysLoadResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
                args.external_id
            )

            if publish_entity.status != PublishEntityStatus.ACTIVE:
                raise InputValidationError(
                    "The publish entity is not active and cannot be loaded."
                )

            if (
                publish_entity.owner.the_type
                != NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value
            ):
                raise InputValidationError(
                    "The publish entity does not refer to a schedule full days event."
                )
            if publish_entity.owner.purpose != "std":
                raise InputValidationError(
                    "The publish entity owner link purpose must be 'std'."
                )

            publish_domain = await uow.get_for(PublishDomain).load_by_id(
                publish_entity.publish_domain.ref_id
            )
            schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
                publish_domain.workspace.ref_id
            )
            schedule_event_full_days = await uow.get_for(
                ScheduleEventFullDays
            ).load_by_id(
                publish_entity.owner.ref_id,
                allow_archived=False,
            )
            if schedule_event_full_days.parent_ref_id != schedule_domain.ref_id:
                raise InputValidationError(
                    "The publish entity does not refer to a workspace schedule event."
                )

            return await ScheduleEventFullDaysLoadService().do_it(
                uow,
                publish_domain.workspace.ref_id,
                schedule_event_full_days,
                allow_archived=False,
                include_publish_entity=False,
            )
