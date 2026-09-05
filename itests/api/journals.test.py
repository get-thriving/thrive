"""Tests for the API for journals."""

from collections.abc import Iterator
from typing import cast

import pytest
import requests
from jupiter_webapi_client.api.application.get_summaries import (
    sync_detailed as get_summaries_sync,
)
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.gen.gen_do import (
    sync_detailed as gen_do_sync,
)
from jupiter_webapi_client.api.journals.journal_create import (
    sync_detailed as journal_create_sync,
)
from jupiter_webapi_client.api.journals.journal_load import (
    sync_detailed as journal_load_sync,
)
from jupiter_webapi_client.api.journals.journal_load_for_date_and_period import (
    sync_detailed as journal_load_for_date_and_period_sync,
)
from jupiter_webapi_client.api.journals.journal_question_archive import (
    sync_detailed as journal_question_archive_sync,
)
from jupiter_webapi_client.api.journals.journal_question_create import (
    sync_detailed as journal_question_create_sync,
)
from jupiter_webapi_client.api.journals.journal_question_find import (
    sync_detailed as journal_question_find_sync,
)
from jupiter_webapi_client.api.journals.journal_question_load import (
    sync_detailed as journal_question_load_sync,
)
from jupiter_webapi_client.api.journals.journal_question_remove import (
    sync_detailed as journal_question_remove_sync,
)
from jupiter_webapi_client.api.journals.journal_question_reorder import (
    sync_detailed as journal_question_reorder_sync,
)
from jupiter_webapi_client.api.journals.journal_question_update import (
    sync_detailed as journal_question_update_sync,
)
from jupiter_webapi_client.api.life_plan.aspect_create import (
    sync_detailed as aspect_create_sync,
)
from jupiter_webapi_client.api.life_plan.goal_create import (
    sync_detailed as goal_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.aspect import Aspect
from jupiter_webapi_client.models.aspect_create_args import AspectCreateArgs
from jupiter_webapi_client.models.aspect_create_result import AspectCreateResult
from jupiter_webapi_client.models.gen_do_args import GenDoArgs
from jupiter_webapi_client.models.get_summaries_args import GetSummariesArgs
from jupiter_webapi_client.models.get_summaries_result import GetSummariesResult
from jupiter_webapi_client.models.goal import Goal
from jupiter_webapi_client.models.goal_create_args import GoalCreateArgs
from jupiter_webapi_client.models.goal_create_result import GoalCreateResult
from jupiter_webapi_client.models.heading_block import HeadingBlock
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.journal import Journal
from jupiter_webapi_client.models.journal_create_args import JournalCreateArgs
from jupiter_webapi_client.models.journal_create_result import JournalCreateResult
from jupiter_webapi_client.models.journal_load_args import JournalLoadArgs
from jupiter_webapi_client.models.journal_load_for_date_and_period_args import (
    JournalLoadForDateAndPeriodArgs,
)
from jupiter_webapi_client.models.journal_load_for_date_and_period_result import (
    JournalLoadForDateAndPeriodResult,
)
from jupiter_webapi_client.models.journal_load_result import JournalLoadResult
from jupiter_webapi_client.models.journal_question import JournalQuestion
from jupiter_webapi_client.models.journal_question_archive_args import (
    JournalQuestionArchiveArgs,
)
from jupiter_webapi_client.models.journal_question_create_args import (
    JournalQuestionCreateArgs,
)
from jupiter_webapi_client.models.journal_question_create_result import (
    JournalQuestionCreateResult,
)
from jupiter_webapi_client.models.journal_question_find_args import (
    JournalQuestionFindArgs,
)
from jupiter_webapi_client.models.journal_question_find_result import (
    JournalQuestionFindResult,
)
from jupiter_webapi_client.models.journal_question_load_args import (
    JournalQuestionLoadArgs,
)
from jupiter_webapi_client.models.journal_question_load_result import (
    JournalQuestionLoadResult,
)
from jupiter_webapi_client.models.journal_question_remove_args import (
    JournalQuestionRemoveArgs,
)
from jupiter_webapi_client.models.journal_question_reorder_args import (
    JournalQuestionReorderArgs,
)
from jupiter_webapi_client.models.journal_question_update_args import (
    JournalQuestionUpdateArgs,
)
from jupiter_webapi_client.models.journal_question_update_args_name import (
    JournalQuestionUpdateArgsName,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.paragraph_block import ParagraphBlock
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.sync_target import SyncTarget
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from jupiter_webapi_client.types import Unset

from itests.api.conftest import AnotherUserAndWorkspace
from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_journals_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.JOURNALS, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.JOURNALS, value=False
            ),
        )


