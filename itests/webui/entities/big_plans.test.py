"""Tests about big plans."""

import re
from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.big_plans.big_plan_create import (
    sync_detailed as big_plan_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.big_plan import BigPlan
from jupiter_webapi_client.models.big_plan_create_args import BigPlanCreateArgs
from jupiter_webapi_client.models.big_plan_create_result import BigPlanCreateResult
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.init_result import InitResult
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.time_plan_activity_feasability import (
    TimePlanActivityFeasability,
)
from jupiter_webapi_client.models.time_plan_activity_kind import TimePlanActivityKind
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response, open_leaf_publish_panel
from itests.webui.entities.conftest import AnotherUserAndWorkspace

_ACCESS_DENIED_LABEL = "You do not have the right access for this entity"


@pytest.fixture(autouse=True, scope="module")
def _enable_big_plans_feature(
    webapi_url: str, new_user_and_workspace: InitResult
) -> Iterator[None]:
    def make_client() -> AuthenticatedClient:
        return AuthenticatedClient(
            base_url=webapi_url,
            token=new_user_and_workspace.auth_token_ext,
        )

    try:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=False
            ),
        )


@pytest.fixture(autouse=True, scope="module")
def create_big_plan(logged_in_client: AuthenticatedClient):
    def _create_big_plan(
        name: str,
        is_key: bool = False,
        eisen: Eisen = Eisen.REGULAR,
        difficulty: Difficulty = Difficulty.MEDIUM,
        actionable_date: str | None = None,
        due_date: str | None = None,
        time_plan_activity_kind: TimePlanActivityKind | None = None,
        time_plan_activity_feasability: TimePlanActivityFeasability | None = None,
    ) -> BigPlan:
        result = big_plan_create_sync(
            client=logged_in_client,
            body=BigPlanCreateArgs(
                name=name,
                is_key=is_key,
                eisen=eisen,
                difficulty=difficulty,
                actionable_date=actionable_date,
                due_date=due_date,
                time_plan_activity_kind=time_plan_activity_kind,
                time_plan_activity_feasability=time_plan_activity_feasability,
            ),
        )
        return get_parsed_from_response(BigPlanCreateResult, result).new_big_plan

    return _create_big_plan


def test_webui_big_plan_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/big-plans")

    expect(page.locator("#trunk-panel")).to_contain_text(
        "There are no big plans to show"
    )


def test_webui_big_plan_view_all(page: Page, create_big_plan) -> None:
    big_plan1 = create_big_plan("Big Plan 1", False, Eisen.REGULAR, Difficulty.MEDIUM)
    big_plan2 = create_big_plan(
        "Big Plan 2", True, Eisen.IMPORTANT, Difficulty.HARD, "2024-01-01", "2024-12-31"
    )
    big_plan3 = create_big_plan(
        "Big Plan 3",
        False,
        Eisen.URGENT,
        Difficulty.EASY,
        None,
        "2024-06-30",
        TimePlanActivityKind.MAKE_PROGRESS,
        TimePlanActivityFeasability.MUST_DO,
    )

    page.goto("/app/workspace/big-plans")

    expect(page.locator(f"#big-plan-{big_plan1.ref_id}")).to_contain_text("Big Plan 1")
    expect(page.locator(f"#big-plan-{big_plan2.ref_id}")).to_contain_text("Big Plan 2")
    expect(page.locator(f"#big-plan-{big_plan3.ref_id}")).to_contain_text("Big Plan 3")


def test_webui_big_plan_publish_and_view_public(page: Page, create_big_plan) -> None:
    big_plan = create_big_plan("Published Big Plan")
    page.goto(f"/app/workspace/big-plans/{big_plan.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "BigPlan-publish")
    page.locator("button[id='BigPlan-publish-create']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/big-plans/{big_plan.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "BigPlan-publish")
    expect(page.locator("#BigPlan-publish")).to_contain_text("draft")

    page.locator("button[id='BigPlan-publish-toggle-status']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/big-plans/{big_plan.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "BigPlan-publish")
    expect(page.locator("#BigPlan-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/big-plan/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Published Big Plan")


@pytest.fixture()
def another_user_with_big_plans_enabled(
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
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=True
            ),
        )
        # LIFE_PLAN makes the trunk default to by-aspect views; shared plans
        # must still appear when their aspect is from another workspace.
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.LIFE_PLAN, value=True
            ),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.LIFE_PLAN, value=False
            ),
        )
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=False
            ),
        )


