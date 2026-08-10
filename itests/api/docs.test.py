"""Tests for the API for docs."""

import uuid
from collections.abc import Callable, Iterator
from typing import cast

import pytest
import requests
from jupiter_webapi_client.api.application.get_access_for_entity import (
    sync_detailed as get_access_for_entity_sync,
)
from jupiter_webapi_client.api.application.get_summaries import (
    sync_detailed as get_summaries_sync,
)
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.application.remove_grant_for_entity import (
    sync_detailed as remove_grant_for_entity_sync,
)
from jupiter_webapi_client.api.docs.dir_create import (
    sync_detailed as dir_create_sync,
)
from jupiter_webapi_client.api.docs.doc_create import (
    sync_detailed as doc_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.dir_ import Dir
from jupiter_webapi_client.models.dir_create_args import DirCreateArgs
from jupiter_webapi_client.models.dir_create_result import DirCreateResult
from jupiter_webapi_client.models.doc import Doc
from jupiter_webapi_client.models.doc_create_args import DocCreateArgs
from jupiter_webapi_client.models.doc_create_result import DocCreateResult
from jupiter_webapi_client.models.get_access_for_entity_args import (
    GetAccessForEntityArgs,
)
from jupiter_webapi_client.models.get_access_for_entity_result import (
    GetAccessForEntityResult,
)
from jupiter_webapi_client.models.get_summaries_args import GetSummariesArgs
from jupiter_webapi_client.models.get_summaries_result import GetSummariesResult
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.paragraph_block import ParagraphBlock
from jupiter_webapi_client.models.paragraph_block_kind import ParagraphBlockKind
from jupiter_webapi_client.models.remove_grant_for_entity_args import (
    RemoveGrantForEntityArgs,
)
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from jupiter_webapi_client.types import Unset

from itests.api.conftest import AnotherUserAndWorkspace
from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_docs_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.DOCS, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.DOCS, value=False),
        )


@pytest.fixture()
def get_root_dir_ref_id(
    logged_in_client: AuthenticatedClient,
) -> Callable[[], str]:
    def _get_root_dir_ref_id() -> str:
        response = get_summaries_sync(
            client=logged_in_client,
            body=GetSummariesArgs(),
        )
        result = get_parsed_from_response(GetSummariesResult, response)
        root_dir = result.root_dir
        if root_dir is None or isinstance(root_dir, Unset):
            raise ValueError("root_dir missing from get_summaries")
        return cast(str, root_dir.ref_id)

    return _get_root_dir_ref_id


@pytest.fixture()
def root_dir_ref_id(get_root_dir_ref_id: Callable[[], str]) -> str:
    return get_root_dir_ref_id()


@pytest.fixture()
def create_doc(
    logged_in_client: AuthenticatedClient, get_root_dir_ref_id: Callable[[], str]
):
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
                    else get_root_dir_ref_id()
                ),
            ),
        )
        return get_parsed_from_response(DocCreateResult, result).new_doc

    return _create


@pytest.fixture()
def create_dir(
    logged_in_client: AuthenticatedClient, get_root_dir_ref_id: Callable[[], str]
):
    def _create(name: str, *, parent_dir_ref_id: str | None = None) -> Dir:
        parent = (
            parent_dir_ref_id
            if parent_dir_ref_id is not None
            else get_root_dir_ref_id()
        )
        result = dir_create_sync(
            client=logged_in_client,
            body=DirCreateArgs(name=name, parent_dir_ref_id=parent),
        )
        return get_parsed_from_response(DirCreateResult, result).new_dir

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


_ACL_DENIED_REASON = "You are not allowed to access this entity"


def _assert_acl_denied(response: requests.Response) -> None:
    assert response.status_code == 502
    body = response.json()
    assert body["status"] == 401
    assert body["response"]["reason"] == _ACL_DENIED_REASON


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


# --- ACL tests ---


@pytest.fixture()
def another_user_with_docs_enabled(
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
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.DOCS, value=True),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.DOCS, value=False),
        )


