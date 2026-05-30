"""Fixtures for Google lifecycle tests."""

import os
from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.test_helper.nuke_all import (
    sync_detailed as nuke_all_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.nuke_all_args import NukeAllArgs

_FAKE_TOKEN = "eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTczNjI5MjEyNH0."  # nosec


@pytest.fixture(scope="session")
def itest_google_user() -> str:
    """Google account email used for OAuth integration tests."""
    google_user = os.getenv("ITEST_GOOGLE_USER")
    if google_user is None or google_user == "":
        pytest.skip("ITEST_GOOGLE_USER is not set")
    return google_user


@pytest.fixture(scope="session")
def itest_google_pass() -> str:
    """Google account password used for OAuth integration tests."""
    google_pass = os.getenv("ITEST_GOOGLE_PASS")
    if google_pass is None or len(google_pass.strip()) == 0:
        pytest.skip("ITEST_GOOGLE_PASS is not set")
    return google_pass


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
