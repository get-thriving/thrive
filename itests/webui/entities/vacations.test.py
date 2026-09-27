"""Tests about vacations."""

import re
from collections.abc import Iterator
from urllib.parse import parse_qs

import pytest
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.locations.location_create import (
    sync_detailed as location_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.vacations.travel_wish_create import (
    sync_detailed as travel_wish_create_sync,
)
from jupiter_webapi_client.api.vacations.vacation_create import (
    sync_detailed as vacation_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.location import Location
from jupiter_webapi_client.models.location_create_args import LocationCreateArgs
from jupiter_webapi_client.models.location_create_result import LocationCreateResult
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.travel_wish import TravelWish
from jupiter_webapi_client.models.travel_wish_create_args import TravelWishCreateArgs
from jupiter_webapi_client.models.travel_wish_create_result import (
    TravelWishCreateResult,
)
from jupiter_webapi_client.models.vacation import Vacation
from jupiter_webapi_client.models.vacation_create_args import VacationCreateArgs
from jupiter_webapi_client.models.vacation_create_result import VacationCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Browser, Page, expect

from itests.helpers import (
    get_parsed_from_response,
    open_leaf_publish_panel,
    type_entity_note_editor_and_wait_for_save,
)
from itests.webui.entities.conftest import AnotherUserAndWorkspace

_ACCESS_DENIED_LABEL = "You do not have the right access for this entity"


@pytest.fixture(autouse=True, scope="module")
def _enable_vacations_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.VACATIONS, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.VACATIONS, value=False
            ),
        )


@pytest.fixture()
def create_vacation(logged_in_client: AuthenticatedClient):
    def _create_vacation(
        name: str, start_month: int, start_day: int, end_month: int, end_day: int
    ) -> Vacation:
        result = vacation_create_sync(
            client=logged_in_client,
            body=VacationCreateArgs(
                name=name,
                start_date=f"2024-{start_month:02d}-{start_day:02d}",
                end_date=f"2024-{end_month:02d}-{end_day:02d}",
            ),
        )
        return get_parsed_from_response(VacationCreateResult, result).new_vacation

    return _create_vacation


