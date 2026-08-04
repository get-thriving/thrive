"""Tests about schedule."""

import re
from collections.abc import Iterator

import pendulum
import pytest
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
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
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
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response, open_leaf_publish_panel
from itests.webui.entities.conftest import AnotherUserAndWorkspace


@pytest.fixture(autouse=True, scope="module")
def _enable_schedule_feature(logged_in_client: AuthenticatedClient):
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


@pytest.fixture(autouse=True, scope="module")
def create_schedule_stream(logged_in_client: AuthenticatedClient):
    def _create_schedule_stream(
        name: str,
        color: ScheduleStreamColor = ScheduleStreamColor.BLUE,
    ) -> ScheduleStream:
        result = schedule_stream_create_for_user_sync(
            client=logged_in_client,
            body=ScheduleStreamCreateForUserArgs(
                name=name,
                color=color,
            ),
        )
        return get_parsed_from_response(
            ScheduleStreamCreateForUserResult, result
        ).new_schedule_stream

    return _create_schedule_stream


@pytest.fixture(autouse=True, scope="module")
def create_schedule_event_in_day(logged_in_client: AuthenticatedClient):
    def _create_schedule_event_in_day(
        schedule_stream_ref_id: str,
        name: str,
        start_date: str | None = None,
        start_time_in_day: str = "09:00",
        duration_mins: int = 60,
    ) -> ScheduleEventInDay:
        if start_date is None:
            start_date = pendulum.now().to_iso8601_string()

        result = schedule_event_in_day_create_sync(
            client=logged_in_client,
            body=ScheduleEventInDayCreateArgs(
                schedule_stream_ref_id=schedule_stream_ref_id,
                name=name,
                start_date=start_date,
                start_time_in_day=start_time_in_day,
                duration_mins=duration_mins,
            ),
        )
        return get_parsed_from_response(
            ScheduleEventInDayCreateResult, result
        ).new_schedule_event_in_day

    return _create_schedule_event_in_day


@pytest.fixture(autouse=True, scope="module")
def create_schedule_event_full_days(logged_in_client: AuthenticatedClient):
    def _create_schedule_event_full_days(
        schedule_stream_ref_id: str,
        name: str,
        start_date: str,
        duration_days: int = 3,
    ) -> ScheduleEventFullDays:
        result = schedule_event_full_days_create_sync(
            client=logged_in_client,
            body=ScheduleEventFullDaysCreateArgs(
                schedule_stream_ref_id=schedule_stream_ref_id,
                name=name,
                start_date=start_date,
                duration_days=duration_days,
            ),
        )
        return get_parsed_from_response(
            ScheduleEventFullDaysCreateResult, result
        ).new_schedule_event_full_days

    return _create_schedule_event_full_days


@pytest.fixture(scope="module")
def create_schedule_export(
    logged_in_client: AuthenticatedClient, create_schedule_stream
):
    def _create_schedule_export(
        name: str,
        schedule_stream: ScheduleStream | None = None,
    ) -> ScheduleExport:
        stream = schedule_stream or create_schedule_stream(f"{name} Stream")
        result = schedule_export_create_sync(
            client=logged_in_client,
            body=ScheduleExportCreateArgs(
                name=name,
                schedule_stream_ref_ids=[stream.ref_id],
            ),
        )
        return get_parsed_from_response(
            ScheduleExportCreateResult, result
        ).new_schedule_export

    return _create_schedule_export


def test_webui_schedule_view_empty_calendar(page: Page) -> None:
    page.goto("/app/workspace/calendar")

    # Calendar view shows empty state - no specific text to check for empty calendar
    # The calendar will just show empty days
    expect(page.locator("body")).to_be_visible()


