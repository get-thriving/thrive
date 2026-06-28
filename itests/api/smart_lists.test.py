"""Tests for the API for smart lists."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.smart_lists.smart_list_create import (
    sync_detailed as smart_list_create_sync,
)
from jupiter_webapi_client.api.smart_lists.smart_list_item_create import (
    sync_detailed as smart_list_item_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.smart_list import SmartList
from jupiter_webapi_client.models.smart_list_create_args import SmartListCreateArgs
from jupiter_webapi_client.models.smart_list_create_result import SmartListCreateResult
from jupiter_webapi_client.models.smart_list_item import SmartListItem
from jupiter_webapi_client.models.smart_list_item_create_args import (
    SmartListItemCreateArgs,
)
from jupiter_webapi_client.models.smart_list_item_create_result import (
    SmartListItemCreateResult,
)
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.helpers import get_parsed_from_response
from itests.api.conftest import AnotherUserAndWorkspace


@pytest.fixture(autouse=True, scope="module")
def _enable_smart_lists_feature(
    logged_in_client: AuthenticatedClient,
) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.SMART_LISTS, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.SMART_LISTS, value=False
            ),
        )


@pytest.fixture()
def create_smart_list(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> SmartList:
        result = smart_list_create_sync(
            client=logged_in_client,
            body=SmartListCreateArgs(name=name),
        )
        return get_parsed_from_response(SmartListCreateResult, result).new_smart_list

    return _create


@pytest.fixture()
def create_smart_list_item(logged_in_client: AuthenticatedClient):
    def _create(smart_list_ref_id: str, name: str) -> SmartListItem:
        result = smart_list_item_create_sync(
            client=logged_in_client,
            body=SmartListItemCreateArgs(
                smart_list_ref_id=smart_list_ref_id,
                name=name,
                is_done=False,
            ),
        )
        return get_parsed_from_response(
            SmartListItemCreateResult, result
        ).new_smart_list_item

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


@pytest.fixture()
def another_user_with_smart_lists_enabled(
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
                feature=WorkspaceFeature.SMART_LISTS, value=True
            ),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.SMART_LISTS, value=False
            ),
        )


def _assert_acl_denied(response: requests.Response) -> None:
    assert response.status_code == 502


def test_api_smart_list_acl(
    api_url: str,
    create_smart_list,
    another_user_with_smart_lists_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_smart_list("ACL List")
    other_api_key = another_user_with_smart_lists_enabled.api_key

    load_response = requests.get(
        f"{api_url}/v1/smart-lists/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        f"{api_url}/v1/smart-lists/{created.ref_id}",
        headers=_headers(other_api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "Hacked List"},
            "icon": {"should_change": False},
        },
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/smart-lists/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)

    remove_response = requests.delete(
        f"{api_url}/v1/smart-lists/{created.ref_id}/remove",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(remove_response)


def test_api_smart_list_item_acl(
    api_url: str,
    create_smart_list,
    create_smart_list_item,
    another_user_with_smart_lists_enabled: AnotherUserAndWorkspace,
) -> None:
    sl = create_smart_list("ACL List")
    item = create_smart_list_item(sl.ref_id, "ACL Item")
    other_api_key = another_user_with_smart_lists_enabled.api_key
    item_url = f"{api_url}/v1/smart-lists/{sl.ref_id}/items/{item.ref_id}"

    load_response = requests.get(
        f"{item_url}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        item_url,
        headers=_headers(other_api_key),
        json={
            "ref_id": item.ref_id,
            "name": {"should_change": True, "value": "Hacked Item"},
            "is_done": {"should_change": False},
            "url": {"should_change": False},
        },
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        item_url,
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)

    remove_response = requests.delete(
        f"{item_url}/remove",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(remove_response)


def test_api_smart_list_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/smart-lists",
        headers=_headers(api_key),
        json={"name": "Shopping List", "icon": "🛒"},
        timeout=10,
    )
    assert response.status_code == 200

    sl = response.json()["new_smart_list"]
    assert sl["name"] == "Shopping List"
    assert sl["archived"] is False
    assert "ref_id" in sl


def test_api_smart_list_load(api_url: str, api_key: str, create_smart_list) -> None:
    created = create_smart_list("Load List")

    response = requests.get(
        f"{api_url}/v1/smart-lists/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    sl = response.json()["smart_list"]
    assert sl["ref_id"] == created.ref_id
    assert sl["name"] == "Load List"


def test_api_smart_list_find(api_url: str, api_key: str, create_smart_list) -> None:
    create_smart_list("List Alpha")
    create_smart_list("List Beta")

    response = requests.get(
        f"{api_url}/v1/smart-lists?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [e["smart_list"]["name"] for e in response.json()["entries"]]
    assert "List Alpha" in names
    assert "List Beta" in names


def test_api_smart_list_update(api_url: str, api_key: str, create_smart_list) -> None:
    created = create_smart_list("Old List")

    response = requests.put(
        f"{api_url}/v1/smart-lists/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "New List"},
            "icon": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/smart-lists/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["smart_list"]["name"] == "New List"


def test_api_smart_list_archive(api_url: str, api_key: str, create_smart_list) -> None:
    created = create_smart_list("Archive List")

    response = requests.delete(
        f"{api_url}/v1/smart-lists/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/smart-lists/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["smart_list"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/smart-lists/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_smart_list_remove(api_url: str, api_key: str, create_smart_list) -> None:
    created = create_smart_list("Remove List")

    response = requests.delete(
        f"{api_url}/v1/smart-lists/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/smart-lists/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_smart_list_item_create(
    api_url: str, api_key: str, create_smart_list
) -> None:
    sl = create_smart_list("Items List")

    response = requests.post(
        f"{api_url}/v1/smart-lists/{sl.ref_id}/items",
        headers=_headers(api_key),
        json={
            "smart_list_ref_id": sl.ref_id,
            "name": "Milk",
            "is_done": False,
            "url": "https://example.com",
        },
        timeout=10,
    )
    assert response.status_code == 200

    item = response.json()["new_smart_list_item"]
    assert item["name"] == "Milk"
    assert item["is_done"] is False
    assert "ref_id" in item


def test_api_smart_list_item_load(
    api_url: str, api_key: str, create_smart_list, create_smart_list_item
) -> None:
    sl = create_smart_list("Item Load List")
    item = create_smart_list_item(sl.ref_id, "Load Item")

    response = requests.get(
        f"{api_url}/v1/smart-lists/{sl.ref_id}/items/{item.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert response.json()["item"]["name"] == "Load Item"


def test_api_smart_list_item_update(
    api_url: str, api_key: str, create_smart_list, create_smart_list_item
) -> None:
    sl = create_smart_list("Item Update List")
    item = create_smart_list_item(sl.ref_id, "Old Item")

    response = requests.put(
        f"{api_url}/v1/smart-lists/{sl.ref_id}/items/{item.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": item.ref_id,
            "name": {"should_change": True, "value": "New Item"},
            "is_done": {"should_change": True, "value": True},
            "url": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/smart-lists/{sl.ref_id}/items/{item.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["item"]["name"] == "New Item"


def test_api_smart_list_item_archive(
    api_url: str, api_key: str, create_smart_list, create_smart_list_item
) -> None:
    sl = create_smart_list("Item Archive List")
    item = create_smart_list_item(sl.ref_id, "Archive Item")

    response = requests.delete(
        f"{api_url}/v1/smart-lists/{sl.ref_id}/items/{item.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/smart-lists/{sl.ref_id}/items/{item.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404

    response3 = requests.get(
        f"{api_url}/v1/smart-lists/{sl.ref_id}/items/{item.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 200
    assert response3.json()["item"]["archived"] is True


def test_api_smart_list_item_remove(
    api_url: str, api_key: str, create_smart_list, create_smart_list_item
) -> None:
    sl = create_smart_list("Item Remove List")
    item = create_smart_list_item(sl.ref_id, "Remove Item")

    response = requests.delete(
        f"{api_url}/v1/smart-lists/{sl.ref_id}/items/{item.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/smart-lists/{sl.ref_id}/items/{item.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_smart_list_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/smart-lists?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401
