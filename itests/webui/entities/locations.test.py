"""Tests about locations."""

import re
from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.locations.location_create import (
    sync_detailed as location_create_sync,
)
from jupiter_webapi_client.api.locations.location_link_upsert import (
    sync_detailed as location_link_upsert_sync,
)
from jupiter_webapi_client.api.test_helper.search_index_backfill_test_helper import (
    sync_detailed as search_index_backfill_test_helper_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.gps_coordinates import GpsCoordinates
from jupiter_webapi_client.models.location import Location
from jupiter_webapi_client.models.location_create_args import LocationCreateArgs
from jupiter_webapi_client.models.location_create_result import LocationCreateResult
from jupiter_webapi_client.models.location_link_upsert_args import (
    LocationLinkUpsertArgs,
)
from jupiter_webapi_client.models.search_index_backfill_test_helper_args import (
    SearchIndexBackfillTestHelperArgs,
)
from jupiter_webapi_client.models.todo_task import TodoTask
from jupiter_webapi_client.models.todo_task_create_args import TodoTaskCreateArgs
from jupiter_webapi_client.models.todo_task_create_result import TodoTaskCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import fill_after_hydration, get_parsed_from_response

_LOCATIONS_PATH = "/app/workspace/core/locations"


@pytest.fixture(autouse=True, scope="module")
def _enable_todo_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=False
            ),
        )


@pytest.fixture()
def create_location(logged_in_client: AuthenticatedClient):
    def _create_location(
        name: str,
        is_key: bool = False,
        address_line: str | None = None,
        country: str | None = None,
        gps: GpsCoordinates | None = None,
    ) -> Location:
        result = location_create_sync(
            client=logged_in_client,
            body=LocationCreateArgs(
                name=name,
                is_key=is_key,
                address_line=address_line,
                country=country,
                gps=gps,
            ),
        )
        return get_parsed_from_response(LocationCreateResult, result).new_location

    return _create_location


