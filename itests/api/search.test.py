"""Tests for the Jupiter API search endpoint (todos, filters, entity-tag scope)."""

import uuid
from collections.abc import Iterator
from typing import Any

import pytest
import requests
from jupiter_webapi_client.api.projects.project_create import (
    sync_detailed as project_create_sync,
)
from jupiter_webapi_client.api.tags.tag_create import (
    sync_detailed as tag_create_sync,
)
from jupiter_webapi_client.api.test_helper.search_index_backfill_test_helper import (
    sync_detailed as search_index_backfill_test_helper_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.project import Project
from jupiter_webapi_client.models.project_create_args import ProjectCreateArgs
from jupiter_webapi_client.models.project_create_result import ProjectCreateResult
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.search_index_backfill_test_helper_args import (
    SearchIndexBackfillTestHelperArgs,
)
from jupiter_webapi_client.models.tag_create_args import TagCreateArgs
from jupiter_webapi_client.models.tag_create_result import TagCreateResult
from jupiter_webapi_client.models.todo_task import TodoTask
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
                feature=WorkspaceFeature.TODO_TASK,
                value=True,
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK,
                value=False,
            ),
        )


@pytest.fixture(autouse=True, scope="module")
def _enable_projects_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.PROJECTS,
                value=True,
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.PROJECTS,
                value=False,
            ),
        )


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def _note_owner_todo_task(todo_task_ref_id: str) -> str:
    return f"TodoTask:std:{todo_task_ref_id}"


def _search(
    api_url: str, api_key: str, payload: dict[str, str | int | bool | list[str]]
) -> tuple[int, dict[str, str | int | bool | list[str]]]:
    response = requests.post(
        f"{api_url}/v1/search",
        headers=_headers(api_key),
        json=payload,
        timeout=30,
    )
    if response.status_code != 200:
        return response.status_code, {}
    return response.status_code, response.json()


def _ref_ids_from_search(data: Any) -> list[str]:  # type: ignore
    # JSON numbers decode as int; API clients use str ref_ids — normalize for ``in`` checks.
    return [str(m["summary"]["ref_id"]) for m in data.get("matches", [])]


def _todo_ref_ids_from_search(data: Any) -> list[str]:  # type: ignore
    return _ref_ids_from_search(data)


