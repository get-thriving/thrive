"""Tests about habits."""

import re
from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.habits.habit_create import (
    sync_detailed as habit_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.habit import Habit
from jupiter_webapi_client.models.habit_create_args import HabitCreateArgs
from jupiter_webapi_client.models.habit_create_result import HabitCreateResult
from jupiter_webapi_client.models.habit_repeats_strategy import HabitRepeatsStrategy
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
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
def _enable_habits_feature(logged_in_client: AuthenticatedClient):
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.HABITS, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.HABITS, value=False),
        )


@pytest.fixture(autouse=True, scope="module")
def create_habit(logged_in_client: AuthenticatedClient):
    def _create_habit(
        name: str,
        period: RecurringTaskPeriod = RecurringTaskPeriod.DAILY,
        is_key: bool = False,
        eisen: Eisen = Eisen.REGULAR,
        difficulty: Difficulty = Difficulty.MEDIUM,
        repeats_strategy: HabitRepeatsStrategy | None = None,
        repeats_in_period_count: int | None = None,
    ) -> Habit:
        result = habit_create_sync(
            client=logged_in_client,
            body=HabitCreateArgs(
                name=name,
                period=period,
                is_key=is_key,
                eisen=eisen,
                difficulty=difficulty,
                repeats_strategy=repeats_strategy,
                repeats_in_period_count=repeats_in_period_count,
            ),
        )
        return get_parsed_from_response(HabitCreateResult, result).new_habit

    return _create_habit


def test_webui_habit_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/habits")

    expect(page.locator("#trunk-panel")).to_contain_text("There are no habits to show")


def test_webui_habit_view_all(page: Page, create_habit) -> None:
    habit1 = create_habit(
        "Habit 1", RecurringTaskPeriod.DAILY, False, Eisen.REGULAR, Difficulty.MEDIUM
    )
    habit2 = create_habit(
        "Habit 2",
        RecurringTaskPeriod.WEEKLY,
        True,
        Eisen.IMPORTANT,
        Difficulty.HARD,
        HabitRepeatsStrategy.ALL_SAME,
        3,
    )
    habit3 = create_habit(
        "Habit 3",
        RecurringTaskPeriod.MONTHLY,
        False,
        Eisen.URGENT,
        Difficulty.EASY,
        HabitRepeatsStrategy.SPREAD_OUT_NO_OVERLAP,
        2,
    )

    page.goto("/app/workspace/habits")

    expect(page.locator(f"#habit-{habit1.ref_id}")).to_contain_text("Habit 1")
    expect(page.locator(f"#habit-{habit2.ref_id}")).to_contain_text("Habit 2")
    expect(page.locator(f"#habit-{habit3.ref_id}")).to_contain_text("Habit 3")


def test_webui_habit_publish_and_view_public(page: Page, create_habit) -> None:
    habit = create_habit("Published Habit")
    page.goto(f"/app/workspace/habits/{habit.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Habit-publish")
    page.locator("button[id='Habit-publish-create']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/habits/{habit.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Habit-publish")
    expect(page.locator("#Habit-publish")).to_contain_text("draft")

    page.locator("button[id='Habit-publish-toggle-status']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/habits/{habit.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Habit-publish")
    expect(page.locator("#Habit-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/habit/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Published Habit")


@pytest.fixture()
def another_user_with_habits_enabled(
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
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.HABITS, value=True),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.HABITS, value=False),
        )


@pytest.fixture()
def grant_habit_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_habits_enabled: AnotherUserAndWorkspace,
):
    def _grant(habit: Habit, access_level: AccessLevel) -> None:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.HABIT,
                entity_ref_id=habit.ref_id,
                user_ref_ids=[
                    another_user_with_habits_enabled.init_result.new_user.ref_id
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


def _assert_other_user_cannot_access_habit_webui(
    page: Page,
    *,
    habit: Habit,
) -> None:
    page.goto("/app/workspace/habits")
    expect(page.locator("#trunk-panel")).to_contain_text("There are no habits to show")
    expect(page.locator(f"#habit-{habit.ref_id}")).to_have_count(0)

    page.goto(f"/app/workspace/habits/{habit.ref_id}")
    expect(page.locator("body")).to_contain_text(_ACCESS_DENIED_LABEL)


def test_webui_habit_acl_reader_can_read_but_not_update_or_archive(
    page: Page,
    create_habit,
    grant_habit_access,
    another_user_with_habits_enabled: AnotherUserAndWorkspace,
) -> None:
    habit = create_habit("Reader ACL Habit")

    _login_as_other_user(page, another_user_with_habits_enabled)
    _assert_other_user_cannot_access_habit_webui(page, habit=habit)

    grant_habit_access(habit, AccessLevel.READER)

    _login_as_other_user(page, another_user_with_habits_enabled)

    page.goto("/app/workspace/habits")
    expect(page.locator(f"#habit-{habit.ref_id}")).to_have_count(1)

    page.goto(f"/app/workspace/habits/{habit.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Reader ACL Habit")
    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='habit-update']")).to_be_disabled()
    expect(page.locator("button[id='leaf-entity-archive']")).to_be_disabled()


def test_webui_habit_acl_writer_can_read_and_update(
    page: Page,
    create_habit,
    grant_habit_access,
    another_user_with_habits_enabled: AnotherUserAndWorkspace,
) -> None:
    habit = create_habit("Writer Update Habit")
    grant_habit_access(habit, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_habits_enabled)

    page.goto(f"/app/workspace/habits/{habit.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Update Habit")

    page.locator('input[name="name"]').fill("Writer Updated Habit")
    page.locator("button[id='habit-update']").click()

    page.wait_for_url("/app/workspace/habits")
    page.goto(f"/app/workspace/habits/{habit.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Updated Habit")


def test_webui_habit_acl_writer_can_read_and_archive(
    page: Page,
    create_habit,
    grant_habit_access,
    another_user_with_habits_enabled: AnotherUserAndWorkspace,
) -> None:
    habit = create_habit("Writer Archive Habit")
    grant_habit_access(habit, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_habits_enabled)

    page.goto(f"/app/workspace/habits/{habit.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.wait_for_url("/app/workspace/habits")
    page.goto(f"/app/workspace/habits/{habit.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='habit-update']")).to_be_disabled()


def test_webui_habit_acl_z_denied_without_grant(
    page: Page,
    create_habit,
    another_user_with_habits_enabled: AnotherUserAndWorkspace,
) -> None:
    habit = create_habit("Denied ACL Habit")

    _login_as_other_user(page, another_user_with_habits_enabled)
    _assert_other_user_cannot_access_habit_webui(page, habit=habit)