def test_webui_schedule_view_with_events(
    page: Page, create_schedule_stream, create_schedule_event_in_day
) -> None:
    # Create a schedule stream first
    schedule_stream = create_schedule_stream("Work Schedule", ScheduleStreamColor.BLUE)

    today = pendulum.now()

    # Create some events
    event1 = create_schedule_event_in_day(
        schedule_stream.ref_id,
        "Morning Meeting",
        today.to_iso8601_string(),
        "09:00",
        60,
    )
    event2 = create_schedule_event_in_day(
        schedule_stream.ref_id,
        "Lunch Break",
        today.to_iso8601_string(),
        "12:00",
        30,
    )
    event3_date = today.add(days=1) if today.day_of_week != 6 else today.add(days=-1)
    event3 = create_schedule_event_in_day(
        schedule_stream.ref_id,
        "Aspect Review",
        event3_date.to_iso8601_string(),
        "14:00",
        90,
    )

    page.goto("/app/workspace/calendar")

    # The events should be visible in the calendar view
    expect(
        page.locator(f"#schedule-event-in-day-block-{event1.ref_id}")
    ).to_contain_text(re.compile(r".*Morning.*"))
    expect(
        page.locator(f"#schedule-event-in-day-block-{event2.ref_id}")
    ).to_contain_text(re.compile(r".*Lunch.*"))
    expect(
        page.locator(f"#schedule-event-in-day-block-{event3.ref_id}")
    ).to_contain_text(re.compile(r".*Aspect.*"))


def test_webui_schedule_event_in_day_publish_and_view_public(
    page: Page, create_schedule_stream, create_schedule_event_in_day
) -> None:
    schedule_stream = create_schedule_stream("Publish Stream")
    event = create_schedule_event_in_day(
        schedule_stream.ref_id,
        "Published In Day Event",
        "2024-07-01",
        "09:00",
        60,
    )
    page.goto(f"/app/workspace/calendar/schedule/event-in-day/{event.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "ScheduleEventInDay-publish")
    page.locator("button[id='ScheduleEventInDay-publish-create']").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/calendar/schedule/event-in-day/{event.ref_id}")
    )
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "ScheduleEventInDay-publish")
    expect(page.locator("#ScheduleEventInDay-publish")).to_contain_text("draft")

    page.locator("button[id='ScheduleEventInDay-publish-toggle-status']").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/calendar/schedule/event-in-day/{event.ref_id}")
    )
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "ScheduleEventInDay-publish")
    expect(page.locator("#ScheduleEventInDay-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/schedule-event-in-day/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Published In Day Event")
    expect(page.locator('input[name="startDate"]')).to_have_value("2024-07-01")
    expect(page.locator('input[name="startTimeInDay"]')).to_have_value("09:00")


def test_webui_schedule_stream_publish_and_view_public(
    page: Page, create_schedule_stream, create_schedule_event_in_day
) -> None:
    schedule_stream = create_schedule_stream("Published Stream Calendar")
    event = create_schedule_event_in_day(
        schedule_stream.ref_id,
        "Stream Calendar Event",
        "2024-07-01",
        "09:00",
        60,
    )

    page.goto(f"/app/workspace/calendar/schedule/stream/{schedule_stream.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "ScheduleStream-publish")
    page.locator("button[id='ScheduleStream-publish-create']").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/calendar/schedule/stream/{schedule_stream.ref_id}")
    )
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "ScheduleStream-publish")
    page.locator("button[id='ScheduleStream-publish-toggle-status']").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/calendar/schedule/stream/{schedule_stream.ref_id}")
    )
    page.wait_for_selector("#leaf-panel")

    # Wait until the activation has actually committed (the panel reflects the
    # active status) before navigating to the public URL. Otherwise the guest
    # load can race the activation and 404, since publishEntityLoadByExternalId
    # only serves active entities.
    open_leaf_publish_panel(page, "ScheduleStream-publish")
    expect(page.locator("#ScheduleStream-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/schedule-stream/"))
    page.wait_for_selector("#leaf-panel")

    page.goto(f"{public_url.split('?')[0]}?date=2024-07-01&period=daily&view=calendar")
    page.wait_for_selector("#leaf-panel")
    expect(
        page.locator(f"#schedule-event-in-day-block-{event.ref_id}")
    ).to_contain_text(re.compile(r".*Stream Calendar.*"))

    page.locator(f"#schedule-event-in-day-block-{event.ref_id}").click()
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Stream Calendar Event")


