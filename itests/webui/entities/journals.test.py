"""Tests about journals."""

import re
import uuid
from collections.abc import Iterator

import pendulum
import pytest
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.journals.journal_create import (
    sync_detailed as journal_create_sync,
)
from jupiter_webapi_client.api.journals.journal_question_create import (
    sync_detailed as journal_question_create_sync,
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
from jupiter_webapi_client.models.journal_question import JournalQuestion
from jupiter_webapi_client.models.journal_question_create_args import (
    JournalQuestionCreateArgs,
)
from jupiter_webapi_client.models.journal_question_create_result import (
    JournalQuestionCreateResult,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import (
    fill_after_hydration,
    get_parsed_from_response,
    open_leaf_publish_panel,
)
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
def create_question(logged_in_client: AuthenticatedClient):
    def _create(
        name: str, period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY
    ) -> JournalQuestion:
        result = journal_question_create_sync(
            client=logged_in_client,
            body=JournalQuestionCreateArgs(name=name, period=period),
        )
        return get_parsed_from_response(
            JournalQuestionCreateResult, result
        ).new_journal_question

    return _create


def _wait_for_note_editor(page: Page) -> None:
    editor = page.locator("#entity-block-editor")
    editor.wait_for(state="visible")
    handle = editor.element_handle()
    if handle is not None:
        page.wait_for_function(
            """(el) =>
                el.dataset.editorReady === "true" ||
                !!el.querySelector("[data-editor-ready='true']")
            """,
            arg=handle,
        )


def _note_heading_texts(page: Page) -> list[str]:
    _wait_for_note_editor(page)
    return [
        text.strip()
        for text in page.locator("#entity-block-editor .ce-header").all_text_contents()
    ]


def _deselect_all_new_journal_questions(page: Page) -> None:
    cards = page.locator("[id^='journal-new-question-']")
    for index in range(cards.count()):
        _set_new_journal_question_selected(
            page, cards.nth(index).get_attribute("id"), selected=False
        )


def _set_new_journal_question_selected(
    page: Page, entity_id: str | None, *, selected: bool
) -> None:
    assert entity_id is not None
    card = page.locator(f"#{entity_id}")
    for _ in range(4):
        box_shadow = card.evaluate("el => getComputedStyle(el).boxShadow") or ""
        if ("inset" in box_shadow) == selected:
            return
        card.click()
    raise AssertionError(f"Could not set {entity_id} selected={selected}")


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


def test_webui_journal_question_create_and_update(page: Page) -> None:
    page.goto("/app/workspace/apps/journals")
    page.wait_for_selector("#trunk-panel")
    page.locator("#journals-questions").click()
    page.wait_for_selector("#branch-panel")

    page.locator("#branch-new-leaf-entity").click()
    page.wait_for_selector("#leaf-panel")
    fill_after_hydration(page.locator('input[name="name"]'), "What went well?")
    page.locator("button[id='period-weekly']").click()
    page.locator("button[id='journal-question-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/journals/questions/\d+"))
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("What went well?")

    fill_after_hydration(page.locator('input[name="name"]'), "What went better?")
    page.locator("button[id='journal-question-update']").click()
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("What went better?")


def test_webui_journal_create_shows_period_questions(
    page: Page, logged_in_client: AuthenticatedClient
) -> None:
    question = get_parsed_from_response(
        JournalQuestionCreateResult,
        journal_question_create_sync(
            client=logged_in_client,
            body=JournalQuestionCreateArgs(
                name="Weekly wins",
                period=RecurringTaskPeriod.WEEKLY,
            ),
        ),
    ).new_journal_question

    page.goto("/app/workspace/apps/journals/new")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator(f"#journal-new-question-{question.ref_id}")).to_contain_text(
        "Weekly wins"
    )


def test_webui_journal_create(page: Page) -> None:
    page.goto("/app/workspace/apps/journals")
    page.wait_for_selector("#trunk-panel")
    page.locator("a[id='trunk-new-leaf-entity']").click()
    page.wait_for_selector("#leaf-panel")

    fill_after_hydration(page.locator('input[name="rightNow"]'), "2025-02-03")
    page.locator("button[id='period-weekly']").click()
    page.locator("button[id='journal-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/journals/\d+"))
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="rightNow"]')).to_have_value("2025-02-03")
    expect(page.locator('input[name="period"]')).to_have_value("weekly")