@pytest.fixture()
def _with_life_plan_enabled(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.LIFE_PLAN, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.LIFE_PLAN, value=False
            ),
        )


@pytest.fixture()
def create_aspect(logged_in_client: AuthenticatedClient):
    def _create(name: str, parent_aspect_ref_id: str | None = None) -> Aspect:
        if parent_aspect_ref_id is None:
            summaries = get_parsed_from_response(
                GetSummariesResult,
                get_summaries_sync(client=logged_in_client, body=GetSummariesArgs()),
            )
            root_aspect = summaries.root_aspect
            if root_aspect is None or isinstance(root_aspect, Unset):
                raise ValueError("Root aspect is missing from get_summaries")
            parent_aspect_ref_id = cast(str, root_aspect.ref_id)

        result = aspect_create_sync(
            client=logged_in_client,
            body=AspectCreateArgs(parent_aspect_ref_id=parent_aspect_ref_id, name=name),
        )
        return get_parsed_from_response(AspectCreateResult, result).new_aspect

    return _create


@pytest.fixture()
def create_goal(logged_in_client: AuthenticatedClient):
    def _create(
        name: str, aspect_ref_id: str, parent_goal_ref_id: str | None = None
    ) -> Goal:
        result = goal_create_sync(
            client=logged_in_client,
            body=GoalCreateArgs(
                name=name,
                aspect_ref_id=aspect_ref_id,
                parent_goal_ref_id=parent_goal_ref_id,
            ),
        )
        return get_parsed_from_response(GoalCreateResult, result).new_goal

    return _create


@pytest.fixture()
def create_journal(logged_in_client: AuthenticatedClient):
    def _create(
        right_now: str, period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY
    ) -> Journal:
        result = journal_create_sync(
            client=logged_in_client,
            body=JournalCreateArgs(
                right_now=right_now,
                period=period,
            ),
        )
        return get_parsed_from_response(JournalCreateResult, result).new_journal

    return _create


@pytest.fixture()
def create_question(logged_in_client: AuthenticatedClient):
    def _create(
        name: str, period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY
    ) -> JournalQuestion:
        result = journal_question_create_sync(
            client=logged_in_client,
            body=JournalQuestionCreateArgs(name=name, period=period),
        )
        return get_parsed_from_response(
            JournalQuestionCreateResult, result
        ).new_journal_question

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


@pytest.fixture()
def another_user_with_journals_enabled(
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
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.JOURNALS, value=True),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.JOURNALS, value=False
            ),
        )


_ACL_DENIED_REASON = "You are not allowed to access this entity"


def _assert_acl_denied(response: requests.Response) -> None:
    assert response.status_code == 502
    body = response.json()
    assert body["status"] == 401
    assert body["response"]["reason"] == _ACL_DENIED_REASON


