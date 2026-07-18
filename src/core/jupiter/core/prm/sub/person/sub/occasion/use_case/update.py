"""Update an occasion."""

from typing import cast

from jupiter.core.common import schedules
from jupiter.core.common.birthday import Birthday
from jupiter.core.common.recurring_task_due_at_day import RecurringTaskDueAtDay
from jupiter.core.common.recurring_task_due_at_month import RecurringTaskDueAtMonth
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlockRepository,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.sub.occasion.kind import OccasionKind
from jupiter.core.prm.sub.person.sub.occasion.name import OccasionName
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class OccasionUpdateArgs(JupiterUpdateCrownEntityArgs):
    """OccasionUpdate args."""

    ref_id: EntityId
    name: UpdateAction[OccasionName]
    kind: UpdateAction[OccasionKind]
    date: UpdateAction[Birthday]


@mutation_use_case(WorkspaceFeature.PRM)
class OccasionUpdateUseCase(JupiterUpdateCrownEntityUseCase[OccasionUpdateArgs, None]):
    """The command for updating an occasion."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: OccasionUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        occasion = await uow.get_for(Occasion).load_by_id(args.ref_id)
        person = await self.load_entity(
            uow, context.user.ref_id, Person, occasion.person.ref_id
        )

        occasion = occasion.update(
            ctx=context.domain_context,
            name=args.name,
            kind=args.kind,
            date=args.date,
        )

        await uow.get_for(Occasion).save(occasion)
        await progress_reporter.mark_updated(occasion)

        contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.PERSON.value, person.ref_id),
        )
        if contact_link is None or len(contact_link.contacts_ref_ids) == 0:
            raise InputValidationError("Person does not have a linked contact")
        contact = await uow.get_for(Contact).load_by_id(
            contact_link.contacts_ref_ids[0]
        )

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            context.workspace.ref_id,
        )

        person_occasion_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_owner_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            owner=EntityLink.std(NamedEntityTag.OCCASION.value, occasion.ref_id),
        )

        for inbox_task in person_occasion_tasks:
            schedule = schedules.get_schedule(
                RecurringTaskPeriod.YEARLY,
                occasion.name,
                cast(Timestamp, inbox_task.recurring_gen_right_now),
                None,
                None,
                None,
                RecurringTaskDueAtDay.build(
                    RecurringTaskPeriod.YEARLY,
                    occasion.date.day,
                ),
                RecurringTaskDueAtMonth.build(
                    RecurringTaskPeriod.YEARLY,
                    occasion.date.month,
                ),
            )

            inbox_task = inbox_task.update_link_to_person_occasion(
                ctx=context.domain_context,
                name=schedule.full_name,
                recurring_timeline=schedule.timeline,
                occasion_kind=occasion.kind,
                occasion_person_name=contact.name,
                preparation_days_cnt=person.preparation_days_cnt_for_birthday,
                due_time=schedule.due_date,
            )

            await uow.get_for(InboxTask).save(inbox_task)

        occasion_time_event_blocks = await uow.get(
            TimeEventFullDaysBlockRepository
        ).find_for_owner(
            EntityLink.std(NamedEntityTag.OCCASION.value, occasion.ref_id),
            allow_archived=False,
        )

        for occasion_time_event_block in occasion_time_event_blocks:
            occasion_time_event_block = (
                occasion_time_event_block.update_for_person_occasion(
                    ctx=context.domain_context,
                    occasion_date=occasion.date_in_year(
                        occasion_time_event_block.start_date
                    ),
                )
            )
            await uow.get(TimeEventFullDaysBlockRepository).save(
                occasion_time_event_block
            )