def test_webui_journal_view_one(page: Page, create_journal) -> None:
    journal = create_journal(
        right_now="2025-02-10",
        period=RecurringTaskPeriod.WEEKLY,
    )

    page.goto(f"/app/workspace/apps/journals/{journal.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="rightNow"]')).to_have_value("2025-02-10")
    expect(page.locator('input[name="period"]')).to_have_value("weekly")


def test_webui_journal_change_time_config(page: Page, create_journal) -> None:
    journal = create_journal(
        right_now="2025-02-17",
        period=RecurringTaskPeriod.WEEKLY,
    )

    page.goto(f"/app/workspace/apps/journals/{journal.ref_id}")
    page.wait_for_selector("#leaf-panel")

    fill_after_hydration(page.locator('input[name="rightNow"]'), "2025-03-03")
    page.locator("button[id='period-monthly']").click()
    page.locator("button[id='journal-change-time-config']").click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/journals/{journal.ref_id}"))
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="rightNow"]')).to_have_value("2025-03-03")
    expect(page.locator('input[name="period"]')).to_have_value("monthly")


def test_webui_journal_load_and_update_settings(page: Page) -> None:
    page.goto("/app/workspace/apps/journals/settings")
    page.wait_for_selector("#branch-panel")
    expect(page.locator("#period-weekly")).to_have_attribute("aria-pressed", "true")

    page.locator("#period-monthly").click()
    expect(page.locator("#period-monthly")).to_have_attribute("aria-pressed", "true")
    expect(
        page.locator('input[name="generationInAdvanceDaysForMonthly"]')
    ).to_be_visible()
    page.locator("button[id='journals-settings-save']").click()
    page.wait_for_load_state("networkidle")

    page.reload()
    page.wait_for_selector("#branch-panel")
    expect(page.locator("#period-weekly")).to_have_attribute("aria-pressed", "true")
    expect(page.locator("#period-monthly")).to_have_attribute("aria-pressed", "true")


def test_webui_journal_archive(page: Page, create_journal) -> None:
    journal = create_journal(
        right_now="2025-03-10",
        period=RecurringTaskPeriod.WEEKLY,
    )

    page.goto(f"/app/workspace/apps/journals/{journal.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/journals/{journal.ref_id}"))
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="rightNow"]')).to_be_disabled()
    expect(page.locator("button[id='journal-change-time-config']")).to_be_disabled()

    page.goto("/app/workspace/apps/journals")
    page.wait_for_selector("#trunk-panel")
    expect(page.locator(f"#journal-{journal.ref_id}")).to_have_count(0)


def test_webui_journal_remove(page: Page, create_journal) -> None:
    journal = create_journal(
        right_now="2025-03-17",
        period=RecurringTaskPeriod.WEEKLY,
    )

    page.goto(f"/app/workspace/apps/journals/{journal.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="rightNow"]')).to_be_disabled()

    page.goto(f"/app/workspace/apps/journals/{journal.ref_id}")
    page.wait_for_selector("#leaf-panel")
    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()
    page.wait_for_url("/app/workspace/apps/journals")

    page.goto(f"/app/workspace/apps/journals/{journal.ref_id}")
    expect(page.locator("body")).to_contain_text(
        f"Could not find journal #{journal.ref_id}"
    )


def test_webui_journal_question_create_find_and_load(page: Page) -> None:
    name = f"What went well {uuid.uuid4().hex[:8]}"

    page.goto("/app/workspace/apps/journals")
    page.wait_for_selector("#trunk-panel")
    page.locator("#journals-questions").click()
    page.wait_for_selector("#branch-panel")

    page.locator("#branch-new-leaf-entity").click()
    page.wait_for_selector("#leaf-panel")
    fill_after_hydration(page.locator('input[name="name"]'), name)
    page.locator("button[id='period-weekly']").click()
    page.locator("button[id='journal-question-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/journals/questions/\d+"))
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value(name)
    expect(page.locator("#leaf-panel")).to_contain_text("Weekly")

    question_match = re.search(r"/questions/(\d+)", page.url)
    assert question_match is not None
    question_id = question_match.group(1)

    page.goto("/app/workspace/apps/journals/questions")
    page.wait_for_selector("#branch-panel")
    expect(page.locator("#branch-panel")).to_contain_text("Weekly Questions")
    expect(page.locator(f"#journal-question-{question_id}")).to_contain_text(name)

    page.locator(f"#journal-question-{question_id} a").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/journals/questions/{question_id}")
    )
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value(name)


