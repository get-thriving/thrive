"""Tests for the API for projects."""

from collections.abc import Iterator
from typing import cast

import pytest
import requests
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.projects.project_create import (
    sync_detailed as project_create_sync,
)
from jupiter_webapi_client.api.projects.project_milestone_create import (
    sync_detailed as project_milestone_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
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
from jupiter_webapi_client.models.project_milestone import ProjectMilestone
from jupiter_webapi_client.models.project_milestone_create_args import (
    ProjectMilestoneCreateArgs,
)
from jupiter_webapi_client.models.project_milestone_create_result import (
    ProjectMilestoneCreateResult,
)
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.api.conftest import AnotherUserAndWorkspace
from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_projects_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
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
def create_project_milestone(logged_in_client: AuthenticatedClient):
    def _create(project_ref_id: str, name: str, date: str) -> ProjectMilestone:
        result = project_milestone_create_sync(
            client=logged_in_client,
            body=ProjectMilestoneCreateArgs(
                project_ref_id=project_ref_id,
                name=name,
                date=date,
            ),
        )
        return get_parsed_from_response(
            ProjectMilestoneCreateResult, result
        ).new_project_milestone

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


_ACL_DENIED_REASON = "You are not allowed to access this entity"


def _assert_acl_denied(response: requests.Response) -> None:
    assert response.status_code == 502
    body = response.json()
    assert body["status"] == 401
    assert body["response"]["reason"] == _ACL_DENIED_REASON


def test_api_project_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/projects",
        headers=_headers(api_key),
        json={
            "name": "Launch Product",
            "is_key": True,
            "eisen": "important",
            "difficulty": "hard",
            "actionable_date": "2024-03-01",
            "due_date": "2024-06-30",
        },
        timeout=10,
    )
    assert response.status_code == 200

    bp = response.json()["new_project"]
    assert bp["name"] == "Launch Product"
    assert bp["is_key"] is True
    assert bp["eisen"] == "important"
    assert bp["difficulty"] == "hard"
    assert bp["archived"] is False
    assert "ref_id" in bp


