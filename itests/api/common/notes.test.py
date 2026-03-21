"""Tests for the notes API using inbox tasks."""

import pytest
import requests
from jupiter_webapi_client.api.inbox_tasks.inbox_task_create import (
    sync_detailed as inbox_task_create_sync,
)
from jupiter_webapi_client.api.notes.note_create import (
    sync_detailed as note_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.inbox_task import InboxTask
from jupiter_webapi_client.models.inbox_task_create_args import InboxTaskCreateArgs
from jupiter_webapi_client.models.inbox_task_create_result import InboxTaskCreateResult
from jupiter_webapi_client.models.note import Note
from jupiter_webapi_client.models.note_create_args import NoteCreateArgs
from jupiter_webapi_client.models.note_create_result import NoteCreateResult
from jupiter_webapi_client.models.note_namespace import NoteNamespace
from jupiter_webapi_client.models.paragraph_block import ParagraphBlock
from jupiter_webapi_client.models.paragraph_block_kind import ParagraphBlockKind

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
def create_note(logged_in_client: AuthenticatedClient):
    def _create(inbox_task_ref_id: str, text: str = "Hello world") -> Note:
        result = note_create_sync(
            client=logged_in_client,
            body=NoteCreateArgs(
                namespace=NoteNamespace.TODO_TASK,
                source_entity_ref_id=inbox_task_ref_id,
                content=[
                    ParagraphBlock(
                        correlation_id="1",
                        kind=ParagraphBlockKind.PARAGRAPH,
                        text=text,
                    )
                ],
            ),
        )
        return get_parsed_from_response(NoteCreateResult, result).new_note

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def test_api_common_note_create(api_url: str, api_key: str, create_inbox_task) -> None:
    task = create_inbox_task("Note Task")

    response = requests.post(
        f"{api_url}/v1/common/notes",
        headers=_headers(api_key),
        json={
            "namespace": "inbox-task",
            "source_entity_ref_id": task.ref_id,
            "content": [
                {
                    "correlation_id": "1",
                    "kind": "paragraph",
                    "text": "My note content",
                }
            ],
        },
        timeout=10,
    )
    assert response.status_code == 200

    note = response.json()["new_note"]
    assert note["namespace"] == "inbox-task"
    assert note["source_entity_ref_id"] == task.ref_id
    assert note["archived"] is False
    assert "ref_id" in note
    assert len(note["content"]) == 1
    assert note["content"][0]["text"] == "My note content"


def test_api_common_note_load(
    api_url: str, api_key: str, create_inbox_task, create_note
) -> None:
    task = create_inbox_task("Note Load Task")
    note = create_note(task.ref_id, "Load me")

    response = requests.get(
        f"{api_url}/v1/common/notes/{note.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    loaded = response.json()["note"]
    assert loaded["ref_id"] == note.ref_id
    assert loaded["namespace"] == "inbox-task"


def test_api_common_note_find(
    api_url: str, api_key: str, create_inbox_task, create_note
) -> None:
    task = create_inbox_task("Note Find Task")
    note = create_note(task.ref_id, "Find me")

    response = requests.get(
        f"{api_url}/v1/common/notes?allow_archived=false&filter_namespace=inbox-task",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    ref_ids = [n["ref_id"] for n in response.json()["notes"]]
    assert note.ref_id in ref_ids


def test_api_common_note_update(
    api_url: str, api_key: str, create_inbox_task, create_note
) -> None:
    task = create_inbox_task("Note Update Task")
    note = create_note(task.ref_id, "Old content")

    response = requests.put(
        f"{api_url}/v1/common/notes/{note.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": note.ref_id,
            "content": {
                "should_change": True,
                "value": [
                    {
                        "correlation_id": "1",
                        "kind": "paragraph",
                        "text": "New content",
                    }
                ],
            },
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/notes/{note.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["note"]["content"][0]["text"] == "New content"


def test_api_common_note_archive(
    api_url: str, api_key: str, create_inbox_task, create_note
) -> None:
    task = create_inbox_task("Note Archive Task")
    note = create_note(task.ref_id, "Archive me")

    response = requests.delete(
        f"{api_url}/v1/common/notes/{note.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/notes/{note.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["note"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/common/notes/{note.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_common_note_remove(
    api_url: str, api_key: str, create_inbox_task, create_note
) -> None:
    task = create_inbox_task("Note Remove Task")
    note = create_note(task.ref_id, "Remove me")

    response = requests.delete(
        f"{api_url}/v1/common/notes/{note.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/notes/{note.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_common_notes_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/common/notes?allow_archived=false",
        timeout=10,
    )
    assert response.status_code == 401
