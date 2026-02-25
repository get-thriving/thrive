"""Tests for the API for life plan (visions, chapters, goals, milestones, projects)."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.life_plan.chapter_create import (
    sync_detailed as chapter_create_sync,
)
from jupiter_webapi_client.api.life_plan.goal_create import (
    sync_detailed as goal_create_sync,
)
from jupiter_webapi_client.api.life_plan.milestone_create import (
    sync_detailed as milestone_create_sync,
)
from jupiter_webapi_client.api.life_plan.project_create import (
    sync_detailed as project_create_sync,
)
from jupiter_webapi_client.api.life_plan.project_find import (
    sync_detailed as project_find_sync,
)
from jupiter_webapi_client.api.life_plan.vision_create_draft import (
    sync_detailed as vision_create_draft_sync,
)
from jupiter_webapi_client.api.life_plan.vision_mark_draft_as_active import (
    sync_detailed as vision_mark_active_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.chapter import Chapter
from jupiter_webapi_client.models.chapter_create_args import ChapterCreateArgs
from jupiter_webapi_client.models.chapter_create_result import ChapterCreateResult
from jupiter_webapi_client.models.goal import Goal
from jupiter_webapi_client.models.goal_create_args import GoalCreateArgs
from jupiter_webapi_client.models.goal_create_result import GoalCreateResult
from jupiter_webapi_client.models.milestone import Milestone
from jupiter_webapi_client.models.milestone_create_args import MilestoneCreateArgs
from jupiter_webapi_client.models.milestone_create_result import MilestoneCreateResult
from jupiter_webapi_client.models.project import Project
from jupiter_webapi_client.models.project_create_args import ProjectCreateArgs
from jupiter_webapi_client.models.project_create_result import ProjectCreateResult
from jupiter_webapi_client.models.project_find_args import ProjectFindArgs
from jupiter_webapi_client.models.project_find_result import ProjectFindResult
from jupiter_webapi_client.models.vision import Vision
from jupiter_webapi_client.models.vision_create_draft_args import VisionCreateDraftArgs
from jupiter_webapi_client.models.vision_create_draft_result import (
    VisionCreateDraftResult,
)
from jupiter_webapi_client.models.vision_mark_draft_as_active_args import (
    VisionMarkDraftAsActiveArgs,
)
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_life_plan_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.LIFE_PLAN, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.LIFE_PLAN, value=False
            ),
        )


@pytest.fixture()
def root_project_ref_id(logged_in_client: AuthenticatedClient) -> str:
    result = project_find_sync(
        client=logged_in_client,
        body=ProjectFindArgs(
            allow_archived=False,
            include_notes=False,
            include_tags=False,
        ),
    )
    entries = get_parsed_from_response(ProjectFindResult, result).entries
    assert len(entries) >= 1
    return entries[0].project.ref_id


@pytest.fixture()
def create_vision(logged_in_client: AuthenticatedClient):
    def _create() -> Vision:
        result = vision_create_draft_sync(
            client=logged_in_client,
            body=VisionCreateDraftArgs(),
        )
        return get_parsed_from_response(VisionCreateDraftResult, result).vision

    return _create


@pytest.fixture()
def activate_vision(logged_in_client: AuthenticatedClient):
    def _activate(ref_id: str) -> None:
        vision_mark_active_sync(
            client=logged_in_client,
            body=VisionMarkDraftAsActiveArgs(ref_id=ref_id),
        )

    return _activate


@pytest.fixture()
def create_chapter(logged_in_client: AuthenticatedClient):
    def _create(
        name: str, project_ref_id: str, start_date: str, end_date: str
    ) -> Chapter:
        result = chapter_create_sync(
            client=logged_in_client,
            body=ChapterCreateArgs(
                name=name,
                project_ref_id=project_ref_id,
                start_date=f"absolute-year-month-day {start_date}",
                end_date=f"absolute-year-month-day {end_date}",
            ),
        )
        return get_parsed_from_response(ChapterCreateResult, result).new_chapter

    return _create


@pytest.fixture()
def create_goal(logged_in_client: AuthenticatedClient):
    def _create(name: str, project_ref_id: str) -> Goal:
        result = goal_create_sync(
            client=logged_in_client,
            body=GoalCreateArgs(name=name, project_ref_id=project_ref_id),
        )
        return get_parsed_from_response(GoalCreateResult, result).new_goal

    return _create


@pytest.fixture()
def create_milestone(logged_in_client: AuthenticatedClient):
    def _create(name: str, date: str, project_ref_id: str) -> Milestone:
        result = milestone_create_sync(
            client=logged_in_client,
            body=MilestoneCreateArgs(
                name=name, date=date, project_ref_id=project_ref_id
            ),
        )
        return get_parsed_from_response(MilestoneCreateResult, result).new_milestone

    return _create


@pytest.fixture()
def create_project(logged_in_client: AuthenticatedClient):
    def _create(parent_project_ref_id: str, name: str) -> Project:
        result = project_create_sync(
            client=logged_in_client,
            body=ProjectCreateArgs(
                parent_project_ref_id=parent_project_ref_id, name=name
            ),
        )
        return get_parsed_from_response(ProjectCreateResult, result).new_project

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


# --- Vision tests ---


def test_api_life_plan_vision_create_draft(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/life-plan/visions/create-draft",
        headers=_headers(api_key),
        json={},
        timeout=10,
    )
    assert response.status_code == 200

    vision = response.json()["vision"]
    assert "ref_id" in vision
    assert vision["archived"] is False


def test_api_life_plan_vision_mark_active(
    api_url: str, api_key: str, create_vision
) -> None:
    vision = create_vision()

    response = requests.post(
        f"{api_url}/v1/life-plan/visions/{vision.ref_id}/mark-active",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200


def test_api_life_plan_vision_load(api_url: str, api_key: str, create_vision) -> None:
    vision = create_vision()

    response = requests.get(
        f"{api_url}/v1/life-plan/visions/{vision.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert response.json()["vision"]["ref_id"] == vision.ref_id


def test_api_life_plan_vision_find(api_url: str, api_key: str, create_vision) -> None:
    create_vision()

    response = requests.get(
        f"{api_url}/v1/life-plan/visions?include_notes=true",
        headers=_headers(api_key),
        timeout=10,
    )
    data = response.json()
    assert response.status_code == 200
    assert "entries" in data
    entries = data["entries"]
    assert len(entries) >= 1
    assert entries[0]["note"]["namespace"] == "vision"


def test_api_life_plan_vision_load_active(
    api_url: str, api_key: str, create_vision, activate_vision
) -> None:
    vision = create_vision()
    activate_vision(vision.ref_id)

    response = requests.get(
        f"{api_url}/v1/life-plan/visions/active",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert "vision" in response.json()
    assert response.json()["vision"]["ref_id"] == vision.ref_id


def test_api_life_plan_vision_archive(
    api_url: str, api_key: str, create_vision
) -> None:
    vision = create_vision()

    response = requests.delete(
        f"{api_url}/v1/life-plan/visions/{vision.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/life-plan/visions/{vision.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404

    response3 = requests.get(
        f"{api_url}/v1/life-plan/visions/{vision.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 200
    assert response3.json()["vision"]["archived"] is True


def test_api_life_plan_vision_remove(api_url: str, api_key: str, create_vision) -> None:
    vision = create_vision()

    response = requests.delete(
        f"{api_url}/v1/life-plan/visions/{vision.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/life-plan/visions/{vision.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


# --- Chapter tests ---


def test_api_life_plan_chapter_create(
    api_url: str, api_key: str, root_project_ref_id: str
) -> None:
    response = requests.post(
        f"{api_url}/v1/life-plan/chapters",
        headers=_headers(api_key),
        json={
            "name": "Chapter One",
            "project_ref_id": root_project_ref_id,
            "start_date": "absolute-year-month-day 2024 01 01",
            "end_date": "absolute-year-month-day 2024 06 30",
        },
        timeout=10,
    )
    assert response.status_code == 200

    chapter = response.json()["new_chapter"]
    assert chapter["name"] == "Chapter One"
    assert "ref_id" in chapter


def test_api_life_plan_chapter_load(
    api_url: str, api_key: str, root_project_ref_id: str, create_chapter
) -> None:
    chapter = create_chapter(
        "Load Chapter", root_project_ref_id, "2024 01 01", "2024 12 31"
    )

    response = requests.get(
        f"{api_url}/v1/life-plan/chapters/{chapter.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert response.json()["chapter"]["name"] == "Load Chapter"


def test_api_life_plan_chapter_find(
    api_url: str, api_key: str, root_project_ref_id: str, create_chapter
) -> None:
    create_chapter("Find Chapter 1", root_project_ref_id, "2024 01 01", "2024 06 30")
    create_chapter("Find Chapter 2", root_project_ref_id, "2024 01 01", "2024 06 30")

    response = requests.get(
        f"{api_url}/v1/life-plan/chapters",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert "entries" in response.json()
    data = response.json()
    assert "entries" in data
    assert "Find Chapter 1" in [entry["chapter"]["name"] for entry in data["entries"]]
    assert "Find Chapter 2" in [entry["chapter"]["name"] for entry in data["entries"]]


def test_api_life_plan_chapter_update(
    api_url: str, api_key: str, root_project_ref_id: str, create_chapter
) -> None:
    chapter = create_chapter(
        "Old Chapter", root_project_ref_id, "2024 01 01", "2024 06 30"
    )

    response = requests.put(
        f"{api_url}/v1/life-plan/chapters/{chapter.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": chapter.ref_id,
            "name": {"should_change": True, "value": "New Chapter"},
            "project_ref_id": {"should_change": False},
            "start_date": {"should_change": False},
            "end_date": {
                "should_change": True,
                "value": "absolute-year-month-day 2024 12 31",
            },
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/life-plan/chapters/{chapter.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["chapter"]["name"] == "New Chapter"


def test_api_life_plan_chapter_archive(
    api_url: str, api_key: str, root_project_ref_id: str, create_chapter
) -> None:
    chapter = create_chapter(
        "Archive Chapter", root_project_ref_id, "2024 01 01", "2024 03 31"
    )

    response = requests.delete(
        f"{api_url}/v1/life-plan/chapters/{chapter.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response3 = requests.get(
        f"{api_url}/v1/life-plan/chapters/{chapter.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404

    response4 = requests.get(
        f"{api_url}/v1/life-plan/chapters/{chapter.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response4.status_code == 200
    assert response4.json()["chapter"]["archived"] is True


def test_api_life_plan_chapter_remove(
    api_url: str, api_key: str, root_project_ref_id: str, create_chapter
) -> None:
    chapter = create_chapter(
        "Remove Chapter", root_project_ref_id, "2024 01 01", "2024 03 31"
    )

    response = requests.delete(
        f"{api_url}/v1/life-plan/chapters/{chapter.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/life-plan/chapters/{chapter.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


# --- Goal tests ---


def test_api_life_plan_goal_create(
    api_url: str, api_key: str, root_project_ref_id: str
) -> None:
    response = requests.post(
        f"{api_url}/v1/life-plan/goals",
        headers=_headers(api_key),
        json={
            "name": "Learn Piano",
            "project_ref_id": root_project_ref_id,
        },
        timeout=10,
    )
    assert response.status_code == 200

    goal = response.json()["new_goal"]
    assert goal["name"] == "Learn Piano"
    assert "ref_id" in goal


def test_api_life_plan_goal_load(
    api_url: str, api_key: str, root_project_ref_id: str, create_goal
) -> None:
    goal = create_goal("Load Goal", root_project_ref_id)

    response = requests.get(
        f"{api_url}/v1/life-plan/goals/{goal.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert response.json()["goal"]["name"] == "Load Goal"


def test_api_life_plan_goal_find(
    api_url: str, api_key: str, root_project_ref_id: str, create_goal
) -> None:
    create_goal("Find Goal 1", root_project_ref_id)
    create_goal("Find Goal 2", root_project_ref_id)

    response = requests.get(
        f"{api_url}/v1/life-plan/goals",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert "entries" in response.json()
    data = response.json()
    assert "entries" in data
    assert "Find Goal 1" in [entry["goal"]["name"] for entry in data["entries"]]
    assert "Find Goal 2" in [entry["goal"]["name"] for entry in data["entries"]]


def test_api_life_plan_goal_update(
    api_url: str, api_key: str, root_project_ref_id: str, create_goal
) -> None:
    goal = create_goal("Old Goal", root_project_ref_id)

    response = requests.put(
        f"{api_url}/v1/life-plan/goals/{goal.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": goal.ref_id,
            "name": {"should_change": True, "value": "New Goal"},
            "project_ref_id": {"should_change": False},
            "parent_goal_ref_id": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/life-plan/goals/{goal.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["goal"]["name"] == "New Goal"


def test_api_life_plan_goal_archive(
    api_url: str, api_key: str, root_project_ref_id: str, create_goal
) -> None:
    goal = create_goal("Archive Goal", root_project_ref_id)

    response = requests.delete(
        f"{api_url}/v1/life-plan/goals/{goal.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response3 = requests.get(
        f"{api_url}/v1/life-plan/goals/{goal.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404

    response4 = requests.get(
        f"{api_url}/v1/life-plan/goals/{goal.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response4.status_code == 200
    assert response4.json()["goal"]["archived"] is True


def test_api_life_plan_goal_remove(
    api_url: str, api_key: str, root_project_ref_id: str, create_goal
) -> None:
    goal = create_goal("Remove Goal", root_project_ref_id)

    response = requests.delete(
        f"{api_url}/v1/life-plan/goals/{goal.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/life-plan/goals/{goal.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


# --- Milestone tests ---


def test_api_life_plan_milestone_create(
    api_url: str, api_key: str, root_project_ref_id: str
) -> None:
    response = requests.post(
        f"{api_url}/v1/life-plan/milestones",
        headers=_headers(api_key),
        json={
            "name": "Ship v1.0",
            "date": "2024-09-01",
            "project_ref_id": root_project_ref_id,
        },
        timeout=10,
    )
    assert response.status_code == 200

    milestone = response.json()["new_milestone"]
    assert milestone["name"] == "Ship v1.0"
    assert "ref_id" in milestone


def test_api_life_plan_milestone_load(
    api_url: str, api_key: str, root_project_ref_id: str, create_milestone
) -> None:
    milestone = create_milestone("Load Milestone", "2024-10-01", root_project_ref_id)

    response = requests.get(
        f"{api_url}/v1/life-plan/milestones/{milestone.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert response.json()["milestone"]["name"] == "Load Milestone"


def test_api_life_plan_milestone_find(
    api_url: str, api_key: str, root_project_ref_id: str, create_milestone
) -> None:
    create_milestone("Find Milestone 1", "2024-01-01", root_project_ref_id)
    create_milestone("Find Milestone 2", "2024-01-01", root_project_ref_id)

    response = requests.get(
        f"{api_url}/v1/life-plan/milestones",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert "entries" in response.json()
    data = response.json()
    assert "entries" in data
    assert "Find Milestone 1" in [
        entry["milestone"]["name"] for entry in data["entries"]
    ]
    assert "Find Milestone 2" in [
        entry["milestone"]["name"] for entry in data["entries"]
    ]


def test_api_life_plan_milestone_update(
    api_url: str, api_key: str, root_project_ref_id: str, create_milestone
) -> None:
    milestone = create_milestone("Old Milestone", "2024-11-01", root_project_ref_id)

    response = requests.put(
        f"{api_url}/v1/life-plan/milestones/{milestone.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": milestone.ref_id,
            "name": {"should_change": True, "value": "New Milestone"},
            "date": {"should_change": True, "value": "2024-12-15"},
            "project_ref_id": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/life-plan/milestones/{milestone.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["milestone"]["name"] == "New Milestone"


def test_api_life_plan_milestone_archive(
    api_url: str, api_key: str, root_project_ref_id: str, create_milestone
) -> None:
    milestone = create_milestone("Archive Milestone", "2024-04-01", root_project_ref_id)

    response = requests.delete(
        f"{api_url}/v1/life-plan/milestones/{milestone.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response3 = requests.get(
        f"{api_url}/v1/life-plan/milestones/{milestone.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404

    response4 = requests.get(
        f"{api_url}/v1/life-plan/milestones/{milestone.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response4.status_code == 200
    assert response4.json()["milestone"]["archived"] is True


def test_api_life_plan_milestone_remove(
    api_url: str, api_key: str, root_project_ref_id: str, create_milestone
) -> None:
    milestone = create_milestone("Remove Milestone", "2024-05-01", root_project_ref_id)

    response = requests.delete(
        f"{api_url}/v1/life-plan/milestones/{milestone.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/life-plan/milestones/{milestone.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


# --- Project tests ---


def test_api_life_plan_project_create(
    api_url: str, api_key: str, root_project_ref_id: str
) -> None:
    response = requests.post(
        f"{api_url}/v1/life-plan/projects",
        headers=_headers(api_key),
        json={
            "parent_project_ref_id": root_project_ref_id,
            "name": "Sub Project",
        },
        timeout=10,
    )
    assert response.status_code == 200

    project = response.json()["new_project"]
    assert project["name"] == "Sub Project"
    assert "ref_id" in project


def test_api_life_plan_project_load(
    api_url: str, api_key: str, root_project_ref_id: str, create_project
) -> None:
    project = create_project(root_project_ref_id, "Load Project")

    response = requests.get(
        f"{api_url}/v1/life-plan/projects/{project.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert response.json()["project"]["name"] == "Load Project"


def test_api_life_plan_project_find(
    api_url: str, api_key: str, root_project_ref_id: str, create_project
) -> None:
    create_project(root_project_ref_id, "Find Project 1")
    create_project(root_project_ref_id, "Find Project 2")
    response = requests.get(
        f"{api_url}/v1/life-plan/projects?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert "entries" in response.json()
    data = response.json()
    assert "entries" in data
    assert "Find Project 1" in [entry["project"]["name"] for entry in data["entries"]]
    assert "Find Project 2" in [entry["project"]["name"] for entry in data["entries"]]


def test_api_life_plan_project_update(
    api_url: str, api_key: str, root_project_ref_id: str, create_project
) -> None:
    project = create_project(root_project_ref_id, "Old Project")

    response = requests.put(
        f"{api_url}/v1/life-plan/projects/{project.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": project.ref_id,
            "name": {"should_change": True, "value": "New Project"},
            "parent_project_ref_id": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/life-plan/projects/{project.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["project"]["name"] == "New Project"


def test_api_life_plan_project_archive(
    api_url: str, api_key: str, root_project_ref_id: str, create_project
) -> None:
    project = create_project(root_project_ref_id, "Archive Project")

    response = requests.delete(
        f"{api_url}/v1/life-plan/projects/{project.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response3 = requests.get(
        f"{api_url}/v1/life-plan/projects/{project.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404

    response4 = requests.get(
        f"{api_url}/v1/life-plan/projects/{project.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response4.status_code == 200
    assert response4.json()["project"]["archived"] is True


def test_api_life_plan_project_remove(
    api_url: str, api_key: str, root_project_ref_id: str, create_project
) -> None:
    project = create_project(root_project_ref_id, "Remove Project")

    response = requests.delete(
        f"{api_url}/v1/life-plan/projects/{project.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/life-plan/projects/{project.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


# --- Auth test ---


def test_api_life_plan_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/life-plan/visions?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401
