"""Tests about the picture of the user, as the WebUI shows and serves it."""

import base64
import io
import re
from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.images.image_load import (
    sync_detailed as image_load_sync,
)
from jupiter_webapi_client.api.users.user_avatar_clear import (
    sync_detailed as user_avatar_clear_sync,
)
from jupiter_webapi_client.api.users.user_avatar_upload import (
    sync_detailed as user_avatar_upload_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.image_load_args import ImageLoadArgs
from jupiter_webapi_client.models.image_load_result import ImageLoadResult
from jupiter_webapi_client.models.image_purpose import ImagePurpose
from jupiter_webapi_client.models.user_avatar_clear_args import UserAvatarClearArgs
from jupiter_webapi_client.models.user_avatar_upload_args import UserAvatarUploadArgs
from jupiter_webapi_client.models.user_avatar_upload_result import (
    UserAvatarUploadResult,
)
from PIL import Image
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response

_LOCAL_PREFIX = "/images/avatars/"
_APP_BAR_AVATAR = "#account-menu img.MuiAvatar-img"


@pytest.fixture(autouse=True)
def _end_with_the_generated_avatar(
    logged_in_client: AuthenticatedClient,
) -> Iterator[None]:
    try:
        yield
    finally:
        user_avatar_clear_sync(client=logged_in_client, body=UserAvatarClearArgs())


def _upload_a_picture(logged_in_client: AuthenticatedClient) -> str:
    output = io.BytesIO()
    Image.new("RGB", (600, 400), (30, 30, 220)).save(output, format="PNG")
    response = user_avatar_upload_sync(
        client=logged_in_client,
        body=UserAvatarUploadArgs(
            image_base64=base64.b64encode(output.getvalue()).decode()
        ),
    )
    url = get_parsed_from_response(UserAvatarUploadResult, response).avatar_url
    if not url.startswith(_LOCAL_PREFIX):
        pytest.skip("Pictures are not on the local image store here")
    return url


def test_the_picture_drawn_from_the_name_is_shown_by_default(page: Page) -> None:
    page.goto("/app/workspace")

    expect(page.locator(_APP_BAR_AVATAR)).to_have_attribute(
        "src", re.compile(r"^data:image/svg\+xml;base64,")
    )


def test_an_uploaded_picture_is_shown_in_the_app_bar(
    page: Page, logged_in_client: AuthenticatedClient
) -> None:
    url = _upload_a_picture(logged_in_client)

    page.goto("/app/workspace")

    avatar = page.locator(_APP_BAR_AVATAR)
    expect(avatar).to_have_attribute("src", url)
    # Not just a tag: the browser really fetched it, and got the picture we keep.
    expect(avatar).to_have_js_property("complete", True)
    assert avatar.evaluate("img => img.naturalWidth") == 256


def test_the_webui_serves_the_picture_for_good(
    page: Page, logged_in_client: AuthenticatedClient
) -> None:
    url = _upload_a_picture(logged_in_client)
    expected = get_parsed_from_response(
        ImageLoadResult,
        image_load_sync(
            client=logged_in_client,
            body=ImageLoadArgs(
                purpose=ImagePurpose.AVATARS, path=url.removeprefix(_LOCAL_PREFIX)
            ),
        ),
    )

    response = page.request.get(url)

    assert response.status == 200
    assert response.headers["content-type"] == "image/webp"
    assert response.headers["cache-control"] == "public, max-age=31536000, immutable"
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.body() == base64.b64decode(expected.content_base64)


def test_pictures_are_served_to_people_who_are_not_logged_in(
    page: Page, logged_in_client: AuthenticatedClient, webui_url: str
) -> None:
    url = _upload_a_picture(logged_in_client)

    response = requests.get(f"{webui_url}{url}", timeout=30)

    assert response.status_code == 200
    assert response.headers["content-type"] == "image/webp"


@pytest.mark.parametrize(
    "path",
    [
        "/images/avatars/0123456789abcdef0123456789abcdef0123456789abcdef.webp",
        "/images/wallpapers/whatever.webp",
        "/images/avatars",
        "/images/avatars/",
        "/images/avatars/..%2F..%2Fetc%2Fpasswd.webp",
        "/images/avatars/UPPER.webp",
    ],
)
def test_pictures_that_are_not_there_are_all_the_same_404(
    page: Page, path: str
) -> None:
    assert page.request.get(path).status == 404
