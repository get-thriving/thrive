"""Tests for the name stored in the search index."""

from jupiter.core.apps.prm.sub.circle.name import CircleName
from jupiter.core.apps.prm.sub.circle.root import Circle
from jupiter.core.apps.prm.sub.person.root import Person
from jupiter.core.common.scheduling_params import SchedulingParams
from jupiter.core.common.search.indexed_entity_name import indexed_entity_name
from jupiter.core.common.sub.contacts.sub.contact.name import ContactName
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext


def _ctx() -> DomainContext:
    return DomainContext(
        trace_id=TraceId.new(),
        mutation_id=MutationId.new(),
        event_source="test",
        action_timestamp=Timestamp.from_components(2024, 1, 1, 0, 0),
        _context_str="test",
    )


def _person() -> Person:
    return Person.new_person(
        ctx=_ctx(),
        prm_ref_id=EntityId("1"),
        catch_up_params=None,
        scheduling_params=SchedulingParams.default(),
    )


def _contact(name: str) -> Contact:
    return Contact.new_contact(
        ctx=_ctx(),
        contact_domain_ref_id=EntityId("1"),
        name=ContactName(name),
    )


def test_person_is_indexed_under_its_contact_name() -> None:
    name = indexed_entity_name(_person(), [_contact("Alice Smith")])
    assert name.the_name == "Alice Smith"


def test_person_without_contacts_falls_back_to_its_own_name() -> None:
    person = _person()
    assert indexed_entity_name(person, []) == person.name


def test_other_crown_entities_ignore_contacts() -> None:
    circle = Circle.new_circle(
        ctx=_ctx(),
        prm_ref_id=EntityId("1"),
        name=CircleName("Family"),
    )
    assert indexed_entity_name(circle, [_contact("Alice Smith")]) == circle.name