def test_api_project_load(api_url: str, api_key: str, create_project) -> None:
    created = create_project("Load Project")

    response = requests.get(
        f"{api_url}/v1/projects/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    bp = response.json()["project"]
    assert bp["ref_id"] == created.ref_id
    assert bp["name"] == "Load Project"


def test_api_project_find(api_url: str, api_key: str, create_project) -> None:
    create_project("Plan Alpha")
    create_project("Plan Beta")

    response = requests.get(
        f"{api_url}/v1/projects?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [e["project"]["name"] for e in response.json()["entries"]]
    assert "Plan Alpha" in names
    assert "Plan Beta" in names


def test_api_project_update(api_url: str, api_key: str, create_project) -> None:
    created = create_project("Old Plan")

    response = requests.put(
        f"{api_url}/v1/projects/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "New Plan"},
            "status": {"should_change": False},
            "is_key": {"should_change": False},
            "eisen": {"should_change": False},
            "difficulty": {"should_change": False},
            "actionable_date": {"should_change": False},
            "due_date": {"should_change": False},
            "aspect_ref_id": {"should_change": False},
            "chapter_ref_id": {"should_change": False},
            "goal_ref_id": {"should_change": False},
            "dependency_ref_ids": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/projects/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["project"]["name"] == "New Plan"


def _set_dependencies(
    api_url: str, api_key: str, ref_id: str, dependency_ref_ids: list[str]
) -> requests.Response:
    return requests.put(
        f"{api_url}/v1/projects/{ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": ref_id,
            "name": {"should_change": False},
            "status": {"should_change": False},
            "is_key": {"should_change": False},
            "eisen": {"should_change": False},
            "difficulty": {"should_change": False},
            "actionable_date": {"should_change": False},
            "due_date": {"should_change": False},
            "aspect_ref_id": {"should_change": False},
            "chapter_ref_id": {"should_change": False},
            "goal_ref_id": {"should_change": False},
            "dependency_ref_ids": {
                "should_change": True,
                "value": dependency_ref_ids,
            },
        },
        timeout=10,
    )


def _load_dependencies(api_url: str, api_key: str, ref_id: str) -> list[str]:
    response = requests.get(
        f"{api_url}/v1/projects/{ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    return cast(list[str], response.json()["project"]["dependency_ref_ids"])


def test_api_project_create_with_dependencies(
    api_url: str, api_key: str, create_project
) -> None:
    dependency = create_project("Create Dependency Plan")

    response = requests.post(
        f"{api_url}/v1/projects",
        headers=_headers(api_key),
        json={
            "name": "Plan With Dependencies",
            "is_key": False,
            "eisen": "regular",
            "difficulty": "easy",
            "dependency_ref_ids": [dependency.ref_id, dependency.ref_id],
        },
        timeout=10,
    )
    assert response.status_code == 200

    bp = response.json()["new_project"]
    assert bp["dependency_ref_ids"] == [dependency.ref_id]
    assert _load_dependencies(api_url, api_key, bp["ref_id"]) == [dependency.ref_id]


def test_api_project_create_with_missing_dependency(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/projects",
        headers=_headers(api_key),
        json={
            "name": "Plan With Bad Dependency",
            "is_key": False,
            "eisen": "regular",
            "difficulty": "easy",
            "dependency_ref_ids": ["30234"],
        },
        timeout=10,
    )
    assert response.status_code != 200


def test_api_project_update_dependencies(
    api_url: str, api_key: str, create_project
) -> None:
    dependency = create_project("Dependency Plan")
    created = create_project("Dependent Plan")

    response = _set_dependencies(
        api_url, api_key, created.ref_id, [dependency.ref_id, dependency.ref_id]
    )
    assert response.status_code == 200
    assert _load_dependencies(api_url, api_key, created.ref_id) == [dependency.ref_id]


def test_api_project_update_cannot_depend_on_itself(
    api_url: str, api_key: str, create_project
) -> None:
    created = create_project("Self Dependent Plan")

    response = _set_dependencies(api_url, api_key, created.ref_id, [created.ref_id])
    assert response.status_code != 200


def test_api_project_update_rejects_dependency_cycle(
    api_url: str, api_key: str, create_project
) -> None:
    first = create_project("Cycle Plan First")
    second = create_project("Cycle Plan Second")

    response = _set_dependencies(api_url, api_key, second.ref_id, [first.ref_id])
    assert response.status_code == 200

    response = _set_dependencies(api_url, api_key, first.ref_id, [second.ref_id])
    assert response.status_code != 200
    assert _load_dependencies(api_url, api_key, first.ref_id) == []


def test_api_project_update_rejects_transitive_dependency_cycle(
    api_url: str, api_key: str, create_project
) -> None:
    first = create_project("Long Cycle Plan First")
    second = create_project("Long Cycle Plan Second")
    third = create_project("Long Cycle Plan Third")

    assert (
        _set_dependencies(api_url, api_key, second.ref_id, [first.ref_id]).status_code
        == 200
    )
    assert (
        _set_dependencies(api_url, api_key, third.ref_id, [second.ref_id]).status_code
        == 200
    )

    # first -> third closes first -> third -> second -> first.
    response = _set_dependencies(api_url, api_key, first.ref_id, [third.ref_id])
    assert response.status_code != 200
    assert _load_dependencies(api_url, api_key, first.ref_id) == []


def test_api_project_update_allows_diamond_dependencies(
    api_url: str, api_key: str, create_project
) -> None:
    base = create_project("Diamond Plan Base")
    left = create_project("Diamond Plan Left")
    right = create_project("Diamond Plan Right")
    top = create_project("Diamond Plan Top")

    assert (
        _set_dependencies(api_url, api_key, left.ref_id, [base.ref_id]).status_code
        == 200
    )
    assert (
        _set_dependencies(api_url, api_key, right.ref_id, [base.ref_id]).status_code
        == 200
    )

    response = _set_dependencies(
        api_url, api_key, top.ref_id, [left.ref_id, right.ref_id]
    )
    assert response.status_code == 200
    assert _load_dependencies(api_url, api_key, top.ref_id) == [
        left.ref_id,
        right.ref_id,
    ]


def test_api_project_archive_unlinks_it_from_dependents(
    api_url: str, api_key: str, create_project
) -> None:
    dependency = create_project("Archive Unlink Dependency")
    other = create_project("Archive Unlink Other")
    dependent = create_project("Archive Unlink Dependent")

    response = _set_dependencies(
        api_url, api_key, dependent.ref_id, [dependency.ref_id, other.ref_id]
    )
    assert response.status_code == 200

    response = requests.delete(
        f"{api_url}/v1/projects/{dependency.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    assert _load_dependencies(api_url, api_key, dependent.ref_id) == [other.ref_id]


def test_api_project_remove_unlinks_it_from_dependents(
    api_url: str, api_key: str, create_project
) -> None:
    dependency = create_project("Remove Unlink Dependency")
    other = create_project("Remove Unlink Other")
    dependent = create_project("Remove Unlink Dependent")

    response = _set_dependencies(
        api_url, api_key, dependent.ref_id, [dependency.ref_id, other.ref_id]
    )
    assert response.status_code == 200

    response = requests.delete(
        f"{api_url}/v1/projects/{dependency.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    assert _load_dependencies(api_url, api_key, dependent.ref_id) == [other.ref_id]


def test_api_project_archive(api_url: str, api_key: str, create_project) -> None:
    created = create_project("Archive Plan")

    response = requests.delete(
        f"{api_url}/v1/projects/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response1 = requests.get(
        f"{api_url}/v1/projects/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response1.status_code == 502
    assert response1.json()["status"] == 404

    response2 = requests.get(
        f"{api_url}/v1/projects/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["project"]["archived"] is True


def test_api_project_remove(api_url: str, api_key: str, create_project) -> None:
    created = create_project("Remove Plan")

    response = requests.delete(
        f"{api_url}/v1/projects/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/projects/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_project_milestone_create(
    api_url: str, api_key: str, create_project
) -> None:
    bp = create_project("Plan With Milestone")

    response = requests.post(
        f"{api_url}/v1/projects/{bp.ref_id}/milestones",
        headers=_headers(api_key),
        json={
            "project_ref_id": bp.ref_id,
            "name": "Milestone 1",
            "date": "2024-04-15",
        },
        timeout=10,
    )
    assert response.status_code == 200

    milestone = response.json()["new_project_milestone"]
    assert milestone["name"] == "Milestone 1"
    assert milestone["date"] == "2024-04-15"
    assert milestone["project_ref_id"] == bp.ref_id


def test_api_project_milestone_load(
    api_url: str, api_key: str, create_project, create_project_milestone
) -> None:
    bp = create_project("Plan For MS Load")
    ms = create_project_milestone(bp.ref_id, "Load MS", "2024-05-01")

    response = requests.get(
        f"{api_url}/v1/projects/{bp.ref_id}/milestones/{ms.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert response.json()["project_milestone"]["name"] == "Load MS"


def test_api_project_milestone_update(
    api_url: str, api_key: str, create_project, create_project_milestone
) -> None:
    bp = create_project("Plan For MS Update")
    ms = create_project_milestone(bp.ref_id, "Old MS", "2024-07-01")

    response = requests.put(
        f"{api_url}/v1/projects/{bp.ref_id}/milestones/{ms.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": ms.ref_id,
            "name": {"should_change": True, "value": "New MS"},
            "date": {"should_change": True, "value": "2024-08-01"},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/projects/{bp.ref_id}/milestones/{ms.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["project_milestone"]["name"] == "New MS"


def test_api_project_milestone_archive(
    api_url: str, api_key: str, create_project, create_project_milestone
) -> None:
    bp = create_project("Plan For MS Archive")
    ms = create_project_milestone(bp.ref_id, "Archive MS", "2024-09-01")

    response = requests.delete(
        f"{api_url}/v1/projects/{bp.ref_id}/milestones/{ms.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/projects/{bp.ref_id}/milestones/{ms.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["project_milestone"]["archived"] is True


def test_api_project_milestone_remove(
    api_url: str, api_key: str, create_project, create_project_milestone
) -> None:
    bp = create_project("Plan For MS Remove")
    ms = create_project_milestone(bp.ref_id, "Remove MS", "2024-10-01")

    response = requests.delete(
        f"{api_url}/v1/projects/{bp.ref_id}/milestones/{ms.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/projects/{bp.ref_id}/milestones/{ms.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_project_load_includes_time_event_blocks(
    api_url: str, api_key: str, create_project
) -> None:
    bp = create_project("BP With Time Events")

    response = requests.get(
        f"{api_url}/v1/projects/{bp.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert response.json()["time_event_blocks"] == []

    create_response = requests.post(
        f"{api_url}/v1/common/time-events/in-day-blocks/for-project",
        headers=_headers(api_key),
        json={
            "project_ref_id": bp.ref_id,
            "start_date": "2024-08-01",
            "start_time_in_day": "11:00",
            "duration_mins": 30,
        },
        timeout=10,
    )
    assert create_response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/projects/{bp.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    time_event_blocks = response2.json()["time_event_blocks"]
    assert len(time_event_blocks) == 1
    assert time_event_blocks[0]["start_date"] == "2024-08-01"
    assert time_event_blocks[0]["start_time_in_day"] == "11:00"
    assert time_event_blocks[0]["duration_mins"] == 30


def test_api_project_create_inbox_task(
    api_url: str, api_key: str, create_project
) -> None:
    bp = create_project("Plan With Inbox Task")

    response = requests.post(
        f"{api_url}/v1/projects/{bp.ref_id}/inbox-tasks",
        headers=_headers(api_key),
        json={
            "project_ref_id": bp.ref_id,
            "name": "My Inbox Task",
            "is_key": False,
            "eisen": "regular",
            "difficulty": "easy",
        },
        timeout=10,
    )
    assert response.status_code == 200

    it = response.json()["new_inbox_task"]
    assert it["name"] == "My Inbox Task"
    assert it["is_key"] is False
    assert it["eisen"] == "regular"
    assert it["difficulty"] == "easy"
    assert it["owner"] == f"Project:std:{bp.ref_id}"
    assert it["archived"] is False
    assert response.json()["new_time_plan_activity"] is None


def test_api_project_create_inbox_task_with_dates(
    api_url: str, api_key: str, create_project
) -> None:
    bp = create_project("Plan With Dated Task")

    response = requests.post(
        f"{api_url}/v1/projects/{bp.ref_id}/inbox-tasks",
        headers=_headers(api_key),
        json={
            "project_ref_id": bp.ref_id,
            "name": "Dated Task",
            "is_key": True,
            "eisen": "important",
            "difficulty": "hard",
            "actionable_date": "2024-04-01",
            "due_date": "2024-04-30",
        },
        timeout=10,
    )
    assert response.status_code == 200

    it = response.json()["new_inbox_task"]
    assert it["name"] == "Dated Task"
    assert it["is_key"] is True
    assert it["eisen"] == "important"
    assert it["difficulty"] == "hard"
    assert it["actionable_date"] == "2024-04-01"
    assert it["due_date"] == "2024-04-30"
    assert it["owner"] == f"Project:std:{bp.ref_id}"


def test_api_project_create_inbox_task_visible_in_inbox(
    api_url: str, api_key: str, create_project
) -> None:
    bp = create_project("Plan For Inbox Check")

    create_response = requests.post(
        f"{api_url}/v1/projects/{bp.ref_id}/inbox-tasks",
        headers=_headers(api_key),
        json={
            "project_ref_id": bp.ref_id,
            "name": "Visible In Inbox",
            "is_key": False,
            "eisen": "regular",
            "difficulty": "easy",
        },
        timeout=10,
    )

    assert create_response.status_code == 200
    created_ref_id = create_response.json()["new_inbox_task"]["ref_id"]

    load_response = requests.get(
        f"{api_url}/v1/common/inbox-tasks/{created_ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load_response.status_code == 200

    it = load_response.json()["inbox_task"]
    assert it["ref_id"] == created_ref_id
    assert it["name"] == "Visible In Inbox"
    assert it["owner"] == f"Project:std:{bp.ref_id}"


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


def _update_payload(ref_id: str, *, name: str | None = None) -> dict[str, object]:
    return {
        "ref_id": ref_id,
        "name": (
            {"should_change": True, "value": name}
            if name is not None
            else {"should_change": False}
        ),
        "status": {"should_change": False},
        "is_key": {"should_change": False},
        "eisen": {"should_change": False},
        "difficulty": {"should_change": False},
        "actionable_date": {"should_change": False},
        "due_date": {"should_change": False},
        "aspect_ref_id": {"should_change": False},
        "chapter_ref_id": {"should_change": False},
        "goal_ref_id": {"should_change": False},
        "dependency_ref_ids": {"should_change": False},
    }


def _assert_other_user_cannot_access_project(
    api_url: str,
    *,
    project_ref_id: str,
    owner_api_key: str,
    other_api_key: str,
) -> None:
    assert other_api_key != owner_api_key

    owner_load_response = requests.get(
        f"{api_url}/v1/projects/{project_ref_id}?allow_archived=false",
        headers=_headers(owner_api_key),
        timeout=10,
    )
    assert owner_load_response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/projects/{project_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        f"{api_url}/v1/projects/{project_ref_id}",
        headers=_headers(other_api_key),
        json=_update_payload(project_ref_id, name="Hacked Plan"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/projects/{project_ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_project_acl_reader_can_read_but_not_update_or_archive(
    api_url: str,
    api_key: str,
    create_project,
    grant_project_access,
    another_user_with_projects_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_project("Reader ACL Plan")
    other_api_key = another_user_with_projects_enabled.api_key

    _assert_other_user_cannot_access_project(
        api_url,
        project_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=other_api_key,
    )

    other_api_key = grant_project_access(created, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/projects/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["project"]["ref_id"] == created.ref_id
    assert load_response.json()["owner"]["ref_id"] is not None
    assert load_response.json()["access_status"]["access_level"] == "reader"

    update_response = requests.put(
        f"{api_url}/v1/projects/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_update_payload(created.ref_id, name="Reader Cannot Update"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/projects/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_project_acl_writer_can_read_and_update(
    api_url: str,
    create_project,
    grant_project_access,
) -> None:
    created = create_project("Writer Update Plan")
    other_api_key = grant_project_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/projects/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    update_response = requests.put(
        f"{api_url}/v1/projects/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_update_payload(created.ref_id, name="Writer Updated Plan"),
        timeout=10,
    )
    assert update_response.status_code == 200

    verify_response = requests.get(
        f"{api_url}/v1/projects/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert verify_response.status_code == 200
    assert verify_response.json()["project"]["name"] == "Writer Updated Plan"


def test_api_project_acl_writer_can_read_and_archive(
    api_url: str,
    create_project,
    grant_project_access,
) -> None:
    created = create_project("Writer Archive Plan")
    other_api_key = grant_project_access(created, AccessLevel.WRITER)

    archive_response = requests.delete(
        f"{api_url}/v1/projects/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    archived_response = requests.get(
        f"{api_url}/v1/projects/{created.ref_id}?allow_archived=true",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archived_response.status_code == 200
    assert archived_response.json()["project"]["archived"] is True


def test_api_project_acl_z_denied_without_grant(
    api_url: str,
    api_key: str,
    create_project,
    another_user_with_projects_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_project("Denied ACL Plan")
    _assert_other_user_cannot_access_project(
        api_url,
        project_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=another_user_with_projects_enabled.api_key,
    )


def test_api_project_milestone_acl(
    api_url: str,
    create_project,
    create_project_milestone,
    another_user_with_projects_enabled: AnotherUserAndWorkspace,
) -> None:
    bp = create_project("ACL Plan")
    ms = create_project_milestone(bp.ref_id, "ACL Milestone", "2024-04-15")
    other_api_key = another_user_with_projects_enabled.api_key
    milestone_url = f"{api_url}/v1/projects/{bp.ref_id}/milestones/{ms.ref_id}"

    load_response = requests.get(
        f"{milestone_url}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        milestone_url,
        headers=_headers(other_api_key),
        json={
            "ref_id": ms.ref_id,
            "name": {"should_change": True, "value": "Hacked Milestone"},
            "date": {"should_change": True, "value": "2024-12-31"},
        },
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        milestone_url,
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_project_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/projects?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401
