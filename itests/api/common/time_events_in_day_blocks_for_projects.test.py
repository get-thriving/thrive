"""Tests for the time event in-day blocks API using projects."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.projects.project_create import (
    sync_detailed as project_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.time_events.time_event_in_day_block_create_for_project import (
    sync_detailed as time_event_in_day_block_create_for_project_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.project import Project
from jupiter_webapi_client.models.project_create_args import ProjectCreateArgs
from jupiter_webapi_client.models.project_create_result import ProjectCreateResult
from jupiter_webapi_client.models.time_event_in_day_block import TimeEventInDayBlock
from jupiter_webapi_client.models.time_event_in_day_block_create_for_project_args import (
    TimeEventInDayBlockCreateForProjectArgs,
)
from jupiter_webapi_client.models.time_event_in_day_block_create_for_project_result import (
    TimeEventInDayBlockCreateForProjectResult,
)
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.api.conftest import AnotherUserAndWorkspace
from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_projects_feature(
    logged_in_client: AuthenticatedClient,
) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PROJECTS, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.PROJECTS, value=False
            ),
        )


@pytest.fixture()
def create_project(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> Project:
        result = project_create_sync(
            client=logged_in_client,
            body=ProjectCreateArgs(
                name=name,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        )
        return get_parsed_from_response(ProjectCreateResult, result).new_project

    return _create


@pytest.fixture()
def create_time_event_for_project(logged_in_client: AuthenticatedClient):
    def _create(project_ref_id: str) -> TimeEventInDayBlock:
        result = time_event_in_day_block_create_for_project_sync(
            client=logged_in_client,
            body=TimeEventInDayBlockCreateForProjectArgs(
                project_ref_id=project_ref_id,
                start_date="2024-06-10",
                start_time_in_day="09:00",
                duration_mins=60,
            ),
        )
        return get_parsed_from_response(
            TimeEventInDayBlockCreateForProjectResult, result
        ).new_time_event

    return _create


@pytest.fixture()
def another_user_with_projects_enabled(
    webapi_url: str,
    another_user_and_workspace: AnotherUserAndWorkspace,
) -> Iterator[AnotherUserAndWorkspace]:
    def make_client() -> AuthenticatedClient:
        return AuthenticatedClient(
            base_url=webapi_url,
            token=another_user_and_workspace.init_result.auth_token_ext,
        )

    try:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PROJECTS, value=True),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.PROJECTS, value=False
            ),
        )


@pytest.fixture()
def grant_project_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_projects_enabled: AnotherUserAndWorkspace,
):
    def _grant(project: Project, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.PROJECT,
                entity_ref_id=project.ref_id,
                user_ref_ids=[
                    another_user_with_projects_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_projects_enabled.api_key

    return _grant


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


_ACL_DENIED_REASON = "You are not allowed to access this entity"


def _assert_acl_denied(response: requests.Response) -> None:
    assert response.status_code == 502
    body = response.json()
    assert body["status"] in (401, 404)
    if body["status"] == 401:
        assert body["response"]["reason"] == _ACL_DENIED_REASON


def test_api_common_time_event_in_day_block_create_for_project(
    api_url: str, api_key: str, create_project
) -> None:
    plan = create_project("Time Event Project")

    response = requests.post(
        f"{api_url}/v1/common/time-events/in-day-blocks/for-project",
        headers=_headers(api_key),
        json={
            "project_ref_id": plan.ref_id,
            "start_date": "2024-07-15",
            "start_time_in_day": "10:00",
            "duration_mins": 45,
        },
        timeout=10,
    )
    assert response.status_code == 200

    block = response.json()["new_time_event"]
    assert block["start_date"] == "2024-07-15"
    assert block["start_time_in_day"] == "10:00"
    assert block["duration_mins"] == 45
    assert block["archived"] is False
    assert "ref_id" in block


def test_api_common_time_event_in_day_block_load_for_project(
    api_url: str, api_key: str, create_project, create_time_event_for_project
) -> None:
    plan = create_project("TE BP Load")
    block = create_time_event_for_project(plan.ref_id)

    response = requests.get(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    loaded = response.json()["in_day_block"]
    assert loaded["ref_id"] == block.ref_id
    assert loaded["start_date"] == "2024-06-10"
    assert loaded["duration_mins"] == 60

    loaded_project = response.json().get("project")
    assert loaded_project is not None
    assert loaded_project["ref_id"] == plan.ref_id


def test_api_common_time_event_in_day_block_update_for_project(
    api_url: str, api_key: str, create_project, create_time_event_for_project
) -> None:
    plan = create_project("TE BP Update")
    block = create_time_event_for_project(plan.ref_id)

    response = requests.put(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": block.ref_id,
            "start_date": {"should_change": True, "value": "2024-07-01"},
            "start_time_in_day": {"should_change": True, "value": "14:30"},
            "duration_mins": {"should_change": True, "value": 90},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    loaded = response2.json()["in_day_block"]
    assert loaded["start_date"] == "2024-07-01"
    assert loaded["start_time_in_day"] == "14:30"
    assert loaded["duration_mins"] == 90


def test_api_common_time_event_in_day_block_archive_for_project(
    api_url: str, api_key: str, create_project, create_time_event_for_project
) -> None:
    plan = create_project("TE BP Archive")
    block = create_time_event_for_project(plan.ref_id)

    response = requests.delete(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["in_day_block"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_common_time_event_in_day_block_remove_for_project(
    api_url: str, api_key: str, create_project, create_time_event_for_project
) -> None:
    plan = create_project("TE BP Remove")
    block = create_time_event_for_project(plan.ref_id)

    response = requests.delete(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def _create_time_event_response(
    api_url: str, api_key: str, project_ref_id: str
) -> requests.Response:
    return requests.post(
        f"{api_url}/v1/common/time-events/in-day-blocks/for-project",
        headers=_headers(api_key),
        json={
            "project_ref_id": project_ref_id,
            "start_date": "2024-07-15",
            "start_time_in_day": "10:00",
            "duration_mins": 45,
        },
        timeout=10,
    )


def _assert_can_mutate_time_event_in_day(
    api_url: str,
    api_key: str,
    *,
    create_project,
    grant_project_access,
    access_level: AccessLevel | None,
) -> None:
    role = access_level.value if access_level is not None else "owner"
    plan = create_project(f"TE Mutate {role}")
    actor_api_key = (
        grant_project_access(plan, access_level)
        if access_level is not None
        else api_key
    )

    create_response = _create_time_event_response(api_url, actor_api_key, plan.ref_id)
    assert create_response.status_code == 200
    block_ref_id = create_response.json()["new_time_event"]["ref_id"]

    load_response = requests.get(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block_ref_id}?allow_archived=false",
        headers=_headers(actor_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200

    update_response = requests.put(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block_ref_id}",
        headers=_headers(actor_api_key),
        json={
            "ref_id": block_ref_id,
            "start_date": {"should_change": True, "value": "2024-07-16"},
            "start_time_in_day": {"should_change": True, "value": "11:00"},
            "duration_mins": {"should_change": True, "value": 60},
        },
        timeout=10,
    )
    assert update_response.status_code == 200

    archive_plan = create_project(f"TE Archive {role}")
    archive_create = _create_time_event_response(api_url, api_key, archive_plan.ref_id)
    assert archive_create.status_code == 200
    archive_actor = (
        grant_project_access(archive_plan, access_level)
        if access_level is not None
        else api_key
    )
    archive_response = requests.delete(
        f"{api_url}/v1/common/time-events/in-day-blocks/{archive_create.json()['new_time_event']['ref_id']}",
        headers=_headers(archive_actor),
        timeout=10,
    )
    assert archive_response.status_code == 200

    remove_plan = create_project(f"TE Remove {role}")
    remove_create = _create_time_event_response(api_url, api_key, remove_plan.ref_id)
    assert remove_create.status_code == 200
    remove_actor = (
        grant_project_access(remove_plan, access_level)
        if access_level is not None
        else api_key
    )
    remove_response = requests.delete(
        f"{api_url}/v1/common/time-events/in-day-blocks/{remove_create.json()['new_time_event']['ref_id']}/remove",
        headers=_headers(remove_actor),
        timeout=10,
    )
    assert remove_response.status_code == 200


def _assert_read_only_time_event_in_day(
    api_url: str,
    api_key: str,
    *,
    create_project,
    create_time_event_for_project,
    grant_project_access,
    access_level: AccessLevel,
) -> None:
    plan = create_project(f"TE Read {access_level.value}")
    block = create_time_event_for_project(plan.ref_id)
    other_api_key = grant_project_access(plan, access_level)

    load_response = requests.get(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200

    create_response = _create_time_event_response(api_url, other_api_key, plan.ref_id)
    _assert_acl_denied(create_response)

    update_response = requests.put(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}",
        headers=_headers(other_api_key),
        json={
            "ref_id": block.ref_id,
            "start_date": {"should_change": True, "value": "2024-08-01"},
            "start_time_in_day": {"should_change": True, "value": "12:00"},
            "duration_mins": {"should_change": True, "value": 90},
        },
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)

    remove_response = requests.delete(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}/remove",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(remove_response)


def test_api_common_time_event_in_day_block_acl_owner_can_do_everything(
    api_url: str, api_key: str, create_project, grant_project_access
) -> None:
    _assert_can_mutate_time_event_in_day(
        api_url,
        api_key,
        create_project=create_project,
        grant_project_access=grant_project_access,
        access_level=None,
    )


def test_api_common_time_event_in_day_block_acl_writer_can_read_and_mutate(
    api_url: str, api_key: str, create_project, grant_project_access
) -> None:
    _assert_can_mutate_time_event_in_day(
        api_url,
        api_key,
        create_project=create_project,
        grant_project_access=grant_project_access,
        access_level=AccessLevel.WRITER,
    )


def test_api_common_time_event_in_day_block_acl_commenter_can_only_read(
    api_url: str,
    api_key: str,
    create_project,
    create_time_event_for_project,
    grant_project_access,
) -> None:
    _assert_read_only_time_event_in_day(
        api_url,
        api_key,
        create_project=create_project,
        create_time_event_for_project=create_time_event_for_project,
        grant_project_access=grant_project_access,
        access_level=AccessLevel.COMMENTER,
    )


def test_api_common_time_event_in_day_block_acl_reader_can_only_read(
    api_url: str,
    api_key: str,
    create_project,
    create_time_event_for_project,
    grant_project_access,
) -> None:
    _assert_read_only_time_event_in_day(
        api_url,
        api_key,
        create_project=create_project,
        create_time_event_for_project=create_time_event_for_project,
        grant_project_access=grant_project_access,
        access_level=AccessLevel.READER,
    )
