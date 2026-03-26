"""Fixtures for API tests."""

from typing import Iterator

import pytest
from jupiter_webapi_client.api.api_key.a_pi_key_create import (
    sync_detailed as api_key_create_sync,
)
from jupiter_webapi_client.api.application.init import sync_detailed as init_sync
from jupiter_webapi_client.api.test_helper.remove_all import (
    sync_detailed as remove_all_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.api_key_create_args import APIKeyCreateArgs
from jupiter_webapi_client.models.api_key_create_result import APIKeyCreateResult
from jupiter_webapi_client.models.init_args import InitArgs
from jupiter_webapi_client.models.init_result import InitResult
from jupiter_webapi_client.models.remove_all_args import RemoveAllArgs
from jupiter_webapi_client.models.user_feature import UserFeature
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature

from itests.conftest import TestUser
from itests.helpers import get_parsed_from_response

_FAKE_TOKEN = "eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTczNjI5MjEyNH0."  # nosec


@pytest.fixture(autouse=True, scope="package")
def new_user() -> TestUser:
    """Create a new random test user."""
    return TestUser.new_random()


@pytest.fixture(autouse=True, scope="package")
def new_user_and_workspace(webapi_url: str, new_user: TestUser) -> Iterator[InitResult]:
    """Create a new user and workspace."""
    guest_client = AuthenticatedClient(base_url=webapi_url, token=_FAKE_TOKEN)

    init_response = init_sync(
        client=guest_client,
        body=InitArgs(
            user_email_address=new_user.email,
            user_name=new_user.name,
            user_timezone="UTC",
            user_feature_flags=[UserFeature.GAMIFICATION],
            auth_password=new_user.password,
            auth_password_repeat=new_user.password,
            user_birthday="12 Sep",
            user_birth_year=1990,
            workspace_name="Test Workspace",
            workspace_root_aspect_name="Root Aspect",
            workspace_first_schedule_stream_name="Life",
            workspace_feature_flags=[
                WorkspaceFeature.TODO_TASK,
                WorkspaceFeature.HABITS,
                WorkspaceFeature.DOCS,
            ],
        ),
    )

    if init_response.status_code != 200:
        raise Exception(init_response.content)

    logged_in_client = AuthenticatedClient(
        base_url=webapi_url,
        token=get_parsed_from_response(InitResult, init_response).auth_token_ext,
    )

    try:
        yield get_parsed_from_response(InitResult, init_response)
    finally:
        remove_all_sync(client=logged_in_client, body=RemoveAllArgs())


@pytest.fixture(autouse=True, scope="package")
def logged_in_client(
    webapi_url: str, new_user_and_workspace: InitResult
) -> AuthenticatedClient:
    """An authenticated client."""
    return AuthenticatedClient(
        base_url=webapi_url, token=new_user_and_workspace.auth_token_ext
    )


@pytest.fixture(autouse=True, scope="package")
def api_key(logged_in_client: AuthenticatedClient) -> str:
    """The URL of the local API server."""
    response = api_key_create_sync(
        client=logged_in_client, body=APIKeyCreateArgs(name="Test API Key")
    )
    return get_parsed_from_response(APIKeyCreateResult, response).api_key
