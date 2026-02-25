"""Tests for the API for habits."""

import pytest
import requests
from jupiter_webapi_client.api.habits.habit_archive import (
    sync_detailed as habit_archive_sync,
)
from jupiter_webapi_client.api.habits.habit_create import (
    sync_detailed as habit_create_sync,
)
from jupiter_webapi_client.api.habits.habit_suspend import (
    sync_detailed as habit_suspend_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.habit import Habit
from jupiter_webapi_client.models.habit_archive_args import HabitArchiveArgs
from jupiter_webapi_client.models.habit_create_args import HabitCreateArgs
from jupiter_webapi_client.models.habit_create_result import HabitCreateResult
from jupiter_webapi_client.models.habit_suspend_args import HabitSuspendArgs
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod

from itests.helpers import get_parsed_from_response


@pytest.fixture()
def create_habit(logged_in_client: AuthenticatedClient):
    def _create(
        name: str, period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY
    ) -> Habit:
        result = habit_create_sync(
            client=logged_in_client,
            body=HabitCreateArgs(
                name=name,
                period=period,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        )
        return get_parsed_from_response(HabitCreateResult, result).new_habit

    return _create


@pytest.fixture()
def archive_habit(logged_in_client: AuthenticatedClient):
    def _archive(ref_id: str) -> None:
        habit_archive_sync(
            client=logged_in_client,
            body=HabitArchiveArgs(ref_id=ref_id),
        )

    return _archive


@pytest.fixture()
def suspend_habit(logged_in_client: AuthenticatedClient):
    def _suspend(ref_id: str) -> None:
        habit_suspend_sync(
            client=logged_in_client,
            body=HabitSuspendArgs(ref_id=ref_id),
        )

    return _suspend


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def test_api_habit_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/habits",
        headers=_headers(api_key),
        json={
            "name": "Morning Run",
            "period": "daily",
            "is_key": True,
            "eisen": "important",
            "difficulty": "hard",
        },
        timeout=10,
    )
    assert response.status_code == 200

    habit = response.json()["new_habit"]
    assert habit["name"] == "Morning Run"
    assert habit["gen_params"]["period"] == "daily"
    assert habit["is_key"] is True
    assert habit["gen_params"]["eisen"] == "important"
    assert habit["gen_params"]["difficulty"] == "hard"
    assert habit["archived"] is False
    assert "ref_id" in habit


def test_api_habit_load(api_url: str, api_key: str, create_habit) -> None:
    created = create_habit("Load Habit")

    response = requests.get(
        f"{api_url}/v1/habits/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    habit = response.json()["habit"]
    assert habit["ref_id"] == created.ref_id
    assert habit["name"] == "Load Habit"


def test_api_habit_find(api_url: str, api_key: str, create_habit) -> None:
    create_habit("Habit Alpha")
    create_habit("Habit Beta")

    response = requests.get(
        f"{api_url}/v1/habits?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [e["habit"]["name"] for e in response.json()["entries"]]
    assert "Habit Alpha" in names
    assert "Habit Beta" in names


def test_api_habit_update(api_url: str, api_key: str, create_habit) -> None:
    created = create_habit("Old Habit")

    response = requests.put(
        f"{api_url}/v1/habits/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "New Habit"},
            "period": {"should_change": True, "value": "daily"},
            "is_key": {"should_change": False},
            "eisen": {"should_change": False},
            "difficulty": {"should_change": False},
            "actionable_from_day": {"should_change": False},
            "actionable_from_month": {"should_change": False},
            "due_at_day": {"should_change": False},
            "due_at_month": {"should_change": False},
            "skip_rule": {"should_change": False},
            "repeats_strategy": {"should_change": False},
            "repeats_in_period_count": {"should_change": False},
            "project_ref_id": {"should_change": False},
            "chapter_ref_id": {"should_change": False},
            "goal_ref_id": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/habits/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["habit"]["name"] == "New Habit"


def test_api_habit_archive(api_url: str, api_key: str, create_habit) -> None:
    created = create_habit("Archive Habit")

    response = requests.delete(
        f"{api_url}/v1/habits/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response1 = requests.get(
        f"{api_url}/v1/habits/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response1.status_code == 502
    assert response1.json()["status"] == 404

    response2 = requests.get(
        f"{api_url}/v1/habits/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["habit"]["archived"] is True


def test_api_habit_remove(api_url: str, api_key: str, create_habit) -> None:
    created = create_habit("Remove Habit")

    response = requests.delete(
        f"{api_url}/v1/habits/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/habits/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_habit_suspend(api_url: str, api_key: str, create_habit) -> None:
    created = create_habit("Suspend Habit")

    response = requests.post(
        f"{api_url}/v1/habits/{created.ref_id}/suspend",
        headers=_headers(api_key),
        json={"ref_id": created.ref_id},
        timeout=10,
    )
    assert response.status_code == 200


def test_api_habit_unsuspend(
    api_url: str, api_key: str, create_habit, suspend_habit
) -> None:
    created = create_habit("Unsuspend Habit")
    suspend_habit(created.ref_id)

    response = requests.post(
        f"{api_url}/v1/habits/{created.ref_id}/unsuspend",
        headers=_headers(api_key),
        json={"ref_id": created.ref_id},
        timeout=10,
    )
    assert response.status_code == 200


def test_api_habit_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/habits?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401
