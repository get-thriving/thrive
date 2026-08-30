"""Tests for the API for schedule."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.schedule.schedule_event_full_days_create import (
    sync_detailed as schedule_event_full_days_create_sync,
)
from jupiter_webapi_client.api.schedule.schedule_event_in_day_create import (
    sync_detailed as schedule_event_in_day_create_sync,
)
from jupiter_webapi_client.api.schedule.schedule_export_create import (
    sync_detailed as schedule_export_create_sync,
)
from jupiter_webapi_client.api.schedule.schedule_stream_create_for_user import (
    sync_detailed as schedule_stream_create_for_user_sync,
)
from jupiter_webapi_client.api.schedule.schedule_stream_find import (
    sync_detailed as schedule_stream_find_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.schedule_event_full_days import ScheduleEventFullDays
from jupiter_webapi_client.models.schedule_event_full_days_create_args import (
    ScheduleEventFullDaysCreateArgs,
)
from jupiter_webapi_client.models.schedule_event_full_days_create_result import (
    ScheduleEventFullDaysCreateResult,
)
from jupiter_webapi_client.models.schedule_event_in_day import ScheduleEventInDay
from jupiter_webapi_client.models.schedule_event_in_day_create_args import (
    ScheduleEventInDayCreateArgs,
)
from jupiter_webapi_client.models.schedule_event_in_day_create_result import (
    ScheduleEventInDayCreateResult,
)
from jupiter_webapi_client.models.schedule_export import ScheduleExport
from jupiter_webapi_client.models.schedule_export_create_args import (
    ScheduleExportCreateArgs,
)
from jupiter_webapi_client.models.schedule_export_create_result import (
    ScheduleExportCreateResult,
)
from jupiter_webapi_client.models.schedule_stream import ScheduleStream
from jupiter_webapi_client.models.schedule_stream_color import ScheduleStreamColor
from jupiter_webapi_client.models.schedule_stream_create_for_user_args import (
    ScheduleStreamCreateForUserArgs,
)
from jupiter_webapi_client.models.schedule_stream_create_for_user_result import (
    ScheduleStreamCreateForUserResult,
)
from jupiter_webapi_client.models.schedule_stream_find_args import (
    ScheduleStreamFindArgs,
)
from jupiter_webapi_client.models.schedule_stream_find_result import (
    ScheduleStreamFindResult,
)
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.api.conftest import AnotherUserAndWorkspace
from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_schedule_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.SCHEDULE, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.SCHEDULE, value=False
            ),
        )


@pytest.fixture()
def create_stream(logged_in_client: AuthenticatedClient):
    def _create(
        name: str, color: ScheduleStreamColor = ScheduleStreamColor.BLUE
    ) -> ScheduleStream:
        result = schedule_stream_create_for_user_sync(
            client=logged_in_client,
            body=ScheduleStreamCreateForUserArgs(name=name, color=color),
        )
        return get_parsed_from_response(
            ScheduleStreamCreateForUserResult, result
        ).new_schedule_stream

    return _create


@pytest.fixture()
def get_default_stream_ref_id(logged_in_client: AuthenticatedClient):
    def _get() -> str:
        result = schedule_stream_find_sync(
            client=logged_in_client,
            body=ScheduleStreamFindArgs(
                allow_archived=False,
                include_notes=False,
                include_tags=False,
            ),
        )
        entries = get_parsed_from_response(ScheduleStreamFindResult, result).entries
        return entries[0].schedule_stream.ref_id

    return _get


@pytest.fixture()
def create_event_full_days(logged_in_client: AuthenticatedClient):
    def _create(
        stream_ref_id: str, name: str, start_date: str, duration_days: int
    ) -> ScheduleEventFullDays:
        result = schedule_event_full_days_create_sync(
            client=logged_in_client,
            body=ScheduleEventFullDaysCreateArgs(
                schedule_stream_ref_id=stream_ref_id,
                name=name,
                start_date=start_date,
                duration_days=duration_days,
            ),
        )
        return get_parsed_from_response(
            ScheduleEventFullDaysCreateResult, result
        ).new_schedule_event_full_days

    return _create


@pytest.fixture()
def create_event_in_day(logged_in_client: AuthenticatedClient):
    def _create(
        stream_ref_id: str,
        name: str,
        start_date: str,
        start_time_in_day: str,
        duration_mins: int,
    ) -> ScheduleEventInDay:
        result = schedule_event_in_day_create_sync(
            client=logged_in_client,
            body=ScheduleEventInDayCreateArgs(
                schedule_stream_ref_id=stream_ref_id,
                name=name,
                start_date=start_date,
                start_time_in_day=start_time_in_day,
                duration_mins=duration_mins,
            ),
        )
        return get_parsed_from_response(
            ScheduleEventInDayCreateResult, result
        ).new_schedule_event_in_day

    return _create


@pytest.fixture()
def create_export(logged_in_client: AuthenticatedClient, create_stream):
    def _create(name: str, stream: ScheduleStream | None = None) -> ScheduleExport:
        schedule_stream = stream or create_stream(f"{name} Stream")
        result = schedule_export_create_sync(
            client=logged_in_client,
            body=ScheduleExportCreateArgs(
                name=name,
                schedule_stream_ref_ids=[schedule_stream.ref_id],
            ),
        )
        return get_parsed_from_response(
            ScheduleExportCreateResult, result
        ).new_schedule_export

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


_ACL_DENIED_REASON = "You are not allowed to access this entity"


def _assert_acl_denied(response: requests.Response) -> None:
    assert response.status_code == 502
    body = response.json()
    assert body["status"] == 401
    assert body["response"]["reason"] == _ACL_DENIED_REASON


@pytest.fixture()
def another_user_with_schedule_enabled(
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
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.SCHEDULE, value=True),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.SCHEDULE, value=False
            ),
        )


# --- Schedule Stream tests ---


def test_api_schedule_stream_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/schedule/streams/for-user",
        headers=_headers(api_key),
        json={
            "name": "Work",
            "color": "green",
        },
        timeout=10,
    )
    assert response.status_code == 200

    stream = response.json()["new_schedule_stream"]
    assert stream["name"] == "Work"
    assert stream["color"] == "green"
    assert stream["source"] == "user"
    assert stream["archived"] is False
    assert "ref_id" in stream


def test_api_schedule_stream_load(api_url: str, api_key: str, create_stream) -> None:
    created = create_stream("Load Stream")

    response = requests.get(
        f"{api_url}/v1/schedule/streams/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    stream = response.json()["schedule_stream"]
    assert stream["ref_id"] == created.ref_id
    assert stream["name"] == "Load Stream"


def test_api_schedule_stream_find(api_url: str, api_key: str, create_stream) -> None:
    create_stream("Stream Alpha")
    create_stream("Stream Beta")

    response = requests.get(
        f"{api_url}/v1/schedule/streams?allow_archived=false&include_notes=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [e["schedule_stream"]["name"] for e in response.json()["entries"]]
    assert "Stream Alpha" in names
    assert "Stream Beta" in names


def test_api_schedule_stream_update(api_url: str, api_key: str, create_stream) -> None:
    created = create_stream("Old Stream")

    response = requests.put(
        f"{api_url}/v1/schedule/streams/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "New Stream"},
            "color": {"should_change": True, "value": "red"},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/schedule/streams/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["schedule_stream"]["name"] == "New Stream"
    assert response2.json()["schedule_stream"]["color"] == "red"


def test_api_schedule_stream_archive(api_url: str, api_key: str, create_stream) -> None:
    created = create_stream("Archive Stream")

    response = requests.delete(
        f"{api_url}/v1/schedule/streams/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/schedule/streams/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["schedule_stream"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/schedule/streams/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_schedule_stream_remove(api_url: str, api_key: str, create_stream) -> None:
    created = create_stream("Remove Stream")

    response = requests.delete(
        f"{api_url}/v1/schedule/streams/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/schedule/streams/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


# --- Schedule Event Full Days tests ---


def test_api_schedule_event_full_days_create(
    api_url: str, api_key: str, create_stream
) -> None:
    stream = create_stream("FD Create Stream")

    response = requests.post(
        f"{api_url}/v1/schedule/events-full-days",
        headers=_headers(api_key),
        json={
            "schedule_stream_ref_id": stream.ref_id,
            "name": "Team Offsite",
            "start_date": "2024-07-15",
            "duration_days": 3,
        },
        timeout=10,
    )
    assert response.status_code == 200

    event = response.json()["new_schedule_event_full_days"]
    assert event["name"] == "Team Offsite"
    assert event["schedule_stream_ref_id"] == stream.ref_id
    assert event["archived"] is False
    assert "ref_id" in event

    block = response.json()["new_time_event_full_day_block"]
    assert block["start_date"] == "2024-07-15"
    assert block["duration_days"] == 3


def test_api_schedule_event_full_days_load(
    api_url: str, api_key: str, create_stream, create_event_full_days
) -> None:
    stream = create_stream("FD Load Stream")
    event = create_event_full_days(stream.ref_id, "Load FD Event", "2024-08-01", 2)

    response = requests.get(
        f"{api_url}/v1/schedule/events-full-days/{event.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    ev = response.json()["schedule_event_full_days"]
    assert ev["ref_id"] == event.ref_id
    assert ev["name"] == "Load FD Event"

    block = response.json()["time_event_full_days_block"]
    assert block["start_date"] == "2024-08-01"
    assert block["duration_days"] == 2


def test_api_schedule_event_full_days_update(
    api_url: str, api_key: str, create_stream, create_event_full_days
) -> None:
    stream = create_stream("FD Update Stream")
    event = create_event_full_days(stream.ref_id, "Old FD Event", "2024-09-01", 1)

    response = requests.put(
        f"{api_url}/v1/schedule/events-full-days/{event.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": event.ref_id,
            "name": {"should_change": True, "value": "New FD Event"},
            "start_date": {"should_change": True, "value": "2024-09-05"},
            "duration_days": {"should_change": True, "value": 4},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/schedule/events-full-days/{event.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["schedule_event_full_days"]["name"] == "New FD Event"
    assert response2.json()["time_event_full_days_block"]["start_date"] == "2024-09-05"
    assert response2.json()["time_event_full_days_block"]["duration_days"] == 4


def test_api_schedule_event_full_days_change_stream(
    api_url: str, api_key: str, create_stream, create_event_full_days
) -> None:
    stream1 = create_stream("FD Stream 1")
    stream2 = create_stream("FD Stream 2")
    event = create_event_full_days(stream1.ref_id, "Move FD Event", "2024-09-10", 1)

    response = requests.post(
        f"{api_url}/v1/schedule/events-full-days/{event.ref_id}/change-stream",
        headers=_headers(api_key),
        json={
            "ref_id": event.ref_id,
            "schedule_stream_ref_id": stream2.ref_id,
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/schedule/events-full-days/{event.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert (
        response2.json()["schedule_event_full_days"]["schedule_stream_ref_id"]
        == stream2.ref_id
    )


def test_api_schedule_event_full_days_archive(
    api_url: str, api_key: str, create_stream, create_event_full_days
) -> None:
    stream = create_stream("FD Archive Stream")
    event = create_event_full_days(stream.ref_id, "Archive FD Event", "2024-10-01", 1)

    response = requests.delete(
        f"{api_url}/v1/schedule/events-full-days/{event.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/schedule/events-full-days/{event.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["schedule_event_full_days"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/schedule/events-full-days/{event.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_schedule_event_full_days_remove(
    api_url: str, api_key: str, create_stream, create_event_full_days
) -> None:
    stream = create_stream("FD Remove Stream")
    event = create_event_full_days(stream.ref_id, "Remove FD Event", "2024-10-15", 1)

    response = requests.delete(
        f"{api_url}/v1/schedule/events-full-days/{event.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/schedule/events-full-days/{event.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


# --- Schedule Event In Day tests ---


def test_api_schedule_event_in_day_create(
    api_url: str, api_key: str, create_stream
) -> None:
    stream = create_stream("ID Create Stream")

    response = requests.post(
        f"{api_url}/v1/schedule/events-in-day",
        headers=_headers(api_key),
        json={
            "schedule_stream_ref_id": stream.ref_id,
            "name": "Standup Meeting",
            "start_date": "2024-07-15",
            "start_time_in_day": "09:00",
            "duration_mins": 30,
        },
        timeout=10,
    )
    assert response.status_code == 200

    event = response.json()["new_schedule_event_in_day"]
    assert event["name"] == "Standup Meeting"
    assert event["schedule_stream_ref_id"] == stream.ref_id
    assert event["archived"] is False
    assert "ref_id" in event

    block = response.json()["new_time_event_in_day_block"]
    assert block["start_date"] == "2024-07-15"
    assert block["start_time_in_day"] == "09:00"
    assert block["duration_mins"] == 30


def test_api_schedule_event_in_day_load(
    api_url: str, api_key: str, create_stream, create_event_in_day
) -> None:
    stream = create_stream("ID Load Stream")
    event = create_event_in_day(
        stream.ref_id, "Load ID Event", "2024-08-01", "14:00", 60
    )

    response = requests.get(
        f"{api_url}/v1/schedule/events-in-day/{event.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    ev = response.json()["schedule_event_in_day"]
    assert ev["ref_id"] == event.ref_id
    assert ev["name"] == "Load ID Event"

    block = response.json()["time_event_in_day_block"]
    assert block["start_date"] == "2024-08-01"
    assert block["start_time_in_day"] == "14:00"
    assert block["duration_mins"] == 60


def test_api_schedule_event_in_day_update(
    api_url: str, api_key: str, create_stream, create_event_in_day
) -> None:
    stream = create_stream("ID Update Stream")
    event = create_event_in_day(
        stream.ref_id, "Old ID Event", "2024-09-01", "10:00", 45
    )

    response = requests.put(
        f"{api_url}/v1/schedule/events-in-day/{event.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": event.ref_id,
            "name": {"should_change": True, "value": "New ID Event"},
            "start_date": {"should_change": True, "value": "2024-09-05"},
            "start_time_in_day": {"should_change": True, "value": "11:30"},
            "duration_mins": {"should_change": True, "value": 90},
            "buffer_before_mins": {"should_change": False},
            "buffer_after_mins": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/schedule/events-in-day/{event.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["schedule_event_in_day"]["name"] == "New ID Event"
    assert response2.json()["time_event_in_day_block"]["start_date"] == "2024-09-05"
    assert response2.json()["time_event_in_day_block"]["start_time_in_day"] == "11:30"
    assert response2.json()["time_event_in_day_block"]["duration_mins"] == 90


def test_api_schedule_event_in_day_change_stream(
    api_url: str, api_key: str, create_stream, create_event_in_day
) -> None:
    stream1 = create_stream("ID Stream 1")
    stream2 = create_stream("ID Stream 2")
    event = create_event_in_day(
        stream1.ref_id, "Move ID Event", "2024-09-10", "08:00", 30
    )

    response = requests.post(
        f"{api_url}/v1/schedule/events-in-day/{event.ref_id}/change-stream",
        headers=_headers(api_key),
        json={
            "ref_id": event.ref_id,
            "schedule_stream_ref_id": stream2.ref_id,
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/schedule/events-in-day/{event.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert (
        response2.json()["schedule_event_in_day"]["schedule_stream_ref_id"]
        == stream2.ref_id
    )


def test_api_schedule_event_in_day_archive(
    api_url: str, api_key: str, create_stream, create_event_in_day
) -> None:
    stream = create_stream("ID Archive Stream")
    event = create_event_in_day(
        stream.ref_id, "Archive ID Event", "2024-10-01", "16:00", 60
    )

    response = requests.delete(
        f"{api_url}/v1/schedule/events-in-day/{event.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/schedule/events-in-day/{event.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["schedule_event_in_day"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/schedule/events-in-day/{event.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_schedule_event_in_day_remove(
    api_url: str, api_key: str, create_stream, create_event_in_day
) -> None:
    stream = create_stream("ID Remove Stream")
    event = create_event_in_day(
        stream.ref_id, "Remove ID Event", "2024-10-15", "12:00", 30
    )

    response = requests.delete(
        f"{api_url}/v1/schedule/events-in-day/{event.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/schedule/events-in-day/{event.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


@pytest.fixture()
def grant_schedule_stream_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_schedule_enabled: AnotherUserAndWorkspace,
):
    def _grant(stream: ScheduleStream, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.SCHEDULESTREAM,
                entity_ref_id=stream.ref_id,
                user_ref_ids=[
                    another_user_with_schedule_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_schedule_enabled.api_key

    return _grant


@pytest.fixture()
def grant_schedule_event_in_day_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_schedule_enabled: AnotherUserAndWorkspace,
):
    def _grant(event: ScheduleEventInDay, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.SCHEDULEEVENTINDAY,
                entity_ref_id=event.ref_id,
                user_ref_ids=[
                    another_user_with_schedule_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_schedule_enabled.api_key

    return _grant


@pytest.fixture()
def grant_schedule_event_full_days_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_schedule_enabled: AnotherUserAndWorkspace,
):
    def _grant(event: ScheduleEventFullDays, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.SCHEDULEEVENTFULLDAYS,
                entity_ref_id=event.ref_id,
                user_ref_ids=[
                    another_user_with_schedule_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_schedule_enabled.api_key

    return _grant


def _stream_update_body(ref_id: str, *, name: str) -> dict[str, object]:
    return {
        "ref_id": ref_id,
        "name": {"should_change": True, "value": name},
        "color": {"should_change": False},
    }


def _event_in_day_update_body(ref_id: str, *, name: str) -> dict[str, object]:
    return {
        "ref_id": ref_id,
        "name": {"should_change": True, "value": name},
        "start_date": {"should_change": False},
        "start_time_in_day": {"should_change": False},
        "duration_mins": {"should_change": False},
        "buffer_before_mins": {"should_change": False},
        "buffer_after_mins": {"should_change": False},
    }


def _event_full_days_update_body(ref_id: str, *, name: str) -> dict[str, object]:
    return {
        "ref_id": ref_id,
        "name": {"should_change": True, "value": name},
        "start_date": {"should_change": False},
        "duration_days": {"should_change": False},
    }


def _assert_other_user_cannot_access_stream(
    api_url: str,
    *,
    stream_ref_id: str,
    owner_api_key: str,
    other_api_key: str,
) -> None:
    assert other_api_key != owner_api_key

    owner_load_response = requests.get(
        f"{api_url}/v1/schedule/streams/{stream_ref_id}?allow_archived=false",
        headers=_headers(owner_api_key),
        timeout=10,
    )
    assert owner_load_response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/schedule/streams/{stream_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        f"{api_url}/v1/schedule/streams/{stream_ref_id}",
        headers=_headers(other_api_key),
        json=_stream_update_body(stream_ref_id, name="Hacked Stream"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/schedule/streams/{stream_ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def _assert_other_user_cannot_access_event_in_day(
    api_url: str,
    *,
    event_ref_id: str,
    owner_api_key: str,
    other_api_key: str,
) -> None:
    assert other_api_key != owner_api_key
    event_url = f"{api_url}/v1/schedule/events-in-day/{event_ref_id}"

    owner_load_response = requests.get(
        f"{event_url}?allow_archived=false",
        headers=_headers(owner_api_key),
        timeout=10,
    )
    assert owner_load_response.status_code == 200

    load_response = requests.get(
        f"{event_url}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        event_url,
        headers=_headers(other_api_key),
        json=_event_in_day_update_body(event_ref_id, name="Hacked ID Event"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        event_url,
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def _assert_other_user_cannot_access_event_full_days(
    api_url: str,
    *,
    event_ref_id: str,
    owner_api_key: str,
    other_api_key: str,
) -> None:
    assert other_api_key != owner_api_key
    event_url = f"{api_url}/v1/schedule/events-full-days/{event_ref_id}"

    owner_load_response = requests.get(
        f"{event_url}?allow_archived=false",
        headers=_headers(owner_api_key),
        timeout=10,
    )
    assert owner_load_response.status_code == 200

    load_response = requests.get(
        f"{event_url}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        event_url,
        headers=_headers(other_api_key),
        json=_event_full_days_update_body(event_ref_id, name="Hacked FD Event"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        event_url,
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_schedule_stream_acl_reader_can_read_but_not_update_or_archive(
    api_url: str,
    api_key: str,
    create_stream,
    grant_schedule_stream_access,
    another_user_with_schedule_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_stream("Reader ACL Stream")
    other_api_key = another_user_with_schedule_enabled.api_key

    _assert_other_user_cannot_access_stream(
        api_url,
        stream_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=other_api_key,
    )

    other_api_key = grant_schedule_stream_access(created, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/schedule/streams/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["schedule_stream"]["name"] == "Reader ACL Stream"
    assert load_response.json()["owner"]["ref_id"] is not None
    assert load_response.json()["access_status"]["access_level"] == "reader"

    update_response = requests.put(
        f"{api_url}/v1/schedule/streams/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_stream_update_body(created.ref_id, name="Hacked Stream"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/schedule/streams/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_schedule_stream_acl_writer_can_read_and_update(
    api_url: str,
    create_stream,
    grant_schedule_stream_access,
) -> None:
    created = create_stream("Writer Update Stream")
    other_api_key = grant_schedule_stream_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/schedule/streams/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    update_response = requests.put(
        f"{api_url}/v1/schedule/streams/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_stream_update_body(created.ref_id, name="Updated By Writer"),
        timeout=10,
    )
    assert update_response.status_code == 200

    verify_response = requests.get(
        f"{api_url}/v1/schedule/streams/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert verify_response.status_code == 200
    assert verify_response.json()["schedule_stream"]["name"] == "Updated By Writer"


def test_api_schedule_stream_acl_writer_can_read_and_archive(
    api_url: str,
    create_stream,
    grant_schedule_stream_access,
) -> None:
    created = create_stream("Writer Archive Stream")
    other_api_key = grant_schedule_stream_access(created, AccessLevel.WRITER)

    archive_response = requests.delete(
        f"{api_url}/v1/schedule/streams/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    archived_response = requests.get(
        f"{api_url}/v1/schedule/streams/{created.ref_id}?allow_archived=true",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archived_response.status_code == 200
    assert archived_response.json()["schedule_stream"]["archived"] is True


def test_api_schedule_stream_acl_z_denied_without_grant(
    api_url: str,
    api_key: str,
    create_stream,
    another_user_with_schedule_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_stream("ACL Stream")
    _assert_other_user_cannot_access_stream(
        api_url,
        stream_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=another_user_with_schedule_enabled.api_key,
    )


def test_api_schedule_event_in_day_acl_reader_can_read_but_not_update_or_archive(
    api_url: str,
    api_key: str,
    create_stream,
    create_event_in_day,
    grant_schedule_event_in_day_access,
    another_user_with_schedule_enabled: AnotherUserAndWorkspace,
) -> None:
    stream = create_stream("ID Reader Stream")
    event = create_event_in_day(
        stream.ref_id, "Reader ACL ID Event", "2025-01-06", "09:00", 30
    )
    other_api_key = another_user_with_schedule_enabled.api_key

    _assert_other_user_cannot_access_event_in_day(
        api_url,
        event_ref_id=event.ref_id,
        owner_api_key=api_key,
        other_api_key=other_api_key,
    )

    other_api_key = grant_schedule_event_in_day_access(event, AccessLevel.READER)
    event_url = f"{api_url}/v1/schedule/events-in-day/{event.ref_id}"

    load_response = requests.get(
        f"{event_url}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert (
        load_response.json()["schedule_event_in_day"]["name"] == "Reader ACL ID Event"
    )
    assert load_response.json()["owner"]["ref_id"] is not None
    assert load_response.json()["access_status"]["access_level"] == "reader"

    update_response = requests.put(
        event_url,
        headers=_headers(other_api_key),
        json=_event_in_day_update_body(event.ref_id, name="Hacked ID Event"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        event_url,
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_schedule_event_in_day_acl_writer_can_read_and_update(
    api_url: str,
    create_stream,
    create_event_in_day,
    grant_schedule_event_in_day_access,
) -> None:
    stream = create_stream("ID Writer Update Stream")
    event = create_event_in_day(
        stream.ref_id, "Writer Update ID Event", "2025-01-06", "09:00", 30
    )
    other_api_key = grant_schedule_event_in_day_access(event, AccessLevel.WRITER)
    event_url = f"{api_url}/v1/schedule/events-in-day/{event.ref_id}"

    load_response = requests.get(
        f"{event_url}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    update_response = requests.put(
        event_url,
        headers=_headers(other_api_key),
        json=_event_in_day_update_body(event.ref_id, name="Updated By Writer"),
        timeout=10,
    )
    assert update_response.status_code == 200

    verify_response = requests.get(
        f"{event_url}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert verify_response.status_code == 200
    assert (
        verify_response.json()["schedule_event_in_day"]["name"] == "Updated By Writer"
    )


def test_api_schedule_event_in_day_acl_writer_can_read_and_archive(
    api_url: str,
    create_stream,
    create_event_in_day,
    grant_schedule_event_in_day_access,
) -> None:
    stream = create_stream("ID Writer Archive Stream")
    event = create_event_in_day(
        stream.ref_id, "Writer Archive ID Event", "2025-01-06", "09:00", 30
    )
    other_api_key = grant_schedule_event_in_day_access(event, AccessLevel.WRITER)
    event_url = f"{api_url}/v1/schedule/events-in-day/{event.ref_id}"

    archive_response = requests.delete(
        event_url,
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    archived_response = requests.get(
        f"{event_url}?allow_archived=true",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archived_response.status_code == 200
    assert archived_response.json()["schedule_event_in_day"]["archived"] is True


def test_api_schedule_event_in_day_acl_z_denied_without_grant(
    api_url: str,
    api_key: str,
    create_stream,
    create_event_in_day,
    another_user_with_schedule_enabled: AnotherUserAndWorkspace,
) -> None:
    stream = create_stream("ID ACL Stream")
    event = create_event_in_day(
        stream.ref_id, "ACL ID Event", "2025-01-06", "09:00", 30
    )
    _assert_other_user_cannot_access_event_in_day(
        api_url,
        event_ref_id=event.ref_id,
        owner_api_key=api_key,
        other_api_key=another_user_with_schedule_enabled.api_key,
    )


def test_api_schedule_event_full_days_acl_reader_can_read_but_not_update_or_archive(
    api_url: str,
    api_key: str,
    create_stream,
    create_event_full_days,
    grant_schedule_event_full_days_access,
    another_user_with_schedule_enabled: AnotherUserAndWorkspace,
) -> None:
    stream = create_stream("FD Reader Stream")
    event = create_event_full_days(
        stream.ref_id, "Reader ACL FD Event", "2025-01-06", 2
    )
    other_api_key = another_user_with_schedule_enabled.api_key

    _assert_other_user_cannot_access_event_full_days(
        api_url,
        event_ref_id=event.ref_id,
        owner_api_key=api_key,
        other_api_key=other_api_key,
    )

    other_api_key = grant_schedule_event_full_days_access(event, AccessLevel.READER)
    event_url = f"{api_url}/v1/schedule/events-full-days/{event.ref_id}"

    load_response = requests.get(
        f"{event_url}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert (
        load_response.json()["schedule_event_full_days"]["name"]
        == "Reader ACL FD Event"
    )
    assert load_response.json()["owner"]["ref_id"] is not None
    assert load_response.json()["access_status"]["access_level"] == "reader"

    update_response = requests.put(
        event_url,
        headers=_headers(other_api_key),
        json=_event_full_days_update_body(event.ref_id, name="Hacked FD Event"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        event_url,
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_schedule_event_full_days_acl_writer_can_read_and_update(
    api_url: str,
    create_stream,
    create_event_full_days,
    grant_schedule_event_full_days_access,
) -> None:
    stream = create_stream("FD Writer Update Stream")
    event = create_event_full_days(
        stream.ref_id, "Writer Update FD Event", "2025-01-06", 2
    )
    other_api_key = grant_schedule_event_full_days_access(event, AccessLevel.WRITER)
    event_url = f"{api_url}/v1/schedule/events-full-days/{event.ref_id}"

    load_response = requests.get(
        f"{event_url}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    update_response = requests.put(
        event_url,
        headers=_headers(other_api_key),
        json=_event_full_days_update_body(event.ref_id, name="Updated By Writer"),
        timeout=10,
    )
    assert update_response.status_code == 200

    verify_response = requests.get(
        f"{event_url}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert verify_response.status_code == 200
    assert (
        verify_response.json()["schedule_event_full_days"]["name"]
        == "Updated By Writer"
    )


def test_api_schedule_event_full_days_acl_writer_can_read_and_archive(
    api_url: str,
    create_stream,
    create_event_full_days,
    grant_schedule_event_full_days_access,
) -> None:
    stream = create_stream("FD Writer Archive Stream")
    event = create_event_full_days(
        stream.ref_id, "Writer Archive FD Event", "2025-01-06", 2
    )
    other_api_key = grant_schedule_event_full_days_access(event, AccessLevel.WRITER)
    event_url = f"{api_url}/v1/schedule/events-full-days/{event.ref_id}"

    archive_response = requests.delete(
        event_url,
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    archived_response = requests.get(
        f"{event_url}?allow_archived=true",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archived_response.status_code == 200
    assert archived_response.json()["schedule_event_full_days"]["archived"] is True


def test_api_schedule_event_full_days_acl_z_denied_without_grant(
    api_url: str,
    api_key: str,
    create_stream,
    create_event_full_days,
    another_user_with_schedule_enabled: AnotherUserAndWorkspace,
) -> None:
    stream = create_stream("FD ACL Stream")
    event = create_event_full_days(stream.ref_id, "ACL FD Event", "2025-01-06", 2)
    _assert_other_user_cannot_access_event_full_days(
        api_url,
        event_ref_id=event.ref_id,
        owner_api_key=api_key,
        other_api_key=another_user_with_schedule_enabled.api_key,
    )


def test_api_schedule_export_acl(
    api_url: str,
    create_export,
    another_user_with_schedule_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_export("ACL Export")
    export_url = f"{api_url}/v1/schedule/exports/{created.ref_id}"

    other_api_key = another_user_with_schedule_enabled.api_key

    load_response = requests.get(
        f"{export_url}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        export_url,
        headers=_headers(other_api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "Hacked Export"},
            "schedule_stream_ref_ids": {"should_change": False},
        },
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        export_url,
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


# --- Auth test ---


def test_api_schedule_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/schedule/streams?allow_archived=false&include_notes=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401
