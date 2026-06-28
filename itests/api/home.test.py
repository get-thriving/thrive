"""Tests for the home WebAPI use cases."""

import pytest
from jupiter_webapi_client.api.home.home_tab_archive import (
    sync_detailed as home_tab_archive_sync,
)
from jupiter_webapi_client.api.home.home_tab_create import (
    sync_detailed as home_tab_create_sync,
)
from jupiter_webapi_client.api.home.home_tab_load import (
    sync_detailed as home_tab_load_sync,
)
from jupiter_webapi_client.api.home.home_tab_remove import (
    sync_detailed as home_tab_remove_sync,
)
from jupiter_webapi_client.api.home.home_tab_update import (
    sync_detailed as home_tab_update_sync,
)
from jupiter_webapi_client.api.home.home_widget_archive import (
    sync_detailed as home_widget_archive_sync,
)
from jupiter_webapi_client.api.home.home_widget_create import (
    sync_detailed as home_widget_create_sync,
)
from jupiter_webapi_client.api.home.home_widget_load import (
    sync_detailed as home_widget_load_sync,
)
from jupiter_webapi_client.api.home.home_widget_move_and_resize import (
    sync_detailed as home_widget_move_and_resize_sync,
)
from jupiter_webapi_client.api.home.home_widget_remove import (
    sync_detailed as home_widget_remove_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.home_tab import HomeTab
from jupiter_webapi_client.models.home_tab_archive_args import HomeTabArchiveArgs
from jupiter_webapi_client.models.home_tab_create_args import HomeTabCreateArgs
from jupiter_webapi_client.models.home_tab_create_result import HomeTabCreateResult
from jupiter_webapi_client.models.home_tab_load_args import HomeTabLoadArgs
from jupiter_webapi_client.models.home_tab_remove_args import HomeTabRemoveArgs
from jupiter_webapi_client.models.home_tab_target import HomeTabTarget
from jupiter_webapi_client.models.home_tab_update_args import HomeTabUpdateArgs
from jupiter_webapi_client.models.home_tab_update_args_icon import HomeTabUpdateArgsIcon
from jupiter_webapi_client.models.home_tab_update_args_name import HomeTabUpdateArgsName
from jupiter_webapi_client.models.home_widget import HomeWidget
from jupiter_webapi_client.models.home_widget_archive_args import HomeWidgetArchiveArgs
from jupiter_webapi_client.models.home_widget_create_args import HomeWidgetCreateArgs
from jupiter_webapi_client.models.home_widget_create_result import HomeWidgetCreateResult
from jupiter_webapi_client.models.home_widget_load_args import HomeWidgetLoadArgs
from jupiter_webapi_client.models.home_widget_move_and_resize_args import (
    HomeWidgetMoveAndResizeArgs,
)
from jupiter_webapi_client.models.home_widget_remove_args import HomeWidgetRemoveArgs
from jupiter_webapi_client.models.widget_dimension import WidgetDimension
from jupiter_webapi_client.models.widget_type import WidgetType

from itests.api.conftest import AnotherUserAndWorkspace
from itests.helpers import get_parsed_from_response


@pytest.fixture()
def create_home_tab(logged_in_client: AuthenticatedClient):
    def _create(name: str = "ACL Tab") -> HomeTab:
        result = home_tab_create_sync(
            client=logged_in_client,
            body=HomeTabCreateArgs(
                target=HomeTabTarget.BIG_SCREEN,
                name=name,
            ),
        )
        return get_parsed_from_response(HomeTabCreateResult, result).new_home_tab

    return _create


@pytest.fixture()
def create_home_widget(logged_in_client: AuthenticatedClient):
    def _create(home_tab_ref_id: str) -> HomeWidget:
        result = home_widget_create_sync(
            client=logged_in_client,
            body=HomeWidgetCreateArgs(
                home_tab_ref_id=home_tab_ref_id,
                the_type=WidgetType.MOTD,
                row=0,
                col=0,
                dimension=WidgetDimension.DIM_1X1,
            ),
        )
        return get_parsed_from_response(HomeWidgetCreateResult, result).new_widget

    return _create


def _other_client(
    webapi_url: str, another_user_and_workspace: AnotherUserAndWorkspace
) -> AuthenticatedClient:
    return AuthenticatedClient(
        base_url=webapi_url,
        token=another_user_and_workspace.init_result.auth_token_ext,
    )


def _assert_acl_denied(response: object) -> None:
    assert int(getattr(response, "status_code")) == 401


def test_api_home_tab_acl(
    create_home_tab,
    another_user_and_workspace: AnotherUserAndWorkspace,
    webapi_url: str,
) -> None:
    tab = create_home_tab("ACL Tab")
    other_client = _other_client(webapi_url, another_user_and_workspace)

    load_response = home_tab_load_sync(
        client=other_client,
        body=HomeTabLoadArgs(ref_id=tab.ref_id, allow_archived=False),
    )
    _assert_acl_denied(load_response)

    update_response = home_tab_update_sync(
        client=other_client,
        body=HomeTabUpdateArgs(
            ref_id=tab.ref_id,
            name=HomeTabUpdateArgsName(should_change=True, value="Hacked Tab"),
            icon=HomeTabUpdateArgsIcon(should_change=False),
        ),
    )
    _assert_acl_denied(update_response)

    archive_response = home_tab_archive_sync(
        client=other_client,
        body=HomeTabArchiveArgs(ref_id=tab.ref_id),
    )
    _assert_acl_denied(archive_response)

    remove_response = home_tab_remove_sync(
        client=other_client,
        body=HomeTabRemoveArgs(ref_id=tab.ref_id),
    )
    _assert_acl_denied(remove_response)


def test_api_home_widget_acl(
    create_home_tab,
    create_home_widget,
    another_user_and_workspace: AnotherUserAndWorkspace,
    webapi_url: str,
) -> None:
    tab = create_home_tab("ACL Tab")
    widget = create_home_widget(tab.ref_id)
    other_client = _other_client(webapi_url, another_user_and_workspace)

    load_response = home_widget_load_sync(
        client=other_client,
        body=HomeWidgetLoadArgs(ref_id=widget.ref_id, allow_archived=False),
    )
    _assert_acl_denied(load_response)

    move_response = home_widget_move_and_resize_sync(
        client=other_client,
        body=HomeWidgetMoveAndResizeArgs(
            ref_id=widget.ref_id,
            row=1,
            col=0,
            dimension=WidgetDimension.DIM_1X1,
        ),
    )
    _assert_acl_denied(move_response)

    archive_response = home_widget_archive_sync(
        client=other_client,
        body=HomeWidgetArchiveArgs(ref_id=widget.ref_id),
    )
    _assert_acl_denied(archive_response)

    remove_response = home_widget_remove_sync(
        client=other_client,
        body=HomeWidgetRemoveArgs(ref_id=widget.ref_id),
    )
    _assert_acl_denied(remove_response)