@pytest.fixture()
def create_todo(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> TodoTask:
        result = todo_task_create_sync(
            client=logged_in_client,
            body=TodoTaskCreateArgs(
                name=name,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        )
        return get_parsed_from_response(TodoTaskCreateResult, result).new_todo_task

    return _create


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
def drain_search_mutation_log(logged_in_client: AuthenticatedClient):
    def _drain() -> None:
        result = search_index_backfill_test_helper_sync(
            client=logged_in_client,
            body=SearchIndexBackfillTestHelperArgs(),
        )
        assert result.status_code == 200

    return _drain


@pytest.fixture()
def create_tag(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> str:
        result = tag_create_sync(
            client=logged_in_client,
            body=TagCreateArgs(name=name),
        )
        return get_parsed_from_response(TagCreateResult, result).new_tag.ref_id

    return _create


def test_api_search_todo_by_name(
    api_url: str,
    api_key: str,
    create_todo,
    drain_search_mutation_log,
) -> None:
    token = f"srchname-{uuid.uuid4().hex[:12]}"
    todo = create_todo(f"Alpha {token} Beta")
    drain_search_mutation_log()

    status, data = _search(
        api_url,
        api_key,
        {
            "query": token,
            "limit": 20,
            "include_archived": False,
            "filter_entity_tags": ["TodoTask"],
        },
    )
    assert status == 200
    assert todo.ref_id in _todo_ref_ids_from_search(data)


def test_api_search_todo_by_note_content(
    api_url: str,
    api_key: str,
    create_todo,
    drain_search_mutation_log,
) -> None:
    token = f"notetxt-{uuid.uuid4().hex[:12]}"
    todo = create_todo("Plain title for note search")
    requests.post(
        f"{api_url}/v1/common/notes",
        headers=_headers(api_key),
        json={
            "owner": _note_owner_todo_task(todo.ref_id),
            "content": [
                {
                    "correlation_id": "1",
                    "kind": "paragraph",
                    "text": f"Body holds secret {token} phrase",
                }
            ],
        },
        timeout=10,
    ).raise_for_status()
    drain_search_mutation_log()

    status, data = _search(
        api_url,
        api_key,
        {
            "query": token,
            "limit": 20,
            "include_archived": False,
            "filter_entity_tags": ["TodoTask"],
        },
    )
    assert status == 200
    assert todo.ref_id in _todo_ref_ids_from_search(data)


def test_api_search_todo_filter_single_tag(
    api_url: str,
    api_key: str,
    create_todo,
    create_tag,
    drain_search_mutation_log,
) -> None:
    tag_name = f"st-{uuid.uuid4().hex[:8]}"
    tag_ref_id = create_tag(tag_name)
    token = f"tag1-{uuid.uuid4().hex[:8]}"
    todo = create_todo(f"Tagged {token}")
    requests.post(
        f"{api_url}/v1/common/tags/link",
        headers=_headers(api_key),
        json={
            "owner": _note_owner_todo_task(todo.ref_id),
            "tag_names": [tag_name],
        },
        timeout=10,
    ).raise_for_status()
    drain_search_mutation_log()

    status, data = _search(
        api_url,
        api_key,
        {
            "query": token,
            "limit": 20,
            "include_archived": False,
            "filter_entity_tags": ["TodoTask"],
            "filter_tag_ref_ids": [tag_ref_id],
        },
    )
    assert status == 200
    assert todo.ref_id in _todo_ref_ids_from_search(data)


def test_api_search_todo_filter_two_tags(
    api_url: str,
    api_key: str,
    create_todo,
    create_tag,
    drain_search_mutation_log,
) -> None:
    a = f"ta-{uuid.uuid4().hex[:8]}"
    b = f"tb-{uuid.uuid4().hex[:8]}"
    tag_a = create_tag(a)
    tag_b = create_tag(b)
    token = f"tag2-{uuid.uuid4().hex[:8]}"
    todo = create_todo(f"Two tags {token}")
    requests.post(
        f"{api_url}/v1/common/tags/link",
        headers=_headers(api_key),
        json={
            "owner": _note_owner_todo_task(todo.ref_id),
            "tag_names": [a, b],
        },
        timeout=10,
    ).raise_for_status()
    drain_search_mutation_log()

    status, data = _search(
        api_url,
        api_key,
        {
            "query": token,
            "limit": 20,
            "include_archived": False,
            "filter_entity_tags": ["TodoTask"],
            "filter_tag_ref_ids": [tag_a, tag_b],
        },
    )
    assert status == 200
    assert todo.ref_id in _todo_ref_ids_from_search(data)


def test_api_search_todo_filter_single_contact(
    api_url: str,
    api_key: str,
    create_todo,
    drain_search_mutation_log,
) -> None:
    cname = f"Person-{uuid.uuid4().hex[:8]}"
    token = f"con1-{uuid.uuid4().hex[:8]}"
    todo = create_todo(f"Contact task {token}")
    contact_resp = requests.post(
        f"{api_url}/v1/common/contacts",
        headers=_headers(api_key),
        json={"name": cname},
        timeout=10,
    )
    contact_resp.raise_for_status()
    contact_ref_id = contact_resp.json()["new_contact"]["ref_id"]
    requests.post(
        f"{api_url}/v1/common/contacts/link",
        headers=_headers(api_key),
        json={
            "owner": _note_owner_todo_task(todo.ref_id),
            "contact_names": [cname],
        },
        timeout=10,
    ).raise_for_status()
    drain_search_mutation_log()

    status, data = _search(
        api_url,
        api_key,
        {
            "query": token,
            "limit": 20,
            "include_archived": False,
            "filter_entity_tags": ["TodoTask"],
            "filter_contact_ref_ids": [contact_ref_id],
        },
    )
    assert status == 200
    assert todo.ref_id in _todo_ref_ids_from_search(data)


def test_api_search_todo_filter_two_contacts(
    api_url: str,
    api_key: str,
    create_todo,
    drain_search_mutation_log,
) -> None:
    c1 = f"Alice-{uuid.uuid4().hex[:8]}"
    c2 = f"Bob-{uuid.uuid4().hex[:8]}"
    token = f"con2-{uuid.uuid4().hex[:8]}"
    todo = create_todo(f"Two contacts {token}")
    r1 = requests.post(
        f"{api_url}/v1/common/contacts",
        headers=_headers(api_key),
        json={"name": c1},
        timeout=10,
    )
    r1.raise_for_status()
    id1 = r1.json()["new_contact"]["ref_id"]
    r2 = requests.post(
        f"{api_url}/v1/common/contacts",
        headers=_headers(api_key),
        json={"name": c2},
        timeout=10,
    )
    r2.raise_for_status()
    id2 = r2.json()["new_contact"]["ref_id"]
    requests.post(
        f"{api_url}/v1/common/contacts/link",
        headers=_headers(api_key),
        json={
            "owner": _note_owner_todo_task(todo.ref_id),
            "contact_names": [c1, c2],
        },
        timeout=10,
    ).raise_for_status()
    drain_search_mutation_log()

    status, data = _search(
        api_url,
        api_key,
        {
            "query": token,
            "limit": 20,
            "include_archived": False,
            "filter_entity_tags": ["TodoTask"],
            "filter_contact_ref_ids": [id1, id2],
        },
    )
    assert status == 200
    assert todo.ref_id in _todo_ref_ids_from_search(data)


def test_api_search_filter_entity_tag_project_excludes_todo_same_name(
    api_url: str,
    api_key: str,
    create_project,
    create_todo,
    drain_search_mutation_log,
) -> None:
    token = f"enttag-{uuid.uuid4().hex[:12]}"
    shared_name = f"Same title {token}"
    project = create_project(shared_name)
    todo = create_todo(shared_name)
    drain_search_mutation_log()

    status_bp, data_bp = _search(
        api_url,
        api_key,
        {
            "query": token,
            "limit": 20,
            "include_archived": False,
            "filter_entity_tags": ["Project"],
        },
    )
    assert status_bp == 200
    ref_ids_bp = _ref_ids_from_search(data_bp)
    assert project.ref_id in ref_ids_bp
    assert todo.ref_id not in ref_ids_bp

    status_td, data_td = _search(
        api_url,
        api_key,
        {
            "query": token,
            "limit": 20,
            "include_archived": False,
            "filter_entity_tags": ["TodoTask"],
        },
    )
    assert status_td == 200
    ref_ids_td = _ref_ids_from_search(data_td)
    assert todo.ref_id in ref_ids_td
    assert project.ref_id not in ref_ids_td
