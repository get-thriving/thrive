"""Tests about projects."""

import re
from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.projects.project_archive import (
    sync_detailed as project_archive_sync,
)
from jupiter_webapi_client.api.projects.project_create import (
    sync_detailed as project_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.init_result import InitResult
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.project import Project
from jupiter_webapi_client.models.project_archive_args import ProjectArchiveArgs
from jupiter_webapi_client.models.project_create_args import ProjectCreateArgs
from jupiter_webapi_client.models.project_create_result import ProjectCreateResult
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
def _enable_projects_feature(
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
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PROJECTS, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.PROJECTS, value=False
            ),
        )


@pytest.fixture(autouse=True, scope="module")
def create_project(logged_in_client: AuthenticatedClient):
    def _create_project(
        name: str,
        is_key: bool = False,
        eisen: Eisen = Eisen.REGULAR,
        difficulty: Difficulty = Difficulty.MEDIUM,
        actionable_date: str | None = None,
        due_date: str | None = None,
        time_plan_activity_kind: TimePlanActivityKind | None = None,
        time_plan_activity_feasability: TimePlanActivityFeasability | None = None,
        dependency_ref_ids: list[str] | None = None,
    ) -> Project:
        result = project_create_sync(
            client=logged_in_client,
            body=ProjectCreateArgs(
                name=name,
                is_key=is_key,
                eisen=eisen,
                difficulty=difficulty,
                actionable_date=actionable_date,
                due_date=due_date,
                time_plan_activity_kind=time_plan_activity_kind,
                time_plan_activity_feasability=time_plan_activity_feasability,
                dependency_ref_ids=dependency_ref_ids,
            ),
        )
        return get_parsed_from_response(ProjectCreateResult, result).new_project

    return _create_project


def test_webui_project_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/apps/projects")

    expect(page.locator("#trunk-panel")).to_contain_text(
        "There are no projects to show"
    )


def test_webui_project_view_all(page: Page, create_project) -> None:
    project1 = create_project("Project 1", False, Eisen.REGULAR, Difficulty.MEDIUM)
    project2 = create_project(
        "Project 2", True, Eisen.IMPORTANT, Difficulty.HARD, "2024-01-01", "2024-12-31"
    )
    project3 = create_project(
        "Project 3",
        False,
        Eisen.URGENT,
        Difficulty.EASY,
        None,
        "2024-06-30",
        TimePlanActivityKind.MAKE_PROGRESS,
        TimePlanActivityFeasability.MUST_DO,
    )

    page.goto("/app/workspace/apps/projects")

    expect(page.locator(f"#project-{project1.ref_id}")).to_contain_text("Project 1")
    expect(page.locator(f"#project-{project2.ref_id}")).to_contain_text("Project 2")
    expect(page.locator(f"#project-{project3.ref_id}")).to_contain_text("Project 3")


def _pick_dependency(page: Page, name: str) -> None:
    page.get_by_label("Depends On", exact=True).click()
    page.keyboard.type(name)
    page.get_by_role("option").filter(has_text=name).first.click()
    page.keyboard.press("Escape")


