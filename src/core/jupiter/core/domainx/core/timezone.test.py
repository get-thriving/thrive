"""Tests for the timezone."""

from jupiter.core.domainx.core.timezone import UTC, Timezone


def test_creation() -> None:
    timezone = Timezone("Europe/Paris")
    assert str(timezone) == "Europe/Paris"


def test_utc() -> None:
    assert str(UTC) == "UTC"
