"""Tests for the API for habits."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.gen.gen_do import (
    sync_detailed as gen_do_sync,
)
from jupiter_webapi_client.api.habits.habit_archive import (
    sync_detailed as habit_archive_sync,
)
from jupiter_webapi_client.api.habits.habit_create import (
    sync_detailed as habit_create_sync,
)
from jupiter_webapi_client.api.habits.habit_stack_create import (
    sync_detailed as habit_stack_create_sync,
)
from jupiter_webapi_client.api.habits.habit_suspend import (
    sync_detailed as habit_suspend_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.gen_do_args import GenDoArgs
from jupiter_webapi_client.models.habit import Habit
from jupiter_webapi_client.models.habit_archive_args import HabitArchiveArgs
from jupiter_webapi_client.models.habit_create_args import HabitCreateArgs
from jupiter_webapi_client.models.habit_create_result import HabitCreateResult
from jupiter_webapi_client.models.habit_stack import HabitStack
from jupiter_webapi_client.models.habit_stack_create_args import HabitStackCreateArgs
from jupiter_webapi_client.models.habit_stack_create_result import (
    HabitStackCreateResult,
)
from jupiter_webapi_client.models.habit_suspend_args import HabitSuspendArgs
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.sync_target import SyncTarget
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.api.conftest import AnotherUserAndWorkspace
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
def create_habit_stack(logged_in_client: AuthenticatedClient):
    def _create(
        name: str,
        habit_ref_ids: list[str] | None = None,
        period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY,
    ) -> HabitStack:
        result = habit_stack_create_sync(
            client=logged_in_client,
            body=HabitStackCreateArgs(
                name=name,
                period=period,
                habit_ref_ids=habit_ref_ids or [],
            ),
        )
        return get_parsed_from_response(HabitStackCreateResult, result).new_habit_stack

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


_ACL_DENIED_REASON = "You are not allowed to access this entity"


def _assert_acl_denied(response: requests.Response) -> None:
    assert response.status_code == 502
    body = response.json()
    assert body["status"] == 401
    assert body["response"]["reason"] == _ACL_DENIED_REASON


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


def test_api_habit_create_with_stack(api_url: str, api_key: str) -> None:
    stack_response = requests.post(
        f"{api_url}/v1/habits/stacks",
        headers=_headers(api_key),
        json={
            "name": "Morning Stack",
            "period": "daily",
            "habit_ref_ids": [],
        },
        timeout=10,
    )
    assert stack_response.status_code == 200
    stack = stack_response.json()["new_habit_stack"]

    response = requests.post(
        f"{api_url}/v1/habits",
        headers=_headers(api_key),
        json={
            "name": "Stacked Run",
            "period": "daily",
            "is_key": False,
            "eisen": "regular",
            "difficulty": "easy",
            "stack_ref_id": stack["ref_id"],
        },
        timeout=10,
    )
    assert response.status_code == 200

    habit = response.json()["new_habit"]
    assert habit["stack_ref_id"] == stack["ref_id"]


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
            "aspect_ref_id": {"should_change": False},
            "chapter_ref_id": {"should_change": False},
            "goal_ref_id": {"should_change": False},
            "stack_ref_id": {"should_change": False},
            "schedulability": {"should_change": False},
            "scheduling_event_duration_mins": {"should_change": False},
            "scheduling_event_count": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    assert response.json()["updated_habit"]["name"] == "New Habit"

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


@pytest.fixture()
def another_user_with_habits_enabled(
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
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.HABITS, value=True),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.HABITS, value=False),
        )


@pytest.fixture()
def grant_habit_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_habits_enabled: AnotherUserAndWorkspace,
):
    def _grant(habit: Habit, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.HABIT,
                entity_ref_id=habit.ref_id,
                user_ref_ids=[
                    another_user_with_habits_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_habits_enabled.api_key

    return _grant


def _update_payload(ref_id: str, *, name: str | None = None) -> dict[str, object]:
    return {
        "ref_id": ref_id,
        "name": (
            {"should_change": True, "value": name}
            if name is not None
            else {"should_change": False}
        ),
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
        "aspect_ref_id": {"should_change": False},
        "chapter_ref_id": {"should_change": False},
        "goal_ref_id": {"should_change": False},
        "stack_ref_id": {"should_change": False},
        "schedulability": {"should_change": False},
        "scheduling_event_duration_mins": {"should_change": False},
        "scheduling_event_count": {"should_change": False},
    }


def _stack_update_payload(
    ref_id: str,
    *,
    name: str | None = None,
    habit_ref_ids: list[str] | None = None,
) -> dict[str, object]:
    return {
        "ref_id": ref_id,
        "name": (
            {"should_change": True, "value": name}
            if name is not None
            else {"should_change": False}
        ),
        "habit_ref_ids": (
            {"should_change": True, "value": habit_ref_ids}
            if habit_ref_ids is not None
            else {"should_change": False}
        ),
        "aspect_ref_id": {"should_change": False},
        "chapter_ref_id": {"should_change": False},
        "goal_ref_id": {"should_change": False},
        "schedulability": {"should_change": False},
        "scheduling_event_duration_mins": {"should_change": False},
        "scheduling_event_count": {"should_change": False},
    }


def _assert_other_user_cannot_access_habit(
    api_url: str,
    *,
    habit_ref_id: str,
    owner_api_key: str,
    other_api_key: str,
) -> None:
    assert other_api_key != owner_api_key

    owner_load_response = requests.get(
        f"{api_url}/v1/habits/{habit_ref_id}?allow_archived=false",
        headers=_headers(owner_api_key),
        timeout=10,
    )
    assert owner_load_response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/habits/{habit_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        f"{api_url}/v1/habits/{habit_ref_id}",
        headers=_headers(other_api_key),
        json=_update_payload(habit_ref_id, name="Hacked Habit"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/habits/{habit_ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_habit_acl_reader_can_read_but_not_update_or_archive(
    api_url: str,
    api_key: str,
    create_habit,
    grant_habit_access,
    another_user_with_habits_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_habit("Reader ACL Habit")
    other_api_key = another_user_with_habits_enabled.api_key

    _assert_other_user_cannot_access_habit(
        api_url,
        habit_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=other_api_key,
    )

    other_api_key = grant_habit_access(created, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/habits/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["habit"]["ref_id"] == created.ref_id
    assert load_response.json()["owner"]["ref_id"] is not None
    assert load_response.json()["access_status"]["access_level"] == "reader"

    update_response = requests.put(
        f"{api_url}/v1/habits/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_update_payload(created.ref_id, name="Reader Cannot Update"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/habits/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_habit_acl_writer_can_read_and_update(
    api_url: str,
    create_habit,
    grant_habit_access,
) -> None:
    created = create_habit("Writer Update Habit")
    other_api_key = grant_habit_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/habits/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    update_response = requests.put(
        f"{api_url}/v1/habits/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_update_payload(created.ref_id, name="Writer Updated Habit"),
        timeout=10,
    )
    assert update_response.status_code == 200

    verify_response = requests.get(
        f"{api_url}/v1/habits/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert verify_response.status_code == 200
    assert verify_response.json()["habit"]["name"] == "Writer Updated Habit"


def test_api_habit_acl_writer_can_read_and_archive(
    api_url: str,
    create_habit,
    grant_habit_access,
) -> None:
    created = create_habit("Writer Archive Habit")
    other_api_key = grant_habit_access(created, AccessLevel.WRITER)

    archive_response = requests.delete(
        f"{api_url}/v1/habits/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    archived_response = requests.get(
        f"{api_url}/v1/habits/{created.ref_id}?allow_archived=true",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archived_response.status_code == 200
    assert archived_response.json()["habit"]["archived"] is True


def test_api_habit_acl_z_denied_without_grant(
    api_url: str,
    api_key: str,
    create_habit,
    another_user_with_habits_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_habit("Denied ACL Habit")
    _assert_other_user_cannot_access_habit(
        api_url,
        habit_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=another_user_with_habits_enabled.api_key,
    )


def test_api_habit_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/habits?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401


def test_api_habit_stack_create(api_url: str, api_key: str, create_habit) -> None:
    habit = create_habit("Stack Member", RecurringTaskPeriod.WEEKLY)

    response = requests.post(
        f"{api_url}/v1/habits/stacks",
        headers=_headers(api_key),
        json={
            "name": "Morning Stack",
            "period": "weekly",
            "habit_ref_ids": [habit.ref_id],
        },
        timeout=10,
    )
    assert response.status_code == 200
    stack = response.json()["new_habit_stack"]
    assert stack["name"] == "Morning Stack"
    assert stack["period"] == "weekly"

    habit_load = requests.get(
        f"{api_url}/v1/habits/{habit.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert habit_load.status_code == 200
    assert habit_load.json()["habit"]["stack_ref_id"] == stack["ref_id"]


def test_api_habit_stack_create_rejects_period_mismatch(
    api_url: str, api_key: str, create_habit
) -> None:
    habit = create_habit("Daily Member", RecurringTaskPeriod.DAILY)

    response = requests.post(
        f"{api_url}/v1/habits/stacks",
        headers=_headers(api_key),
        json={
            "name": "Weekly Stack",
            "period": "weekly",
            "habit_ref_ids": [habit.ref_id],
        },
        timeout=10,
    )
    assert response.status_code != 200


def test_api_habit_stack_create_rejects_duplicate_habit_ids(
    api_url: str, api_key: str, create_habit
) -> None:
    habit = create_habit("Dup Member", RecurringTaskPeriod.WEEKLY)

    response = requests.post(
        f"{api_url}/v1/habits/stacks",
        headers=_headers(api_key),
        json={
            "name": "Dup Stack",
            "period": "weekly",
            "habit_ref_ids": [habit.ref_id, habit.ref_id],
        },
        timeout=10,
    )
    assert response.status_code != 200


def test_api_habit_stack_find(api_url: str, api_key: str, create_habit_stack) -> None:
    create_habit_stack("Stack Alpha")
    create_habit_stack("Stack Beta")

    response = requests.get(
        f"{api_url}/v1/habits/stacks?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    names = [e["habit_stack"]["name"] for e in response.json()["entries"]]
    assert "Stack Alpha" in names
    assert "Stack Beta" in names


def test_api_habit_stack_update_membership(
    api_url: str, api_key: str, create_habit, create_habit_stack
) -> None:
    habit1 = create_habit("First Member", RecurringTaskPeriod.WEEKLY)
    habit2 = create_habit("Second Member", RecurringTaskPeriod.WEEKLY)
    stack = create_habit_stack("Members Stack", [habit1.ref_id])

    response = requests.put(
        f"{api_url}/v1/habits/stacks/{stack.ref_id}",
        headers=_headers(api_key),
        json=_stack_update_payload(stack.ref_id, habit_ref_ids=[habit2.ref_id]),
        timeout=10,
    )
    assert response.status_code == 200

    load1 = requests.get(
        f"{api_url}/v1/habits/{habit1.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    load2 = requests.get(
        f"{api_url}/v1/habits/{habit2.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load1.json()["habit"]["stack_ref_id"] is None
    assert load2.json()["habit"]["stack_ref_id"] == stack.ref_id


def test_api_habit_stack_archive_clears_membership(
    api_url: str, api_key: str, create_habit, create_habit_stack
) -> None:
    habit = create_habit("Archive Member", RecurringTaskPeriod.WEEKLY)
    stack = create_habit_stack("Archive Stack", [habit.ref_id])

    response = requests.delete(
        f"{api_url}/v1/habits/stacks/{stack.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    habit_load = requests.get(
        f"{api_url}/v1/habits/{habit.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert habit_load.json()["habit"]["stack_ref_id"] is None


def test_api_habit_stack_remove_clears_membership(
    api_url: str, api_key: str, create_habit, create_habit_stack
) -> None:
    habit = create_habit("Remove Member", RecurringTaskPeriod.WEEKLY)
    stack = create_habit_stack("Remove Stack", [habit.ref_id])

    response = requests.delete(
        f"{api_url}/v1/habits/stacks/{stack.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    habit_load = requests.get(
        f"{api_url}/v1/habits/{habit.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert habit_load.json()["habit"]["stack_ref_id"] is None


def test_api_habit_update_cannot_change_period(
    api_url: str, api_key: str, create_habit, create_habit_stack
) -> None:
    habit = create_habit("Period Member", RecurringTaskPeriod.WEEKLY)
    stack = create_habit_stack("Period Stack", [habit.ref_id])

    # Update doesn't take a period, so whether this is rejected or ignored,
    # the habit keeps the one it was created with.
    requests.put(
        f"{api_url}/v1/habits/{habit.ref_id}",
        headers=_headers(api_key),
        json={
            **_update_payload(habit.ref_id),
            "period": {"should_change": True, "value": "daily"},
            "schedulability": {"should_change": False},
            "scheduling_event_duration_mins": {"should_change": False},
            "scheduling_event_count": {"should_change": False},
        },
        timeout=10,
    )

    habit_load = requests.get(
        f"{api_url}/v1/habits/{habit.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert habit_load.json()["habit"]["gen_params"]["period"] == "weekly"
    assert habit_load.json()["habit"]["stack_ref_id"] == stack.ref_id


def test_api_habit_inbox_task_includes_stack(
    api_url: str,
    api_key: str,
    logged_in_client: AuthenticatedClient,
    create_habit,
    create_habit_stack,
) -> None:
    habit = create_habit("Stacked Inbox Habit", RecurringTaskPeriod.DAILY)
    stack = create_habit_stack(
        "Morning Stack", [habit.ref_id], RecurringTaskPeriod.DAILY
    )

    gen_result = gen_do_sync(
        client=logged_in_client,
        body=GenDoArgs(
            gen_even_if_not_modified=True,
            today="2026-09-06",
            gen_targets=[SyncTarget.HABITS],
            period=[RecurringTaskPeriod.DAILY],
            filter_habit_ref_ids=[habit.ref_id],
        ),
    )
    assert gen_result.status_code == 200

    habit_load = requests.get(
        f"{api_url}/v1/habits/{habit.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert habit_load.status_code == 200
    inbox_tasks = habit_load.json()["inbox_tasks"]
    assert len(inbox_tasks) > 0
    inbox_task_ref_id = inbox_tasks[0]["ref_id"]

    find_response = requests.get(
        f"{api_url}/v1/common/inbox-tasks?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert find_response.status_code == 200
    entry = next(
        e
        for e in find_response.json()["entries"]
        if e["inbox_task"]["ref_id"] == inbox_task_ref_id
    )
    assert entry["habit"]["ref_id"] == habit.ref_id
    assert entry["habit_stack"]["ref_id"] == stack.ref_id
    assert entry["habit_stack"]["name"] == "Morning Stack"

    load_response = requests.get(
        f"{api_url}/v1/common/inbox-tasks/{inbox_task_ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    loaded = load_response.json()
    assert loaded["habit"]["ref_id"] == habit.ref_id
    assert loaded["habit_stack"]["ref_id"] == stack.ref_id
    assert loaded["habit_stack"]["name"] == "Morning Stack"


@pytest.fixture()
def grant_habit_stack_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_habits_enabled: AnotherUserAndWorkspace,
):
    def _grant(stack: HabitStack, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.HABITSTACK,
                entity_ref_id=stack.ref_id,
                user_ref_ids=[
                    another_user_with_habits_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_habits_enabled.api_key

    return _grant


def _assert_other_user_cannot_access_habit_stack(
    api_url: str,
    *,
    stack_ref_id: str,
    owner_api_key: str,
    other_api_key: str,
) -> None:
    assert other_api_key != owner_api_key

    owner_load_response = requests.get(
        f"{api_url}/v1/habits/stacks/{stack_ref_id}?allow_archived=false",
        headers=_headers(owner_api_key),
        timeout=10,
    )
    assert owner_load_response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/habits/stacks/{stack_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        f"{api_url}/v1/habits/stacks/{stack_ref_id}",
        headers=_headers(other_api_key),
        json=_stack_update_payload(stack_ref_id, name="Hacked Stack"),
        timeout=10,
    )
    _assert_acl_denied(update_response)


def test_api_habit_stack_acl_reader_can_read_but_not_update(
    api_url: str,
    api_key: str,
    create_habit_stack,
    grant_habit_stack_access,
    another_user_with_habits_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_habit_stack("Reader ACL Stack")
    other_api_key = another_user_with_habits_enabled.api_key

    _assert_other_user_cannot_access_habit_stack(
        api_url,
        stack_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=other_api_key,
    )

    other_api_key = grant_habit_stack_access(created, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/habits/stacks/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["habit_stack"]["ref_id"] == created.ref_id
    assert load_response.json()["access_status"]["access_level"] == "reader"

    update_response = requests.put(
        f"{api_url}/v1/habits/stacks/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_stack_update_payload(created.ref_id, name="Reader Cannot Update"),
        timeout=10,
    )
    _assert_acl_denied(update_response)


def test_api_habit_stack_acl_writer_can_read_and_update(
    api_url: str,
    api_key: str,
    create_habit_stack,
    grant_habit_stack_access,
) -> None:
    created = create_habit_stack("Writer Update Stack")
    other_api_key = grant_habit_stack_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/habits/stacks/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    update_response = requests.put(
        f"{api_url}/v1/habits/stacks/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_stack_update_payload(created.ref_id, name="Writer Updated Stack"),
        timeout=10,
    )
    assert update_response.status_code == 200

    owner_load = requests.get(
        f"{api_url}/v1/habits/stacks/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert owner_load.json()["habit_stack"]["name"] == "Writer Updated Stack"


def test_api_habit_stack_acl_z_denied_without_grant(
    api_url: str,
    api_key: str,
    create_habit_stack,
    another_user_with_habits_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_habit_stack("Denied ACL Stack")
    _assert_other_user_cannot_access_habit_stack(
        api_url,
        stack_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=another_user_with_habits_enabled.api_key,
    )
