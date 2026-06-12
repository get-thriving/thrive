"""Guest readonly use case for loading a schedule event in day via a published stream."""

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
from jupiter.core.schedule.sub.event_in_day.root import ScheduleEventInDay
from jupiter.core.schedule.sub.event_in_day.service.load import (
    ScheduleEventInDayLoadResult,
    ScheduleEventInDayLoadService,
)
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ScheduleEventInDayLoadPublicFromScheduleStreamArgs(UseCaseArgsBase):
    """ScheduleEventInDayLoadPublicFromScheduleStream args."""

    external_id: PublishExternalId
    ref_id: EntityId


class ScheduleEventInDayLoadPublicFromScheduleStreamUseCase(
    JupiterGuestReadonlyUseCase[
        ScheduleEventInDayLoadPublicFromScheduleStreamArgs,
        ScheduleEventInDayLoadResult,
    ]
):
    """Load a schedule event in day through a published schedule stream."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: ScheduleEventInDayLoadPublicFromScheduleStreamArgs,
    ) -> ScheduleEventInDayLoadResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
                args.external_id
            )

            if publish_entity.status != PublishEntityStatus.ACTIVE:
                raise InputValidationError(
                    "The publish entity is not active and cannot be loaded."
                )

            if publish_entity.owner.the_type != NamedEntityTag.SCHEDULE_STREAM.value:
                raise InputValidationError(
                    "The publish entity does not refer to a schedule stream."
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
            schedule_stream = await uow.get_for(ScheduleStream).load_by_id(
                publish_entity.owner.ref_id,
                allow_archived=False,
            )
            if schedule_stream.parent_ref_id != schedule_domain.ref_id:
                raise InputValidationError(
                    "The publish entity does not refer to a workspace schedule stream."
                )

            schedule_event_in_day = await uow.get_for(ScheduleEventInDay).load_by_id(
                args.ref_id,
                allow_archived=False,
            )
            if schedule_event_in_day.parent_ref_id != schedule_domain.ref_id:
                raise InputValidationError(
                    "The publish entity does not refer to a workspace schedule event."
                )
            if schedule_event_in_day.schedule_stream_ref_id != schedule_stream.ref_id:
                raise InputValidationError(
                    "The schedule event does not belong to the published schedule stream."
                )

            return await ScheduleEventInDayLoadService().do_it(
                uow,
                publish_domain.workspace.ref_id,
                schedule_event_in_day,
                allow_archived=False,
                include_publish_entity=False,
            )
