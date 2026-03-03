"""Tests for contact name."""

from jupiter.core.common.sub.contacts.sub.contact.name import ContactName


def test_construction() -> None:
    contact_name = ContactName("Ada Lovelace")
    assert str(contact_name) == "Ada Lovelace"