@pytest.fixture()
def grant_big_plan_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_big_plans_enabled: AnotherUserAndWorkspace,
):
    def _grant(big_plan: BigPlan, access_level: AccessLevel) -> None:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.BIGPLAN,
                entity_ref_id=big_plan.ref_id,
                user_ref_ids=[
                    another_user_with_big_plans_enabled.init_result.new_user.ref_id
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


def _assert_other_user_cannot_access_big_plan_webui(
    page: Page,
    *,
    big_plan: BigPlan,
) -> None:
    page.goto("/app/workspace/big-plans")
    expect(page.locator(f"#big-plan-{big_plan.ref_id}")).to_have_count(0)

    page.goto(f"/app/workspace/big-plans/{big_plan.ref_id}")
    expect(page.locator("body")).to_contain_text(_ACCESS_DENIED_LABEL)


def test_webui_big_plan_acl_reader_can_read_but_not_update_or_archive(
    page: Page,
    create_big_plan,
    grant_big_plan_access,
    another_user_with_big_plans_enabled: AnotherUserAndWorkspace,
) -> None:
    big_plan = create_big_plan("Reader ACL Plan")

    _login_as_other_user(page, another_user_with_big_plans_enabled)
    _assert_other_user_cannot_access_big_plan_webui(page, big_plan=big_plan)

    grant_big_plan_access(big_plan, AccessLevel.READER)

    _login_as_other_user(page, another_user_with_big_plans_enabled)

    page.goto("/app/workspace/big-plans")
    expect(page.locator("#trunk-panel")).to_contain_text("Reader ACL Plan")

    page.goto(f"/app/workspace/big-plans/{big_plan.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Reader ACL Plan")
    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='big-plan-editor-save']")).to_be_disabled()
    expect(page.locator("button[id='leaf-entity-archive']")).to_be_disabled()


def test_webui_big_plan_acl_writer_can_read_and_update(
    page: Page,
    create_big_plan,
    grant_big_plan_access,
    another_user_with_big_plans_enabled: AnotherUserAndWorkspace,
) -> None:
    big_plan = create_big_plan("Writer Update Plan")
    grant_big_plan_access(big_plan, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_big_plans_enabled)

    page.goto(f"/app/workspace/big-plans/{big_plan.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Update Plan")

    page.locator('input[name="name"]').fill("Writer Updated Plan")
    page.locator("button[id='big-plan-editor-save']").click()

    page.wait_for_url("/app/workspace/big-plans")
    page.goto(f"/app/workspace/big-plans/{big_plan.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Updated Plan")


def test_webui_big_plan_acl_writer_can_read_and_archive(
    page: Page,
    create_big_plan,
    grant_big_plan_access,
    another_user_with_big_plans_enabled: AnotherUserAndWorkspace,
) -> None:
    big_plan = create_big_plan("Writer Archive Plan")
    grant_big_plan_access(big_plan, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_big_plans_enabled)

    page.goto(f"/app/workspace/big-plans/{big_plan.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.wait_for_url("/app/workspace/big-plans")
    page.goto(f"/app/workspace/big-plans/{big_plan.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='big-plan-editor-save']")).to_be_disabled()


def test_webui_big_plan_acl_z_denied_without_grant(
    page: Page,
    create_big_plan,
    another_user_with_big_plans_enabled: AnotherUserAndWorkspace,
) -> None:
    big_plan = create_big_plan("Denied ACL Plan")

    _login_as_other_user(page, another_user_with_big_plans_enabled)
    _assert_other_user_cannot_access_big_plan_webui(page, big_plan=big_plan)