def test_webui_project_create_with_dependency(page: Page, create_project) -> None:
    create_project("Create Dep Target")

    page.goto("/app/workspace/apps/projects/new")
    page.wait_for_selector("#leaf-panel")

    page.locator('input[name="name"]').fill("Create Dep Owner")
    _pick_dependency(page, "Create Dep Target")
    page.locator("button[id='project-create']").click()

    page.wait_for_url(re.compile(r".*/projects/(?!new$)[^/]+$"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Create Dep Owner")
    expect(page.locator("#leaf-panel")).to_contain_text("Create Dep Target")


def test_webui_project_update_dependencies(page: Page, create_project) -> None:
    create_project("Update Dep Target")
    dependent = create_project("Update Dep Owner")

    page.goto(f"/app/workspace/apps/projects/{dependent.ref_id}")
    page.wait_for_selector("#leaf-panel")

    _pick_dependency(page, "Update Dep Target")
    page.locator("button[id='project-editor-save']").click()

    page.wait_for_url("/app/workspace/apps/projects")
    page.goto(f"/app/workspace/apps/projects/{dependent.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator("#leaf-panel")).to_contain_text("Update Dep Target")


def test_webui_project_cannot_depend_on_itself(page: Page, create_project) -> None:
    create_project("Self Dep Other")
    project = create_project("Self Dep Owner")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.get_by_label("Depends On", exact=True).click()
    page.keyboard.type("Self Dep Owner")
    expect(page.get_by_role("option").filter(has_text="Self Dep Owner")).to_have_count(
        0
    )


def test_webui_project_archiving_a_dependency_unlinks_it(
    page: Page, create_project, logged_in_client: AuthenticatedClient
) -> None:
    dependency = create_project("Archived Dep Target")
    dependent = create_project(
        "Archived Dep Owner", dependency_ref_ids=[dependency.ref_id]
    )

    page.goto(f"/app/workspace/apps/projects/{dependent.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator("#leaf-panel")).to_contain_text("Archived Dep Target")

    response = project_archive_sync(
        client=logged_in_client, body=ProjectArchiveArgs(ref_id=dependency.ref_id)
    )
    assert response.status_code == 200

    page.goto(f"/app/workspace/apps/projects/{dependent.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator("#leaf-panel")).not_to_contain_text("Archived Dep Target")


def test_webui_project_publish_and_view_public(page: Page, create_project) -> None:
    project = create_project("Published Project")
    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Project-publish")
    page.locator("button[id='Project-publish-create']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/apps/projects/{project.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Project-publish")
    expect(page.locator("#Project-publish")).to_contain_text("draft")

    page.locator("button[id='Project-publish-toggle-status']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/apps/projects/{project.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Project-publish")
    expect(page.locator("#Project-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/project/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Published Project")


@pytest.fixture()
def another_user_with_projects_enabled(
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
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PROJECTS, value=True),
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
                feature=WorkspaceFeature.PROJECTS, value=False
            ),
        )


@pytest.fixture()
def grant_project_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_projects_enabled: AnotherUserAndWorkspace,
):
    def _grant(project: Project, access_level: AccessLevel) -> None:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.PROJECT,
                entity_ref_id=project.ref_id,
                user_ref_ids=[
                    another_user_with_projects_enabled.init_result.new_user.ref_id
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


def _assert_other_user_cannot_access_project_webui(
    page: Page,
    *,
    project: Project,
) -> None:
    page.goto("/app/workspace/apps/projects")
    expect(page.locator(f"#project-{project.ref_id}")).to_have_count(0)

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    expect(page.locator("body")).to_contain_text(_ACCESS_DENIED_LABEL)


def test_webui_project_acl_reader_can_read_but_not_update_or_archive(
    page: Page,
    create_project,
    grant_project_access,
    another_user_with_projects_enabled: AnotherUserAndWorkspace,
) -> None:
    project = create_project("Reader ACL Plan")

    _login_as_other_user(page, another_user_with_projects_enabled)
    _assert_other_user_cannot_access_project_webui(page, project=project)

    grant_project_access(project, AccessLevel.READER)

    _login_as_other_user(page, another_user_with_projects_enabled)

    page.goto("/app/workspace/apps/projects")
    expect(page.locator("#trunk-panel")).to_contain_text("Reader ACL Plan")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Reader ACL Plan")
    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='project-editor-save']")).to_be_disabled()
    expect(page.locator("button[id='leaf-entity-archive']")).to_be_disabled()


def test_webui_project_acl_writer_can_read_and_update(
    page: Page,
    create_project,
    grant_project_access,
    another_user_with_projects_enabled: AnotherUserAndWorkspace,
) -> None:
    project = create_project("Writer Update Plan")
    grant_project_access(project, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_projects_enabled)

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Update Plan")

    page.locator('input[name="name"]').fill("Writer Updated Plan")
    page.locator("button[id='project-editor-save']").click()

    page.wait_for_url("/app/workspace/apps/projects")
    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Updated Plan")


def test_webui_project_acl_writer_can_read_and_archive(
    page: Page,
    create_project,
    grant_project_access,
    another_user_with_projects_enabled: AnotherUserAndWorkspace,
) -> None:
    project = create_project("Writer Archive Plan")
    grant_project_access(project, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_projects_enabled)

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.wait_for_url("/app/workspace/apps/projects")
    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='project-editor-save']")).to_be_disabled()


def test_webui_project_acl_z_denied_without_grant(
    page: Page,
    create_project,
    another_user_with_projects_enabled: AnotherUserAndWorkspace,
) -> None:
    project = create_project("Denied ACL Plan")

    _login_as_other_user(page, another_user_with_projects_enabled)
    _assert_other_user_cannot_access_project_webui(page, project=project)
