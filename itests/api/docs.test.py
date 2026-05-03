"""Tests for the API for docs."""

import uuid
from typing import cast

import pytest
import requests
from jupiter_webapi_client.api.application.get_summaries import (
    sync_detailed as get_summaries_sync,
)
from jupiter_webapi_client.api.docs.dir_create import (
    sync_detailed as dir_create_sync,
)
from jupiter_webapi_client.api.docs.doc_create import (
    sync_detailed as doc_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.dir_ import Dir
from jupiter_webapi_client.models.dir_create_args import DirCreateArgs
from jupiter_webapi_client.models.dir_create_result import DirCreateResult
from jupiter_webapi_client.models.doc import Doc
from jupiter_webapi_client.models.doc_create_args import DocCreateArgs
from jupiter_webapi_client.models.doc_create_result import DocCreateResult
from jupiter_webapi_client.models.get_summaries_args import GetSummariesArgs
from jupiter_webapi_client.models.get_summaries_result import GetSummariesResult
from jupiter_webapi_client.models.paragraph_block import ParagraphBlock
from jupiter_webapi_client.models.paragraph_block_kind import ParagraphBlockKind
from jupiter_webapi_client.types import Unset

from itests.helpers import get_parsed_from_response


@pytest.fixture(scope="package")
def root_dir_ref_id(logged_in_client: AuthenticatedClient) -> str:
    response = get_summaries_sync(
        client=logged_in_client,
        body=GetSummariesArgs(),
    )
    result = get_parsed_from_response(GetSummariesResult, response)
    root_dir = result.root_dir
    if root_dir is None or isinstance(root_dir, Unset):
        raise ValueError("root_dir missing from get_summaries")
    return cast(str, root_dir.ref_id)


@pytest.fixture()
def create_doc(logged_in_client: AuthenticatedClient, root_dir_ref_id: str):
    def _create(name: str, *, parent_dir_ref_id: str | None = None) -> Doc:
        result = doc_create_sync(
            client=logged_in_client,
            body=DocCreateArgs(
                idempotency_key=str(uuid.uuid4()),
                name=name,
                content=[
                    ParagraphBlock(
                        correlation_id=str(uuid.uuid4()),
                        kind=ParagraphBlockKind.PARAGRAPH,
                        text=f"Content for {name}",
                    )
                ],
                parent_dir_ref_id=(
                    parent_dir_ref_id
                    if parent_dir_ref_id is not None
                    else root_dir_ref_id
                ),
            ),
        )
        return get_parsed_from_response(DocCreateResult, result).new_doc

    return _create


@pytest.fixture()
def create_dir(logged_in_client: AuthenticatedClient, root_dir_ref_id: str):
    def _create(name: str, *, parent_dir_ref_id: str | None = None) -> Dir:
        parent = parent_dir_ref_id if parent_dir_ref_id is not None else root_dir_ref_id
        result = dir_create_sync(
            client=logged_in_client,
            body=DirCreateArgs(name=name, parent_dir_ref_id=parent),
        )
        return get_parsed_from_response(DirCreateResult, result).new_dir

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def test_api_docs_doc_create(api_url: str, api_key: str, root_dir_ref_id: str) -> None:
    response = requests.post(
        f"{api_url}/v1/docs/docs",
        headers=_headers(api_key),
        json={
            "idempotency_key": str(uuid.uuid4()),
            "name": "My First Doc",
            "content": [
                {
                    "kind": "paragraph",
                    "correlation_id": str(uuid.uuid4()),
                    "text": "Hello world",
                }
            ],
            "parent_dir_ref_id": root_dir_ref_id,
        },
        timeout=10,
    )
    assert response.status_code == 200

    doc = response.json()["new_doc"]
    assert doc["name"] == "My First Doc"
    assert doc["archived"] is False
    assert doc["parent_dir_ref_id"] == root_dir_ref_id
    assert "ref_id" in doc


def test_api_docs_doc_load(api_url: str, api_key: str, create_doc) -> None:
    created = create_doc("Load Doc")

    response = requests.get(
        f"{api_url}/v1/docs/docs/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    doc = response.json()["doc"]
    assert doc["ref_id"] == created.ref_id
    assert doc["name"] == "Load Doc"
    note = response.json()["note"]
    assert note["owner"] == f"Doc:std:{created.ref_id}"
    assert len(note["content"]) == 1
    assert note["content"][0]["kind"] == "paragraph"
    assert note["content"][0]["text"] == "Content for Load Doc"


def test_api_docs_doc_find(api_url: str, api_key: str, create_doc) -> None:
    create_doc("Doc Alpha")
    create_doc("Doc Beta")

    response = requests.get(
        f"{api_url}/v1/docs/docs?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [e["doc"]["name"] for e in response.json()["entries"]]
    assert "Doc Alpha" in names
    assert "Doc Beta" in names


def test_api_docs_doc_update(api_url: str, api_key: str, create_doc) -> None:
    created = create_doc("Old Doc Name")

    response = requests.put(
        f"{api_url}/v1/docs/docs/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "New Doc Name"},
            "parent_dir_ref_id": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/docs/docs/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["doc"]["name"] == "New Doc Name"


def test_api_docs_doc_archive(api_url: str, api_key: str, create_doc) -> None:
    created = create_doc("Archive Doc")

    response = requests.delete(
        f"{api_url}/v1/docs/docs/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response1 = requests.get(
        f"{api_url}/v1/docs/docs/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response1.status_code == 502
    assert response1.json()["status"] == 404

    response2 = requests.get(
        f"{api_url}/v1/docs/docs/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["doc"]["archived"] is True


def test_api_docs_doc_remove(api_url: str, api_key: str, create_doc) -> None:
    created = create_doc("Remove Doc")

    response = requests.delete(
        f"{api_url}/v1/docs/docs/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/docs/docs/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_docs_doc_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/docs/docs?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401


# --- Doc directories (external API) ---


def test_api_docs_dir_find(api_url: str, api_key: str, create_dir) -> None:
    dir_a = create_dir("Folder Alpha")
    dir_b = create_dir("Folder Beta")

    response = requests.get(
        f"{api_url}/v1/docs/dirs?allow_archived=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    names = [e["dir"]["name"] for e in response.json()["entries"]]
    assert dir_a.name in names
    assert dir_b.name in names


def test_api_docs_dir_load(api_url: str, api_key: str, create_dir, create_doc) -> None:
    created_dir = create_dir("Loaded Folder")

    # Create a few docs inside the dir
    for i in range(3):
        create_doc(f"Doc {i}", parent_dir_ref_id=created_dir.ref_id)

    response = requests.get(
        f"{api_url}/v1/docs/dirs/{created_dir.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["dir"]["ref_id"] == created_dir.ref_id
    assert body["dir"]["name"] == "Loaded Folder"

    # Check that the docs created above appear in the entries list
    loaded_doc_names = [entry["doc"]["name"] for entry in body["entries"]]
    for i in range(3):
        assert f"Doc {i}" in loaded_doc_names

    assert body["subdirs"] == []


def test_api_docs_dir_update_name(api_url: str, api_key: str, create_dir) -> None:
    created = create_dir("Old Folder Name")

    loaded = requests.get(
        f"{api_url}/v1/docs/dirs/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert loaded.status_code == 200
    keep_parent = loaded.json()["dir"]["parent_dir_ref_id"]

    response = requests.put(
        f"{api_url}/v1/docs/dirs/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "name": {"should_change": True, "value": "New Folder Name"},
            "parent_dir_ref_id": {
                "should_change": True,
                "value": keep_parent,
            },
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/docs/dirs/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["dir"]["name"] == "New Folder Name"


def test_api_docs_dir_move_to_parent(api_url: str, api_key: str, create_dir) -> None:
    parent = create_dir("Parent For Move")
    child = create_dir("Child To Move")

    response = requests.put(
        f"{api_url}/v1/docs/dirs/{child.ref_id}",
        headers=_headers(api_key),
        json={
            "name": {"should_change": True, "value": "Child To Move"},
            "parent_dir_ref_id": {
                "should_change": True,
                "value": parent.ref_id,
            },
        },
        timeout=10,
    )
    assert response.status_code == 200

    load_parent = requests.get(
        f"{api_url}/v1/docs/dirs/{parent.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load_parent.status_code == 200
    child_names = [s["dir"]["name"] for s in load_parent.json()["subdirs"]]
    assert "Child To Move" in child_names


def test_api_docs_doc_move_to_other_dir(
    api_url: str, api_key: str, create_doc, create_dir
) -> None:
    dir_a = create_dir("Doc Move Dir A")
    dir_b = create_dir("Doc Move Dir B")
    doc = create_doc("Moving Doc")
    # Move doc from root into dir_a first (create_doc uses root)
    requests.put(
        f"{api_url}/v1/docs/docs/{doc.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": doc.ref_id,
            "name": {"should_change": True, "value": doc.name},
            "parent_dir_ref_id": {
                "should_change": True,
                "value": dir_a.ref_id,
            },
        },
        timeout=10,
    )

    response = requests.put(
        f"{api_url}/v1/docs/docs/{doc.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": doc.ref_id,
            "name": {"should_change": True, "value": doc.name},
            "parent_dir_ref_id": {
                "should_change": True,
                "value": dir_b.ref_id,
            },
        },
        timeout=10,
    )
    assert response.status_code == 200

    load_b = requests.get(
        f"{api_url}/v1/docs/dirs/{dir_b.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load_b.status_code == 200
    doc_names = [e["doc"]["name"] for e in load_b.json()["entries"]]
    assert "Moving Doc" in doc_names


def test_api_docs_dir_archive_recursive(api_url: str, api_key: str, create_dir) -> None:
    parent = create_dir("Archive Parent")
    child = create_dir("Archive Child", parent_dir_ref_id=parent.ref_id)
    doc_resp = requests.post(
        f"{api_url}/v1/docs/docs",
        headers=_headers(api_key),
        json={
            "idempotency_key": str(uuid.uuid4()),
            "name": "Doc Inside Tree",
            "content": [
                {
                    "kind": "paragraph",
                    "correlation_id": str(uuid.uuid4()),
                    "text": "nested",
                }
            ],
            "parent_dir_ref_id": child.ref_id,
        },
        timeout=10,
    )
    assert doc_resp.status_code == 200
    doc_id = doc_resp.json()["new_doc"]["ref_id"]

    arch = requests.delete(
        f"{api_url}/v1/docs/dirs/{parent.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert arch.status_code == 200

    for ref_id, kind in [
        (parent.ref_id, "parent"),
        (child.ref_id, "child"),
        (doc_id, "doc"),
    ]:
        gone = requests.get(
            (
                f"{api_url}/v1/docs/dirs/{ref_id}?allow_archived=false"
                if kind != "doc"
                else f"{api_url}/v1/docs/docs/{ref_id}?allow_archived=false"
            ),
            headers=_headers(api_key),
            timeout=10,
        )
        assert gone.status_code == 502
        assert gone.json()["status"] == 404

    ok_parent = requests.get(
        f"{api_url}/v1/docs/dirs/{parent.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert ok_parent.status_code == 200
    assert ok_parent.json()["dir"]["archived"] is True

    ok_child = requests.get(
        f"{api_url}/v1/docs/dirs/{child.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert ok_child.status_code == 200
    assert ok_child.json()["dir"]["archived"] is True

    ok_doc = requests.get(
        f"{api_url}/v1/docs/docs/{doc_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert ok_doc.status_code == 200
    assert ok_doc.json()["doc"]["archived"] is True


def test_api_docs_dir_remove_recursive(api_url: str, api_key: str, create_dir) -> None:
    parent = create_dir("Remove Parent")
    child = create_dir("Remove Child", parent_dir_ref_id=parent.ref_id)
    doc_resp = requests.post(
        f"{api_url}/v1/docs/docs",
        headers=_headers(api_key),
        json={
            "idempotency_key": str(uuid.uuid4()),
            "name": "Doc To Remove With Tree",
            "content": [
                {
                    "kind": "paragraph",
                    "correlation_id": str(uuid.uuid4()),
                    "text": "bye",
                }
            ],
            "parent_dir_ref_id": child.ref_id,
        },
        timeout=10,
    )
    assert doc_resp.status_code == 200
    doc_id = doc_resp.json()["new_doc"]["ref_id"]

    rem = requests.delete(
        f"{api_url}/v1/docs/dirs/{parent.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert rem.status_code == 200

    for ref_id, path_is_doc in [
        (parent.ref_id, False),
        (child.ref_id, False),
        (doc_id, True),
    ]:
        url = (
            f"{api_url}/v1/docs/docs/{ref_id}?allow_archived=true"
            if path_is_doc
            else f"{api_url}/v1/docs/dirs/{ref_id}?allow_archived=true"
        )
        gone = requests.get(url, headers=_headers(api_key), timeout=10)
        assert gone.status_code == 502
        assert gone.json()["status"] == 404
