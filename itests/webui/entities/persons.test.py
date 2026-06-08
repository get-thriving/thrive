"""Tests about persons."""

import re

import pytest
from jupiter_webapi_client.api.prm.person_create import (
    sync_detailed as person_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.person import Person
from jupiter_webapi_client.models.person_create_args import PersonCreateArgs
from jupiter_webapi_client.models.person_create_result import PersonCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response, open_leaf_publish_panel


@pytest.fixture(autouse=True, scope="module")
def _enable_persons_feature(logged_in_client: AuthenticatedClient):
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


def test_webui_person_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/prm/persons")

    expect(page.locator("#trunk-panel")).to_contain_text("There are no persons to show")


def test_webui_person_view_all(page: Page, create_person) -> None:
    person1 = create_person("Person 1")
    person2 = create_person("Person 2")
    person3 = create_person("Person 3")

    page.goto("/app/workspace/prm/persons")

    expect(page.locator(f"#person-{person1.ref_id}")).to_contain_text("Person 1")
    expect(page.locator(f"#person-{person2.ref_id}")).to_contain_text("Person 2")
    expect(page.locator(f"#person-{person3.ref_id}")).to_contain_text("Person 3")


def test_webui_person_publish_and_view_public(page: Page, create_person) -> None:
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
    assert "/app/public/published/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/app/public/published/person/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Published Person")