@pytest.fixture()
def create_location(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> Location:
        result = location_create_sync(
            client=logged_in_client,
            body=LocationCreateArgs(name=name, is_key=False),
        )
        return get_parsed_from_response(LocationCreateResult, result).new_location

    return _create


@pytest.fixture()
def create_travel_wish(logged_in_client: AuthenticatedClient, create_location):
    def _create_travel_wish(name: str) -> TravelWish:
        location = create_location(name)
        result = travel_wish_create_sync(
            client=logged_in_client,
            body=TravelWishCreateArgs(location_ref_id=location.ref_id),
        )
        return get_parsed_from_response(TravelWishCreateResult, result).new_travel_wish

    return _create_travel_wish


def test_webui_vacations_vacation_view_all(page: Page, create_vacation) -> None:
    vacation1 = create_vacation("First Vacation", 12, 10, 12, 15)
    vacation2 = create_vacation("Second Vacation", 12, 20, 12, 25)
    vacation3 = create_vacation("Third Vacation", 12, 22, 12, 27)

    page.goto("/app/workspace/apps/vacations/vacation")

    expect(page.locator(f"#vacation-{vacation1.ref_id}")).to_contain_text(
        "First Vacation"
    )
    expect(page.locator(f"#vacation-{vacation2.ref_id}")).to_contain_text(
        "Second Vacation"
    )
    expect(page.locator(f"#vacation-{vacation3.ref_id}")).to_contain_text(
        "Third Vacation"
    )


def test_webui_vacations_vacation_view_one(page: Page, create_vacation) -> None:
    vacation = create_vacation("First Vacation", 12, 10, 12, 15)
    page.goto(f"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("First Vacation")
    expect(page.locator('input[name="startDate"]')).to_have_value("2024-12-10")
    expect(page.locator('input[name="endDate"]')).to_have_value("2024-12-15")


def test_webui_vacations_vacation_create(page: Page, browser: Browser) -> None:
    page.goto("/app/workspace/apps/vacations/vacation")
    page.wait_for_selector("#trunk-panel")
    page.locator("a[id='trunk-new-leaf-entity']").click()
    page.locator('input[name="name"]').fill("First Vacation")
    page.locator('input[name="startDate"]').fill("2024-12-10")
    page.locator('input[name="endDate"]').fill("2024-12-15")

    page.locator("button[id='vacation-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/vacations/vacation/\d+"))

    expect(page.locator('input[name="name"]')).to_have_value("First Vacation")
    expect(page.locator('input[name="startDate"]')).to_have_value("2024-12-10")
    expect(page.locator('input[name="endDate"]')).to_have_value("2024-12-15")

    entity_id = page.url.split("/")[-1]
    expect(page.locator(f"#vacation-{entity_id}")).to_contain_text("First Vacation")


def test_webui_vacations_vacation_update(page: Page, create_vacation) -> None:
    vacation = create_vacation("First Vacation", 12, 10, 12, 15)

    page.goto(f"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator('input[name="name"]').fill("Updated Vacation")
    page.locator('input[name="startDate"]').fill("2024-12-11")
    page.locator('input[name="endDate"]').fill("2024-12-16")

    page.locator("button[id='vacation-update']").click()

    page.wait_for_url("/app/workspace/apps/vacations/vacation")

    page.goto(f"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Updated Vacation")
    expect(page.locator('input[name="startDate"]')).to_have_value("2024-12-11")
    expect(page.locator('input[name="endDate"]')).to_have_value("2024-12-16")

    page.reload()
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Updated Vacation")
    expect(page.locator('input[name="startDate"]')).to_have_value("2024-12-11")
    expect(page.locator('input[name="endDate"]')).to_have_value("2024-12-16")

    entity_id = page.url.split("/")[-1]
    expect(page.locator(f"#vacation-{entity_id}")).to_contain_text("Updated Vacation")


def test_webui_vacations_vacation_create_note(page: Page, create_vacation) -> None:
    vacation = create_vacation("First Vacation", 12, 10, 12, 15)
    page.goto(f"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator("button[id='vacation-create-note']").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    )
    page.reload()
    page.wait_for_selector("#leaf-panel")
    page.wait_for_selector("#entity-block-editor")

    type_entity_note_editor_and_wait_for_save(page, "This is a note.")

    page.wait_for_url(re.compile(r"/app/workspace/apps/vacations/vacation/\d+"))

    expect(
        page.locator('#entity-block-editor [contenteditable="true"]').first
    ).to_contain_text("This is a note.")

    page.reload()

    page.wait_for_selector("#leaf-panel")

    expect(
        page.locator('#entity-block-editor [contenteditable="true"]').first
    ).to_contain_text("This is a note.")


def test_webui_vacations_vacation_archive(page: Page, create_vacation) -> None:
    vacation = create_vacation("First Vacation", 12, 10, 12, 15)
    page.goto(f"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.wait_for_url("/app/workspace/apps/vacations/vacation")

    page.goto(f"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")

    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator('input[name="startDate"]')).to_be_disabled()
    expect(page.locator('input[name="endDate"]')).to_be_disabled()

    expect(page.locator("button[id='vacation-update']")).to_be_disabled()
    expect(page.locator("button[id='vacation-create-note']")).to_be_disabled()

    entity_id = page.url.split("/")[-1]
    expect(page.locator(f"#vacation-{entity_id}")).to_have_count(0)


def test_webui_vacations_vacation_publish_and_view_public(
    page: Page, create_vacation
) -> None:
    vacation = create_vacation("Published Vacation", 7, 1, 7, 14)
    page.goto(f"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Vacation-publish")
    page.locator("button[id='Vacation-publish-create']").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    )
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Vacation-publish")
    expect(page.locator("#Vacation-publish")).to_contain_text("draft")

    page.locator("button[id='Vacation-publish-toggle-status']").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    )
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Vacation-publish")
    expect(page.locator("#Vacation-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/vacation/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Published Vacation")
    expect(page.locator('input[name="startDate"]')).to_have_value("2024-07-01")
    expect(page.locator('input[name="endDate"]')).to_have_value("2024-07-14")


@pytest.fixture()
def another_user_with_vacations_enabled(
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
                feature=WorkspaceFeature.VACATIONS, value=True
            ),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.VACATIONS, value=False
            ),
        )


