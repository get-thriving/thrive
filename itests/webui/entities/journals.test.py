"""Tests about journals."""

import re
from collections.abc import Iterator

import pendulum
import pytest
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.journals.journal_create import (
    sync_detailed as journal_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.journal import Journal
from jupiter_webapi_client.models.journal_create_args import JournalCreateArgs
from jupiter_webapi_client.models.journal_create_result import JournalCreateResult
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response, open_leaf_publish_panel
from itests.webui.entities.conftest import AnotherUserAndWorkspace

_ACCESS_DENIED_LABEL = "You do not have the right access for this entity"


@pytest.fixture(autouse=True, scope="module")
def _enable_journals_feature(logged_in_client: AuthenticatedClient):
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.JOURNALS, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.JOURNALS, value=False
            ),
        )


@pytest.fixture(autouse=True, scope="module")
def create_journal(logged_in_client: AuthenticatedClient):
    def _create_journal(
        right_now: str | None = None,
        period: RecurringTaskPeriod = RecurringTaskPeriod.DAILY,
    ) -> Journal:
        if right_now is None:
            # Use today's date as default
            right_now = pendulum.now().to_iso8601_string()

        result = journal_create_sync(
            client=logged_in_client,
            body=JournalCreateArgs(
                right_now=right_now,
                period=period,
            ),
        )
        return get_parsed_from_response(JournalCreateResult, result).new_journal

    return _create_journal


@pytest.fixture()
def another_user_with_journals_enabled(
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
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.JOURNALS, value=True),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.JOURNALS, value=False
            ),
        )


@pytest.fixture()
def grant_journal_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_journals_enabled: AnotherUserAndWorkspace,
):
    def _grant(journal: Journal, access_level: AccessLevel) -> None:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.JOURNAL,
                entity_ref_id=journal.ref_id,
                user_ref_ids=[
                    another_user_with_journals_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200

    return _grant


def _login_as_other_user(page: Page, other_user: AnotherUserAndWorkspace) -> None:
    page.locator("#account-menu").click()
    page.locator("#logout").click()
    page.wait_for_url("/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(other_user.user.email)
    page.locator('input[name="password"]').fill(other_user.user.password)
    page.locator("#login").locator("button", has_text="Login").click()
    page.wait_for_url("/app/workspace")


def _assert_other_user_cannot_access_journal_webui(
    page: Page,
    *,
    journal: Journal,
) -> None:
    page.goto("/app/workspace/apps/journals")
    expect(page.locator(f"#journal-{journal.ref_id}")).to_have_count(0)

    page.goto(f"/app/workspace/apps/journals/{journal.ref_id}")
    expect(page.locator("body")).to_contain_text(_ACCESS_DENIED_LABEL)


def test_webui_journal_acl_reader_can_read_but_not_update_or_archive(
    page: Page,
    create_journal,
    grant_journal_access,
    another_user_with_journals_enabled: AnotherUserAndWorkspace,
) -> None:
    journal = create_journal(
        right_now="2024-10-07",
        period=RecurringTaskPeriod.WEEKLY,
    )

    _login_as_other_user(page, another_user_with_journals_enabled)
    _assert_other_user_cannot_access_journal_webui(page, journal=journal)

    grant_journal_access(journal, AccessLevel.READER)

    _login_as_other_user(page, another_user_with_journals_enabled)

    page.goto("/app/workspace/apps/journals")
    expect(page.locator(f"#journal-{journal.ref_id}")).to_have_count(1)

    page.goto(f"/app/workspace/apps/journals/{journal.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="rightNow"]')).to_have_value("2024-10-07")
    expect(page.locator('input[name="rightNow"]')).to_be_disabled()
    expect(page.locator("button[id='journal-change-time-config']")).to_be_disabled()
    expect(page.locator("button[id='leaf-entity-archive']")).to_be_disabled()


def test_webui_journal_acl_writer_can_read_and_update(
    page: Page,
    create_journal,
    grant_journal_access,
    another_user_with_journals_enabled: AnotherUserAndWorkspace,
) -> None:
    journal = create_journal(
        right_now="2024-11-04",
        period=RecurringTaskPeriod.WEEKLY,
    )
    grant_journal_access(journal, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_journals_enabled)

    page.goto(f"/app/workspace/apps/journals/{journal.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="rightNow"]')).to_have_value("2024-11-04")

    page.locator('input[name="rightNow"]').fill("2024-11-11")
    page.locator("button[id='journal-change-time-config']").click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/journals/{journal.ref_id}"))
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="rightNow"]')).to_have_value("2024-11-11")


def test_webui_journal_acl_writer_can_read_and_archive(
    page: Page,
    create_journal,
    grant_journal_access,
    another_user_with_journals_enabled: AnotherUserAndWorkspace,
) -> None:
    journal = create_journal(
        right_now="2024-10-21",
        period=RecurringTaskPeriod.WEEKLY,
    )
    grant_journal_access(journal, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_journals_enabled)

    page.goto(f"/app/workspace/apps/journals/{journal.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/journals/{journal.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="rightNow"]')).to_be_disabled()
    expect(page.locator("button[id='journal-change-time-config']")).to_be_disabled()


def test_webui_journal_acl_z_denied_without_grant(
    page: Page,
    create_journal,
    another_user_with_journals_enabled: AnotherUserAndWorkspace,
) -> None:
    journal = create_journal(
        right_now="2024-10-28",
        period=RecurringTaskPeriod.WEEKLY,
    )

    _login_as_other_user(page, another_user_with_journals_enabled)
    _assert_other_user_cannot_access_journal_webui(page, journal=journal)


def test_webui_journal_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/apps/journals")

    expect(page.locator("#trunk-panel")).to_contain_text(
        "There are no journals to show"
    )


def test_webui_journal_view_all(page: Page, create_journal) -> None:
    # Create journals for different periods and dates
    journal1 = create_journal(period=RecurringTaskPeriod.DAILY)
    journal2 = create_journal(
        right_now=pendulum.now().subtract(days=1).to_iso8601_string(),
        period=RecurringTaskPeriod.WEEKLY,
    )
    journal3 = create_journal(
        right_now=pendulum.now().subtract(days=7).to_iso8601_string(),
        period=RecurringTaskPeriod.MONTHLY,
    )

    page.goto("/app/workspace/apps/journals")

    # Journals are displayed by their timeline/name, not by ref_id
    # The name is built from the date and period
    expect(page.locator(f"#journal-{journal1.ref_id}").last).to_contain_text(
        f"Daily journal for {pendulum.now().format('YYYY-MM-DD')}"
    )
    expect(page.locator(f"#journal-{journal2.ref_id}").last).to_contain_text(
        f"Weekly journal for {pendulum.now().subtract(days=1).format('YYYY-MM-DD')}"
    )
    expect(page.locator(f"#journal-{journal3.ref_id}").last).to_contain_text(
        f"Monthly journal for {pendulum.now().subtract(days=7).format('YYYY-MM-DD')}"
    )


def test_webui_journal_publish_and_view_public(page: Page, create_journal) -> None:
    journal = create_journal(
        right_now="2024-07-01",
        period=RecurringTaskPeriod.DAILY,
    )
    page.goto(f"/app/workspace/apps/journals/{journal.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Journal-publish")
    page.locator("button[id='Journal-publish-create']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/apps/journals/{journal.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Journal-publish")
    expect(page.locator("#Journal-publish")).to_contain_text("draft")

    page.locator("button[id='Journal-publish-toggle-status']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/apps/journals/{journal.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Journal-publish")
    expect(page.locator("#Journal-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/journal/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="rightNow"]')).to_have_value("2024-07-01")