@pytest.fixture()
def create_todo(logged_in_client: AuthenticatedClient):
    def _create_todo(name: str) -> TodoTask:
        result = todo_task_create_sync(
            client=logged_in_client,
            body=TodoTaskCreateArgs(
                name=name,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        )
        return get_parsed_from_response(TodoTaskCreateResult, result).new_todo_task

    return _create_todo


@pytest.fixture()
def link_location(logged_in_client: AuthenticatedClient):
    def _link(todo_ref_id: str, location_ref_id: str) -> None:
        result = location_link_upsert_sync(
            client=logged_in_client,
            body=LocationLinkUpsertArgs(
                owner=f"TodoTask:std:{todo_ref_id}",
                locations_ref_ids=[location_ref_id],
            ),
        )
        assert result.status_code == 200

    return _link


@pytest.fixture()
def drain_search_mutation_log(logged_in_client: AuthenticatedClient):
    def _drain() -> None:
        result = search_index_backfill_test_helper_sync(
            client=logged_in_client,
            body=SearchIndexBackfillTestHelperArgs(),
        )
        assert result.status_code == 200

    return _drain


def test_webui_location_view_nothing(page: Page) -> None:
    page.goto(_LOCATIONS_PATH)

    expect(page.locator("#trunk-panel")).to_contain_text(
        "There are no locations to show"
    )


def test_webui_location_view_all(page: Page, create_location) -> None:
    location1 = create_location("Location 1")
    location2 = create_location("Location 2")
    location3 = create_location(
        "Location 3",
        address_line="1 Rue de Rivoli",
        country="FR",
        gps=GpsCoordinates(latitude=48.8566, longitude=2.3522),
    )

    page.goto(_LOCATIONS_PATH)

    expect(page.locator(f"#location-{location1.ref_id}")).to_contain_text("Location 1")
    expect(page.locator(f"#location-{location2.ref_id}")).to_contain_text("Location 2")
    expect(page.locator(f"#location-{location3.ref_id}")).to_contain_text("Location 3")
    expect(page.locator(f"#location-{location3.ref_id}")).to_contain_text(
        "1 Rue de Rivoli"
    )
    expect(page.locator(f"#location-{location3.ref_id}")).to_contain_text("FR")
    expect(page.locator(f"#location-{location3.ref_id}")).to_contain_text(
        "48.856, 2.352"
    )


def test_webui_location_view_one(page: Page, create_location) -> None:
    location = create_location(
        "Paris Office",
        address_line="1 Rue de Rivoli",
        country="FR",
        gps=GpsCoordinates(latitude=48.8566, longitude=2.3522),
    )

    page.goto(f"{_LOCATIONS_PATH}/{location.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Paris Office")
    expect(page.locator('input[name="addressLine"]')).to_have_value("1 Rue de Rivoli")
    expect(page.locator('input[name="country"]')).to_have_value("FR")
    assert float(page.locator('input[name="latitude"]').input_value()) == pytest.approx(
        48.8566
    )
    assert float(
        page.locator('input[name="longitude"]').input_value()
    ) == pytest.approx(2.3522)


def test_webui_location_create(page: Page) -> None:
    page.goto(_LOCATIONS_PATH)
    page.wait_for_selector("#trunk-panel")
    page.locator("a[id='trunk-new-leaf-entity']").click()
    page.wait_for_selector("#leaf-panel")

    fill_after_hydration(page.locator('input[name="name"]'), "Home Office")
    page.keyboard.press("Escape")
    fill_after_hydration(page.locator('input[name="addressLine"]'), "123 Main St")
    fill_after_hydration(page.locator('input[name="country"]'), "US")
    fill_after_hydration(page.locator('input[name="latitude"]'), "40.7")
    fill_after_hydration(page.locator('input[name="longitude"]'), "-74.1")

    page.locator("button[id='location-create']").click()

    page.wait_for_url(re.compile(rf"{_LOCATIONS_PATH}/\d+"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Home Office")
    expect(page.locator('input[name="addressLine"]')).to_have_value("123 Main St")
    expect(page.locator('input[name="country"]')).to_have_value("US")
    assert float(page.locator('input[name="latitude"]').input_value()) == pytest.approx(
        40.7
    )
    assert float(
        page.locator('input[name="longitude"]').input_value()
    ) == pytest.approx(-74.1)

    entity_id = page.url.split("/")[-1]
    expect(page.locator(f"#location-{entity_id}")).to_contain_text("Home Office")


def test_webui_location_create_shows_dedup_banner(page: Page, create_location) -> None:
    location = create_location(
        "Dedup Banner Cafe",
        gps=GpsCoordinates(latitude=48.8566, longitude=2.3522),
    )

    page.goto(_LOCATIONS_PATH)
    page.wait_for_selector("#trunk-panel")
    page.locator("a[id='trunk-new-leaf-entity']").click()
    page.wait_for_selector("#leaf-panel")

    fill_after_hydration(page.locator('input[name="name"]'), "Dedup Banner Cafe")
    page.keyboard.press("Escape")
    fill_after_hydration(page.locator('input[name="latitude"]'), "48.85665")
    fill_after_hydration(page.locator('input[name="longitude"]'), "2.3522")

    page.locator("button[id='location-create']").click()

    page.wait_for_url(re.compile(rf"{_LOCATIONS_PATH}/{location.ref_id}"))
    page.wait_for_selector("#leaf-panel")
    expect(page.locator("#leaf-panel")).to_contain_text(
        "A nearby location with a similar name already existed"
    )
    expect(page.locator('input[name="name"]')).to_have_value("Dedup Banner Cafe")


def test_webui_location_update(page: Page, create_location) -> None:
    location = create_location(
        "Old Location",
        address_line="Old Address",
        country="US",
        gps=GpsCoordinates(latitude=40.0, longitude=-74.0),
    )

    page.goto(f"{_LOCATIONS_PATH}/{location.ref_id}")
    page.wait_for_selector("#leaf-panel")

    fill_after_hydration(page.locator('input[name="name"]'), "Updated Location")
    fill_after_hydration(page.locator('input[name="addressLine"]'), "New Address")
    fill_after_hydration(page.locator('input[name="country"]'), "FR")
    fill_after_hydration(page.locator('input[name="latitude"]'), "48.8")
    fill_after_hydration(page.locator('input[name="longitude"]'), "2.3")

    with page.expect_response(
        lambda resp: resp.request.method == "POST"
        and f"{_LOCATIONS_PATH}/{location.ref_id}" in resp.url
        and resp.ok
    ):
        page.locator("button[id='location-update']").click()

    page.reload()
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Updated Location")
    expect(page.locator('input[name="addressLine"]')).to_have_value("New Address")
    expect(page.locator('input[name="country"]')).to_have_value("FR")
    assert float(page.locator('input[name="latitude"]').input_value()) == pytest.approx(
        48.8
    )
    assert float(
        page.locator('input[name="longitude"]').input_value()
    ) == pytest.approx(2.3)

    expect(page.locator(f"#location-{location.ref_id}")).to_contain_text(
        "Updated Location"
    )


def test_webui_location_archive(page: Page, create_location) -> None:
    location = create_location("Archive Location")
    page.goto(f"{_LOCATIONS_PATH}/{location.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator("button[id='leaf-entity-archive']").click()
    with page.expect_response(
        lambda resp: resp.request.method == "POST"
        and f"{_LOCATIONS_PATH}/{location.ref_id}" in resp.url
        and resp.ok
    ):
        page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.goto(_LOCATIONS_PATH)
    page.wait_for_selector("#trunk-panel")
    expect(page.locator(f"#location-{location.ref_id}")).to_have_count(0)

    page.goto(f"{_LOCATIONS_PATH}/{location.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Archive Location")


def test_webui_location_remove(page: Page, create_location) -> None:
    location = create_location("Remove Location")
    page.goto(f"{_LOCATIONS_PATH}/{location.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator("button[id='leaf-entity-archive']").click()
    with page.expect_response(
        lambda resp: resp.request.method == "POST"
        and f"{_LOCATIONS_PATH}/{location.ref_id}" in resp.url
        and resp.ok
    ):
        page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.goto(f"{_LOCATIONS_PATH}/{location.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator("button[id='leaf-entity-archive']").click()
    with page.expect_response(
        lambda resp: resp.request.method == "POST"
        and f"{_LOCATIONS_PATH}/{location.ref_id}" in resp.url
        and resp.ok
    ):
        page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.wait_for_url(_LOCATIONS_PATH)
    expect(page.locator(f"#location-{location.ref_id}")).to_have_count(0)

    page.goto(f"{_LOCATIONS_PATH}/{location.ref_id}")
    expect(page.locator("body")).to_contain_text(
        f"Could not find location #{location.ref_id}!"
    )


def test_webui_location_link_on_todo(page: Page, create_todo, create_location) -> None:
    todo = create_todo("Task With Location")
    location = create_location("Linked Office")

    page.goto(f"/app/workspace/apps/todos/{todo.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.get_by_label("Location", exact=True).click()
    page.keyboard.type("Linked Office")
    page.get_by_role("option").filter(has_text="Linked Office").first.click()
    page.keyboard.press("Escape")
    expect(page.get_by_text("Saved!")).to_be_visible()

    page.reload()
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="locations"]')).to_have_value(location.ref_id)
    expect(page.locator("#leaf-panel")).to_contain_text("Linked Office")


def test_webui_search_filter_by_location(
    page: Page,
    create_todo,
    create_location,
    link_location,
    drain_search_mutation_log,
) -> None:
    matched = create_todo("Search Filter Cafe Task")
    other = create_todo("Search Filter Park Task")
    cafe = create_location("Search Filter Cafe")
    park = create_location("Search Filter Park")
    link_location(matched.ref_id, cafe.ref_id)
    link_location(other.ref_id, park.ref_id)
    drain_search_mutation_log()

    page.locator("#open-instant-search").click()
    dialog = page.get_by_role("dialog")
    expect(dialog).to_be_visible()

    query = dialog.get_by_label("Query").filter(visible=True)
    query.fill("Search Filter")
    expect(dialog).to_contain_text("Search Filter Cafe Task")
    expect(dialog).to_contain_text("Search Filter Park Task")

    locations = dialog.get_by_label("Locations").filter(visible=True)
    locations.click()
    locations.fill("Search Filter Cafe")
    page.get_by_role("option").filter(has_text="Search Filter Cafe").first.click()
    page.keyboard.press("Escape")

    expect(dialog).to_contain_text("Search Filter Cafe Task")
    expect(dialog).not_to_contain_text("Search Filter Park Task")
