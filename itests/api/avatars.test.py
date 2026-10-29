"""Tests for the Jupiter API user avatar endpoints."""

import base64
import io
import uuid
from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.application.close_account import (
    sync_detailed as close_account_sync,
)
from jupiter_webapi_client.api.application.load_top_level_info import (
    sync_detailed as load_top_level_info_sync,
)
from jupiter_webapi_client.api.images.image_load import (
    sync_detailed as image_load_sync,
)
from jupiter_webapi_client.api.users.user_avatar_clear import (
    sync_detailed as user_avatar_clear_sync,
)
from jupiter_webapi_client.api.users.user_avatar_upload import (
    sync_detailed as user_avatar_upload_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient, Client
from jupiter_webapi_client.models.close_account_args import CloseAccountArgs
from jupiter_webapi_client.models.error_response import ErrorResponse
from jupiter_webapi_client.models.image_load_args import ImageLoadArgs
from jupiter_webapi_client.models.image_load_result import ImageLoadResult
from jupiter_webapi_client.models.image_purpose import ImagePurpose
from jupiter_webapi_client.models.load_top_level_info_args import LoadTopLevelInfoArgs
from jupiter_webapi_client.models.load_top_level_info_result import (
    LoadTopLevelInfoResult,
)
from jupiter_webapi_client.models.user_avatar_clear_args import UserAvatarClearArgs
from jupiter_webapi_client.models.user_avatar_clear_result import UserAvatarClearResult
from jupiter_webapi_client.models.user_avatar_upload_args import UserAvatarUploadArgs
from jupiter_webapi_client.models.user_avatar_upload_result import (
    UserAvatarUploadResult,
)
from jupiter_webapi_client.types import Response
from PIL import Image

from itests.api.conftest import AnotherUserAndWorkspace, create_other_user_and_workspace
from itests.helpers import get_parsed_from_response

_GENERATED_PREFIX = "data:image/svg+xml;base64,"
_LOCAL_PREFIX = "/images/avatars/"


@pytest.fixture(autouse=True)
def _start_and_end_with_the_generated_avatar(
    logged_in_client: AuthenticatedClient,
) -> Iterator[None]:
    user_avatar_clear_sync(client=logged_in_client, body=UserAvatarClearArgs())
    try:
        yield
    finally:
        user_avatar_clear_sync(client=logged_in_client, body=UserAvatarClearArgs())


def _picture(colour: tuple[int, int, int] = (220, 30, 30)) -> bytes:
    output = io.BytesIO()
    Image.new("RGB", (600, 400), colour).save(output, format="PNG")
    return output.getvalue()


def _upload(
    client: AuthenticatedClient, content: bytes
) -> Response[ErrorResponse | UserAvatarUploadResult]:
    return user_avatar_upload_sync(
        client=client,
        body=UserAvatarUploadArgs(image_base64=base64.b64encode(content).decode()),
    )


def _uploaded_url(client: AuthenticatedClient, content: bytes) -> str:
    response = _upload(client, content)
    url = get_parsed_from_response(UserAvatarUploadResult, response).avatar_url
    if not url.startswith(_LOCAL_PREFIX):
        pytest.skip("Pictures are not on the local image store here")
    return url


def _current_url(client: AuthenticatedClient) -> str:
    response = load_top_level_info_sync(client=client, body=LoadTopLevelInfoArgs())
    url = get_parsed_from_response(LoadTopLevelInfoResult, response).user_avatar_url
    assert isinstance(url, str)
    return url


def _load(
    client: AuthenticatedClient | Client, url: str
) -> Response[ErrorResponse | ImageLoadResult]:
    return image_load_sync(
        client=client,
        body=ImageLoadArgs(
            purpose=ImagePurpose.AVATARS, path=url.removeprefix(_LOCAL_PREFIX)
        ),
    )


def test_a_new_user_has_a_picture_drawn_from_their_name(
    logged_in_client: AuthenticatedClient,
) -> None:
    assert _current_url(logged_in_client).startswith(_GENERATED_PREFIX)


def test_an_uploaded_picture_is_shown_and_served(
    logged_in_client: AuthenticatedClient,
) -> None:
    url = _uploaded_url(logged_in_client, _picture())

    assert _current_url(logged_in_client) == url
    loaded = get_parsed_from_response(ImageLoadResult, _load(logged_in_client, url))
    assert loaded.content_type == "image/webp"
    stored = Image.open(io.BytesIO(base64.b64decode(loaded.content_base64)))
    assert stored.format == "WEBP"
    assert stored.size == (256, 256)


def test_pictures_are_served_to_people_who_are_not_logged_in(
    logged_in_client: AuthenticatedClient, webapi_url: str
) -> None:
    url = _uploaded_url(logged_in_client, _picture())

    response = _load(Client(base_url=webapi_url), url)

    assert response.status_code == 200


def test_a_new_picture_replaces_the_old_one(
    logged_in_client: AuthenticatedClient,
) -> None:
    first = _uploaded_url(logged_in_client, _picture((220, 30, 30)))
    second = _uploaded_url(logged_in_client, _picture((30, 30, 220)))

    assert first != second
    assert _current_url(logged_in_client) == second
    assert _load(logged_in_client, second).status_code == 200
    # The old one is gone for good, not just unlinked.
    assert _load(logged_in_client, first).status_code == 404


def test_clearing_goes_back_to_the_generated_picture(
    logged_in_client: AuthenticatedClient,
) -> None:
    url = _uploaded_url(logged_in_client, _picture())

    response = user_avatar_clear_sync(
        client=logged_in_client, body=UserAvatarClearArgs()
    )

    cleared = get_parsed_from_response(UserAvatarClearResult, response)
    assert cleared.avatar_url.startswith(_GENERATED_PREFIX)
    assert _current_url(logged_in_client) == cleared.avatar_url
    assert _load(logged_in_client, url).status_code == 404


def test_clearing_with_no_picture_is_fine(
    logged_in_client: AuthenticatedClient,
) -> None:
    response = user_avatar_clear_sync(
        client=logged_in_client, body=UserAvatarClearArgs()
    )

    assert response.status_code == 200


@pytest.mark.parametrize(
    "bad_image_base64",
    [
        "this is not base64!",
        base64.b64encode(b"not a picture at all").decode(),
        base64.b64encode(b"").decode(),
    ],
)
def test_bad_uploads_are_refused_and_change_nothing(
    logged_in_client: AuthenticatedClient, bad_image_base64: str
) -> None:
    url = _uploaded_url(logged_in_client, _picture())

    response = user_avatar_upload_sync(
        client=logged_in_client,
        body=UserAvatarUploadArgs(image_base64=bad_image_base64),
    )

    assert response.status_code == 422
    assert _current_url(logged_in_client) == url
    assert _load(logged_in_client, url).status_code == 200


def test_a_picture_that_is_too_small_is_refused(
    logged_in_client: AuthenticatedClient,
) -> None:
    output = io.BytesIO()
    Image.new("RGB", (64, 64), (220, 30, 30)).save(output, format="PNG")

    assert _upload(logged_in_client, output.getvalue()).status_code == 422


def test_a_picture_that_is_too_big_is_refused(
    logged_in_client: AuthenticatedClient,
) -> None:
    assert _upload(logged_in_client, b"\x00" * (5 * 1024 * 1024)).status_code == 422


def test_an_image_nobody_stored_is_not_found(
    logged_in_client: AuthenticatedClient,
) -> None:
    response = _load(logged_in_client, f"{_LOCAL_PREFIX}{uuid.uuid4().hex}.webp")

    assert response.status_code == 404


@pytest.mark.parametrize(
    "bad_path",
    ["../../etc/passwd.webp", "/etc/passwd.webp", "..%2Fsecret.webp", "UPPER.webp"],
)
def test_paths_that_could_reach_other_files_are_refused(
    logged_in_client: AuthenticatedClient, bad_path: str
) -> None:
    response = image_load_sync(
        client=logged_in_client,
        body=ImageLoadArgs(purpose=ImagePurpose.AVATARS, path=bad_path),
    )

    assert response.status_code == 422


def test_users_do_not_touch_each_others_pictures(
    logged_in_client: AuthenticatedClient,
    another_user_and_workspace: AnotherUserAndWorkspace,
    webapi_url: str,
) -> None:
    other_client = AuthenticatedClient(
        base_url=webapi_url, token=another_user_and_workspace.init_result.auth_token_ext
    )
    mine = _uploaded_url(logged_in_client, _picture((220, 30, 30)))

    theirs = _uploaded_url(other_client, _picture((30, 30, 220)))
    user_avatar_clear_sync(client=other_client, body=UserAvatarClearArgs())

    assert _current_url(logged_in_client) == mine
    assert _load(logged_in_client, mine).status_code == 200
    assert _load(logged_in_client, theirs).status_code == 404


def test_closing_an_account_removes_the_picture(webapi_url: str) -> None:
    with create_other_user_and_workspace(webapi_url, cleanup=False) as other:
        client = AuthenticatedClient(
            base_url=webapi_url, token=other.init_result.auth_token_ext
        )
        url = _uploaded_url(client, _picture())
        assert _load(client, url).status_code == 200

        close_response = close_account_sync(client=client, body=CloseAccountArgs())

        assert close_response.status_code == 200
        assert _load(Client(base_url=webapi_url), url).status_code == 404
