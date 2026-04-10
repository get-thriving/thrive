"""Tests for the API for docs."""

import uuid

import pytest
import requests
from jupiter_webapi_client.api.docs.doc_create import (
    sync_detailed as doc_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.doc import Doc
from jupiter_webapi_client.models.doc_create_args import DocCreateArgs
from jupiter_webapi_client.models.doc_create_result import DocCreateResult
from jupiter_webapi_client.models.paragraph_block import ParagraphBlock
from jupiter_webapi_client.models.paragraph_block_kind import ParagraphBlockKind

from itests.helpers import get_parsed_from_response


@pytest.fixture()
def create_doc(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> Doc:
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
            ),
        )
        return get_parsed_from_response(DocCreateResult, result).new_doc

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def test_api_doc_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/docs",
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
        },
        timeout=10,
    )
    assert response.status_code == 200

    doc = response.json()["new_doc"]
    assert doc["name"] == "My First Doc"
    assert doc["archived"] is False
    assert "ref_id" in doc


def test_api_doc_load(api_url: str, api_key: str, create_doc) -> None:
    created = create_doc("Load Doc")

    response = requests.get(
        f"{api_url}/v1/docs/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    doc = response.json()["doc"]
    assert doc["ref_id"] == created.ref_id
    assert doc["name"] == "Load Doc"
    note = response.json()["note"]
    assert note["owner"] == f"Doc:{created.ref_id}:std"
    assert len(note["content"]) == 1
    assert note["content"][0]["kind"] == "paragraph"
    assert note["content"][0]["text"] == "Content for Load Doc"


def test_api_doc_find(api_url: str, api_key: str, create_doc) -> None:
    create_doc("Doc Alpha")
    create_doc("Doc Beta")

    response = requests.get(
        f"{api_url}/v1/docs?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [e["doc"]["name"] for e in response.json()["entries"]]
    assert "Doc Alpha" in names
    assert "Doc Beta" in names


def test_api_doc_update(api_url: str, api_key: str, create_doc) -> None:
    created = create_doc("Old Doc Name")

    response = requests.put(
        f"{api_url}/v1/docs/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "New Doc Name"},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/docs/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["doc"]["name"] == "New Doc Name"


def test_api_doc_archive(api_url: str, api_key: str, create_doc) -> None:
    created = create_doc("Archive Doc")

    response = requests.delete(
        f"{api_url}/v1/docs/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response1 = requests.get(
        f"{api_url}/v1/docs/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response1.status_code == 502
    assert response1.json()["status"] == 404

    response2 = requests.get(
        f"{api_url}/v1/docs/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["doc"]["archived"] is True


def test_api_doc_remove(api_url: str, api_key: str, create_doc) -> None:
    created = create_doc("Remove Doc")

    response = requests.delete(
        f"{api_url}/v1/docs/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/docs/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_doc_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/docs?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401
