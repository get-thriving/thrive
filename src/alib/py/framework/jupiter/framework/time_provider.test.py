"""Tests for time providers."""

from unittest.mock import patch

import pendulum
from jupiter.framework.time_provider import PerRequestTimeProvider, TimeProvider
from pendulum.tz.timezone import UTC


def test_time_provider_date_matches_frozen_construction_time() -> None:
    """The base provider keeps date and time frozen at construction."""
    construction = pendulum.datetime(2026, 7, 1, 12, 0, tz=UTC)
    with patch(
        "jupiter.framework.time_provider.pendulum.now", return_value=construction
    ):
        provider = TimeProvider()

    assert str(provider.get_current_date()) == "2026-07-01"
    assert provider.get_current_time().as_date() == construction.date()


def test_per_request_get_current_date_uses_request_time_not_construction_time() -> None:
    """MOTD and other daily logic must follow the request clock, not process start."""
    construction = pendulum.datetime(2026, 7, 1, 12, 0, tz=UTC)
    request = pendulum.datetime(2026, 8, 14, 12, 0, tz=UTC)

    with patch(
        "jupiter.framework.time_provider.pendulum.now", return_value=construction
    ):
        provider = PerRequestTimeProvider()

    with patch("jupiter.framework.time_provider.pendulum.now", return_value=request):
        provider.set_request_time()

    assert str(provider.get_current_date()) == "2026-08-14"
    assert provider.get_current_time().as_date() == request.date()