@pytest.fixture()
def grant_doc_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_docs_enabled: AnotherUserAndWorkspace,
):
    def _grant(doc: Doc, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.DOC,
                entity_ref_id=doc.ref_id,
                user_ref_ids=[
                    another_user_with_docs_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_docs_enabled.api_key

    return _grant


@pytest.fixture()
def grant_dir_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_docs_enabled: AnotherUserAndWorkspace,
):
    def _grant(directory: Dir, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.DIR,
                entity_ref_id=directory.ref_id,
                user_ref_ids=[
                    another_user_with_docs_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_docs_enabled.api_key

    return _grant


def _doc_update_body(ref_id: str, *, name: str) -> dict[str, object]:
    return {
        "ref_id": ref_id,
        "name": {"should_change": True, "value": name},
        "parent_dir_ref_id": {"should_change": False},
    }


def _dir_update_body(*, name: str) -> dict[str, object]:
    return {
        "name": {"should_change": True, "value": name},
        "parent_dir_ref_id": {"should_change": False},
    }


def _assert_other_user_cannot_access_doc(
    api_url: str,
    *,
    doc_ref_id: str,
    other_api_key: str,
) -> None:
    load_response = requests.get(
        f"{api_url}/v1/docs/docs/{doc_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        f"{api_url}/v1/docs/docs/{doc_ref_id}",
        headers=_headers(other_api_key),
        json=_doc_update_body(doc_ref_id, name="Hacked Doc Name"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/docs/docs/{doc_ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def _assert_other_user_cannot_access_dir(
    api_url: str,
    *,
    dir_ref_id: str,
    other_api_key: str,
) -> None:
    load_response = requests.get(
        f"{api_url}/v1/docs/dirs/{dir_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        f"{api_url}/v1/docs/dirs/{dir_ref_id}",
        headers=_headers(other_api_key),
        json=_dir_update_body(name="Hacked Folder Name"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/docs/dirs/{dir_ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_docs_doc_acl_reader_can_read_but_not_update_or_archive(
    api_url: str,
    create_doc,
    grant_doc_access,
    another_user_with_docs_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_doc("Reader ACL Doc")
    other_api_key = another_user_with_docs_enabled.api_key

    _assert_other_user_cannot_access_doc(
        api_url, doc_ref_id=created.ref_id, other_api_key=other_api_key
    )

    other_api_key = grant_doc_access(created, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/docs/docs/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    body = load_response.json()
    assert body["doc"]["ref_id"] == created.ref_id
    assert body["doc"]["name"] == "Reader ACL Doc"
    assert body["owner"]["ref_id"] is not None
    assert body["access_status"]["access_level"] == "reader"

    update_response = requests.put(
        f"{api_url}/v1/docs/docs/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_doc_update_body(created.ref_id, name="Hacked Doc Name"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/docs/docs/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_docs_doc_acl_writer_can_read_and_update(
    api_url: str,
    create_doc,
    grant_doc_access,
) -> None:
    created = create_doc("Writer Update Doc")
    other_api_key = grant_doc_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/docs/docs/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    update_response = requests.put(
        f"{api_url}/v1/docs/docs/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_doc_update_body(created.ref_id, name="Updated By Writer"),
        timeout=10,
    )
    assert update_response.status_code == 200

    verify_response = requests.get(
        f"{api_url}/v1/docs/docs/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert verify_response.status_code == 200
    assert verify_response.json()["doc"]["name"] == "Updated By Writer"


def test_api_docs_doc_acl_writer_can_read_and_archive(
    api_url: str,
    create_doc,
    grant_doc_access,
) -> None:
    created = create_doc("Writer Archive Doc")
    other_api_key = grant_doc_access(created, AccessLevel.WRITER)

    archive_response = requests.delete(
        f"{api_url}/v1/docs/docs/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    archived_response = requests.get(
        f"{api_url}/v1/docs/docs/{created.ref_id}?allow_archived=true",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archived_response.status_code == 200
    assert archived_response.json()["doc"]["archived"] is True


def test_api_docs_dir_acl_reader_can_read_but_not_update_or_archive(
    api_url: str,
    create_dir,
    grant_dir_access,
    another_user_with_docs_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_dir("Reader ACL Folder")
    other_api_key = another_user_with_docs_enabled.api_key

    _assert_other_user_cannot_access_dir(
        api_url, dir_ref_id=created.ref_id, other_api_key=other_api_key
    )

    other_api_key = grant_dir_access(created, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/docs/dirs/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    body = load_response.json()
    assert body["dir"]["ref_id"] == created.ref_id
    assert body["dir"]["name"] == "Reader ACL Folder"
    assert body["owner"]["ref_id"] is not None
    assert body["access_status"]["access_level"] == "reader"

    update_response = requests.put(
        f"{api_url}/v1/docs/dirs/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_dir_update_body(name="Hacked Folder Name"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/docs/dirs/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_docs_dir_acl_writer_can_read_and_update(
    api_url: str,
    create_dir,
    grant_dir_access,
) -> None:
    created = create_dir("Writer Update Folder")
    other_api_key = grant_dir_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/docs/dirs/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    update_response = requests.put(
        f"{api_url}/v1/docs/dirs/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_dir_update_body(name="Updated By Writer"),
        timeout=10,
    )
    assert update_response.status_code == 200

    verify_response = requests.get(
        f"{api_url}/v1/docs/dirs/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert verify_response.status_code == 200
    assert verify_response.json()["dir"]["name"] == "Updated By Writer"


def test_api_docs_dir_acl_writer_can_read_and_archive(
    api_url: str,
    create_dir,
    grant_dir_access,
) -> None:
    created = create_dir("Writer Archive Folder")
    other_api_key = grant_dir_access(created, AccessLevel.WRITER)

    archive_response = requests.delete(
        f"{api_url}/v1/docs/dirs/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    archived_response = requests.get(
        f"{api_url}/v1/docs/dirs/{created.ref_id}?allow_archived=true",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archived_response.status_code == 200
    assert archived_response.json()["dir"]["archived"] is True


def test_api_docs_doc_acl_z_denied_without_grant(
    api_url: str,
    create_doc,
    another_user_with_docs_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_doc("ACL Doc")
    _assert_other_user_cannot_access_doc(
        api_url,
        doc_ref_id=created.ref_id,
        other_api_key=another_user_with_docs_enabled.api_key,
    )


def test_api_docs_dir_acl_z_denied_without_grant(
    api_url: str,
    create_dir,
    another_user_with_docs_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_dir("ACL Folder")
    _assert_other_user_cannot_access_dir(
        api_url,
        dir_ref_id=created.ref_id,
        other_api_key=another_user_with_docs_enabled.api_key,
    )


def test_api_docs_find_shared_lists_granted_dirs_and_docs(
    api_url: str,
    create_doc,
    create_dir,
    grant_doc_access,
    grant_dir_access,
    another_user_with_docs_enabled: AnotherUserAndWorkspace,
) -> None:
    shared_doc = create_doc("Shared Find Doc")
    shared_dir = create_dir("Shared Find Folder")
    create_doc("Not Shared Doc")
    create_dir("Not Shared Folder")

    other_api_key = another_user_with_docs_enabled.api_key
    empty_response = requests.get(
        f"{api_url}/v1/docs/shared?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert empty_response.status_code == 200
    assert empty_response.json()["dirs"] == []
    assert empty_response.json()["docs"] == []

    grant_doc_access(shared_doc, AccessLevel.READER)
    grant_dir_access(shared_dir, AccessLevel.WRITER)

    shared_response = requests.get(
        f"{api_url}/v1/docs/shared?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert shared_response.status_code == 200
    body = shared_response.json()
    assert [entry["doc"]["ref_id"] for entry in body["docs"]] == [shared_doc.ref_id]
    assert body["docs"][0]["access_status"]["access_level"] == "reader"
    assert body["docs"][0]["owner"]["ref_id"] is not None
    assert [entry["dir"]["ref_id"] for entry in body["dirs"]] == [shared_dir.ref_id]
    assert body["dirs"][0]["access_status"]["access_level"] == "writer"
    assert body["dirs"][0]["owner"]["ref_id"] is not None


def test_api_docs_dir_share_cascades_reader_to_nested_docs_and_subdirs(
    api_url: str,
    create_doc,
    create_dir,
    grant_dir_access,
    another_user_with_docs_enabled: AnotherUserAndWorkspace,
) -> None:
    folder = create_dir("Cascade Folder")
    nested_doc = create_doc("Cascade Nested Doc", parent_dir_ref_id=folder.ref_id)
    nested_dir = create_dir("Cascade Nested Dir", parent_dir_ref_id=folder.ref_id)
    deep_doc = create_doc("Cascade Deep Doc", parent_dir_ref_id=nested_dir.ref_id)
    other_api_key = another_user_with_docs_enabled.api_key

    _assert_other_user_cannot_access_doc(
        api_url, doc_ref_id=nested_doc.ref_id, other_api_key=other_api_key
    )
    _assert_other_user_cannot_access_dir(
        api_url, dir_ref_id=nested_dir.ref_id, other_api_key=other_api_key
    )

    other_api_key = grant_dir_access(folder, AccessLevel.READER)

    for ref_id, kind in (
        (nested_doc.ref_id, "docs"),
        (deep_doc.ref_id, "docs"),
        (nested_dir.ref_id, "dirs"),
    ):
        load_response = requests.get(
            f"{api_url}/v1/docs/{kind}/{ref_id}?allow_archived=false",
            headers=_headers(other_api_key),
            timeout=10,
        )
        assert load_response.status_code == 200
        assert load_response.json()["access_status"]["access_level"] == "reader"

    update_response = requests.put(
        f"{api_url}/v1/docs/docs/{nested_doc.ref_id}",
        headers=_headers(other_api_key),
        json=_doc_update_body(nested_doc.ref_id, name="Should Fail"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    shared_response = requests.get(
        f"{api_url}/v1/docs/shared?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert shared_response.status_code == 200
    shared_body = shared_response.json()
    assert [entry["dir"]["ref_id"] for entry in shared_body["dirs"]] == [folder.ref_id]
    assert shared_body["docs"] == []


def test_api_docs_dir_reader_plus_doc_writer_keeps_doc_writable(
    api_url: str,
    create_doc,
    create_dir,
    grant_dir_access,
    grant_doc_access,
) -> None:
    folder = create_dir("Reader Folder Writer Doc")
    nested_doc = create_doc("Stronger Grant Doc", parent_dir_ref_id=folder.ref_id)

    other_api_key = grant_dir_access(folder, AccessLevel.READER)
    other_api_key = grant_doc_access(nested_doc, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/docs/docs/{nested_doc.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    update_response = requests.put(
        f"{api_url}/v1/docs/docs/{nested_doc.ref_id}",
        headers=_headers(other_api_key),
        json=_doc_update_body(nested_doc.ref_id, name="Updated Via Stronger Grant"),
        timeout=10,
    )
    assert update_response.status_code == 200

    folder_load = requests.get(
        f"{api_url}/v1/docs/dirs/{folder.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert folder_load.status_code == 200
    assert folder_load.json()["access_status"]["access_level"] == "reader"


def test_api_docs_doc_reader_plus_dir_writer_makes_doc_writable(
    api_url: str,
    create_doc,
    create_dir,
    grant_dir_access,
    grant_doc_access,
) -> None:
    folder = create_dir("Writer Folder Over Reader Doc")
    nested_doc = create_doc("Weaker Grant Doc", parent_dir_ref_id=folder.ref_id)

    other_api_key = grant_doc_access(nested_doc, AccessLevel.READER)
    other_api_key = grant_dir_access(folder, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/docs/docs/{nested_doc.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    update_response = requests.put(
        f"{api_url}/v1/docs/docs/{nested_doc.ref_id}",
        headers=_headers(other_api_key),
        json=_doc_update_body(nested_doc.ref_id, name="Updated Via Folder Writer"),
        timeout=10,
    )
    assert update_response.status_code == 200


def test_api_docs_new_child_inherits_existing_dir_share(
    api_url: str,
    create_doc,
    create_dir,
    grant_dir_access,
) -> None:
    folder = create_dir("Pre Shared Folder")
    other_api_key = grant_dir_access(folder, AccessLevel.READER)

    nested_doc = create_doc("Created After Share", parent_dir_ref_id=folder.ref_id)
    nested_dir = create_dir("Created After Share Dir", parent_dir_ref_id=folder.ref_id)

    for ref_id, kind in (
        (nested_doc.ref_id, "docs"),
        (nested_dir.ref_id, "dirs"),
    ):
        load_response = requests.get(
            f"{api_url}/v1/docs/{kind}/{ref_id}?allow_archived=false",
            headers=_headers(other_api_key),
            timeout=10,
        )
        assert load_response.status_code == 200
        assert load_response.json()["access_status"]["access_level"] == "reader"


def test_api_docs_removing_dir_share_revokes_inherited_access(
    api_url: str,
    logged_in_client: AuthenticatedClient,
    create_doc,
    create_dir,
    grant_dir_access,
    grant_doc_access,
    another_user_with_docs_enabled: AnotherUserAndWorkspace,
) -> None:
    folder = create_dir("Revoke Cascade Folder")
    nested_doc = create_doc("Revoke Nested Doc", parent_dir_ref_id=folder.ref_id)
    stronger_doc = create_doc("Keep Direct Grant Doc", parent_dir_ref_id=folder.ref_id)

    other_api_key = grant_dir_access(folder, AccessLevel.READER)
    grant_doc_access(stronger_doc, AccessLevel.WRITER)

    access_response = get_access_for_entity_sync(
        client=logged_in_client,
        body=GetAccessForEntityArgs(
            entity_type=NamedEntityTag.DIR,
            entity_ref_id=folder.ref_id,
        ),
    )
    access_result = get_parsed_from_response(GetAccessForEntityResult, access_response)
    other_user_ref_id = another_user_with_docs_enabled.init_result.new_user.ref_id
    dir_grant = next(
        entry.access_grant
        for entry in access_result.entries
        if entry.access_grant.user_ref_id == other_user_ref_id
    )

    remove_response = remove_grant_for_entity_sync(
        client=logged_in_client,
        body=RemoveGrantForEntityArgs(
            entity_type=NamedEntityTag.DIR,
            entity_ref_id=folder.ref_id,
            access_grant_ref_id=dir_grant.ref_id,
        ),
    )
    assert remove_response.status_code == 200

    _assert_other_user_cannot_access_doc(
        api_url, doc_ref_id=nested_doc.ref_id, other_api_key=other_api_key
    )
    _assert_other_user_cannot_access_dir(
        api_url, dir_ref_id=folder.ref_id, other_api_key=other_api_key
    )

    stronger_load = requests.get(
        f"{api_url}/v1/docs/docs/{stronger_doc.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert stronger_load.status_code == 200
    assert stronger_load.json()["access_status"]["access_level"] == "writer"
