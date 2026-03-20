"""Tests for the tags API using inbox tasks."""

import pytest
import requests
from jupiter_webapi_client.api.inbox_tasks.inbox_task_create import (
    sync_detailed as inbox_task_create_sync,
)
from jupiter_webapi_client.api.tags.tag_create import (
    sync_detailed as tag_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.inbox_task import InboxTask
from jupiter_webapi_client.models.inbox_task_create_args import InboxTaskCreateArgs
from jupiter_webapi_client.models.inbox_task_create_result import InboxTaskCreateResult
from jupiter_webapi_client.models.tag import Tag
from jupiter_webapi_client.models.tag_create_args import TagCreateArgs
from jupiter_webapi_client.models.tag_create_result import TagCreateResult
from jupiter_webapi_client.models.tag_namespace import TagNamespace

from itests.helpers import get_parsed_from_response


@pytest.fixture()
def create_inbox_task(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> InboxTask:
        result = inbox_task_create_sync(
            client=logged_in_client,
            body=InboxTaskCreateArgs(
                name=name,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        )
        return get_parsed_from_response(InboxTaskCreateResult, result).new_inbox_task

    return _create


@pytest.fixture()
def create_tag(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> Tag:
        result = tag_create_sync(
            client=logged_in_client,
            body=TagCreateArgs(
                namespace=TagNamespace.TODO_TASK,
                name=name,
            ),
        )
        return get_parsed_from_response(TagCreateResult, result).new_tag

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def test_api_common_tag_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/common/tags",
        headers=_headers(api_key),
        json={
            "namespace": "todo-task",
            "name": "urgent",
        },
        timeout=10,
    )
    assert response.status_code == 200

    tag = response.json()["new_tag"]
    assert tag["name"] == "urgent"
    assert tag["namespace"] == "todo-task"
    assert tag["archived"] is False
    assert "ref_id" in tag


def test_api_common_tag_load(api_url: str, api_key: str, create_tag) -> None:
    tag = create_tag("load-tag")

    response = requests.get(
        f"{api_url}/v1/common/tags/{tag.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    loaded = response.json()["tag"]
    assert loaded["ref_id"] == tag.ref_id
    assert loaded["name"] == "load-tag"


def test_api_common_tag_find(api_url: str, api_key: str, create_tag) -> None:
    create_tag("find-tag-1")
    create_tag("find-tag-2")

    response = requests.get(
        f"{api_url}/v1/common/tags?allow_archived=false&filter_namespace=todo-task",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [t["name"] for t in response.json()["tags"]]
    assert "find-tag-1" in names
    assert "find-tag-2" in names


def test_api_common_tag_update(api_url: str, api_key: str, create_tag) -> None:
    tag = create_tag("old-tag")

    response = requests.put(
        f"{api_url}/v1/common/tags/{tag.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": tag.ref_id,
            "name": {"should_change": True, "value": "new-tag"},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/tags/{tag.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["tag"]["name"] == "new-tag"


def test_api_common_tag_link_upsert(
    api_url: str, api_key: str, create_inbox_task, create_tag
) -> None:
    task = create_inbox_task("Tagged Task")
    create_tag("link-tag")

    response = requests.post(
        f"{api_url}/v1/common/tags/link",
        headers=_headers(api_key),
        json={
            "namespace": "todo-task",
            "source_entity_ref_id": task.ref_id,
            "tag_names": ["link-tag"],
        },
        timeout=10,
    )
    assert response.status_code == 200

    tag_link = response.json()["tag_link"]
    assert tag_link["source_entity_ref_id"] == task.ref_id
    assert len(tag_link["ref_ids"]) >= 1


def test_api_common_tag_archive(api_url: str, api_key: str, create_tag) -> None:
    tag = create_tag("archive-tag")

    response = requests.delete(
        f"{api_url}/v1/common/tags/{tag.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/tags/{tag.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["tag"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/common/tags/{tag.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_common_tag_remove(api_url: str, api_key: str, create_tag) -> None:
    tag = create_tag("remove-tag")

    response = requests.delete(
        f"{api_url}/v1/common/tags/{tag.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/tags/{tag.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_common_tags_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/common/tags?allow_archived=false",
        timeout=10,
    )
    assert response.status_code == 401
