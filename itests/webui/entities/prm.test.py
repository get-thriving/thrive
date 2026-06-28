"""Tests about PRM persons, circles, and occasions."""

import re
from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.prm.circle_create import (
    sync_detailed as circle_create_sync,
)
from jupiter_webapi_client.api.prm.occasion_create import (
    sync_detailed as occasion_create_sync,
)
from jupiter_webapi_client.api.prm.person_create import (
    sync_detailed as person_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.circle import Circle
from jupiter_webapi_client.models.circle_create_args import CircleCreateArgs
from jupiter_webapi_client.models.circle_create_result import CircleCreateResult
from jupiter_webapi_client.models.occasion import Occasion
from jupiter_webapi_client.models.occasion_create_args import OccasionCreateArgs
from jupiter_webapi_client.models.occasion_create_result import OccasionCreateResult
from jupiter_webapi_client.models.occasion_kind import OccasionKind
from jupiter_webapi_client.models.person import Person
from jupiter_webapi_client.models.person_create_args import PersonCreateArgs
from jupiter_webapi_client.models.person_create_result import PersonCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response, open_leaf_publish_panel
from itests.webui.entities.conftest import AnotherUserAndWorkspace


@pytest.fixture(autouse=True, scope="module")
def _enable_prm_feature(logged_in_client: AuthenticatedClient):
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PRM, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PRM, value=False),
        )


@pytest.fixture(autouse=True, scope="module")
def create_person(logged_in_client: AuthenticatedClient):
    def _create_person(name: str) -> Person:
        result = person_create_sync(
            client=logged_in_client,
            body=PersonCreateArgs(name=name),
        )
        return get_parsed_from_response(PersonCreateResult, result).new_person

    return _create_person


@pytest.fixture()
def create_occasion(logged_in_client: AuthenticatedClient):
    def _create_occasion(
        person_ref_id: str,
        kind: OccasionKind,
        name: str,
        date: str,
    ) -> Occasion:
        result = occasion_create_sync(
            client=logged_in_client,
            body=OccasionCreateArgs(
                person_ref_id=person_ref_id,
                kind=kind,
                name=name,
                date=date,
            ),
        )
        return get_parsed_from_response(OccasionCreateResult, result).new_occasion

    return _create_occasion


@pytest.fixture()
def create_circle(logged_in_client: AuthenticatedClient):
    def _create_circle(name: str) -> Circle:
        result = circle_create_sync(
            client=logged_in_client,
            body=CircleCreateArgs(name=name),
        )
        return get_parsed_from_response(CircleCreateResult, result).new_circle

    return _create_circle


@pytest.fixture()
def another_user_with_prm_enabled(
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
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PRM, value=True),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PRM, value=False),
        )


def test_webui_prm_person_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/prm/persons")

    expect(page.locator("#trunk-panel")).to_contain_text("There are no persons to show")


def test_webui_prm_person_view_all(page: Page, create_person) -> None:
    person1 = create_person("Person 1")
    person2 = create_person("Person 2")
    person3 = create_person("Person 3")

    page.goto("/app/workspace/prm/persons")

    expect(page.locator(f"#person-{person1.ref_id}")).to_contain_text("Person 1")
    expect(page.locator(f"#person-{person2.ref_id}")).to_contain_text("Person 2")
    expect(page.locator(f"#person-{person3.ref_id}")).to_contain_text("Person 3")


def test_webui_prm_person_publish_and_view_public(page: Page, create_person) -> None:
    person = create_person("Published Person")
    page.goto(f"/app/workspace/prm/persons/{person.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Person-publish")
    page.locator("button[id='Person-publish-create']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/prm/persons/{person.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Person-publish")
    expect(page.locator("#Person-publish")).to_contain_text("draft")

    page.locator("button[id='Person-publish-toggle-status']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/prm/persons/{person.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Person-publish")
    expect(page.locator("#Person-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/person/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Published Person")


def test_webui_prm_person_acl(
    page: Page,
    create_person,
    another_user_with_prm_enabled: AnotherUserAndWorkspace,
) -> None:
    person = create_person("ACL Person")
    other_user = another_user_with_prm_enabled.user

    page.locator("#account-menu").click()
    page.locator("#logout").click()
    page.wait_for_url("/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(other_user.email)
    page.locator('input[name="password"]').fill(other_user.password)
    page.locator("#login").locator("button", has_text="Login").click()
    page.wait_for_url("/app/workspace")

    page.goto("/app/workspace/prm/persons")
    expect(page.locator(f"#person-{person.ref_id}")).to_have_count(0)
    expect(page.locator("#trunk-panel")).not_to_contain_text("ACL Person")

    page.goto(f"/app/workspace/prm/persons/{person.ref_id}")
    expect(page.locator("body")).to_contain_text(
        f"There was an error loading person with ID {person.ref_id}! Please try again!"
    )


def test_webui_prm_circle_acl(
    page: Page,
    create_circle,
    another_user_with_prm_enabled: AnotherUserAndWorkspace,
) -> None:
    circle = create_circle("ACL Circle")
    other_user = another_user_with_prm_enabled.user

    page.locator("#account-menu").click()
    page.locator("#logout").click()
    page.wait_for_url("/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(other_user.email)
    page.locator('input[name="password"]').fill(other_user.password)
    page.locator("#login").locator("button", has_text="Login").click()
    page.wait_for_url("/app/workspace")

    page.goto("/app/workspace/prm/circles")
    expect(page.locator(f"#circle-{circle.ref_id}")).to_have_count(0)
    expect(page.locator("#trunk-panel")).not_to_contain_text("ACL Circle")

    page.goto(f"/app/workspace/prm/circles/{circle.ref_id}")
    expect(page.locator("body")).to_contain_text(
        f"There was an error loading circle with ID {circle.ref_id}! Please try again!"
    )


def test_webui_prm_occasion_acl(
    page: Page,
    create_person,
    create_occasion,
    another_user_with_prm_enabled: AnotherUserAndWorkspace,
) -> None:
    person = create_person("ACL Person")
    occasion = create_occasion(
        person.ref_id, OccasionKind.BIRTHDAY, "ACL Occasion", "15 Feb"
    )
    other_user = another_user_with_prm_enabled.user

    page.locator("#account-menu").click()
    page.locator("#logout").click()
    page.wait_for_url("/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(other_user.email)
    page.locator('input[name="password"]').fill(other_user.password)
    page.locator("#login").locator("button", has_text="Login").click()
    page.wait_for_url("/app/workspace")

    page.goto(f"/app/workspace/prm/persons/{person.ref_id}/occasions/{occasion.ref_id}")
    expect(page.locator("body")).to_contain_text(
        f"There was an error loading person with ID {person.ref_id}! Please try again!"
    )