def test_webui_journal_question_update_archive_and_remove(page: Page) -> None:
    original_name = f"What should I change {uuid.uuid4().hex[:8]}"
    updated_name = f"What will I change {uuid.uuid4().hex[:8]}"

    page.goto("/app/workspace/apps/journals/questions/new")
    page.wait_for_selector("#leaf-panel")
    fill_after_hydration(page.locator('input[name="name"]'), original_name)
    page.locator("button[id='period-weekly']").click()
    page.locator("button[id='journal-question-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/journals/questions/\d+"))
    page.wait_for_selector("#leaf-panel")
    question_match = re.search(r"/questions/(\d+)", page.url)
    assert question_match is not None
    question_id = question_match.group(1)

    fill_after_hydration(page.locator('input[name="name"]'), updated_name)
    page.locator("button[id='journal-question-update']").click()
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value(updated_name)

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()
    expect(page.locator("#leaf-entity-archive-confirm")).to_have_attribute(
        "value", "remove"
    )

    page.goto("/app/workspace/apps/journals/questions")
    page.wait_for_selector("#branch-panel")
    expect(page.locator(f"#journal-question-{question_id}")).to_have_count(0)

    page.goto(f"/app/workspace/apps/journals/questions/{question_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value(updated_name)

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()
    page.wait_for_url("/app/workspace/apps/journals/questions")

    page.goto(f"/app/workspace/apps/journals/questions/{question_id}")
    expect(page.locator("body")).to_contain_text(
        f"Could not find journal question #{question_id}"
    )


def test_webui_journal_question_reorder(page: Page, create_question) -> None:
    first = create_question(f"First question {uuid.uuid4().hex[:8]}")
    second = create_question(f"Second question {uuid.uuid4().hex[:8]}")

    page.goto("/app/workspace/apps/journals/questions")
    page.wait_for_selector("#branch-panel")
    expect(page.locator(f"#journal-question-{first.ref_id}")).to_be_visible()
    expect(page.locator(f"#journal-question-{second.ref_id}")).to_be_visible()

    page.locator(f"#journal-question-{first.ref_id}-down").click()
    page.wait_for_function(
        """([secondId, firstId]) => {
            const ids = [...document.querySelectorAll("[id^='journal-question-']")]
                .map((el) => el.id)
                .filter((id) => /^journal-question-\\d+$/.test(id));
            return (
                ids.indexOf(secondId) !== -1 &&
                ids.indexOf(firstId) !== -1 &&
                ids.indexOf(secondId) < ids.indexOf(firstId)
            );
        }""",
        arg=[
            f"journal-question-{second.ref_id}",
            f"journal-question-{first.ref_id}",
        ],
    )


def test_webui_journal_question_list_groups_by_period(
    page: Page, create_question
) -> None:
    weekly = create_question(
        f"Weekly grouped {uuid.uuid4().hex[:8]}", RecurringTaskPeriod.WEEKLY
    )
    daily = create_question(
        f"Daily grouped {uuid.uuid4().hex[:8]}", RecurringTaskPeriod.DAILY
    )

    page.goto("/app/workspace/apps/journals/questions")
    page.wait_for_selector("#branch-panel")
    expect(page.locator("#branch-panel")).to_contain_text("Weekly Questions")
    expect(page.locator("#branch-panel")).to_contain_text("Daily Questions")
    expect(page.locator(f"#journal-question-{weekly.ref_id}")).to_contain_text(
        weekly.name
    )
    expect(page.locator(f"#journal-question-{daily.ref_id}")).to_contain_text(
        daily.name
    )


def test_webui_journal_create_includes_selected_questions_in_note(
    page: Page, create_question
) -> None:
    first = create_question(f"Wins {uuid.uuid4().hex[:8]}")
    second = create_question(f"Lessons {uuid.uuid4().hex[:8]}")
    ignored = create_question(f"Ignored {uuid.uuid4().hex[:8]}")

    page.goto("/app/workspace/apps/journals/new")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator(f"#journal-new-question-{first.ref_id}")).to_be_visible()

    fill_after_hydration(page.locator('input[name="rightNow"]'), "2025-04-07")
    page.locator("button[id='period-weekly']").click()
    expect(page.locator("button[id='journal-create']")).to_be_enabled()
    _deselect_all_new_journal_questions(page)
    _set_new_journal_question_selected(
        page, f"journal-new-question-{first.ref_id}", selected=True
    )
    _set_new_journal_question_selected(
        page, f"journal-new-question-{second.ref_id}", selected=True
    )
    page.locator("button[id='journal-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/journals/\d+"))
    page.wait_for_selector("#leaf-panel")
    headings = _note_heading_texts(page)
    assert headings == [first.name, second.name]
    expect(page.locator("#entity-block-editor")).not_to_contain_text(ignored.name)


