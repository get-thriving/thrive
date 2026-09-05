"""Tests for country code."""

import pytest
from jupiter.core.common.sub.locations.sub.location.country import CountryCode
from jupiter.framework.errors import InputValidationError


def test_construction() -> None:
    country = CountryCode("US")
    assert str(country) == "US"


def test_from_raw_uppercases() -> None:
    country = CountryCode.from_raw("us")
    assert str(country) == "US"


def test_construction_rejects_invalid() -> None:
    with pytest.raises(InputValidationError):
        CountryCode("USA")
    with pytest.raises(InputValidationError):
        CountryCode("1A")
    with pytest.raises(InputValidationError):
        CountryCode("")
