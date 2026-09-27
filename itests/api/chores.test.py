"""Tests for the API for chores."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.chores.chore_archive import (
    sync_detailed as chore_archive_sync,
)
from jupiter_webapi_client.api.chores.chore_create import (
    sync_detailed as chore_create_sync,
)
from jupiter_webapi_client.api.chores.chore_stack_create import (
    sync_detailed as chore_stack_create_sync,
)
from jupiter_webapi_client.api.chores.chore_suspend import (
    sync_detailed as chore_suspend_sync,
)
from jupiter_webapi_client.api.gen.gen_do import (
    sync_detailed as gen_do_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.chore import Chore
from jupiter_webapi_client.models.chore_archive_args import ChoreArchiveArgs
from jupiter_webapi_client.models.chore_create_args import ChoreCreateArgs
from jupiter_webapi_client.models.chore_create_result import ChoreCreateResult
from jupiter_webapi_client.models.chore_stack import ChoreStack
from jupiter_webapi_client.models.chore_stack_create_args import ChoreStackCreateArgs
from jupiter_webapi_client.models.chore_stack_create_result import (
    ChoreStackCreateResult,
)
from jupiter_webapi_client.models.chore_suspend_args import ChoreSuspendArgs
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.gen_do_args import GenDoArgs
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


@pytest.fixture(autouse=True, scope="module")
def _enable_chores_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=False),
        )


@pytest.fixture()
def create_chore(logged_in_client: AuthenticatedClient):
    def _create(
        name: str, period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY
    ) -> Chore:
        result = chore_create_sync(
            client=logged_in_client,
            body=ChoreCreateArgs(
                name=name,
                period=period,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
                must_do=False,
            ),
        )
        return get_parsed_from_response(ChoreCreateResult, result).new_chore

    return _create


@pytest.fixture()
def create_chore_stack(logged_in_client: AuthenticatedClient):
    def _create(
        name: str,
        chore_ref_ids: list[str] | None = None,
        period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY,
    ) -> ChoreStack:
        result = chore_stack_create_sync(
            client=logged_in_client,
            body=ChoreStackCreateArgs(
                name=name,
                period=period,
                chore_ref_ids=chore_ref_ids or [],
            ),
        )
        return get_parsed_from_response(ChoreStackCreateResult, result).new_chore_stack

    return _create


@pytest.fixture()
def archive_chore(logged_in_client: AuthenticatedClient):
    def _archive(ref_id: str) -> None:
        chore_archive_sync(
            client=logged_in_client,
            body=ChoreArchiveArgs(ref_id=ref_id),
        )

    return _archive


@pytest.fixture()
def suspend_chore(logged_in_client: AuthenticatedClient):
    def _suspend(ref_id: str) -> None:
        chore_suspend_sync(
            client=logged_in_client,
            body=ChoreSuspendArgs(ref_id=ref_id),
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


def test_api_chore_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/chores",
        headers=_headers(api_key),
        json={
            "name": "Clean Kitchen",
            "period": "daily",
            "is_key": True,
            "eisen": "important",
            "difficulty": "medium",
            "must_do": True,
        },
        timeout=10,
    )
    assert response.status_code == 200

    chore = response.json()["new_chore"]
    assert chore["name"] == "Clean Kitchen"
    assert chore["gen_params"]["period"] == "daily"
    assert chore["gen_params"]["eisen"] == "important"
    assert chore["gen_params"]["difficulty"] == "medium"
    assert chore["is_key"] is True
    assert chore["must_do"] is True
    assert chore["archived"] is False
    assert "ref_id" in chore


def test_api_chore_create_with_stack(api_url: str, api_key: str) -> None:
    stack_response = requests.post(
        f"{api_url}/v1/chores/stacks",
        headers=_headers(api_key),
        json={
            "name": "Morning Stack",
            "period": "daily",
            "chore_ref_ids": [],
        },
        timeout=10,
    )
    assert stack_response.status_code == 200
    stack = stack_response.json()["new_chore_stack"]

    response = requests.post(
        f"{api_url}/v1/chores",
        headers=_headers(api_key),
        json={
            "name": "Stacked Clean",
            "period": "daily",
            "is_key": False,
            "eisen": "regular",
            "difficulty": "easy",
            "must_do": False,
            "stack_ref_id": stack["ref_id"],
        },
        timeout=10,
    )
    assert response.status_code == 200

    chore = response.json()["new_chore"]
    assert chore["stack_ref_id"] == stack["ref_id"]


def test_api_chore_load(api_url: str, api_key: str, create_chore) -> None:
    created = create_chore("Load Chore")

    response = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    chore = response.json()["chore"]
    assert chore["ref_id"] == created.ref_id
    assert chore["name"] == "Load Chore"


def test_api_chore_find(api_url: str, api_key: str, create_chore) -> None:
    create_chore("Chore Alpha")
    create_chore("Chore Beta")

    response = requests.get(
        f"{api_url}/v1/chores?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [e["chore"]["name"] for e in response.json()["entries"]]
    assert "Chore Alpha" in names
    assert "Chore Beta" in names


def test_api_chore_update(api_url: str, api_key: str, create_chore) -> None:
    created = create_chore("Old Chore")

    response = requests.put(
        f"{api_url}/v1/chores/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "New Chore"},
            "is_key": {"should_change": False},
            "eisen": {"should_change": False},
            "difficulty": {"should_change": False},
            "must_do": {"should_change": True, "value": True},
            "actionable_from_day": {"should_change": False},
            "actionable_from_month": {"should_change": False},
            "due_at_day": {"should_change": False},
            "due_at_month": {"should_change": False},
            "skip_rule": {"should_change": False},
            "start_at_date": {"should_change": False},
            "end_at_date": {"should_change": False},
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

    updated = response.json()["updated_chore"]
    assert updated["name"] == "New Chore"
    assert updated["must_do"] is True

    response2 = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["chore"]["name"] == "New Chore"


def test_api_chore_archive(api_url: str, api_key: str, create_chore) -> None:
    created = create_chore("Archive Chore")

    response = requests.delete(
        f"{api_url}/v1/chores/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response1 = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response1.status_code == 502
    assert response1.json()["status"] == 404

    response2 = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["chore"]["archived"] is True


def test_api_chore_remove(api_url: str, api_key: str, create_chore) -> None:
    created = create_chore("Remove Chore")

    response = requests.delete(
        f"{api_url}/v1/chores/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_chore_suspend(api_url: str, api_key: str, create_chore) -> None:
    created = create_chore("Suspend Chore")

    response = requests.post(
        f"{api_url}/v1/chores/{created.ref_id}/suspend",
        headers=_headers(api_key),
        json={"ref_id": created.ref_id},
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["chore"]["suspended"] is True


def test_api_chore_unsuspend(
    api_url: str, api_key: str, create_chore, suspend_chore
) -> None:
    created = create_chore("Unsuspend Chore")
    suspend_chore(created.ref_id)

    response = requests.post(
        f"{api_url}/v1/chores/{created.ref_id}/unsuspend",
        headers=_headers(api_key),
        json={"ref_id": created.ref_id},
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["chore"]["suspended"] is False


@pytest.fixture()
def another_user_with_chores_enabled(
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
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=True),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=False),
        )


@pytest.fixture()
def grant_chore_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
):
    def _grant(chore: Chore, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.CHORE,
                entity_ref_id=chore.ref_id,
                user_ref_ids=[
                    another_user_with_chores_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_chores_enabled.api_key

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
        "must_do": {"should_change": False},
        "actionable_from_day": {"should_change": False},
        "actionable_from_month": {"should_change": False},
        "due_at_day": {"should_change": False},
        "due_at_month": {"should_change": False},
        "skip_rule": {"should_change": False},
        "start_at_date": {"should_change": False},
        "end_at_date": {"should_change": False},
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
    chore_ref_ids: list[str] | None = None,
) -> dict[str, object]:
    return {
        "ref_id": ref_id,
        "name": (
            {"should_change": True, "value": name}
            if name is not None
            else {"should_change": False}
        ),
        "chore_ref_ids": (
            {"should_change": True, "value": chore_ref_ids}
            if chore_ref_ids is not None
            else {"should_change": False}
        ),
        "aspect_ref_id": {"should_change": False},
        "chapter_ref_id": {"should_change": False},
        "goal_ref_id": {"should_change": False},
        "schedulability": {"should_change": False},
        "scheduling_event_duration_mins": {"should_change": False},
        "scheduling_event_count": {"should_change": False},
    }


def _assert_other_user_cannot_access_chore(
    api_url: str,
    *,
    chore_ref_id: str,
    owner_api_key: str,
    other_api_key: str,
) -> None:
    assert other_api_key != owner_api_key

    owner_load_response = requests.get(
        f"{api_url}/v1/chores/{chore_ref_id}?allow_archived=false",
        headers=_headers(owner_api_key),
        timeout=10,
    )
    assert owner_load_response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/chores/{chore_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        f"{api_url}/v1/chores/{chore_ref_id}",
        headers=_headers(other_api_key),
        json=_update_payload(chore_ref_id, name="Hacked Chore"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/chores/{chore_ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_chore_acl_reader_can_read_but_not_update_or_archive(
    api_url: str,
    api_key: str,
    create_chore,
    grant_chore_access,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_chore("Reader ACL Chore")
    other_api_key = another_user_with_chores_enabled.api_key

    _assert_other_user_cannot_access_chore(
        api_url,
        chore_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=other_api_key,
    )

    other_api_key = grant_chore_access(created, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["chore"]["ref_id"] == created.ref_id
    assert load_response.json()["owner"]["ref_id"] is not None
    assert load_response.json()["access_status"]["access_level"] == "reader"

    update_response = requests.put(
        f"{api_url}/v1/chores/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_update_payload(created.ref_id, name="Reader Cannot Update"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/chores/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_chore_acl_writer_can_read_and_update(
    api_url: str,
    create_chore,
    grant_chore_access,
) -> None:
    created = create_chore("Writer Update Chore")
    other_api_key = grant_chore_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    update_response = requests.put(
        f"{api_url}/v1/chores/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_update_payload(created.ref_id, name="Writer Updated Chore"),
        timeout=10,
    )
    assert update_response.status_code == 200

    verify_response = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert verify_response.status_code == 200
    assert verify_response.json()["chore"]["name"] == "Writer Updated Chore"


def test_api_chore_acl_writer_can_read_and_archive(
    api_url: str,
    create_chore,
    grant_chore_access,
) -> None:
    created = create_chore("Writer Archive Chore")
    other_api_key = grant_chore_access(created, AccessLevel.WRITER)

    archive_response = requests.delete(
        f"{api_url}/v1/chores/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    archived_response = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=true",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archived_response.status_code == 200
    assert archived_response.json()["chore"]["archived"] is True


def test_api_chore_acl_z_denied_without_grant(
    api_url: str,
    api_key: str,
    create_chore,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_chore("Denied ACL Chore")
    _assert_other_user_cannot_access_chore(
        api_url,
        chore_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=another_user_with_chores_enabled.api_key,
    )


def test_api_chore_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/chores?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401


def test_api_chore_stack_create(api_url: str, api_key: str, create_chore) -> None:
    chore = create_chore("Stack Member", RecurringTaskPeriod.WEEKLY)

    response = requests.post(
        f"{api_url}/v1/chores/stacks",
        headers=_headers(api_key),
        json={
            "name": "Morning Stack",
            "period": "weekly",
            "chore_ref_ids": [chore.ref_id],
        },
        timeout=10,
    )
    assert response.status_code == 200
    stack = response.json()["new_chore_stack"]
    assert stack["name"] == "Morning Stack"
    assert stack["period"] == "weekly"

    chore_load = requests.get(
        f"{api_url}/v1/chores/{chore.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert chore_load.status_code == 200
    assert chore_load.json()["chore"]["stack_ref_id"] == stack["ref_id"]


def test_api_chore_stack_create_rejects_period_mismatch(
    api_url: str, api_key: str, create_chore
) -> None:
    chore = create_chore("Daily Member", RecurringTaskPeriod.DAILY)

    response = requests.post(
        f"{api_url}/v1/chores/stacks",
        headers=_headers(api_key),
        json={
            "name": "Weekly Stack",
            "period": "weekly",
            "chore_ref_ids": [chore.ref_id],
        },
        timeout=10,
    )
    assert response.status_code != 200


def test_api_chore_stack_create_rejects_duplicate_chore_ids(
    api_url: str, api_key: str, create_chore
) -> None:
    chore = create_chore("Dup Member", RecurringTaskPeriod.WEEKLY)

    response = requests.post(
        f"{api_url}/v1/chores/stacks",
        headers=_headers(api_key),
        json={
            "name": "Dup Stack",
            "period": "weekly",
            "chore_ref_ids": [chore.ref_id, chore.ref_id],
        },
        timeout=10,
    )
    assert response.status_code != 200


def test_api_chore_stack_find(api_url: str, api_key: str, create_chore_stack) -> None:
    create_chore_stack("Stack Alpha")
    create_chore_stack("Stack Beta")

    response = requests.get(
        f"{api_url}/v1/chores/stacks?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    names = [e["chore_stack"]["name"] for e in response.json()["entries"]]
    assert "Stack Alpha" in names
    assert "Stack Beta" in names


def test_api_chore_stack_update_membership(
    api_url: str, api_key: str, create_chore, create_chore_stack
) -> None:
    chore1 = create_chore("First Member", RecurringTaskPeriod.WEEKLY)
    chore2 = create_chore("Second Member", RecurringTaskPeriod.WEEKLY)
    stack = create_chore_stack("Members Stack", [chore1.ref_id])

    response = requests.put(
        f"{api_url}/v1/chores/stacks/{stack.ref_id}",
        headers=_headers(api_key),
        json=_stack_update_payload(stack.ref_id, chore_ref_ids=[chore2.ref_id]),
        timeout=10,
    )
    assert response.status_code == 200

    load1 = requests.get(
        f"{api_url}/v1/chores/{chore1.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    load2 = requests.get(
        f"{api_url}/v1/chores/{chore2.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load1.json()["chore"]["stack_ref_id"] is None
    assert load2.json()["chore"]["stack_ref_id"] == stack.ref_id


def test_api_chore_stack_archive_clears_membership(
    api_url: str, api_key: str, create_chore, create_chore_stack
) -> None:
    chore = create_chore("Archive Member", RecurringTaskPeriod.WEEKLY)
    stack = create_chore_stack("Archive Stack", [chore.ref_id])

    response = requests.delete(
        f"{api_url}/v1/chores/stacks/{stack.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    chore_load = requests.get(
        f"{api_url}/v1/chores/{chore.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert chore_load.json()["chore"]["stack_ref_id"] is None


def test_api_chore_stack_remove_clears_membership(
    api_url: str, api_key: str, create_chore, create_chore_stack
) -> None:
    chore = create_chore("Remove Member", RecurringTaskPeriod.WEEKLY)
    stack = create_chore_stack("Remove Stack", [chore.ref_id])

    response = requests.delete(
        f"{api_url}/v1/chores/stacks/{stack.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    chore_load = requests.get(
        f"{api_url}/v1/chores/{chore.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert chore_load.json()["chore"]["stack_ref_id"] is None


def test_api_chore_update_cannot_change_period(
    api_url: str, api_key: str, create_chore, create_chore_stack
) -> None:
    chore = create_chore("Period Member", RecurringTaskPeriod.WEEKLY)
    stack = create_chore_stack("Period Stack", [chore.ref_id])

    # Update doesn't take a period, so whether this is rejected or ignored,
    # the chore keeps the one it was created with.
    requests.put(
        f"{api_url}/v1/chores/{chore.ref_id}",
        headers=_headers(api_key),
        json={
            **_update_payload(chore.ref_id),
            "period": {"should_change": True, "value": "daily"},
            "schedulability": {"should_change": False},
            "scheduling_event_duration_mins": {"should_change": False},
            "scheduling_event_count": {"should_change": False},
        },
        timeout=10,
    )

    chore_load = requests.get(
        f"{api_url}/v1/chores/{chore.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert chore_load.json()["chore"]["gen_params"]["period"] == "weekly"
    assert chore_load.json()["chore"]["stack_ref_id"] == stack.ref_id


def test_api_chore_inbox_task_includes_stack(
    api_url: str,
    api_key: str,
    logged_in_client: AuthenticatedClient,
    create_chore,
    create_chore_stack,
) -> None:
    chore = create_chore("Stacked Inbox Chore", RecurringTaskPeriod.DAILY)
    stack = create_chore_stack(
        "Morning Stack", [chore.ref_id], RecurringTaskPeriod.DAILY
    )

    gen_result = gen_do_sync(
        client=logged_in_client,
        body=GenDoArgs(
            gen_even_if_not_modified=True,
            today="2026-09-06",
            gen_targets=[SyncTarget.CHORES],
            period=[RecurringTaskPeriod.DAILY],
            filter_chore_ref_ids=[chore.ref_id],
        ),
    )
    assert gen_result.status_code == 200

    chore_load = requests.get(
        f"{api_url}/v1/chores/{chore.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert chore_load.status_code == 200
    inbox_tasks = chore_load.json()["inbox_tasks"]
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
    assert entry["chore"]["ref_id"] == chore.ref_id
    assert entry["chore_stack"]["ref_id"] == stack.ref_id
    assert entry["chore_stack"]["name"] == "Morning Stack"

    load_response = requests.get(
        f"{api_url}/v1/common/inbox-tasks/{inbox_task_ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    loaded = load_response.json()
    assert loaded["chore"]["ref_id"] == chore.ref_id
    assert loaded["chore_stack"]["ref_id"] == stack.ref_id
    assert loaded["chore_stack"]["name"] == "Morning Stack"


@pytest.fixture()
def grant_chore_stack_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
):
    def _grant(stack: ChoreStack, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.CHORESTACK,
                entity_ref_id=stack.ref_id,
                user_ref_ids=[
                    another_user_with_chores_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_chores_enabled.api_key

    return _grant


def _assert_other_user_cannot_access_chore_stack(
    api_url: str,
    *,
    stack_ref_id: str,
    owner_api_key: str,
    other_api_key: str,
) -> None:
    assert other_api_key != owner_api_key

    owner_load_response = requests.get(
        f"{api_url}/v1/chores/stacks/{stack_ref_id}?allow_archived=false",
        headers=_headers(owner_api_key),
        timeout=10,
    )
    assert owner_load_response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/chores/stacks/{stack_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        f"{api_url}/v1/chores/stacks/{stack_ref_id}",
        headers=_headers(other_api_key),
        json=_stack_update_payload(stack_ref_id, name="Hacked Stack"),
        timeout=10,
    )
    _assert_acl_denied(update_response)


def test_api_chore_stack_acl_reader_can_read_but_not_update(
    api_url: str,
    api_key: str,
    create_chore_stack,
    grant_chore_stack_access,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_chore_stack("Reader ACL Stack")
    other_api_key = another_user_with_chores_enabled.api_key

    _assert_other_user_cannot_access_chore_stack(
        api_url,
        stack_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=other_api_key,
    )

    other_api_key = grant_chore_stack_access(created, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/chores/stacks/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["chore_stack"]["ref_id"] == created.ref_id
    assert load_response.json()["access_status"]["access_level"] == "reader"

    update_response = requests.put(
        f"{api_url}/v1/chores/stacks/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_stack_update_payload(created.ref_id, name="Reader Cannot Update"),
        timeout=10,
    )
    _assert_acl_denied(update_response)


def test_api_chore_stack_acl_writer_can_read_and_update(
    api_url: str,
    api_key: str,
    create_chore_stack,
    grant_chore_stack_access,
) -> None:
    created = create_chore_stack("Writer Update Stack")
    other_api_key = grant_chore_stack_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/chores/stacks/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    update_response = requests.put(
        f"{api_url}/v1/chores/stacks/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_stack_update_payload(created.ref_id, name="Writer Updated Stack"),
        timeout=10,
    )
    assert update_response.status_code == 200

    owner_load = requests.get(
        f"{api_url}/v1/chores/stacks/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert owner_load.json()["chore_stack"]["name"] == "Writer Updated Stack"


def test_api_chore_stack_acl_z_denied_without_grant(
    api_url: str,
    api_key: str,
    create_chore_stack,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_chore_stack("Denied ACL Stack")
    _assert_other_user_cannot_access_chore_stack(
        api_url,
        stack_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=another_user_with_chores_enabled.api_key,
    )
