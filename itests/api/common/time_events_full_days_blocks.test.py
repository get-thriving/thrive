"""Tests for the time event full days blocks API using schedule events."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.schedule.schedule_event_full_days_create import (
    sync_detailed as schedule_event_full_days_create_sync,
)
from jupiter_webapi_client.api.schedule.schedule_stream_create_for_user import (
    sync_detailed as schedule_stream_create_for_user_sync,
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
from jupiter_webapi_client.models.schedule_stream import ScheduleStream
from jupiter_webapi_client.models.schedule_stream_color import ScheduleStreamColor
from jupiter_webapi_client.models.schedule_stream_create_for_user_args import (
    ScheduleStreamCreateForUserArgs,
)
from jupiter_webapi_client.models.schedule_stream_create_for_user_result import (
    ScheduleStreamCreateForUserResult,
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
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.SCHEDULE, value=True
            ),
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
def create_event_full_days(logged_in_client: AuthenticatedClient):
    def _create(
        stream_ref_id: str, name: str, start_date: str, duration_days: int
    ) -> tuple[ScheduleEventFullDays, dict[str, object]]:
        result = schedule_event_full_days_create_sync(
            client=logged_in_client,
            body=ScheduleEventFullDaysCreateArgs(
                schedule_stream_ref_id=stream_ref_id,
                name=name,
                start_date=start_date,
                duration_days=duration_days,
            ),
        )
        parsed = get_parsed_from_response(ScheduleEventFullDaysCreateResult, result)
        return parsed.new_schedule_event_full_days, {
            "ref_id": parsed.new_time_event_full_day_block.ref_id,
            "start_date": parsed.new_time_event_full_day_block.start_date,
            "duration_days": parsed.new_time_event_full_day_block.duration_days,
        }

    return _create


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


@pytest.fixture()
def grant_schedule_event_access(
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


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


_ACL_DENIED_REASON = "You are not allowed to access this entity"


def _assert_acl_denied(response: requests.Response) -> None:
    assert response.status_code == 502
    body = response.json()
    assert body["status"] in (401, 404)
    if body["status"] == 401:
        assert body["response"]["reason"] == _ACL_DENIED_REASON


def test_api_common_time_event_full_days_block_load(
    api_url: str, api_key: str, create_stream, create_event_full_days
) -> None:
    stream = create_stream("FD Load Stream")
    event, block = create_event_full_days(stream.ref_id, "FD Load Event", "2024-08-01", 2)

    response = requests.get(
        f"{api_url}/v1/common/time-events/full-days-blocks/{block['ref_id']}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert response.json()["full_days_block"]["ref_id"] == block["ref_id"]
    assert response.json()["schedule_event"]["ref_id"] == event.ref_id


def _assert_can_mutate_full_days(
    api_url: str,
    api_key: str,
    *,
    create_stream,
    create_event_full_days,
    grant_schedule_event_access,
    access_level: AccessLevel | None,
) -> None:
    role = access_level.value if access_level is not None else "owner"
    stream = create_stream(f"FD Mutate Stream {role}")
    event, block = create_event_full_days(
        stream.ref_id, f"FD Mutate {role}", "2024-09-01", 2
    )
    actor_api_key = (
        grant_schedule_event_access(event, access_level)
        if access_level is not None
        else api_key
    )

    load_response = requests.get(
        f"{api_url}/v1/common/time-events/full-days-blocks/{block['ref_id']}?allow_archived=false",
        headers=_headers(actor_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200

    update_response = requests.put(
        f"{api_url}/v1/schedule/events-full-days/{event.ref_id}",
        headers=_headers(actor_api_key),
        json={
            "ref_id": event.ref_id,
            "name": {"should_change": True, "value": f"Updated {role}"},
            "start_date": {"should_change": True, "value": "2024-09-05"},
            "duration_days": {"should_change": True, "value": 3},
        },
        timeout=10,
    )
    assert update_response.status_code == 200

    archive_stream = create_stream(f"FD Archive Stream {role}")
    archive_event, _ = create_event_full_days(
        archive_stream.ref_id, f"FD Archive {role}", "2024-10-01", 1
    )
    archive_actor = (
        grant_schedule_event_access(archive_event, access_level)
        if access_level is not None
        else api_key
    )
    archive_response = requests.delete(
        f"{api_url}/v1/schedule/events-full-days/{archive_event.ref_id}",
        headers=_headers(archive_actor),
        timeout=10,
    )
    assert archive_response.status_code == 200

    remove_stream = create_stream(f"FD Remove Stream {role}")
    remove_event, _ = create_event_full_days(
        remove_stream.ref_id, f"FD Remove {role}", "2024-11-01", 1
    )
    remove_actor = (
        grant_schedule_event_access(remove_event, access_level)
        if access_level is not None
        else api_key
    )
    remove_response = requests.delete(
        f"{api_url}/v1/schedule/events-full-days/{remove_event.ref_id}/remove",
        headers=_headers(remove_actor),
        timeout=10,
    )
    assert remove_response.status_code == 200


def _assert_read_only_full_days(
    api_url: str,
    api_key: str,
    *,
    create_stream,
    create_event_full_days,
    grant_schedule_event_access,
    access_level: AccessLevel,
) -> None:
    stream = create_stream(f"FD Read Stream {access_level.value}")
    event, block = create_event_full_days(
        stream.ref_id, f"FD Read {access_level.value}", "2024-12-01", 2
    )
    other_api_key = grant_schedule_event_access(event, access_level)

    load_response = requests.get(
        f"{api_url}/v1/common/time-events/full-days-blocks/{block['ref_id']}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200

    update_response = requests.put(
        f"{api_url}/v1/schedule/events-full-days/{event.ref_id}",
        headers=_headers(other_api_key),
        json={
            "ref_id": event.ref_id,
            "name": {"should_change": True, "value": "Hacked"},
            "start_date": {"should_change": True, "value": "2024-12-10"},
            "duration_days": {"should_change": True, "value": 5},
        },
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/schedule/events-full-days/{event.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)

    remove_response = requests.delete(
        f"{api_url}/v1/schedule/events-full-days/{event.ref_id}/remove",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(remove_response)


def test_api_common_time_event_full_days_block_acl_owner_can_do_everything(
    api_url: str,
    api_key: str,
    create_stream,
    create_event_full_days,
    grant_schedule_event_access,
) -> None:
    _assert_can_mutate_full_days(
        api_url,
        api_key,
        create_stream=create_stream,
        create_event_full_days=create_event_full_days,
        grant_schedule_event_access=grant_schedule_event_access,
        access_level=None,
    )


def test_api_common_time_event_full_days_block_acl_writer_can_read_and_mutate(
    api_url: str,
    api_key: str,
    create_stream,
    create_event_full_days,
    grant_schedule_event_access,
) -> None:
    _assert_can_mutate_full_days(
        api_url,
        api_key,
        create_stream=create_stream,
        create_event_full_days=create_event_full_days,
        grant_schedule_event_access=grant_schedule_event_access,
        access_level=AccessLevel.WRITER,
    )


def test_api_common_time_event_full_days_block_acl_commenter_can_only_read(
    api_url: str,
    api_key: str,
    create_stream,
    create_event_full_days,
    grant_schedule_event_access,
) -> None:
    _assert_read_only_full_days(
        api_url,
        api_key,
        create_stream=create_stream,
        create_event_full_days=create_event_full_days,
        grant_schedule_event_access=grant_schedule_event_access,
        access_level=AccessLevel.COMMENTER,
    )


def test_api_common_time_event_full_days_block_acl_reader_can_only_read(
    api_url: str,
    api_key: str,
    create_stream,
    create_event_full_days,
    grant_schedule_event_access,
) -> None:
    _assert_read_only_full_days(
        api_url,
        api_key,
        create_stream=create_stream,
        create_event_full_days=create_event_full_days,
        grant_schedule_event_access=grant_schedule_event_access,
        access_level=AccessLevel.READER,
    )
