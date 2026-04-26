"""Tests for the contacts API using inbox tasks."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.contacts.contact_create import (
    sync_detailed as contact_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.contact import Contact
from jupiter_webapi_client.models.contact_create_args import ContactCreateArgs
from jupiter_webapi_client.models.contact_create_result import ContactCreateResult
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.inbox_task import InboxTask
from jupiter_webapi_client.models.todo_task_create_args import TodoTaskCreateArgs
from jupiter_webapi_client.models.todo_task_create_result import TodoTaskCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_todo_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
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
def create_contact(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> Contact:
        result = contact_create_sync(
            client=logged_in_client,
            body=ContactCreateArgs(name=name),
        )
        return get_parsed_from_response(ContactCreateResult, result).new_contact

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def test_api_common_contact_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/common/contacts",
        headers=_headers(api_key),
        json={"name": "Ada"},
        timeout=10,
    )
    assert response.status_code == 200

    contact = response.json()["new_contact"]
    assert contact["name"] == "Ada"
    assert contact["archived"] is False
    assert "ref_id" in contact


def test_api_common_contact_load(api_url: str, api_key: str, create_contact) -> None:
    contact = create_contact("Load Contact")

    response = requests.get(
        f"{api_url}/v1/common/contacts/{contact.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    loaded = response.json()["contact"]
    assert loaded["ref_id"] == contact.ref_id
    assert loaded["name"] == "Load Contact"


def test_api_common_contact_find(api_url: str, api_key: str, create_contact) -> None:
    create_contact("Find Contact 1")
    create_contact("Find Contact 2")

    response = requests.get(
        f"{api_url}/v1/common/contacts?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [t["name"] for t in response.json()["contacts"]]
    assert "Find Contact 1" in names
    assert "Find Contact 2" in names


def test_api_common_contact_update(api_url: str, api_key: str, create_contact) -> None:
    contact = create_contact("Old Contact")

    response = requests.put(
        f"{api_url}/v1/common/contacts/{contact.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": contact.ref_id,
            "name": {"should_change": True, "value": "New Contact"},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/contacts/{contact.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["contact"]["name"] == "New Contact"


def test_api_common_contact_link_upsert(
    api_url: str, api_key: str, create_inbox_task, create_contact
) -> None:
    task = create_inbox_task("Task With Contact")

    response = requests.post(
        f"{api_url}/v1/common/contacts/link",
        headers=_headers(api_key),
        json={
            "owner": f"TodoTask:std:{task.ref_id}",
            "contact_names": ["John Doe"],
        },
        timeout=10,
    )
    assert response.status_code == 200

    contact_link = response.json()["contact_link"]
    assert contact_link["owner"] == f"TodoTask:std:{task.ref_id}"
    assert len(contact_link["contacts_ref_ids"]) == 1


def test_api_common_contact_archive(api_url: str, api_key: str, create_contact) -> None:
    contact = create_contact("Archive Contact")

    response = requests.delete(
        f"{api_url}/v1/common/contacts/{contact.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/contacts/{contact.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["contact"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/common/contacts/{contact.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_common_contact_remove(api_url: str, api_key: str, create_contact) -> None:
    contact = create_contact("Remove Contact")

    response = requests.delete(
        f"{api_url}/v1/common/contacts/{contact.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/contacts/{contact.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_common_contacts_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/common/contacts?allow_archived=false",
        timeout=10,
    )
    assert response.status_code == 401