@pytest.fixture()
def grant_vacation_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
):
    def _grant(vacation: Vacation, access_level: AccessLevel) -> None:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.VACATION,
                entity_ref_id=vacation.ref_id,
                user_ref_ids=[
                    another_user_with_vacations_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200

    return _grant


@pytest.fixture()
def grant_travel_wish_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
):
    def _grant(travel_wish: TravelWish, access_level: AccessLevel) -> None:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.TRAVELWISH,
                entity_ref_id=travel_wish.ref_id,
                user_ref_ids=[
                    another_user_with_vacations_enabled.init_result.new_user.ref_id
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


def _assert_other_user_cannot_access_vacation_webui(
    page: Page,
    *,
    vacation: Vacation,
) -> None:
    page.goto("/app/workspace/apps/vacations/vacation")
    expect(page.locator(f"#vacation-{vacation.ref_id}")).to_have_count(0)

    page.goto(f"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    expect(page.locator("body")).to_contain_text(_ACCESS_DENIED_LABEL)


def test_webui_vacations_vacation_acl_reader_can_read_but_not_update_or_archive(
    page: Page,
    create_vacation,
    grant_vacation_access,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
) -> None:
    vacation = create_vacation("Reader ACL Vacation", 7, 1, 7, 14)

    _login_as_other_user(page, another_user_with_vacations_enabled)
    _assert_other_user_cannot_access_vacation_webui(page, vacation=vacation)

    grant_vacation_access(vacation, AccessLevel.READER)

    _login_as_other_user(page, another_user_with_vacations_enabled)

    page.goto("/app/workspace/apps/vacations/vacation")
    expect(page.locator("#trunk-panel")).to_contain_text("Reader ACL Vacation")

    page.goto(f"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Reader ACL Vacation")
    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='vacation-update']")).to_be_disabled()
    expect(page.locator("button[id='leaf-entity-archive']")).to_be_disabled()


def test_webui_vacations_vacation_acl_writer_can_read_and_update(
    page: Page,
    create_vacation,
    grant_vacation_access,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
) -> None:
    vacation = create_vacation("Writer Update Vacation", 7, 1, 7, 14)
    grant_vacation_access(vacation, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_vacations_enabled)

    page.goto(f"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Update Vacation")

    page.locator('input[name="name"]').fill("Updated By Writer")
    page.locator("button[id='vacation-update']").click()

    page.wait_for_url("/app/workspace/apps/vacations/vacation")

    page.goto(f"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Updated By Writer")


def test_webui_vacations_vacation_acl_writer_can_read_and_archive(
    page: Page,
    create_vacation,
    grant_vacation_access,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
) -> None:
    vacation = create_vacation("Writer Archive Vacation", 7, 1, 7, 14)
    grant_vacation_access(vacation, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_vacations_enabled)

    page.goto(f"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Archive Vacation")

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.wait_for_url("/app/workspace/apps/vacations/vacation")

    page.goto(f"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='vacation-update']")).to_be_disabled()
    expect(page.locator("button[id='vacation-create-note']")).to_be_disabled()


def test_webui_vacations_vacation_acl_z_denied_without_grant(
    page: Page,
    create_vacation,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
) -> None:
    vacation = create_vacation("ACL Vacation", 7, 1, 7, 14)

    _login_as_other_user(page, another_user_with_vacations_enabled)
    _assert_other_user_cannot_access_vacation_webui(page, vacation=vacation)


def test_webui_vacations_vacation_link_multiple_locations(
    page: Page, create_vacation, create_location
) -> None:
    vacation = create_vacation("Grand Tour", 6, 1, 6, 20)
    paris = create_location("Paris")
    rome = create_location("Rome")

    page.goto(f"/app/workspace/apps/vacations/vacation/{vacation.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.get_by_label("Locations").click()
    page.keyboard.type("Paris")
    page.get_by_role("option").filter(has_text="Paris").first.click()
    # Replace a leftover query. Backspace is not used: on an empty
    # multi-select it removes the last chosen city.
    page.keyboard.press("ControlOrMeta+A")
    page.keyboard.type("Rome")
    rome_option = page.get_by_role("option").filter(has_text="Rome").first
    expect(rome_option).to_be_visible(timeout=30000)

    def _posts_both_locations(response) -> bool:
        if response.request.method != "POST":
            return False
        if "upsert-locations" not in response.url:
            return False
        body = response.request.post_data or ""
        chosen = parse_qs(body).get("locations", [""])[0].split(",")
        return paris.ref_id in chosen and rome.ref_id in chosen

    with page.expect_response(_posts_both_locations):
        rome_option.click()
    page.keyboard.press("Escape")

    page.reload()
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="locations"]')).to_have_value(
        f"{paris.ref_id},{rome.ref_id}"
    )
    expect(page.locator("#leaf-panel")).to_contain_text("Paris")
    expect(page.locator("#leaf-panel")).to_contain_text("+1")


