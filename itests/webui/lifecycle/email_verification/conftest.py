"""Fixtures for email verification lifecycle tests."""

import os
from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.test_helper.nuke_all import (
    sync_detailed as nuke_all_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.nuke_all_args import NukeAllArgs

from itests.conftest import TestUser

_FAKE_TOKEN = "eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTczNjI5MjEyNH0."  # nosec


@pytest.fixture(scope="session", autouse=True)
def _skip_when_email_verification_not_enabled() -> None:
    """These tests require EMAIL_VERIFICATION_STRATEGY=verify."""
    if os.getenv("ITEST_EMAIL_VERIFICATION_STRATEGY") != "verify":
        pytest.skip(
            "EMAIL_VERIFICATION_STRATEGY is not verify; "
            "email verification lifecycle tests require verify"
        )


@pytest.fixture(autouse=True)
def new_user() -> TestUser:
    """Create a new random test user."""
    return TestUser.new_random()


def _nuke_all(webapi_url: str) -> None:
    guest_client = AuthenticatedClient(base_url=webapi_url, token=_FAKE_TOKEN)
    response = nuke_all_sync(client=guest_client, body=NukeAllArgs())
    assert response.status_code == 200, response.content


@pytest.fixture(autouse=True)
def _nuke_all_around_test(webapi_url: str) -> Iterator[None]:
    """Remove all users and workspaces before and after each test."""
    _nuke_all(webapi_url)
    try:
        yield
    finally:
        _nuke_all(webapi_url)
