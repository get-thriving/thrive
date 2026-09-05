"""Tests for address line."""

import pytest
from jupiter.core.common.sub.locations.sub.location.address_line import AddressLine
from jupiter.framework.errors import InputValidationError


def test_construction() -> None:
    address_line = AddressLine("123 Main St")
    assert str(address_line) == "123 Main St"


def test_from_raw_strips_and_collapses_whitespace() -> None:
    address_line = AddressLine.from_raw("  123   Main St  ")
    assert str(address_line) == "123 Main St"


def test_from_raw_rejects_empty() -> None:
    with pytest.raises(InputValidationError):
        AddressLine.from_raw("   ")