def test_webui_vacations_travel_wish_view_all(page: Page, create_travel_wish) -> None:
    wish1 = create_travel_wish("Kyoto")
    wish2 = create_travel_wish("Lisbon")

    page.goto("/app/workspace/apps/vacations/wish-list")

    expect(page.locator(f"#travel-wish-{wish1.ref_id}")).to_contain_text("Kyoto")
    expect(page.locator(f"#travel-wish-{wish2.ref_id}")).to_contain_text("Lisbon")


def test_webui_vacations_travel_wish_view_one(page: Page, create_travel_wish) -> None:
    wish = create_travel_wish("Kyoto")
    page.goto(f"/app/workspace/apps/vacations/wish-list/{wish.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Kyoto")
    expect(page.locator('input[name="name"]')).to_be_editable()


def test_webui_vacations_travel_wish_create(
    page: Page, browser: Browser, create_location
) -> None:
    osaka = create_location("Osaka")

    page.goto("/app/workspace/apps/vacations/wish-list")
    page.wait_for_selector("#trunk-panel")
    page.locator("a[id='trunk-new-leaf-entity']").click()
    page.get_by_label("Location").click()
    page.keyboard.type("Osaka")
    page.get_by_role("option").filter(has_text="Osaka").first.click()
    expect(page.locator('input[name="locations"]')).to_have_value(osaka.ref_id)

    page.locator("button[id='travel-wish-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/vacations/wish-list/\d+"))

    expect(page.locator('input[name="name"]')).to_have_value("Osaka")
    expect(page.locator('input[name="name"]')).to_be_editable()
    expect(page.locator('input[name="locations"]')).to_have_value(osaka.ref_id)

    entity_id = page.url.split("/")[-1]
    expect(page.locator(f"#travel-wish-{entity_id}")).to_contain_text("Osaka")


def test_webui_vacations_travel_wish_create_waits_for_the_location(
    page: Page, create_location
) -> None:
    nara = create_location("Nara")

    page.goto("/app/workspace/apps/vacations/wish-list")
    page.wait_for_selector("#trunk-panel")
    page.locator("a[id='trunk-new-leaf-entity']").click()
    page.wait_for_selector("#leaf-panel")

    # Nothing picked yet, so there is no location to make a wish out of.
    expect(page.locator("button[id='travel-wish-create']")).to_be_disabled()
    expect(page.locator("button[id='travel-wish-create-and-another']")).to_be_disabled()

    page.get_by_label("Location").click()
    page.keyboard.type("Nara")
    page.get_by_role("option").filter(has_text="Nara").first.click()
    expect(page.locator('input[name="locations"]')).to_have_value(nara.ref_id)

    expect(page.locator("button[id='travel-wish-create']")).to_be_enabled()
    expect(page.locator("button[id='travel-wish-create-and-another']")).to_be_enabled()


def test_webui_vacations_travel_wish_add_location_after_create(
    page: Page, create_travel_wish, create_location
) -> None:
    wish = create_travel_wish("Kyoto")
    rome = create_location("Rome")

    page.goto(f"/app/workspace/apps/vacations/wish-list/{wish.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.get_by_label("Locations").click()
    page.keyboard.type("Rome")
    page.get_by_role("option").filter(has_text="Rome").first.click()
    page.keyboard.press("Escape")
    expect(page.get_by_text("Saved!")).to_be_visible()

    page.reload()
    page.wait_for_selector("#leaf-panel")
    expect(page.locator("#leaf-panel")).to_contain_text("Kyoto")
    expect(page.locator('input[name="locations"]')).to_have_value(
        re.compile(rf"(^|,){rome.ref_id}(,|$)")
    )
    expect(page.locator("#leaf-panel")).to_contain_text("+1")
    expect(page.locator('input[name="locations"]')).to_have_value(
        re.compile(rf"{rome.ref_id}")
    )


def test_webui_vacations_travel_wish_create_vacation_from_wish(
    page: Page, create_travel_wish
) -> None:
    wish = create_travel_wish("Grand Tour")

    page.goto(f"/app/workspace/apps/vacations/wish-list/{wish.ref_id}")
    page.wait_for_selector("#leaf-panel")
    page.locator("a[id='travel-wish-create-vacation']").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/apps/vacations/vacation/new-from-wish")
    )
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Grand Tour")
    page.locator('input[name="startDate"]').fill("2024-07-01")
    page.locator('input[name="endDate"]').fill("2024-07-14")
    page.locator("button[id='vacation-create-from-wish']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/vacations/vacation/\d+"))
    expect(page.locator('input[name="name"]')).to_have_value("Grand Tour")
    expect(page.locator('input[name="startDate"]')).to_have_value("2024-07-01")
    expect(page.locator('input[name="endDate"]')).to_have_value("2024-07-14")


