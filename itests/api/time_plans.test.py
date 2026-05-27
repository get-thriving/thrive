"""Tests for the API for time plans."""

from collections.abc import Iterator
from urllib.parse import quote

import pytest
import requests
from jupiter_webapi_client.api.big_plans.big_plan_create import (
    sync_detailed as big_plan_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_big_plan_with_plan import (
    sync_detailed as time_plan_associate_big_plan_with_plan_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_inbox_task_with_plan import (
    sync_detailed as time_plan_associate_inbox_task_with_plan_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_create import (
    sync_detailed as time_plan_create_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.big_plan import BigPlan
from jupiter_webapi_client.models.big_plan_create_args import BigPlanCreateArgs
from jupiter_webapi_client.models.big_plan_create_result import BigPlanCreateResult
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.inbox_task import InboxTask
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.time_plan import TimePlan
from jupiter_webapi_client.models.time_plan_activity import TimePlanActivity
from jupiter_webapi_client.models.time_plan_activity_feasability import (
    TimePlanActivityFeasability,
)
from jupiter_webapi_client.models.time_plan_activity_kind import TimePlanActivityKind
from jupiter_webapi_client.models.time_plan_associate_big_plan_with_plan_args import (
    TimePlanAssociateBigPlanWithPlanArgs,
)
from jupiter_webapi_client.models.time_plan_associate_big_plan_with_plan_result import (
    TimePlanAssociateBigPlanWithPlanResult,
)
from jupiter_webapi_client.models.time_plan_associate_inbox_task_with_plan_args import (
    TimePlanAssociateInboxTaskWithPlanArgs,
)
from jupiter_webapi_client.models.time_plan_associate_inbox_task_with_plan_result import (
    TimePlanAssociateInboxTaskWithPlanResult,
)
from jupiter_webapi_client.models.time_plan_create_args import TimePlanCreateArgs
from jupiter_webapi_client.models.time_plan_create_result import TimePlanCreateResult
from jupiter_webapi_client.models.todo_task_create_args import TodoTaskCreateArgs
from jupiter_webapi_client.models.todo_task_create_result import TodoTaskCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

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
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=True
            ),
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
                feature=WorkspaceFeature.BIG_PLANS, value=False
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
def create_big_plan(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> BigPlan:
        result = big_plan_create_sync(
            client=logged_in_client,
            body=BigPlanCreateArgs(
                name=name,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        )
        return get_parsed_from_response(BigPlanCreateResult, result).new_big_plan

    return _create


@pytest.fixture()
def associate_big_plan(logged_in_client: AuthenticatedClient):
    def _associate(time_plan_ref_id: str, big_plan_ref_id: str) -> TimePlanActivity:
        result = time_plan_associate_big_plan_with_plan_sync(
            client=logged_in_client,
            body=TimePlanAssociateBigPlanWithPlanArgs(
                big_plan_ref_id=big_plan_ref_id,
                time_plan_ref_ids=[time_plan_ref_id],
                kind=TimePlanActivityKind.MAKE_PROGRESS,
                feasability=TimePlanActivityFeasability.MUST_DO,
            ),
        )
        return get_parsed_from_response(
            TimePlanAssociateBigPlanWithPlanResult, result
        ).new_time_plan_activities[0]

    return _associate


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


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


def test_api_time_plan_associate_big_plan(
    api_url: str,
    api_key: str,
    create_time_plan,
    create_big_plan,
) -> None:
    tp = create_time_plan("2024-11-11")
    bp = create_big_plan("Associate Big Plan")

    response = requests.post(
        f"{api_url}/v1/time-plans/{tp.ref_id}/associate-big-plan",
        headers=_headers(api_key),
        json={
            "big_plan_ref_id": bp.ref_id,
            "time_plan_ref_ids": [tp.ref_id],
            "kind": "make-progress",
            "feasability": "nice-to-have",
        },
        timeout=10,
    )
    assert response.status_code == 200

    activities = response.json()["new_time_plan_activities"]
    assert len(activities) == 1
    assert activities[0]["target"] == f"BigPlan:std:{bp.ref_id}"
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


def test_api_time_plan_associate_with_big_plans(
    api_url: str,
    api_key: str,
    create_time_plan,
    create_big_plan,
) -> None:
    tp = create_time_plan("2024-12-09")
    bp1 = create_big_plan("Batch Big Plan 1")
    bp2 = create_big_plan("Batch Big Plan 2")

    response = requests.post(
        f"{api_url}/v1/time-plans/{tp.ref_id}/associate-with-big-plans",
        headers=_headers(api_key),
        json={
            "ref_id": tp.ref_id,
            "big_plan_ref_ids": [bp1.ref_id, bp2.ref_id],
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
    assert f"BigPlan:std:{bp1.ref_id}" in targets
    assert f"BigPlan:std:{bp2.ref_id}" in targets
    for a in activities:
        assert a["target"].startswith("BigPlan:std:")
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


def test_api_time_plan_activity_find_for_target_big_plan(
    api_url: str,
    api_key: str,
    create_time_plan,
    create_big_plan,
    associate_big_plan,
) -> None:
    tp = create_time_plan("2024-11-25")
    bp = create_big_plan("Find Target Big Plan")
    associate_big_plan(tp.ref_id, bp.ref_id)

    target_link = f"BigPlan:std:{bp.ref_id}"
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


# --- Auth test ---


def test_api_time_plan_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/time-plans?allow_archived=false&include_notes=false&include_planning_tasks=false&include_life_plan_ref_ids=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401
