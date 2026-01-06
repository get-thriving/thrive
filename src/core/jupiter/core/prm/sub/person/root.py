"""A person."""

from jupiter.core.common.birthday import Birthday
from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.time_events.namespace import (
    TimeEventNamespace,
)
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.prm.sub.person.name import PersonName
from jupiter.core.prm.sub.person_circle_links.root import PersonCircleLink
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    OwnsMany,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.record import ContainsManyRecords
from jupiter.framework.update_action import UpdateAction


@entity
class Person(LeafEntity):
    """A person."""

    prm: ParentLink
    name: PersonName
    catch_up_params: RecurringTaskGenParams | None
    birthday: Birthday | None

    note = OwnsAtMostOne(Note, domain=NoteDomain.PERSON, source_entity_ref_id=IsRefId())
    birthday_time_event_blocks = OwnsMany(
        TimeEventFullDaysBlock,
        namespace=TimeEventNamespace.PERSON_BIRTHDAY,
        source_entity_ref_id=IsRefId(),
    )
    catch_up_tasks = OwnsMany(
        InboxTask,
        source=InboxTaskSource.PERSON_CATCH_UP,
        source_entity_ref_id=IsRefId(),
    )
    birthday_tasks = OwnsMany(
        InboxTask,
        source=InboxTaskSource.PERSON_BIRTHDAY,
        source_entity_ref_id=IsRefId(),
    )
    circle_links = ContainsManyRecords(PersonCircleLink, person_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_person(
        ctx: MutationContext,
        prm_ref_id: EntityId,
        name: PersonName,
        catch_up_params: RecurringTaskGenParams | None,
        birthday: Birthday | None,
    ) -> "Person":
        """Create a person."""
        return Person._create(
            ctx,
            prm=ParentLink(prm_ref_id),
            name=name,
            catch_up_params=catch_up_params,
            birthday=birthday,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[PersonName],
        catch_up_params: UpdateAction[RecurringTaskGenParams | None],
        birthday: UpdateAction[Birthday | None],
    ) -> "Person":
        """Update info about the of the person."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            catch_up_params=catch_up_params.or_else(self.catch_up_params),
            birthday=birthday.or_else(self.birthday),
        )

    @property
    def preparation_days_cnt_for_birthday(self) -> int:
        """How many days in advance to prepare for the birthday of this person."""
        # TODO: derive this from circle membership (e.g. Family/Friend) once we
        # have a robust way to query memberships here.
        return 2

    def birthday_in_year(self, a_date: ADate) -> ADate:
        """Get the birthday of the person in the given year."""
        if self.birthday is None:
            raise Exception("This person has no birthday.")
        return self.birthday.birthday_in_year(a_date)
