"""Tests for the API for time plans."""

from collections.abc import Iterator
from urllib.parse import quote

import pytest
import requests
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.gen.gen_do import (
    sync_detailed as gen_do_sync,
)
from jupiter_webapi_client.api.projects.project_create import (
    sync_detailed as project_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_inbox_task_with_plan import (
    sync_detailed as time_plan_associate_inbox_task_with_plan_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_project_with_plan import (
    sync_detailed as time_plan_associate_project_with_plan_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_create import (
    sync_detailed as time_plan_create_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_load import (
    sync_detailed as time_plan_load_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_load_for_time_date_and_period import (
    sync_detailed as time_plan_load_for_date_and_period_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_question_archive import (
    sync_detailed as time_plan_question_archive_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_question_create import (
    sync_detailed as time_plan_question_create_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_question_find import (
    sync_detailed as time_plan_question_find_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_question_load import (
    sync_detailed as time_plan_question_load_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_question_remove import (
    sync_detailed as time_plan_question_remove_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_question_reorder import (
    sync_detailed as time_plan_question_reorder_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_question_update import (
    sync_detailed as time_plan_question_update_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.gen_do_args import GenDoArgs
from jupiter_webapi_client.models.heading_block import HeadingBlock
from jupiter_webapi_client.models.inbox_task import InboxTask
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.paragraph_block import ParagraphBlock
from jupiter_webapi_client.models.project import Project
from jupiter_webapi_client.models.project_create_args import ProjectCreateArgs
from jupiter_webapi_client.models.project_create_result import ProjectCreateResult
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.sync_target import SyncTarget
from jupiter_webapi_client.models.time_plan import TimePlan
from jupiter_webapi_client.models.time_plan_activity import TimePlanActivity
from jupiter_webapi_client.models.time_plan_activity_feasability import (
    TimePlanActivityFeasability,
)
from jupiter_webapi_client.models.time_plan_activity_kind import TimePlanActivityKind
from jupiter_webapi_client.models.time_plan_associate_inbox_task_with_plan_args import (
    TimePlanAssociateInboxTaskWithPlanArgs,
)
from jupiter_webapi_client.models.time_plan_associate_inbox_task_with_plan_result import (
    TimePlanAssociateInboxTaskWithPlanResult,
)
from jupiter_webapi_client.models.time_plan_associate_project_with_plan_args import (
    TimePlanAssociateProjectWithPlanArgs,
)
from jupiter_webapi_client.models.time_plan_associate_project_with_plan_result import (
    TimePlanAssociateProjectWithPlanResult,
)
from jupiter_webapi_client.models.time_plan_create_args import TimePlanCreateArgs
from jupiter_webapi_client.models.time_plan_create_result import TimePlanCreateResult
from jupiter_webapi_client.models.time_plan_load_args import TimePlanLoadArgs
from jupiter_webapi_client.models.time_plan_load_for_date_and_period_args import (
    TimePlanLoadForDateAndPeriodArgs,
)
from jupiter_webapi_client.models.time_plan_load_for_date_and_period_result import (
    TimePlanLoadForDateAndPeriodResult,
)
from jupiter_webapi_client.models.time_plan_load_result import TimePlanLoadResult
from jupiter_webapi_client.models.time_plan_question import TimePlanQuestion
from jupiter_webapi_client.models.time_plan_question_archive_args import (
    TimePlanQuestionArchiveArgs,
)
from jupiter_webapi_client.models.time_plan_question_create_args import (
    TimePlanQuestionCreateArgs,
)
from jupiter_webapi_client.models.time_plan_question_create_result import (
    TimePlanQuestionCreateResult,
)
from jupiter_webapi_client.models.time_plan_question_find_args import (
    TimePlanQuestionFindArgs,
)
from jupiter_webapi_client.models.time_plan_question_find_result import (
    TimePlanQuestionFindResult,
)
from jupiter_webapi_client.models.time_plan_question_load_args import (
    TimePlanQuestionLoadArgs,
)
from jupiter_webapi_client.models.time_plan_question_load_result import (
    TimePlanQuestionLoadResult,
)
from jupiter_webapi_client.models.time_plan_question_remove_args import (
    TimePlanQuestionRemoveArgs,
)
from jupiter_webapi_client.models.time_plan_question_reorder_args import (
    TimePlanQuestionReorderArgs,
)
from jupiter_webapi_client.models.time_plan_question_update_args import (
    TimePlanQuestionUpdateArgs,
)
from jupiter_webapi_client.models.time_plan_question_update_args_name import (
    TimePlanQuestionUpdateArgsName,
)
from jupiter_webapi_client.models.todo_task_create_args import TodoTaskCreateArgs
from jupiter_webapi_client.models.todo_task_create_result import TodoTaskCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from jupiter_webapi_client.types import Unset

from itests.api.conftest import AnotherUserAndWorkspace
from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_features(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TIME_PLANS, value=True
            ),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PROJECTS, value=True),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=False
            ),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.PROJECTS, value=False
            ),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TIME_PLANS, value=False
            ),
        )


@pytest.fixture()
def create_time_plan(logged_in_client: AuthenticatedClient):
    def _create(
        right_now: str, period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY
    ) -> TimePlan:
        result = time_plan_create_sync(
            client=logged_in_client,
            body=TimePlanCreateArgs(
                right_now=right_now,
                period=period,
            ),
        )
        return get_parsed_from_response(TimePlanCreateResult, result).new_time_plan

    return _create


@pytest.fixture()
def create_question(logged_in_client: AuthenticatedClient):
    def _create(
        name: str, period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY
    ) -> TimePlanQuestion:
        result = time_plan_question_create_sync(
            client=logged_in_client,
            body=TimePlanQuestionCreateArgs(name=name, period=period),
        )
        return get_parsed_from_response(
            TimePlanQuestionCreateResult, result
        ).new_time_plan_question

    return _create


@pytest.fixture()
def create_inbox_task(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> InboxTask:
        result = todo_task_create_sync(
            client=logged_in_client,
            body=TodoTaskCreateArgs(
                name=name,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        )
        return get_parsed_from_response(TodoTaskCreateResult, result).new_inbox_task

    return _create


@pytest.fixture()
def associate_inbox_task(logged_in_client: AuthenticatedClient):
    def _associate(time_plan_ref_id: str, inbox_task_ref_id: str) -> TimePlanActivity:
        result = time_plan_associate_inbox_task_with_plan_sync(
            client=logged_in_client,
            body=TimePlanAssociateInboxTaskWithPlanArgs(
                inbox_task_ref_id=inbox_task_ref_id,
                time_plan_ref_ids=[time_plan_ref_id],
                kind=TimePlanActivityKind.FINISH,
                feasability=TimePlanActivityFeasability.MUST_DO,
            ),
        )
        return get_parsed_from_response(
            TimePlanAssociateInboxTaskWithPlanResult, result
        ).new_time_plan_activities[0]

    return _associate


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
def associate_project(logged_in_client: AuthenticatedClient):
    def _associate(time_plan_ref_id: str, project_ref_id: str) -> TimePlanActivity:
        result = time_plan_associate_project_with_plan_sync(
            client=logged_in_client,
            body=TimePlanAssociateProjectWithPlanArgs(
                project_ref_id=project_ref_id,
                time_plan_ref_ids=[time_plan_ref_id],
                kind=TimePlanActivityKind.MAKE_PROGRESS,
                feasability=TimePlanActivityFeasability.MUST_DO,
            ),
        )
        return get_parsed_from_response(
            TimePlanAssociateProjectWithPlanResult, result
        ).new_time_plan_activities[0]

    return _associate


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


_ACL_DENIED_REASON = "You are not allowed to access this entity"


def _assert_acl_denied(response: requests.Response) -> None:
    assert response.status_code == 502
    body = response.json()
    assert body["status"] == 401
    assert body["response"]["reason"] == _ACL_DENIED_REASON


# --- Time Plan tests ---


def test_api_time_plan_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/time-plans",
        headers=_headers(api_key),
        json={
            "right_now": "2024-06-10",
            "period": "weekly",
        },
        timeout=10,
    )
    assert response.status_code == 200

    tp = response.json()["new_time_plan"]
    assert tp["period"] == "weekly"
    assert tp["right_now"] == "2024-06-10"
    assert tp["archived"] is False
    assert "ref_id" in tp


def test_api_time_plan_load(api_url: str, api_key: str, create_time_plan) -> None:
    created = create_time_plan("2024-07-01")

    response = requests.get(
        f"{api_url}/v1/time-plans/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    tp = response.json()["time_plan"]
    assert tp["ref_id"] == created.ref_id
    assert tp["period"] == "weekly"


def test_api_time_plan_find(api_url: str, api_key: str, create_time_plan) -> None:
    tp1 = create_time_plan("2024-08-05")
    tp2 = create_time_plan("2024-08-12")

    response = requests.get(
        f"{api_url}/v1/time-plans?allow_archived=false&include_notes=false&include_planning_tasks=false&include_life_plan_ref_ids=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    ref_ids = [e["time_plan"]["ref_id"] for e in response.json()["entries"]]
    assert tp1.ref_id in ref_ids
    assert tp2.ref_id in ref_ids


def test_api_time_plan_load_for_date_and_period(
    api_url: str, api_key: str, create_time_plan
) -> None:
    created = create_time_plan("2024-08-19")

    response = requests.get(
        f"{api_url}/v1/time-plans/for-date-and-period?right_now=2024-08-19&period=weekly",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    data = response.json()
    assert data["time_plan"] is not None
    assert data["time_plan"]["ref_id"] == created.ref_id
    assert data["time_plan"]["period"] == "weekly"


def test_api_time_plan_load_for_date_and_period_not_found(
    api_url: str, api_key: str
) -> None:
    response = requests.get(
        f"{api_url}/v1/time-plans/for-date-and-period?right_now=2099-01-01&period=weekly",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    data = response.json()
    assert data["time_plan"] is None


def test_api_time_plan_change_time_config(
    api_url: str, api_key: str, create_time_plan
) -> None:
    created = create_time_plan("2024-08-26")

    response = requests.post(
        f"{api_url}/v1/time-plans/{created.ref_id}/change-time-config",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "right_now": {"should_change": True, "value": "2024-09-02"},
            "period": {"should_change": True, "value": "monthly"},
            "chapter_ref_ids": {"should_change": False},
            "aspect_ref_ids": {"should_change": False},
            "goal_ref_ids": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/time-plans/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    tp = response2.json()["time_plan"]
    assert tp["right_now"] == "2024-09-02"
    assert tp["period"] == "monthly"


def test_api_time_plan_load_settings(api_url: str, api_key: str) -> None:
    response = requests.get(
        f"{api_url}/v1/time-plans/settings",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert "periods" in response.json()


def test_api_time_plan_archive(api_url: str, api_key: str, create_time_plan) -> None:
    created = create_time_plan("2024-09-02")

    response = requests.delete(
        f"{api_url}/v1/time-plans/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/time-plans/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["time_plan"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/time-plans/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_time_plan_remove(api_url: str, api_key: str, create_time_plan) -> None:
    created = create_time_plan("2024-09-09")

    response = requests.delete(
        f"{api_url}/v1/time-plans/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/time-plans/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


# --- Time Plan Activity tests ---


def test_api_time_plan_associate_inbox_task(
    api_url: str,
    api_key: str,
    create_time_plan,
    create_inbox_task,
) -> None:
    tp = create_time_plan("2024-11-04")
    task = create_inbox_task("Associate Inbox Task")

    response = requests.post(
        f"{api_url}/v1/time-plans/{tp.ref_id}/associate-inbox-task",
        headers=_headers(api_key),
        json={
            "inbox_task_ref_id": task.ref_id,
            "time_plan_ref_ids": [tp.ref_id],
            "kind": "finish",
            "feasability": "must-do",
        },
        timeout=10,
    )
    assert response.status_code == 200

    activities = response.json()["new_time_plan_activities"]
    assert len(activities) == 1
    assert activities[0]["target"] == f"InboxTask:std:{task.ref_id}"
    assert activities[0]["kind"] == "finish"
    assert activities[0]["feasability"] == "must-do"


def test_api_time_plan_associate_project(
    api_url: str,
    api_key: str,
    create_time_plan,
    create_project,
) -> None:
    tp = create_time_plan("2024-11-11")
    bp = create_project("Associate Project")

    response = requests.post(
        f"{api_url}/v1/time-plans/{tp.ref_id}/associate-project",
        headers=_headers(api_key),
        json={
            "project_ref_id": bp.ref_id,
            "time_plan_ref_ids": [tp.ref_id],
            "kind": "make-progress",
            "feasability": "nice-to-have",
        },
        timeout=10,
    )
    assert response.status_code == 200

    activities = response.json()["new_time_plan_activities"]
    assert len(activities) == 1
    assert activities[0]["target"] == f"Project:std:{bp.ref_id}"
    assert activities[0]["kind"] == "make-progress"
    assert activities[0]["feasability"] == "nice-to-have"


def test_api_time_plan_associate_with_inbox_tasks(
    api_url: str,
    api_key: str,
    create_time_plan,
    create_inbox_task,
) -> None:
    tp = create_time_plan("2024-12-02")
    task1 = create_inbox_task("Batch Inbox Task 1")
    task2 = create_inbox_task("Batch Inbox Task 2")

    response = requests.post(
        f"{api_url}/v1/time-plans/{tp.ref_id}/associate-with-inbox-tasks",
        headers=_headers(api_key),
        json={
            "ref_id": tp.ref_id,
            "inbox_task_ref_ids": [task1.ref_id, task2.ref_id],
            "override_existing_dates": False,
            "kind": "finish",
            "feasability": "must-do",
        },
        timeout=10,
    )
    assert response.status_code == 200

    activities = response.json()["new_time_plan_activities"]
    assert len(activities) == 2
    targets = {a["target"] for a in activities}
    assert f"InboxTask:std:{task1.ref_id}" in targets
    assert f"InboxTask:std:{task2.ref_id}" in targets
    for a in activities:
        assert a["target"].startswith("InboxTask:std:")
        assert a["kind"] == "finish"
        assert a["feasability"] == "must-do"


def test_api_time_plan_associate_with_projects(
    api_url: str,
    api_key: str,
    create_time_plan,
    create_project,
) -> None:
    tp = create_time_plan("2024-12-09")
    bp1 = create_project("Batch Project 1")
    bp2 = create_project("Batch Project 2")

    response = requests.post(
        f"{api_url}/v1/time-plans/{tp.ref_id}/associate-with-projects",
        headers=_headers(api_key),
        json={
            "ref_id": tp.ref_id,
            "project_ref_ids": [bp1.ref_id, bp2.ref_id],
            "override_existing_dates": False,
            "kind": "make-progress",
            "feasability": "nice-to-have",
        },
        timeout=10,
    )
    assert response.status_code == 200

    activities = response.json()["new_time_plan_activities"]
    assert len(activities) == 2
    targets = {a["target"] for a in activities}
    assert f"Project:std:{bp1.ref_id}" in targets
    assert f"Project:std:{bp2.ref_id}" in targets
    for a in activities:
        assert a["target"].startswith("Project:std:")
        assert a["kind"] == "make-progress"
        assert a["feasability"] == "nice-to-have"


def test_api_time_plan_associate_with_activities(
    api_url: str,
    api_key: str,
    create_time_plan,
    create_inbox_task,
    associate_inbox_task,
) -> None:
    tp1 = create_time_plan("2024-12-16")
    task = create_inbox_task("Activity To Copy")
    activity = associate_inbox_task(tp1.ref_id, task.ref_id)

    tp2 = create_time_plan("2024-12-23")

    response = requests.post(
        f"{api_url}/v1/time-plans/{tp2.ref_id}/associate-with-activities",
        headers=_headers(api_key),
        json={
            "ref_id": tp2.ref_id,
            "other_time_plan_ref_id": tp1.ref_id,
            "activity_ref_ids": [activity.ref_id],
            "kind": "finish",
            "feasability": "stretch",
            "override_existing_dates": False,
        },
        timeout=10,
    )
    assert response.status_code == 200

    activities = response.json()["new_time_plan_activities"]
    assert len(activities) == 1
    assert activities[0]["target"] == f"InboxTask:std:{task.ref_id}"
    assert activities[0]["time_plan_ref_id"] == tp2.ref_id
    assert activities[0]["kind"] == "finish"
    assert activities[0]["feasability"] == "stretch"


def test_api_time_plan_activity_find_for_target_inbox_task(
    api_url: str,
    api_key: str,
    create_time_plan,
    create_inbox_task,
    associate_inbox_task,
) -> None:
    tp = create_time_plan("2024-11-18")
    task = create_inbox_task("Find Target Inbox Task")
    associate_inbox_task(tp.ref_id, task.ref_id)

    target_link = f"InboxTask:std:{task.ref_id}"
    response = requests.get(
        f"{api_url}/v1/time-plans/{tp.ref_id}/activities/find-for-target"
        f"?target={quote(target_link, safe='')}&allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    entries = response.json()["entries"]
    assert len(entries) >= 1
    match = [e for e in entries if e["time_plan_activity"]["target"] == target_link]
    assert len(match) == 1
    assert match[0]["time_plan_activity"]["target"] == target_link
    assert match[0]["time_plan"]["ref_id"] == tp.ref_id


def test_api_time_plan_activity_find_for_target_project(
    api_url: str,
    api_key: str,
    create_time_plan,
    create_project,
    associate_project,
) -> None:
    tp = create_time_plan("2024-11-25")
    bp = create_project("Find Target Project")
    associate_project(tp.ref_id, bp.ref_id)

    target_link = f"Project:std:{bp.ref_id}"
    response = requests.get(
        f"{api_url}/v1/time-plans/{tp.ref_id}/activities/find-for-target"
        f"?target={quote(target_link, safe='')}&allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    entries = response.json()["entries"]
    assert len(entries) >= 1
    match = [e for e in entries if e["time_plan_activity"]["target"] == target_link]
    assert len(match) == 1
    assert match[0]["time_plan_activity"]["target"] == target_link
    assert match[0]["time_plan"]["ref_id"] == tp.ref_id


def test_api_time_plan_activity_load(
    api_url: str,
    api_key: str,
    create_time_plan,
    create_inbox_task,
    associate_inbox_task,
) -> None:
    tp = create_time_plan("2024-10-07")
    task = create_inbox_task("Activity Load Task")
    activity = associate_inbox_task(tp.ref_id, task.ref_id)

    response = requests.get(
        f"{api_url}/v1/time-plans/{tp.ref_id}/activities/{activity.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    act = response.json()["time_plan_activity"]
    assert act["ref_id"] == activity.ref_id
    assert act["target"] == f"InboxTask:std:{task.ref_id}"
    assert act["kind"] == "finish"
    assert act["feasability"] == "must-do"


def test_api_time_plan_activity_update(
    api_url: str,
    api_key: str,
    create_time_plan,
    create_inbox_task,
    associate_inbox_task,
) -> None:
    tp = create_time_plan("2024-10-14")
    task = create_inbox_task("Activity Update Task")
    activity = associate_inbox_task(tp.ref_id, task.ref_id)

    response = requests.put(
        f"{api_url}/v1/time-plans/{tp.ref_id}/activities/{activity.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": activity.ref_id,
            "kind": {"should_change": True, "value": "make-progress"},
            "feasability": {"should_change": True, "value": "nice-to-have"},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/time-plans/{tp.ref_id}/activities/{activity.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["time_plan_activity"]["kind"] == "make-progress"
    assert response2.json()["time_plan_activity"]["feasability"] == "nice-to-have"


def test_api_time_plan_activity_archive(
    api_url: str,
    api_key: str,
    create_time_plan,
    create_inbox_task,
    associate_inbox_task,
) -> None:
    tp = create_time_plan("2024-10-21")
    task = create_inbox_task("Activity Archive Task")
    activity = associate_inbox_task(tp.ref_id, task.ref_id)

    response = requests.delete(
        f"{api_url}/v1/time-plans/{tp.ref_id}/activities/{activity.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/time-plans/{tp.ref_id}/activities/{activity.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["time_plan_activity"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/time-plans/{tp.ref_id}/activities/{activity.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_time_plan_activity_remove(
    api_url: str,
    api_key: str,
    create_time_plan,
    create_inbox_task,
    associate_inbox_task,
) -> None:
    tp = create_time_plan("2024-10-28")
    task = create_inbox_task("Activity Remove Task")
    activity = associate_inbox_task(tp.ref_id, task.ref_id)

    response = requests.delete(
        f"{api_url}/v1/time-plans/{tp.ref_id}/activities/{activity.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/time-plans/{tp.ref_id}/activities/{activity.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


@pytest.fixture()
def another_user_with_time_plans_enabled(
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
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TIME_PLANS, value=True
            ),
        )
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PROJECTS, value=True),
        )
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=True
            ),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=False
            ),
        )
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.PROJECTS, value=False
            ),
        )
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TIME_PLANS, value=False
            ),
        )


@pytest.fixture()
def grant_time_plan_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_time_plans_enabled: AnotherUserAndWorkspace,
):
    def _grant(time_plan: TimePlan, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.TIMEPLAN,
                entity_ref_id=time_plan.ref_id,
                user_ref_ids=[
                    another_user_with_time_plans_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_time_plans_enabled.api_key

    return _grant


def _time_plan_change_time_config_body(
    ref_id: str, *, right_now: str, period: str
) -> dict[str, object]:
    return {
        "ref_id": ref_id,
        "right_now": {"should_change": True, "value": right_now},
        "period": {"should_change": True, "value": period},
        "chapter_ref_ids": {"should_change": False},
        "aspect_ref_ids": {"should_change": False},
        "goal_ref_ids": {"should_change": False},
    }


def _assert_other_user_cannot_access_time_plan(
    api_url: str,
    *,
    time_plan_ref_id: str,
    owner_api_key: str,
    other_api_key: str,
) -> None:
    assert other_api_key != owner_api_key

    owner_load_response = requests.get(
        f"{api_url}/v1/time-plans/{time_plan_ref_id}?allow_archived=false",
        headers=_headers(owner_api_key),
        timeout=10,
    )
    assert owner_load_response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/time-plans/{time_plan_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    change_time_config_response = requests.post(
        f"{api_url}/v1/time-plans/{time_plan_ref_id}/change-time-config",
        headers=_headers(other_api_key),
        json=_time_plan_change_time_config_body(
            time_plan_ref_id, right_now="2025-01-13", period="monthly"
        ),
        timeout=10,
    )
    _assert_acl_denied(change_time_config_response)

    archive_response = requests.delete(
        f"{api_url}/v1/time-plans/{time_plan_ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_time_plan_acl_reader_can_read_but_not_update_or_archive(
    api_url: str,
    api_key: str,
    create_time_plan,
    grant_time_plan_access,
    another_user_with_time_plans_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_time_plan("2025-01-06")
    other_api_key = another_user_with_time_plans_enabled.api_key

    _assert_other_user_cannot_access_time_plan(
        api_url,
        time_plan_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=other_api_key,
    )

    other_api_key = grant_time_plan_access(created, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/time-plans/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    time_plan = load_response.json()["time_plan"]
    assert time_plan["ref_id"] == created.ref_id
    assert load_response.json()["owner"]["ref_id"] is not None
    assert load_response.json()["access_status"]["access_level"] == "reader"

    change_time_config_response = requests.post(
        f"{api_url}/v1/time-plans/{created.ref_id}/change-time-config",
        headers=_headers(other_api_key),
        json=_time_plan_change_time_config_body(
            created.ref_id, right_now="2025-01-13", period="monthly"
        ),
        timeout=10,
    )
    _assert_acl_denied(change_time_config_response)

    archive_response = requests.delete(
        f"{api_url}/v1/time-plans/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_time_plan_acl_writer_can_read_and_update(
    api_url: str,
    create_time_plan,
    grant_time_plan_access,
) -> None:
    created = create_time_plan("2025-01-20")
    other_api_key = grant_time_plan_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/time-plans/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    change_time_config_response = requests.post(
        f"{api_url}/v1/time-plans/{created.ref_id}/change-time-config",
        headers=_headers(other_api_key),
        json=_time_plan_change_time_config_body(
            created.ref_id, right_now="2025-01-27", period="monthly"
        ),
        timeout=10,
    )
    assert change_time_config_response.status_code == 200

    verify_response = requests.get(
        f"{api_url}/v1/time-plans/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert verify_response.status_code == 200
    time_plan = verify_response.json()["time_plan"]
    assert time_plan["right_now"] == "2025-01-27"
    assert time_plan["period"] == "monthly"


def test_api_time_plan_acl_writer_can_read_and_archive(
    api_url: str,
    create_time_plan,
    grant_time_plan_access,
) -> None:
    created = create_time_plan("2025-02-03")
    other_api_key = grant_time_plan_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/time-plans/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200

    archive_response = requests.delete(
        f"{api_url}/v1/time-plans/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    archived_response = requests.get(
        f"{api_url}/v1/time-plans/{created.ref_id}?allow_archived=true",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archived_response.status_code == 200
    assert archived_response.json()["time_plan"]["archived"] is True


def test_api_time_plan_acl_z_denied_without_grant(
    api_url: str,
    api_key: str,
    create_time_plan,
    another_user_with_time_plans_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_time_plan("2025-02-10")
    _assert_other_user_cannot_access_time_plan(
        api_url,
        time_plan_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=another_user_with_time_plans_enabled.api_key,
    )


def test_api_time_plan_activity_acl(
    api_url: str,
    create_time_plan,
    create_inbox_task,
    associate_inbox_task,
    another_user_with_time_plans_enabled: AnotherUserAndWorkspace,
) -> None:
    tp = create_time_plan("2025-01-13")
    task = create_inbox_task("ACL Activity Task")
    activity = associate_inbox_task(tp.ref_id, task.ref_id)
    activity_url = f"{api_url}/v1/time-plans/{tp.ref_id}/activities/{activity.ref_id}"

    other_api_key = another_user_with_time_plans_enabled.api_key

    load_response = requests.get(
        f"{activity_url}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        activity_url,
        headers=_headers(other_api_key),
        json={
            "ref_id": activity.ref_id,
            "kind": {"should_change": True, "value": "make-progress"},
            "feasability": {"should_change": True, "value": "nice-to-have"},
        },
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        activity_url,
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_time_plan_activity_acl_reader_can_read_after_plan_grant(
    api_url: str,
    create_time_plan,
    create_inbox_task,
    associate_inbox_task,
    grant_time_plan_access,
) -> None:
    tp = create_time_plan("2025-02-17")
    task = create_inbox_task("Shared Activity Task")
    activity = associate_inbox_task(tp.ref_id, task.ref_id)
    other_api_key = grant_time_plan_access(tp, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/time-plans/{tp.ref_id}/activities/{activity.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["time_plan_activity"]["ref_id"] == activity.ref_id

    update_response = requests.put(
        f"{api_url}/v1/time-plans/{tp.ref_id}/activities/{activity.ref_id}",
        headers=_headers(other_api_key),
        json={
            "ref_id": activity.ref_id,
            "kind": {"should_change": True, "value": "make-progress"},
            "feasability": {"should_change": True, "value": "nice-to-have"},
        },
        timeout=10,
    )
    _assert_acl_denied(update_response)


# --- Time plan questions ---


def test_api_time_plan_question_create_find_and_load(
    logged_in_client: AuthenticatedClient, create_question
) -> None:
    question = create_question("What went well?")

    find_result = get_parsed_from_response(
        TimePlanQuestionFindResult,
        time_plan_question_find_sync(
            client=logged_in_client,
            body=TimePlanQuestionFindArgs(allow_archived=False),
        ),
    )
    assert any(entry.ref_id == question.ref_id for entry in find_result.questions)
    assert question.ref_id in find_result.order_of_questions[RecurringTaskPeriod.WEEKLY]

    loaded = get_parsed_from_response(
        TimePlanQuestionLoadResult,
        time_plan_question_load_sync(
            client=logged_in_client,
            body=TimePlanQuestionLoadArgs(ref_id=question.ref_id, allow_archived=False),
        ),
    )
    assert loaded.time_plan_question.name == "What went well?"
    assert loaded.time_plan_question.period == RecurringTaskPeriod.WEEKLY


def test_api_time_plan_question_update_archive_and_remove(
    logged_in_client: AuthenticatedClient, create_question
) -> None:
    question = create_question("What should I change?")

    update_result = time_plan_question_update_sync(
        client=logged_in_client,
        body=TimePlanQuestionUpdateArgs(
            ref_id=question.ref_id,
            name=TimePlanQuestionUpdateArgsName(
                should_change=True, value="What will I change?"
            ),
        ),
    )
    assert update_result.status_code == 200

    loaded = get_parsed_from_response(
        TimePlanQuestionLoadResult,
        time_plan_question_load_sync(
            client=logged_in_client,
            body=TimePlanQuestionLoadArgs(ref_id=question.ref_id, allow_archived=False),
        ),
    )
    assert loaded.time_plan_question.name == "What will I change?"

    archive_result = time_plan_question_archive_sync(
        client=logged_in_client,
        body=TimePlanQuestionArchiveArgs(ref_id=question.ref_id),
    )
    assert archive_result.status_code == 200

    find_result = get_parsed_from_response(
        TimePlanQuestionFindResult,
        time_plan_question_find_sync(
            client=logged_in_client,
            body=TimePlanQuestionFindArgs(allow_archived=False),
        ),
    )
    assert all(entry.ref_id != question.ref_id for entry in find_result.questions)

    remove_result = time_plan_question_remove_sync(
        client=logged_in_client,
        body=TimePlanQuestionRemoveArgs(ref_id=question.ref_id),
    )
    assert remove_result.status_code == 200


def test_api_time_plan_question_reorder(
    logged_in_client: AuthenticatedClient, create_question
) -> None:
    first = create_question("First question")
    second = create_question("Second question")

    find_before = get_parsed_from_response(
        TimePlanQuestionFindResult,
        time_plan_question_find_sync(
            client=logged_in_client,
            body=TimePlanQuestionFindArgs(
                allow_archived=False,
                filter_periods=[RecurringTaskPeriod.WEEKLY],
            ),
        ),
    )
    current_order = list(find_before.order_of_questions[RecurringTaskPeriod.WEEKLY])
    new_order = [second.ref_id, first.ref_id] + [
        ref_id
        for ref_id in current_order
        if ref_id not in {first.ref_id, second.ref_id}
    ]

    reorder_result = time_plan_question_reorder_sync(
        client=logged_in_client,
        body=TimePlanQuestionReorderArgs(
            period=RecurringTaskPeriod.WEEKLY,
            order_of_questions=new_order,
        ),
    )
    assert reorder_result.status_code == 200

    find_result = get_parsed_from_response(
        TimePlanQuestionFindResult,
        time_plan_question_find_sync(
            client=logged_in_client,
            body=TimePlanQuestionFindArgs(
                allow_archived=False,
                filter_periods=[RecurringTaskPeriod.WEEKLY],
            ),
        ),
    )
    assert find_result.order_of_questions[RecurringTaskPeriod.WEEKLY][:2] == [
        second.ref_id,
        first.ref_id,
    ]


def test_api_time_plan_create_includes_selected_questions_in_note(
    logged_in_client: AuthenticatedClient, create_question
) -> None:
    first = create_question("Wins")
    second = create_question("Lessons")
    create_question("Ignored")

    result = get_parsed_from_response(
        TimePlanCreateResult,
        time_plan_create_sync(
            client=logged_in_client,
            body=TimePlanCreateArgs(
                right_now="2025-03-03",
                period=RecurringTaskPeriod.WEEKLY,
                question_ref_ids=[first.ref_id, second.ref_id],
            ),
        ),
    )

    headings = [
        block.text
        for block in result.new_note.content
        if isinstance(block, HeadingBlock)
    ]
    paragraphs = [
        block for block in result.new_note.content if isinstance(block, ParagraphBlock)
    ]
    assert headings == ["Wins", "Lessons"]
    assert len(paragraphs) == 2
    assert all(block.text == "" for block in paragraphs)


def test_api_time_plan_create_defaults_to_all_period_questions(
    logged_in_client: AuthenticatedClient, create_question
) -> None:
    first = create_question("Default all first")
    second = create_question("Default all second")

    result = get_parsed_from_response(
        TimePlanCreateResult,
        time_plan_create_sync(
            client=logged_in_client,
            body=TimePlanCreateArgs(
                right_now="2025-03-10",
                period=RecurringTaskPeriod.WEEKLY,
            ),
        ),
    )

    headings = [
        block.text
        for block in result.new_note.content
        if isinstance(block, HeadingBlock)
    ]
    assert first.name in headings
    assert second.name in headings
    assert headings.index(first.name) < headings.index(second.name)


def test_api_time_plan_create_with_no_questions_selected(
    logged_in_client: AuthenticatedClient, create_question
) -> None:
    create_question("Should not appear in empty selection")

    result = get_parsed_from_response(
        TimePlanCreateResult,
        time_plan_create_sync(
            client=logged_in_client,
            body=TimePlanCreateArgs(
                right_now="2025-03-17",
                period=RecurringTaskPeriod.WEEKLY,
                question_ref_ids=[],
            ),
        ),
    )

    headings = [
        block.text
        for block in result.new_note.content
        if isinstance(block, HeadingBlock)
    ]
    assert headings == []
    assert result.new_note.content == []


def test_api_time_plan_generate_includes_period_questions_in_note(
    logged_in_client: AuthenticatedClient, create_question
) -> None:
    question = create_question("Generated weekly prompt")

    gen_result = gen_do_sync(
        client=logged_in_client,
        body=GenDoArgs(
            gen_even_if_not_modified=True,
            today="2098-06-01",
            gen_targets=[SyncTarget.TIME_PLANS],
            period=[RecurringTaskPeriod.WEEKLY],
        ),
    )
    assert gen_result.status_code == 200

    found = get_parsed_from_response(
        TimePlanLoadForDateAndPeriodResult,
        time_plan_load_for_date_and_period_sync(
            client=logged_in_client,
            body=TimePlanLoadForDateAndPeriodArgs(
                right_now="2098-06-04",
                period=RecurringTaskPeriod.WEEKLY,
                allow_archived=False,
            ),
        ),
    )
    time_plan = found.time_plan
    assert time_plan is not None
    assert not isinstance(time_plan, Unset)

    loaded = get_parsed_from_response(
        TimePlanLoadResult,
        time_plan_load_sync(
            client=logged_in_client,
            body=TimePlanLoadArgs(ref_id=time_plan.ref_id, allow_archived=False),
        ),
    )
    headings = [
        block.text for block in loaded.note.content if isinstance(block, HeadingBlock)
    ]
    assert question.name in headings
    paragraphs = [
        block for block in loaded.note.content if isinstance(block, ParagraphBlock)
    ]
    assert len(paragraphs) == len(headings)
    assert all(block.text == "" for block in paragraphs)


def test_api_time_plan_question_rest_create_and_find(
    api_url: str, api_key: str
) -> None:
    create_response = requests.post(
        f"{api_url}/v1/time-plans/questions",
        headers=_headers(api_key),
        json={"name": "REST question", "period": "weekly"},
        timeout=10,
    )
    assert create_response.status_code == 200
    created = create_response.json()["new_time_plan_question"]
    assert created["name"] == "REST question"
    assert created["period"] == "weekly"

    find_response = requests.get(
        f"{api_url}/v1/time-plans/questions?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert find_response.status_code == 200
    ref_ids = [question["ref_id"] for question in find_response.json()["questions"]]
    assert created["ref_id"] in ref_ids


# --- Auth test ---


def test_api_time_plan_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/time-plans?allow_archived=false&include_notes=false&include_planning_tasks=false&include_life_plan_ref_ids=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401
