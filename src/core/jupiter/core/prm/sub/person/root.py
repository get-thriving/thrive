"""A person."""

from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.inbox_tasks.source import InboxTaskSource
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.core.prm.sub.person_circle_links.root import PersonCircleLink
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    OwnsMany,
    OwnsOne,
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
    catch_up_params: RecurringTaskGenParams | None

    occasions = ContainsMany(Occasion, person_ref_id=IsRefId())
    circle_links = ContainsManyRecords(PersonCircleLink, person_ref_id=IsRefId())

    catch_up_tasks = OwnsMany(
        InboxTask,
        source=InboxTaskSource.PERSON_CATCH_UP,
        source_entity_ref_id=IsRefId(),
    )
    tag_link = OwnsAtMostOne(
        TagLink, namespace=TagNamespace.PERSON, source_entity_ref_id=IsRefId()
    )
    contact_link = OwnsOne(
        ContactLink,
        namespace=ContactNamespace.PERSON,
        source_entity_ref_id=IsRefId(),
    )
    note = OwnsAtMostOne(
        Note, namespace=NoteNamespace.PERSON, source_entity_ref_id=IsRefId()
    )

    @staticmethod
    @create_entity_action
    def new_person(
        ctx: DomainContext,
        prm_ref_id: EntityId,
        catch_up_params: RecurringTaskGenParams | None,
    ) -> "Person":
        """Create a person."""
        return Person._create(
            ctx,
            prm=ParentLink(prm_ref_id),
            name=EntityName("A Person"),
            catch_up_params=catch_up_params,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        catch_up_params: UpdateAction[RecurringTaskGenParams | None],
    ) -> "Person":
        """Update info about the of the person."""
        return self._new_version(
            ctx,
            catch_up_params=catch_up_params.or_else(self.catch_up_params),
        )

    @property
    def preparation_days_cnt_for_birthday(self) -> int:
        """How many days in advance to prepare for the birthday of this person."""
        # TODO: derive this from circle membership (e.g. Family/Friend) once we
        # have a robust way to query memberships here.
        return 2
