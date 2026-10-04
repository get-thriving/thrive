"""Fixtures for Apple lifecycle tests."""

import os

import pytest

_APPLE_AUTH_STRATEGY = "local-google-apple"


@pytest.fixture(scope="session", autouse=True)
def _skip_when_apple_auth_unavailable() -> None:
    """Apple OAuth lifecycle tests require the local-google-apple auth blend."""
    if os.getenv("ITEST_EMAIL_VERIFICATION_STRATEGY") == "verify":
        pytest.skip(
            "EMAIL_VERIFICATION_STRATEGY is verify; Apple lifecycle tests require none"
        )
    if os.getenv("ITEST_AUTH_STRATEGY") != _APPLE_AUTH_STRATEGY:
        pytest.skip(
            "AUTH_PROVIDER is not local-google-apple; Apple lifecycle tests require "
            f"{_APPLE_AUTH_STRATEGY}"
        )


@pytest.fixture(scope="session", autouse=True)
def _require_apple_credentials() -> None:
    """A full Apple sign-in needs a Services ID, a .p8 key, and the hosted ready URL."""
    apple_user = os.getenv("ITEST_APPLE_USER")
    if apple_user is None or apple_user == "":
        pytest.skip("ITEST_APPLE_USER is not set")