def test_webui_vacations_travel_wish_nav_between_all_and_wishlist(page: Page) -> None:
    page.goto("/app/workspace/apps/vacations/vacation")
    page.wait_for_selector("#trunk-panel")
    page.locator("#vacations-wishlist").click()
    page.wait_for_url("/app/workspace/apps/vacations/wish-list")
    page.wait_for_selector("#trunk-panel")

    page.locator("#vacations-all").click()
    page.wait_for_url("/app/workspace/apps/vacations/vacation")


def _assert_other_user_cannot_access_travel_wish_webui(
    page: Page,
    *,
    travel_wish: TravelWish,
) -> None:
    page.goto("/app/workspace/apps/vacations/wish-list")
    expect(page.locator(f"#travel-wish-{travel_wish.ref_id}")).to_have_count(0)

    page.goto(f"/app/workspace/apps/vacations/wish-list/{travel_wish.ref_id}")
    expect(page.locator("body")).to_contain_text(_ACCESS_DENIED_LABEL)


def test_webui_vacations_travel_wish_acl_reader_can_read_but_not_update_or_archive(
    page: Page,
    create_travel_wish,
    grant_travel_wish_access,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
) -> None:
    wish = create_travel_wish("Reader ACL Wish")

    _login_as_other_user(page, another_user_with_vacations_enabled)
    _assert_other_user_cannot_access_travel_wish_webui(page, travel_wish=wish)

    grant_travel_wish_access(wish, AccessLevel.READER)

    _login_as_other_user(page, another_user_with_vacations_enabled)

    page.goto("/app/workspace/apps/vacations/wish-list")
    expect(page.locator("#trunk-panel")).to_contain_text("Reader ACL Wish")

    page.goto(f"/app/workspace/apps/vacations/wish-list/{wish.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Reader ACL Wish")
    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='travel-wish-update']")).to_be_disabled()
    expect(page.locator("button[id='leaf-entity-archive']")).to_be_disabled()
    expect(page.locator("#travel-wish-create-vacation")).to_be_disabled()


def test_webui_vacations_travel_wish_acl_writer_can_read_and_update(
    page: Page,
    create_travel_wish,
    grant_travel_wish_access,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
) -> None:
    wish = create_travel_wish("Writer Update Wish")
    grant_travel_wish_access(wish, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_vacations_enabled)

    page.goto(f"/app/workspace/apps/vacations/wish-list/{wish.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Update Wish")

    page.locator('input[name="name"]').fill("Updated By Writer")
    page.locator("button[id='travel-wish-update']").click()

    page.wait_for_url("/app/workspace/apps/vacations/wish-list")

    page.goto(f"/app/workspace/apps/vacations/wish-list/{wish.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Updated By Writer")


def test_webui_vacations_travel_wish_acl_writer_can_read_and_archive(
    page: Page,
    create_travel_wish,
    grant_travel_wish_access,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
) -> None:
    wish = create_travel_wish("Writer Archive Wish")
    grant_travel_wish_access(wish, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_vacations_enabled)

    page.goto(f"/app/workspace/apps/vacations/wish-list/{wish.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Archive Wish")

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.wait_for_url("/app/workspace/apps/vacations/wish-list")

    page.goto(f"/app/workspace/apps/vacations/wish-list/{wish.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='travel-wish-update']")).to_be_disabled()


def test_webui_vacations_travel_wish_acl_z_denied_without_grant(
    page: Page,
    create_travel_wish,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
) -> None:
    wish = create_travel_wish("ACL Wish")

    _login_as_other_user(page, another_user_with_vacations_enabled)
    _assert_other_user_cannot_access_travel_wish_webui(page, travel_wish=wish)