@pytest.fixture()
def grant_journal_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_journals_enabled: AnotherUserAndWorkspace,
):
    def _grant(journal: Journal, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.JOURNAL,
                entity_ref_id=journal.ref_id,
                user_ref_ids=[
                    another_user_with_journals_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_journals_enabled.api_key

    return _grant


def _assert_other_user_cannot_access_journal(
    api_url: str,
    *,
    journal_ref_id: str,
    owner_api_key: str,
    other_api_key: str,
) -> None:
    assert other_api_key != owner_api_key

    owner_load_response = requests.get(
        f"{api_url}/v1/journals/{journal_ref_id}?allow_archived=false",
        headers=_headers(owner_api_key),
        timeout=10,
    )
    assert owner_load_response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/journals/{journal_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    change_time_config_response = requests.post(
        f"{api_url}/v1/journals/{journal_ref_id}/change-time-config",
        headers=_headers(other_api_key),
        json={
            "ref_id": journal_ref_id,
            "right_now": {"should_change": True, "value": "2024-10-14"},
            "period": {"should_change": False},
        },
        timeout=10,
    )
    _assert_acl_denied(change_time_config_response)

    archive_response = requests.delete(
        f"{api_url}/v1/journals/{journal_ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_journal_acl_reader_can_read_but_not_update_or_archive(
    api_url: str,
    api_key: str,
    create_journal,
    grant_journal_access,
    another_user_with_journals_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_journal("2024-10-07")
    other_api_key = another_user_with_journals_enabled.api_key

    _assert_other_user_cannot_access_journal(
        api_url,
        journal_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=other_api_key,
    )

    other_api_key = grant_journal_access(created, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/journals/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    journal = load_response.json()["journal"]
    assert journal["ref_id"] == created.ref_id
    assert load_response.json()["owner"]["ref_id"] is not None
    assert load_response.json()["access_status"]["access_level"] == "reader"

    change_time_config_response = requests.post(
        f"{api_url}/v1/journals/{created.ref_id}/change-time-config",
        headers=_headers(other_api_key),
        json={
            "ref_id": created.ref_id,
            "right_now": {"should_change": True, "value": "2024-10-14"},
            "period": {"should_change": False},
        },
        timeout=10,
    )
    _assert_acl_denied(change_time_config_response)

    archive_response = requests.delete(
        f"{api_url}/v1/journals/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_journal_acl_writer_can_read_and_update(
    api_url: str,
    create_journal,
    grant_journal_access,
) -> None:
    created = create_journal("2024-11-04")
    other_api_key = grant_journal_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/journals/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    change_time_config_response = requests.post(
        f"{api_url}/v1/journals/{created.ref_id}/change-time-config",
        headers=_headers(other_api_key),
        json={
            "ref_id": created.ref_id,
            "right_now": {"should_change": True, "value": "2024-11-11"},
            "period": {"should_change": False},
        },
        timeout=10,
    )
    assert change_time_config_response.status_code == 200

    verify_response = requests.get(
        f"{api_url}/v1/journals/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert verify_response.status_code == 200
    assert verify_response.json()["journal"]["right_now"] == "2024-11-11"


def test_api_journal_acl_writer_can_read_and_archive(
    api_url: str,
    create_journal,
    grant_journal_access,
) -> None:
    created = create_journal("2024-10-21")
    other_api_key = grant_journal_access(created, AccessLevel.WRITER)

    archive_response = requests.delete(
        f"{api_url}/v1/journals/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    archived_response = requests.get(
        f"{api_url}/v1/journals/{created.ref_id}?allow_archived=true",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archived_response.status_code == 200
    assert archived_response.json()["journal"]["archived"] is True


def test_api_journal_acl_z_denied_without_grant(
    api_url: str,
    api_key: str,
    create_journal,
    another_user_with_journals_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_journal("2024-10-28")
    _assert_other_user_cannot_access_journal(
        api_url,
        journal_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=another_user_with_journals_enabled.api_key,
    )


# --- Journal tests ---


def test_api_journal_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/journals",
        headers=_headers(api_key),
        json={
            "right_now": "2024-06-10",
            "period": "weekly",
        },
        timeout=10,
    )
    assert response.status_code == 200

    journal = response.json()["new_journal"]
    assert journal["period"] == "weekly"
    assert journal["right_now"] == "2024-06-10"
    assert journal["archived"] is False
    assert "ref_id" in journal


def test_api_journal_load(api_url: str, api_key: str, create_journal) -> None:
    created = create_journal("2024-07-01")

    response = requests.get(
        f"{api_url}/v1/journals/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    journal = response.json()["journal"]
    assert journal["ref_id"] == created.ref_id
    assert journal["period"] == "weekly"


def test_api_journal_find(api_url: str, api_key: str, create_journal) -> None:
    j1 = create_journal("2024-08-05")
    j2 = create_journal("2024-08-12")

    response = requests.get(
        f"{api_url}/v1/journals?allow_archived=false&include_notes=false&include_journal_stats=false&include_writing_tasks=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    ref_ids = [e["journal"]["ref_id"] for e in response.json()["entries"]]
    assert j1.ref_id in ref_ids
    assert j2.ref_id in ref_ids


def test_api_journal_load_for_date_and_period(
    api_url: str, api_key: str, create_journal
) -> None:
    created = create_journal("2024-08-19")

    response = requests.get(
        f"{api_url}/v1/journals/for-date-and-period?right_now=2024-08-19&period=weekly",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    data = response.json()
    assert data["journal"] is not None
    assert data["journal"]["ref_id"] == created.ref_id
    assert data["journal"]["period"] == "weekly"


def test_api_journal_load_for_date_and_period_not_found(
    api_url: str, api_key: str
) -> None:
    response = requests.get(
        f"{api_url}/v1/journals/for-date-and-period?right_now=2099-01-01&period=weekly",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    data = response.json()
    assert data["journal"] is None


def test_api_journal_change_time_config(
    api_url: str, api_key: str, create_journal
) -> None:
    created = create_journal("2024-08-26")

    response = requests.post(
        f"{api_url}/v1/journals/{created.ref_id}/change-time-config",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "right_now": {"should_change": True, "value": "2024-09-02"},
            "period": {"should_change": True, "value": "monthly"},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/journals/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    journal = response2.json()["journal"]
    assert journal["right_now"] == "2024-09-02"
    assert journal["period"] == "monthly"


def test_api_journal_load_settings(api_url: str, api_key: str) -> None:
    response = requests.get(
        f"{api_url}/v1/journals/settings",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert "periods" in response.json()
    assert "generation_approach" in response.json()


def test_api_journal_update_settings(api_url: str, api_key: str) -> None:
    response = requests.put(
        f"{api_url}/v1/journals/settings",
        headers=_headers(api_key),
        json={
            "periods": {"should_change": False},
            "generation_approach": {"should_change": False},
            "generation_in_advance_days": {"should_change": False},
            "writing_task_eisen": {"should_change": False},
            "writing_task_difficulty": {"should_change": False},
            "include_aspects_in_note": {"should_change": False},
            "include_goals_in_note": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200


def test_api_journal_archive(api_url: str, api_key: str, create_journal) -> None:
    created = create_journal("2024-09-16")

    response = requests.delete(
        f"{api_url}/v1/journals/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/journals/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["journal"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/journals/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_journal_remove(api_url: str, api_key: str, create_journal) -> None:
    created = create_journal("2024-09-23")

    response = requests.delete(
        f"{api_url}/v1/journals/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/journals/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


# --- Journal questions ---


def test_api_journal_question_create_find_and_load(
    logged_in_client: AuthenticatedClient, create_question
) -> None:
    question = create_question("What went well?")

    find_result = get_parsed_from_response(
        JournalQuestionFindResult,
        journal_question_find_sync(
            client=logged_in_client,
            body=JournalQuestionFindArgs(allow_archived=False),
        ),
    )
    assert any(entry.ref_id == question.ref_id for entry in find_result.questions)
    assert question.ref_id in find_result.order_of_questions[RecurringTaskPeriod.WEEKLY]

    loaded = get_parsed_from_response(
        JournalQuestionLoadResult,
        journal_question_load_sync(
            client=logged_in_client,
            body=JournalQuestionLoadArgs(ref_id=question.ref_id, allow_archived=False),
        ),
    )
    assert loaded.journal_question.name == "What went well?"
    assert loaded.journal_question.period == RecurringTaskPeriod.WEEKLY


def test_api_journal_question_update_archive_and_remove(
    logged_in_client: AuthenticatedClient, create_question
) -> None:
    question = create_question("What should I change?")

    update_result = journal_question_update_sync(
        client=logged_in_client,
        body=JournalQuestionUpdateArgs(
            ref_id=question.ref_id,
            name=JournalQuestionUpdateArgsName(
                should_change=True, value="What will I change?"
            ),
        ),
    )
    assert update_result.status_code == 200

    loaded = get_parsed_from_response(
        JournalQuestionLoadResult,
        journal_question_load_sync(
            client=logged_in_client,
            body=JournalQuestionLoadArgs(ref_id=question.ref_id, allow_archived=False),
        ),
    )
    assert loaded.journal_question.name == "What will I change?"

    archive_result = journal_question_archive_sync(
        client=logged_in_client,
        body=JournalQuestionArchiveArgs(ref_id=question.ref_id),
    )
    assert archive_result.status_code == 200

    find_result = get_parsed_from_response(
        JournalQuestionFindResult,
        journal_question_find_sync(
            client=logged_in_client,
            body=JournalQuestionFindArgs(allow_archived=False),
        ),
    )
    assert all(entry.ref_id != question.ref_id for entry in find_result.questions)

    remove_result = journal_question_remove_sync(
        client=logged_in_client,
        body=JournalQuestionRemoveArgs(ref_id=question.ref_id),
    )
    assert remove_result.status_code == 200


def test_api_journal_question_reorder(
    logged_in_client: AuthenticatedClient, create_question
) -> None:
    first = create_question("First question")
    second = create_question("Second question")

    find_before = get_parsed_from_response(
        JournalQuestionFindResult,
        journal_question_find_sync(
            client=logged_in_client,
            body=JournalQuestionFindArgs(
                allow_archived=False,
                filter_periods=[RecurringTaskPeriod.WEEKLY],
            ),
        ),
    )
    current_order = list(find_before.order_of_questions[RecurringTaskPeriod.WEEKLY])
    new_order = [second.ref_id, first.ref_id] + [
        ref_id
        for ref_id in current_order
        if ref_id not in {first.ref_id, second.ref_id}
    ]

    reorder_result = journal_question_reorder_sync(
        client=logged_in_client,
        body=JournalQuestionReorderArgs(
            period=RecurringTaskPeriod.WEEKLY,
            order_of_questions=new_order,
        ),
    )
    assert reorder_result.status_code == 200

    find_result = get_parsed_from_response(
        JournalQuestionFindResult,
        journal_question_find_sync(
            client=logged_in_client,
            body=JournalQuestionFindArgs(
                allow_archived=False,
                filter_periods=[RecurringTaskPeriod.WEEKLY],
            ),
        ),
    )
    assert find_result.order_of_questions[RecurringTaskPeriod.WEEKLY][:2] == [
        second.ref_id,
        first.ref_id,
    ]


def test_api_journal_create_includes_selected_questions_in_note(
    logged_in_client: AuthenticatedClient, create_question
) -> None:
    first = create_question("Wins")
    second = create_question("Lessons")
    create_question("Ignored")

    result = get_parsed_from_response(
        JournalCreateResult,
        journal_create_sync(
            client=logged_in_client,
            body=JournalCreateArgs(
                right_now="2025-03-03",
                period=RecurringTaskPeriod.WEEKLY,
                question_ref_ids=[first.ref_id, second.ref_id],
            ),
        ),
    )

    headings = [
        block.text
        for block in result.new_note.content
        if isinstance(block, HeadingBlock)
    ]
    paragraphs = [
        block for block in result.new_note.content if isinstance(block, ParagraphBlock)
    ]
    assert headings == ["Wins", "Lessons"]
    assert len(paragraphs) == 2
    assert all(block.text == "" for block in paragraphs)


@pytest.mark.usefixtures("_with_life_plan_enabled")
def test_api_journal_create_includes_top_level_life_plan_aspects_and_goals_in_note(
    logged_in_client: AuthenticatedClient,
    create_question,
    create_aspect,
    create_goal,
) -> None:
    question = create_question("Journal question with life plan")
    health = create_aspect("Health In Journals")
    create_aspect("Career In Journals")
    create_aspect("Nested Aspect In Journals", parent_aspect_ref_id=health.ref_id)
    goal = create_goal("Run A Marathon In Journals", health.ref_id)
    create_goal(
        "Nested Goal In Journals", health.ref_id, parent_goal_ref_id=goal.ref_id
    )

    result = get_parsed_from_response(
        JournalCreateResult,
        journal_create_sync(
            client=logged_in_client,
            body=JournalCreateArgs(
                right_now="2025-06-02",
                period=RecurringTaskPeriod.WEEKLY,
                question_ref_ids=[question.ref_id],
                include_aspects=True,
                include_goals=True,
            ),
        ),
    )

    health_heading = "⭐ Health In Journals"
    career_heading = "⭐ Career In Journals"
    nested_aspect_heading = "⭐ Health In Journals / Nested Aspect In Journals"
    goal_heading = "🎯 Health In Journals / Run A Marathon In Journals"
    nested_goal_heading = (
        "🎯 Health In Journals / Run A Marathon In Journals / Nested Goal In Journals"
    )

    headings = [
        block.text
        for block in result.new_note.content
        if isinstance(block, HeadingBlock)
    ]
    paragraphs = [
        block for block in result.new_note.content if isinstance(block, ParagraphBlock)
    ]
    assert "Journal question with life plan" in headings
    assert health_heading in headings
    assert career_heading in headings
    assert nested_aspect_heading in headings
    assert goal_heading in headings
    assert nested_goal_heading in headings
    assert headings.index("Journal question with life plan") < headings.index(
        health_heading
    )
    assert headings.index(health_heading) < headings.index(goal_heading)
    assert headings.index(goal_heading) < headings.index(nested_goal_heading)
    assert headings.index(nested_goal_heading) < headings.index(nested_aspect_heading)
    assert headings.index(nested_aspect_heading) < headings.index(career_heading)
    assert all(block.text == "" for block in paragraphs)


@pytest.mark.usefixtures("_with_life_plan_enabled")
def test_api_journal_create_skips_aspects_and_goals_in_note_by_default(
    logged_in_client: AuthenticatedClient,
    create_question,
    create_aspect,
    create_goal,
) -> None:
    question = create_question("Journal question without life plan")
    aspect = create_aspect("Health Not In Journals")
    create_goal("Run A Marathon Not In Journals", aspect.ref_id)

    result = get_parsed_from_response(
        JournalCreateResult,
        journal_create_sync(
            client=logged_in_client,
            body=JournalCreateArgs(
                right_now="2025-06-23",
                period=RecurringTaskPeriod.WEEKLY,
                question_ref_ids=[question.ref_id],
            ),
        ),
    )

    headings = [
        block.text
        for block in result.new_note.content
        if isinstance(block, HeadingBlock)
    ]
    assert headings == ["Journal question without life plan"]


def test_api_journal_create_defaults_to_all_period_questions(
    logged_in_client: AuthenticatedClient, create_question
) -> None:
    first = create_question("Default all first")
    second = create_question("Default all second")

    result = get_parsed_from_response(
        JournalCreateResult,
        journal_create_sync(
            client=logged_in_client,
            body=JournalCreateArgs(
                right_now="2024-09-02",
                period=RecurringTaskPeriod.WEEKLY,
            ),
        ),
    )

    headings = [
        block.text
        for block in result.new_note.content
        if isinstance(block, HeadingBlock)
    ]
    assert first.name in headings
    assert second.name in headings
    assert headings.index(first.name) < headings.index(second.name)


def test_api_journal_create_with_no_questions_selected(
    logged_in_client: AuthenticatedClient, create_question
) -> None:
    create_question("Should not appear in empty selection")

    result = get_parsed_from_response(
        JournalCreateResult,
        journal_create_sync(
            client=logged_in_client,
            body=JournalCreateArgs(
                right_now="2024-09-09",
                period=RecurringTaskPeriod.WEEKLY,
                question_ref_ids=[],
            ),
        ),
    )

    headings = [
        block.text
        for block in result.new_note.content
        if isinstance(block, HeadingBlock)
    ]
    assert headings == []
    assert result.new_note.content == []


def test_api_journal_generate_includes_period_questions_in_note(
    logged_in_client: AuthenticatedClient, create_question
) -> None:
    question = create_question("Generated weekly prompt")

    gen_result = gen_do_sync(
        client=logged_in_client,
        body=GenDoArgs(
            gen_even_if_not_modified=True,
            today="2098-06-01",
            gen_targets=[SyncTarget.JOURNALS],
            period=[RecurringTaskPeriod.WEEKLY],
        ),
    )
    assert gen_result.status_code == 200

    found = get_parsed_from_response(
        JournalLoadForDateAndPeriodResult,
        journal_load_for_date_and_period_sync(
            client=logged_in_client,
            body=JournalLoadForDateAndPeriodArgs(
                right_now="2098-06-04",
                period=RecurringTaskPeriod.WEEKLY,
                allow_archived=False,
            ),
        ),
    )
    journal = found.journal
    assert journal is not None
    assert not isinstance(journal, Unset)

    loaded = get_parsed_from_response(
        JournalLoadResult,
        journal_load_sync(
            client=logged_in_client,
            body=JournalLoadArgs(ref_id=journal.ref_id, allow_archived=False),
        ),
    )
    headings = [
        block.text for block in loaded.note.content if isinstance(block, HeadingBlock)
    ]
    assert question.name in headings
    paragraphs = [
        block for block in loaded.note.content if isinstance(block, ParagraphBlock)
    ]
    assert len(paragraphs) == len(headings)
    assert all(block.text == "" for block in paragraphs)


def test_api_journal_question_rest_create_and_find(api_url: str, api_key: str) -> None:
    create_response = requests.post(
        f"{api_url}/v1/journals/questions",
        headers=_headers(api_key),
        json={"name": "REST question", "period": "weekly"},
        timeout=10,
    )
    assert create_response.status_code == 200
    created = create_response.json()["new_journal_question"]
    assert created["name"] == "REST question"
    assert created["period"] == "weekly"

    find_response = requests.get(
        f"{api_url}/v1/journals/questions?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert find_response.status_code == 200
    ref_ids = [question["ref_id"] for question in find_response.json()["questions"]]
    assert created["ref_id"] in ref_ids


# --- Auth test ---


def test_api_journal_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/journals?allow_archived=false&include_notes=false&include_journal_stats=false&include_writing_tasks=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401