def test_webui_journal_create_defaults_to_all_period_questions(
    page: Page, create_question
) -> None:
    first = create_question(f"Default all first {uuid.uuid4().hex[:8]}")
    second = create_question(f"Default all second {uuid.uuid4().hex[:8]}")

    page.goto("/app/workspace/apps/journals/new")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator(f"#journal-new-question-{first.ref_id}")).to_be_visible()
    expect(page.locator(f"#journal-new-question-{second.ref_id}")).to_be_visible()

    fill_after_hydration(page.locator('input[name="rightNow"]'), "2025-04-14")
    page.locator("button[id='period-weekly']").click()
    page.locator("button[id='journal-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/journals/\d+"))
    page.wait_for_selector("#leaf-panel")
    headings = _note_heading_texts(page)
    assert first.name in headings
    assert second.name in headings
    assert headings.index(first.name) < headings.index(second.name)


def test_webui_journal_create_with_no_questions_selected(
    page: Page, create_question
) -> None:
    ignored = create_question(f"Should not appear {uuid.uuid4().hex[:8]}")

    page.goto("/app/workspace/apps/journals/new")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator(f"#journal-new-question-{ignored.ref_id}")).to_be_visible()

    fill_after_hydration(page.locator('input[name="rightNow"]'), "2025-04-21")
    page.locator("button[id='period-weekly']").click()
    expect(page.locator("button[id='journal-create']")).to_be_enabled()
    _deselect_all_new_journal_questions(page)
    page.locator("button[id='journal-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/journals/\d+"))
    page.wait_for_selector("#leaf-panel")
    _wait_for_note_editor(page)
    expect(page.locator("#entity-block-editor")).not_to_contain_text(ignored.name)
    assert _note_heading_texts(page) == []


def test_webui_journal_generate_includes_period_questions_in_note(
    page: Page, create_question
) -> None:
    question = create_question(f"Generated weekly prompt {uuid.uuid4().hex[:8]}")

    page.goto("/app/workspace/tools/gen")
    fill_after_hydration(page.locator('input[name="today"]'), "2098-06-01")
    page.get_by_text("Advanced Options & Filtering").click()
    page.get_by_label("Generate Even If Not Modified").click()
    with page.expect_response(
        lambda response: response.request.method == "POST"
        and "/tools/gen" in response.url
        and response.ok,
        timeout=120_000,
    ):
        page.locator("#generate").click()

    page.goto("/app/workspace/apps/journals")
    page.wait_for_selector("#trunk-panel")
    page.reload()
    page.wait_for_selector("#trunk-panel")
    expect(page.locator("#trunk-panel")).to_contain_text(
        "Weekly journal for 2098-06-04"
    )
    page.locator("a", has_text="Weekly journal for 2098-06-04").click()
    page.wait_for_url(re.compile(r"/app/workspace/apps/journals/\d+"))
    page.wait_for_selector("#leaf-panel")
    headings = _note_heading_texts(page)
    assert question.name in headings
