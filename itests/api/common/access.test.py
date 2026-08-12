"""Tests for access collaboration, request, and invite use cases."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.application.accept_access_to_entity import (
    sync_detailed as accept_access_to_entity_sync,
)
from jupiter_webapi_client.api.application.access_invite_load import (
    sync_detailed as access_invite_load_sync,
)
from jupiter_webapi_client.api.application.access_request_load import (
    sync_detailed as access_request_load_sync,
)
from jupiter_webapi_client.api.application.acknowledge_access_invite import (
    sync_detailed as acknowledge_access_invite_sync,
)
from jupiter_webapi_client.api.application.cancel_access_invite import (
    sync_detailed as cancel_access_invite_sync,
)
from jupiter_webapi_client.api.application.cancel_access_to_entity import (
    sync_detailed as cancel_access_to_entity_sync,
)
from jupiter_webapi_client.api.application.find_collaborations import (
    sync_detailed as find_collaborations_sync,
)
from jupiter_webapi_client.api.application.get_access_for_entity import (
    sync_detailed as get_access_for_entity_sync,
)
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.application.load_access_grant import (
    sync_detailed as load_access_grant_sync,
)
from jupiter_webapi_client.api.application.reject_access_to_entity import (
    sync_detailed as reject_access_to_entity_sync,
)
from jupiter_webapi_client.api.application.remove_grant_for_entity import (
    sync_detailed as remove_grant_for_entity_sync,
)
from jupiter_webapi_client.api.application.request_access_to_entity import (
    sync_detailed as request_access_to_entity_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.vacations.vacation_create import (
    sync_detailed as vacation_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.accept_access_to_entity_args import (
    AcceptAccessToEntityArgs,
)
from jupiter_webapi_client.models.access_invite_load_args import AccessInviteLoadArgs
from jupiter_webapi_client.models.access_invite_load_result import (
    AccessInviteLoadResult,
)
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.access_request_load_args import AccessRequestLoadArgs
from jupiter_webapi_client.models.access_request_load_result import (
    AccessRequestLoadResult,
)
from jupiter_webapi_client.models.access_request_status import AccessRequestStatus
from jupiter_webapi_client.models.acknowledge_access_invite_args import (
    AcknowledgeAccessInviteArgs,
)
from jupiter_webapi_client.models.cancel_access_invite_args import (
    CancelAccessInviteArgs,
)
from jupiter_webapi_client.models.cancel_access_to_entity_args import (
    CancelAccessToEntityArgs,
)
from jupiter_webapi_client.models.find_collaborations_args import (
    FindCollaborationsArgs,
)
from jupiter_webapi_client.models.find_collaborations_result import (
    FindCollaborationsResult,
)
from jupiter_webapi_client.models.get_access_for_entity_args import (
    GetAccessForEntityArgs,
)
from jupiter_webapi_client.models.get_access_for_entity_result import (
    GetAccessForEntityResult,
)
from jupiter_webapi_client.models.init_result import InitResult
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.load_access_grant_args import LoadAccessGrantArgs
from jupiter_webapi_client.models.load_access_grant_result import (
    LoadAccessGrantResult,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.reject_access_to_entity_args import (
    RejectAccessToEntityArgs,
)
from jupiter_webapi_client.models.remove_grant_for_entity_args import (
    RemoveGrantForEntityArgs,
)
from jupiter_webapi_client.models.request_access_to_entity_args import (
    RequestAccessToEntityArgs,
)
from jupiter_webapi_client.models.request_access_to_entity_result import (
    RequestAccessToEntityResult,
)
from jupiter_webapi_client.models.vacation import Vacation
from jupiter_webapi_client.models.vacation_create_args import VacationCreateArgs
from jupiter_webapi_client.models.vacation_create_result import VacationCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.api.conftest import AnotherUserAndWorkspace
from itests.helpers import get_parsed_from_response


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
    def _create_vacation(name: str) -> Vacation:
        result = vacation_create_sync(
            client=logged_in_client,
            body=VacationCreateArgs(
                name=name,
                start_date="2024-07-01",
                end_date="2024-07-14",
            ),
        )
        return get_parsed_from_response(VacationCreateResult, result).new_vacation

    return _create_vacation


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
def other_client(
    webapi_url: str,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
) -> AuthenticatedClient:
    return AuthenticatedClient(
        base_url=webapi_url,
        token=another_user_with_vacations_enabled.init_result.auth_token_ext,
    )


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


_ACL_DENIED_REASON = "You are not allowed to access this entity"


def _assert_acl_denied(response: requests.Response) -> None:
    assert response.status_code == 502
    body = response.json()
    assert body["status"] == 401
    assert body["response"]["reason"] == _ACL_DENIED_REASON


def _find_collaborations(client: AuthenticatedClient) -> FindCollaborationsResult:
    response = find_collaborations_sync(
        client=client,
        body=FindCollaborationsArgs(allow_archived=False),
    )
    return get_parsed_from_response(FindCollaborationsResult, response)


def _invite_other_user(
    logged_in_client: AuthenticatedClient,
    other_user: AnotherUserAndWorkspace,
    vacation: Vacation,
    access_level: AccessLevel = AccessLevel.READER,
) -> None:
    response = invite_users_to_entity_sync(
        client=logged_in_client,
        body=InviteUsersToEntityArgs(
            entity_type=NamedEntityTag.VACATION,
            entity_ref_id=vacation.ref_id,
            user_ref_ids=[other_user.init_result.new_user.ref_id],
            access_level=access_level,
        ),
    )
    assert response.status_code == 200


def _grant_for_other_user(
    logged_in_client: AuthenticatedClient,
    other_user: AnotherUserAndWorkspace,
    vacation: Vacation,
):
    access_response = get_access_for_entity_sync(
        client=logged_in_client,
        body=GetAccessForEntityArgs(
            entity_type=NamedEntityTag.VACATION,
            entity_ref_id=vacation.ref_id,
        ),
    )
    access_result = get_parsed_from_response(GetAccessForEntityResult, access_response)
    other_user_ref_id = other_user.init_result.new_user.ref_id
    return next(
        entry.access_grant
        for entry in access_result.entries
        if entry.access_grant.user_ref_id == other_user_ref_id
        and entry.access_grant.access_level != AccessLevel.OWNER
    )


def test_api_invite_creates_invite_and_find_collaborations(
    logged_in_client: AuthenticatedClient,
    other_client: AuthenticatedClient,
    create_vacation,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
    new_user_and_workspace: InitResult,
) -> None:
    vacation = create_vacation("Invite Find Vacation")
    _invite_other_user(logged_in_client, another_user_with_vacations_enabled, vacation)

    owner_collab = _find_collaborations(logged_in_client)
    assert any(
        entry.entity.ref_id == vacation.ref_id
        and entry.subject.ref_id
        == another_user_with_vacations_enabled.init_result.new_user.ref_id
        for entry in owner_collab.shared_by_me
    )
    assert not any(
        entry.entity.ref_id == vacation.ref_id for entry in owner_collab.invites
    )

    invitee_collab = _find_collaborations(other_client)
    invite_entries = [
        entry
        for entry in invitee_collab.invites
        if entry.entity.ref_id == vacation.ref_id
    ]
    assert len(invite_entries) == 1
    assert invite_entries[0].access_grant.access_level == AccessLevel.READER
    assert invite_entries[0].subject.ref_id == new_user_and_workspace.new_user.ref_id
    assert any(
        entry.entity.ref_id == vacation.ref_id
        for entry in invitee_collab.shared_with_me
    )


def test_api_access_invite_load_and_acknowledge(
    logged_in_client: AuthenticatedClient,
    other_client: AuthenticatedClient,
    create_vacation,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
    api_url: str,
) -> None:
    vacation = create_vacation("Invite Acknowledge Vacation")
    _invite_other_user(logged_in_client, another_user_with_vacations_enabled, vacation)

    invite_entry = next(
        entry
        for entry in _find_collaborations(other_client).invites
        if entry.entity.ref_id == vacation.ref_id
    )

    load_response = access_invite_load_sync(
        client=other_client,
        body=AccessInviteLoadArgs(
            ref_id=invite_entry.access_invite.ref_id,
            allow_archived=False,
        ),
    )
    load_result = get_parsed_from_response(AccessInviteLoadResult, load_response)
    assert load_result.entity.ref_id == vacation.ref_id
    assert load_result.access_grant.ref_id == invite_entry.access_grant.ref_id
    assert load_result.can_cancel is True
    assert load_result.access_invite.archived is False

    ack_response = acknowledge_access_invite_sync(
        client=other_client,
        body=AcknowledgeAccessInviteArgs(
            access_invite_ref_id=invite_entry.access_invite.ref_id,
        ),
    )
    assert ack_response.status_code == 200

    after_ack = _find_collaborations(other_client)
    assert not any(
        entry.entity.ref_id == vacation.ref_id for entry in after_ack.invites
    )
    assert any(
        entry.entity.ref_id == vacation.ref_id for entry in after_ack.shared_with_me
    )

    vacation_load_response = requests.get(
        f"{api_url}/v1/vacations/{vacation.ref_id}?allow_archived=false",
        headers=_headers(another_user_with_vacations_enabled.api_key),
        timeout=10,
    )
    assert vacation_load_response.status_code == 200
    assert vacation_load_response.json()["access_status"]["access_level"] == "reader"


def test_api_cancel_access_invite_forgets_grant(
    logged_in_client: AuthenticatedClient,
    other_client: AuthenticatedClient,
    create_vacation,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
    api_url: str,
) -> None:
    vacation = create_vacation("Invite Cancel Vacation")
    _invite_other_user(logged_in_client, another_user_with_vacations_enabled, vacation)

    invite_entry = next(
        entry
        for entry in _find_collaborations(other_client).invites
        if entry.entity.ref_id == vacation.ref_id
    )

    cancel_response = cancel_access_invite_sync(
        client=other_client,
        body=CancelAccessInviteArgs(
            access_invite_ref_id=invite_entry.access_invite.ref_id,
        ),
    )
    assert cancel_response.status_code == 200

    after_cancel = _find_collaborations(other_client)
    assert not any(
        entry.entity.ref_id == vacation.ref_id for entry in after_cancel.invites
    )
    assert not any(
        entry.entity.ref_id == vacation.ref_id for entry in after_cancel.shared_with_me
    )

    load_response = requests.get(
        f"{api_url}/v1/vacations/{vacation.ref_id}?allow_archived=false",
        headers=_headers(another_user_with_vacations_enabled.api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)


def test_api_remove_grant_archives_associated_invite(
    logged_in_client: AuthenticatedClient,
    other_client: AuthenticatedClient,
    create_vacation,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
) -> None:
    vacation = create_vacation("Invite Remove Grant Vacation")
    _invite_other_user(logged_in_client, another_user_with_vacations_enabled, vacation)

    invite_entry = next(
        entry
        for entry in _find_collaborations(other_client).invites
        if entry.entity.ref_id == vacation.ref_id
    )
    grant = _grant_for_other_user(
        logged_in_client, another_user_with_vacations_enabled, vacation
    )

    remove_response = remove_grant_for_entity_sync(
        client=logged_in_client,
        body=RemoveGrantForEntityArgs(
            entity_type=NamedEntityTag.VACATION,
            entity_ref_id=vacation.ref_id,
            access_grant_ref_id=grant.ref_id,
        ),
    )
    assert remove_response.status_code == 200

    after_remove = _find_collaborations(other_client)
    assert not any(
        entry.access_invite.ref_id == invite_entry.access_invite.ref_id
        for entry in after_remove.invites
    )
    assert not any(
        entry.access_grant.ref_id == grant.ref_id
        for entry in after_remove.shared_with_me
    )


def test_api_load_access_grant_for_owner_and_grantee(
    logged_in_client: AuthenticatedClient,
    other_client: AuthenticatedClient,
    create_vacation,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
) -> None:
    vacation = create_vacation("Load Grant Vacation")
    _invite_other_user(
        logged_in_client,
        another_user_with_vacations_enabled,
        vacation,
        AccessLevel.WRITER,
    )
    grant = _grant_for_other_user(
        logged_in_client, another_user_with_vacations_enabled, vacation
    )

    owner_load = get_parsed_from_response(
        LoadAccessGrantResult,
        load_access_grant_sync(
            client=logged_in_client,
            body=LoadAccessGrantArgs(ref_id=grant.ref_id, allow_archived=False),
        ),
    )
    assert owner_load.can_update is True
    assert owner_load.can_revoke is True
    assert owner_load.can_forget is False
    assert (
        owner_load.grantee.ref_id
        == another_user_with_vacations_enabled.init_result.new_user.ref_id
    )

    grantee_load = get_parsed_from_response(
        LoadAccessGrantResult,
        load_access_grant_sync(
            client=other_client,
            body=LoadAccessGrantArgs(ref_id=grant.ref_id, allow_archived=False),
        ),
    )
    assert grantee_load.can_update is False
    assert grantee_load.can_revoke is False
    assert grantee_load.can_forget is True
    assert grantee_load.entity.ref_id == vacation.ref_id


def test_api_request_access_accept_flow(
    logged_in_client: AuthenticatedClient,
    other_client: AuthenticatedClient,
    create_vacation,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
    api_url: str,
) -> None:
    vacation = create_vacation("Request Accept Vacation")
    other_user_ref_id = another_user_with_vacations_enabled.init_result.new_user.ref_id

    request_result = get_parsed_from_response(
        RequestAccessToEntityResult,
        request_access_to_entity_sync(
            client=other_client,
            body=RequestAccessToEntityArgs(
                entity_type=NamedEntityTag.VACATION,
                entity_ref_id=vacation.ref_id,
                access_level=AccessLevel.READER,
            ),
        ),
    )

    requester_collab = _find_collaborations(other_client)
    assert any(
        entry.access_request.ref_id == request_result.access_request_ref_id
        for entry in requester_collab.outgoing_requests
    )

    owner_collab = _find_collaborations(logged_in_client)
    assert any(
        entry.access_request.ref_id == request_result.access_request_ref_id
        and entry.subject.ref_id == other_user_ref_id
        for entry in owner_collab.incoming_requests
    )

    owner_load = get_parsed_from_response(
        AccessRequestLoadResult,
        access_request_load_sync(
            client=logged_in_client,
            body=AccessRequestLoadArgs(
                ref_id=request_result.access_request_ref_id,
                allow_archived=False,
            ),
        ),
    )
    assert owner_load.can_accept is True
    assert owner_load.can_reject is True
    assert owner_load.can_cancel is False
    assert owner_load.requester.ref_id == other_user_ref_id
    assert owner_load.access_request.status == AccessRequestStatus.REQUESTED

    requester_load = get_parsed_from_response(
        AccessRequestLoadResult,
        access_request_load_sync(
            client=other_client,
            body=AccessRequestLoadArgs(
                ref_id=request_result.access_request_ref_id,
                allow_archived=False,
            ),
        ),
    )
    assert requester_load.can_accept is False
    assert requester_load.can_reject is False
    assert requester_load.can_cancel is True

    accept_response = accept_access_to_entity_sync(
        client=logged_in_client,
        body=AcceptAccessToEntityArgs(
            access_request_ref_id=request_result.access_request_ref_id,
        ),
    )
    assert accept_response.status_code == 200

    after_accept_owner = _find_collaborations(logged_in_client)
    assert not any(
        entry.access_request.ref_id == request_result.access_request_ref_id
        for entry in after_accept_owner.incoming_requests
    )
    assert any(
        entry.entity.ref_id == vacation.ref_id
        and entry.subject.ref_id == other_user_ref_id
        for entry in after_accept_owner.shared_by_me
    )

    after_accept_requester = _find_collaborations(other_client)
    assert not any(
        entry.access_request.ref_id == request_result.access_request_ref_id
        for entry in after_accept_requester.outgoing_requests
    )
    assert any(
        entry.entity.ref_id == vacation.ref_id
        for entry in after_accept_requester.shared_with_me
    )
    # Accepting a request grants access without creating an invite notification.
    assert not any(
        entry.entity.ref_id == vacation.ref_id
        for entry in after_accept_requester.invites
    )

    load_response = requests.get(
        f"{api_url}/v1/vacations/{vacation.ref_id}?allow_archived=false",
        headers=_headers(another_user_with_vacations_enabled.api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "reader"


def test_api_request_access_reject_flow(
    logged_in_client: AuthenticatedClient,
    other_client: AuthenticatedClient,
    create_vacation,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
    api_url: str,
) -> None:
    vacation = create_vacation("Request Reject Vacation")

    request_result = get_parsed_from_response(
        RequestAccessToEntityResult,
        request_access_to_entity_sync(
            client=other_client,
            body=RequestAccessToEntityArgs(
                entity_type=NamedEntityTag.VACATION,
                entity_ref_id=vacation.ref_id,
                access_level=AccessLevel.WRITER,
            ),
        ),
    )

    reject_response = reject_access_to_entity_sync(
        client=logged_in_client,
        body=RejectAccessToEntityArgs(
            access_request_ref_id=request_result.access_request_ref_id,
        ),
    )
    assert reject_response.status_code == 200

    owner_collab = _find_collaborations(logged_in_client)
    assert not any(
        entry.access_request.ref_id == request_result.access_request_ref_id
        for entry in owner_collab.incoming_requests
    )
    assert not any(
        entry.entity.ref_id == vacation.ref_id for entry in owner_collab.shared_by_me
    )

    load_response = requests.get(
        f"{api_url}/v1/vacations/{vacation.ref_id}?allow_archived=false",
        headers=_headers(another_user_with_vacations_enabled.api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)


def test_api_request_access_cancel_flow(
    logged_in_client: AuthenticatedClient,
    other_client: AuthenticatedClient,
    create_vacation,
) -> None:
    vacation = create_vacation("Request Cancel Vacation")

    request_result = get_parsed_from_response(
        RequestAccessToEntityResult,
        request_access_to_entity_sync(
            client=other_client,
            body=RequestAccessToEntityArgs(
                entity_type=NamedEntityTag.VACATION,
                entity_ref_id=vacation.ref_id,
                access_level=AccessLevel.COMMENTER,
            ),
        ),
    )

    cancel_response = cancel_access_to_entity_sync(
        client=other_client,
        body=CancelAccessToEntityArgs(
            access_request_ref_id=request_result.access_request_ref_id,
        ),
    )
    assert cancel_response.status_code == 200

    requester_collab = _find_collaborations(other_client)
    assert not any(
        entry.access_request.ref_id == request_result.access_request_ref_id
        for entry in requester_collab.outgoing_requests
    )

    owner_collab = _find_collaborations(logged_in_client)
    assert not any(
        entry.access_request.ref_id == request_result.access_request_ref_id
        for entry in owner_collab.incoming_requests
    )