def test_webui_schedule_event_full_days_publish_and_view_public(
    page: Page, create_schedule_stream, create_schedule_event_full_days
) -> None:
    schedule_stream = create_schedule_stream("Publish Full Days Stream")
    event = create_schedule_event_full_days(
        schedule_stream.ref_id,
        "Published Full Days Event",
        "2024-07-01",
        3,
    )
    page.goto(f"/app/workspace/calendar/schedule/event-full-days/{event.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "ScheduleEventFullDays-publish")
    page.locator("button[id='ScheduleEventFullDays-publish-create']").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/calendar/schedule/event-full-days/{event.ref_id}")
    )
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "ScheduleEventFullDays-publish")
    expect(page.locator("#ScheduleEventFullDays-publish")).to_contain_text("draft")

    page.locator("button[id='ScheduleEventFullDays-publish-toggle-status']").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/calendar/schedule/event-full-days/{event.ref_id}")
    )
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "ScheduleEventFullDays-publish")
    expect(page.locator("#ScheduleEventFullDays-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/schedule-event-full-days/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value(
        "Published Full Days Event"
    )
    expect(page.locator('input[name="startDate"]')).to_have_value("2024-07-01")
    expect(page.locator('input[name="durationDays"]')).to_have_value("3")


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


def _login_as_other_user(page: Page, other_user: AnotherUserAndWorkspace) -> None:
    page.locator("#account-menu").click()
    page.locator("#logout").click()
    page.wait_for_url("/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(other_user.user.email)
    page.locator('input[name="password"]').fill(other_user.user.password)
    page.locator("#login").locator("button", has_text="Login").click()
    page.wait_for_url("/app/workspace")


def test_webui_schedule_stream_acl(
    page: Page,
    create_schedule_stream,
    another_user_with_schedule_enabled: AnotherUserAndWorkspace,
) -> None:
    schedule_stream = create_schedule_stream("ACL Stream")

    _login_as_other_user(page, another_user_with_schedule_enabled)

    page.goto("/app/workspace/calendar/schedule/stream")
    expect(page.locator(f"#schedule-stream-{schedule_stream.ref_id}")).to_have_count(0)

    page.goto(f"/app/workspace/calendar/schedule/stream/{schedule_stream.ref_id}")
    expect(page.locator("body")).to_contain_text(
        "You do not have the right access for this entity"
    )


def test_webui_schedule_event_in_day_acl(
    page: Page,
    create_schedule_stream,
    create_schedule_event_in_day,
    another_user_with_schedule_enabled: AnotherUserAndWorkspace,
) -> None:
    schedule_stream = create_schedule_stream("ACL In Day Stream")
    event = create_schedule_event_in_day(
        schedule_stream.ref_id,
        "ACL In Day Event",
        "2025-01-06",
        "09:00",
        30,
    )

    _login_as_other_user(page, another_user_with_schedule_enabled)

    page.goto(f"/app/workspace/calendar/schedule/event-in-day/{event.ref_id}")
    expect(page.locator("body")).to_contain_text(
        "You do not have the right access for this entity"
    )


def test_webui_schedule_event_full_days_acl(
    page: Page,
    create_schedule_stream,
    create_schedule_event_full_days,
    another_user_with_schedule_enabled: AnotherUserAndWorkspace,
) -> None:
    schedule_stream = create_schedule_stream("ACL Full Days Stream")
    event = create_schedule_event_full_days(
        schedule_stream.ref_id,
        "ACL Full Days Event",
        "2025-01-06",
        2,
    )

    _login_as_other_user(page, another_user_with_schedule_enabled)

    page.goto(f"/app/workspace/calendar/schedule/event-full-days/{event.ref_id}")
    expect(page.locator("body")).to_contain_text(
        "You do not have the right access for this entity"
    )


def test_webui_schedule_export_acl(
    page: Page,
    create_schedule_export,
    another_user_with_schedule_enabled: AnotherUserAndWorkspace,
) -> None:
    schedule_export = create_schedule_export("ACL Export")

    _login_as_other_user(page, another_user_with_schedule_enabled)

    page.goto("/app/workspace/calendar/schedule/export")
    expect(page.locator(f"#schedule-export-{schedule_export.ref_id}")).to_have_count(0)

    page.goto(f"/app/workspace/calendar/schedule/export/{schedule_export.ref_id}")
    expect(page.locator("body")).to_contain_text(
        "You do not have the right access for this entity"
    )
