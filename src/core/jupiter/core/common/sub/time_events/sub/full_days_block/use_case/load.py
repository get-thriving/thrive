"""Load a full day block and associated data."""

from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.time_events.namespace import (
    TimeEventNamespace,
)
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.core.schedule.sub.event_full_days.root import (
    ScheduleEventFullDays,
)
from jupiter.core.vacations.root import Vacation
from jupiter.framework.base.entity_id import EntityId
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
class TimeEventFullDaysBlockLoadArgs(UseCaseArgsBase):
    """FullDaysBlockLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class TimeEventFullDaysBlockLoadResult(UseCaseResultBase):
    """FullDaysBlockLoadResult."""

    full_days_block: TimeEventFullDaysBlock
    schedule_event: ScheduleEventFullDays | None
    person: Person | None
    contact: Contact | None
    occasion: Occasion | None
    vacation: Vacation | None


@readonly_use_case()
class TimeEventFullDaysBlockLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        TimeEventFullDaysBlockLoadArgs, TimeEventFullDaysBlockLoadResult
    ]
):
    """Load a full day block and associated data."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TimeEventFullDaysBlockLoadArgs,
    ) -> TimeEventFullDaysBlockLoadResult:
        """Load a full day block and associated data."""
        allow_archived = args.allow_archived or False
        full_days_block = await uow.get_for(TimeEventFullDaysBlock).load_by_id(
            args.ref_id,
            allow_archived=allow_archived,
        )

        schedule_event = None
        if full_days_block.namespace == TimeEventNamespace.SCHEDULE_FULL_DAYS_BLOCK:
            schedule_event = await uow.get_for(ScheduleEventFullDays).load_by_id(
                full_days_block.source_entity_ref_id,
                allow_archived=allow_archived,
            )

        person = None
        contact = None
        occasion = None
        if full_days_block.namespace == TimeEventNamespace.PERSON_OCCASION:
            occasion = await uow.get_for(Occasion).load_by_id(
                full_days_block.source_entity_ref_id,
                allow_archived=allow_archived,
            )
            person = await uow.get_for(Person).load_by_id(
                occasion.person.ref_id,
                allow_archived=allow_archived,
            )
            contact_link = await uow.get(
                ContactLinkRepository
            ).load_optional_for_namespace_and_source(
                namespace=ContactNamespace.PERSON,
                source_entity_ref_id=person.ref_id,
            )
            if contact_link is not None and len(contact_link.contacts_ref_ids) > 0:
                contact = await uow.get_for(Contact).load_by_id(
                    contact_link.contacts_ref_ids[0]
                )

        vacation = None
        if full_days_block.namespace == TimeEventNamespace.VACATION:
            vacation = await uow.get_for(Vacation).load_by_id(
                full_days_block.source_entity_ref_id,
                allow_archived=allow_archived,
            )

        return TimeEventFullDaysBlockLoadResult(
            full_days_block=full_days_block,
            schedule_event=schedule_event,
            person=person,
            contact=contact,
            occasion=occasion,
            vacation=vacation,
        )
