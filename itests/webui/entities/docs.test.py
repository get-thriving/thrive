"""Tests about docs."""

import re
import uuid
from typing import cast

import pytest
from jupiter_webapi_client.api.application.get_summaries import (
    sync_detailed as get_summaries_sync,
)
from jupiter_webapi_client.api.docs.dir_archive import (
    sync_detailed as dir_archive_sync,
)
from jupiter_webapi_client.api.docs.dir_create import (
    sync_detailed as dir_create_sync,
)
from jupiter_webapi_client.api.docs.dir_remove import (
    sync_detailed as dir_remove_sync,
)
from jupiter_webapi_client.api.docs.doc_create import (
    sync_detailed as doc_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.dir_ import Dir
from jupiter_webapi_client.models.dir_archive_args import DirArchiveArgs
from jupiter_webapi_client.models.dir_create_args import DirCreateArgs
from jupiter_webapi_client.models.dir_create_result import DirCreateResult
from jupiter_webapi_client.models.dir_remove_args import DirRemoveArgs
from jupiter_webapi_client.models.doc import Doc
from jupiter_webapi_client.models.doc_create_args import DocCreateArgs
from jupiter_webapi_client.models.doc_create_result import DocCreateResult
from jupiter_webapi_client.models.get_summaries_args import GetSummariesArgs
from jupiter_webapi_client.models.get_summaries_result import GetSummariesResult
from jupiter_webapi_client.models.paragraph_block import ParagraphBlock
from jupiter_webapi_client.models.paragraph_block_kind import ParagraphBlockKind
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from jupiter_webapi_client.types import Unset
from playwright.sync_api import Page, expect

from itests.helpers import (
    get_parsed_from_response,
    open_leaf_publish_panel,
    open_trunk_publish_panel,
    type_editorjs_content_and_wait_for_save,
)


def type_docs_doc_editor_and_wait_for_save(page: Page, body_text: str) -> None:
    """Doc body saves via ``docs/update-action`` after the doc exists."""
    type_editorjs_content_and_wait_for_save(
        page,
        body_text,
        editor_holder=page.get_by_test_id("docs-doc-block-editor"),
        save_url_substring="docs/update-action",
    )


@pytest.fixture(autouse=True, scope="module")
def _enable_docs_feature(logged_in_client: AuthenticatedClient):
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.DOCS, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.DOCS, value=False),
        )


@pytest.fixture(scope="module")
def root_dir_ref_id(logged_in_client: AuthenticatedClient) -> str:
    response = get_summaries_sync(
        client=logged_in_client,
        body=GetSummariesArgs(),
    )
    result = get_parsed_from_response(GetSummariesResult, response)
    root_dir = result.root_dir
    if root_dir is None or isinstance(root_dir, Unset):
        raise ValueError("root_dir missing from get_summaries")
    return cast(str, root_dir.ref_id)


@pytest.fixture(autouse=True, scope="module")
def create_doc(logged_in_client: AuthenticatedClient, root_dir_ref_id: str):
    def _create_doc(
        name: str,
        content: str = "This is a test document.",
        *,
        parent_dir_ref_id: str | None = None,
    ) -> Doc:
        parent = parent_dir_ref_id if parent_dir_ref_id is not None else root_dir_ref_id
        paragraph_block = ParagraphBlock(
            correlation_id=str(uuid.uuid4()),
            kind=ParagraphBlockKind.PARAGRAPH,
            text=content,
        )

        result = doc_create_sync(
            client=logged_in_client,
            body=DocCreateArgs(
                idempotency_key=str(uuid.uuid4()),
                name=name,
                content=[paragraph_block],
                parent_dir_ref_id=parent,
            ),
        )
        return get_parsed_from_response(DocCreateResult, result).new_doc

    return _create_doc


@pytest.fixture(autouse=True, scope="module")
def create_dir(logged_in_client: AuthenticatedClient, root_dir_ref_id: str):
    def _create_dir(
        name: str,
        *,
        parent_dir_ref_id: str | None = None,
    ) -> Dir:
        parent = parent_dir_ref_id if parent_dir_ref_id is not None else root_dir_ref_id
        result = dir_create_sync(
            client=logged_in_client,
            body=DirCreateArgs(name=name, parent_dir_ref_id=parent),
        )
        return get_parsed_from_response(DirCreateResult, result).new_dir

    return _create_dir


def test_webui_docs_doc_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/docs/root-redirect")

    expect(page.locator("#trunk-panel")).to_contain_text(
        "There are no folders or docs to show here."
    )


def test_webui_docs_doc_view_all(page: Page, create_doc) -> None:
    doc1 = create_doc("Doc 1", "This is the first test document.")
    doc2 = create_doc("Doc 2", "This is the second test document.")
    doc3 = create_doc("Doc 3", "This is the third test document.")

    page.goto("/app/workspace/docs/root-redirect")

    expect(page.locator(f"#doc-{doc1.ref_id}")).to_contain_text("Doc 1")
    expect(page.locator(f"#doc-{doc2.ref_id}")).to_contain_text("Doc 2")
    expect(page.locator(f"#doc-{doc3.ref_id}")).to_contain_text("Doc 3")


def test_webui_docs_doc_create_write_and_list(page: Page, root_dir_ref_id: str) -> None:
    suffix = uuid.uuid4().hex[:8]
    title = f"UI Doc {suffix}"
    body_text = f"Playwright body {suffix}"

    page.goto("/app/workspace/docs/root-redirect")
    page.locator("#trunk-new-leaf-entity").click()
    page.wait_for_url(re.compile(r".*/doc/new$"))

    with page.expect_response(
        lambda r: r.request.method == "POST" and "docs/create-action" in r.url and r.ok,
        timeout=30_000,
    ):
        page.locator('input[name="name"]').fill(title)

    type_docs_doc_editor_and_wait_for_save(page, body_text)

    page.reload()
    page.wait_for_url(re.compile(r".*/doc/[^/]+$"))

    page.goto(f"/app/workspace/docs/{root_dir_ref_id}")
    expect(page.locator("#trunk-panel-content")).to_contain_text(title)
    expect(page.locator("#trunk-panel-content")).to_contain_text(body_text)


def test_webui_docs_doc_rename_via_settings(page: Page, create_doc) -> None:
    doc = create_doc("Rename Me", "content")
    new_name = f"Renamed {uuid.uuid4().hex[:8]}"

    page.goto(f"/app/workspace/docs/{doc.parent_dir_ref_id}/doc/{doc.ref_id}/settings")
    page.locator('#leaf-panel input[name="name"]').nth(1).fill(new_name)
    page.locator("#docs-doc-settings-save").nth(1).click()
    page.wait_for_url(re.compile(rf".*/docs/{doc.parent_dir_ref_id}/doc/{doc.ref_id}$"))

    page.goto(f"/app/workspace/docs/{doc.parent_dir_ref_id}")
    expect(page.locator("#trunk-panel-content")).to_contain_text(new_name)


def test_webui_docs_doc_archive_via_leaf_panel(page: Page, create_doc) -> None:
    doc = create_doc("Archive Me UI", "x")
    page.goto(f"/app/workspace/docs/{doc.parent_dir_ref_id}/doc/{doc.ref_id}")

    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()
    page.wait_for_url(re.compile(rf".*/docs/{doc.parent_dir_ref_id}$"))

    page.goto(f"/app/workspace/docs/{doc.parent_dir_ref_id}")
    expect(page.locator(f"#doc-{doc.ref_id}")).to_have_count(0)


def test_webui_docs_doc_remove_via_leaf_panel(page: Page, create_doc) -> None:
    doc = create_doc("Remove Me UI", "x")
    page.goto(f"/app/workspace/docs/{doc.parent_dir_ref_id}/doc/{doc.ref_id}")

    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()
    page.wait_for_url(re.compile(rf".*/docs/{doc.parent_dir_ref_id}$"))

    page.goto(f"/app/workspace/docs/{doc.parent_dir_ref_id}/doc/{doc.ref_id}")
    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()
    page.wait_for_url(re.compile(rf".*/docs/{doc.parent_dir_ref_id}$"))

    page.reload()

    page.goto(f"/app/workspace/docs/{doc.parent_dir_ref_id}/doc/{doc.ref_id}")
    expect(page.get_by_text("Could not find doc")).to_be_visible()


def test_webui_docs_dir_create_folder_and_see_in_parent(
    page: Page, root_dir_ref_id: str
) -> None:
    name = f"Folder {uuid.uuid4().hex[:8]}"
    page.goto(f"/app/workspace/docs/{root_dir_ref_id}")

    page.locator("a[id='docs-new-folder']").click()
    page.wait_for_url(re.compile(r".*/new$"))
    page.locator('input[name="name"]').fill(name)
    page.locator("button[id='docs-dir-create']").click()

    page.wait_for_url(re.compile(r".*/docs/[^/]+$"))
    match = re.search(r"/docs/([^/]+)$", page.url)
    assert match is not None
    folder_id = match.group(1)

    page.locator("#docs-parent").click()
    page.wait_for_url(re.compile(rf".*/docs/{root_dir_ref_id}$"))
    expect(page.locator(f"#dir-{folder_id}")).to_contain_text(name)


def test_webui_docs_dir_move_folder_via_settings(page: Page, create_dir) -> None:
    parent = create_dir("Parent UI")
    child = create_dir("Child UI")

    page.goto(f"/app/workspace/docs/{child.ref_id}/settings")
    page.get_by_label("Parent folder", exact=True).click()
    page.keyboard.type("Parent UI")
    page.get_by_role("option").filter(has_text="Parent UI").first.click()
    page.locator("button[id='docs-dir-settings-save']").click()
    page.wait_for_url(re.compile(rf".*/docs/{child.ref_id}$"))

    page.goto(f"/app/workspace/docs/{parent.ref_id}")
    expect(page.locator(f"#dir-{child.ref_id}")).to_contain_text("Child UI")


def test_webui_docs_doc_move_doc_via_settings(
    page: Page, create_doc, create_dir
) -> None:
    dir_a = create_dir("Move Doc Dir A")
    dir_b = create_dir("Move Doc Dir B")
    doc = create_doc("Move Me Doc", "body", parent_dir_ref_id=dir_a.ref_id)

    page.goto(f"/app/workspace/docs/{dir_a.ref_id}/doc/{doc.ref_id}/settings")
    page.get_by_label("Folder", exact=True).click()
    page.keyboard.type("Move Doc Dir B")
    page.get_by_role("option").filter(has_text="Move Doc Dir B").first.click()
    page.locator("button[id='docs-doc-settings-save']").click()
    page.wait_for_url(
        re.compile(rf".*/docs/{dir_b.ref_id}/doc/{doc.ref_id}$"),
    )

    page.goto(f"/app/workspace/docs/{dir_b.ref_id}")
    expect(page.locator(f"#doc-{doc.ref_id}")).to_contain_text("Move Me Doc")


def test_webui_docs_dir_rename_via_settings(
    page: Page, create_dir, root_dir_ref_id: str
) -> None:
    d = create_dir("Old Dir Name")
    new_name = f"RenamedDir{uuid.uuid4().hex[:6]}"
    page.goto(f"/app/workspace/docs/{d.ref_id}/settings")
    page.locator('input[name="name"]').fill(new_name)
    page.locator("button[id='docs-dir-settings-save']").click()
    page.wait_for_url(re.compile(rf".*/docs/{d.ref_id}$"))

    page.goto(f"/app/workspace/docs/{root_dir_ref_id}")
    expect(page.locator(f"#dir-{d.ref_id}")).to_contain_text(new_name)


def test_webui_docs_dir_archive_nested_reflects_in_browser(
    page: Page,
    logged_in_client: AuthenticatedClient,
    root_dir_ref_id: str,
    create_dir,
    create_doc,
) -> None:
    parent = create_dir("Tree Parent")
    child = create_dir("Tree Child", parent_dir_ref_id=parent.ref_id)
    doc = create_doc("Nested Doc", "in tree", parent_dir_ref_id=child.ref_id)

    page.goto(f"/app/workspace/docs/{root_dir_ref_id}")
    expect(page.locator(f"#dir-{parent.ref_id}")).to_contain_text("Tree Parent")

    dir_archive_sync(
        client=logged_in_client,
        body=DirArchiveArgs(ref_id=parent.ref_id),
    )

    page.goto(f"/app/workspace/docs/{root_dir_ref_id}")
    expect(page.locator(f"#dir-{parent.ref_id}")).to_have_count(0)
    expect(page.locator(f"#doc-{doc.ref_id}")).to_have_count(0)


def test_webui_docs_dir_remove_nested_reflects_in_browser(
    page: Page,
    logged_in_client: AuthenticatedClient,
    root_dir_ref_id: str,
    create_dir,
    create_doc,
) -> None:
    parent = create_dir("Rm Parent")
    child = create_dir("Rm Child", parent_dir_ref_id=parent.ref_id)
    doc = create_doc("Rm Nested Doc", "gone", parent_dir_ref_id=child.ref_id)

    page.goto(f"/app/workspace/docs/{root_dir_ref_id}")
    expect(page.locator(f"#dir-{parent.ref_id}")).to_contain_text("Rm Parent")

    dir_remove_sync(
        client=logged_in_client,
        body=DirRemoveArgs(ref_id=parent.ref_id),
    )

    page.goto(f"/app/workspace/docs/{root_dir_ref_id}")
    expect(page.locator(f"#dir-{parent.ref_id}")).to_have_count(0)
    expect(page.locator(f"#doc-{doc.ref_id}")).to_have_count(0)


def test_webui_doc_publish_and_view_public(page: Page, create_doc) -> None:
    doc = create_doc("Published Doc", "Published doc body")
    page.goto(f"/app/workspace/docs/{doc.parent_dir_ref_id}/doc/{doc.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Doc-publish")
    page.locator("button[id='Doc-publish-create']").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/docs/{doc.parent_dir_ref_id}/doc/{doc.ref_id}")
    )
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Doc-publish")
    expect(page.locator("#Doc-publish")).to_contain_text("draft")

    page.locator("button[id='Doc-publish-toggle-status']").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/docs/{doc.parent_dir_ref_id}/doc/{doc.ref_id}")
    )
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Doc-publish")
    expect(page.locator("#Doc-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/doc/doc/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Published Doc")


def test_webui_dir_publish_and_view_public(page: Page, create_dir, create_doc) -> None:
    folder = create_dir("Published Folder")
    doc = create_doc(
        "Nested Published Doc",
        "Nested doc body",
        parent_dir_ref_id=folder.ref_id,
    )

    page.goto(f"/app/workspace/docs/{folder.ref_id}")
    page.wait_for_selector("#trunk-panel")

    open_trunk_publish_panel(page, "Dir-publish")
    page.locator("button[id='Dir-publish-create']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/docs/{folder.ref_id}"))
    page.wait_for_selector("#trunk-panel")

    open_trunk_publish_panel(page, "Dir-publish")
    expect(page.locator("#Dir-publish")).to_contain_text("draft")

    page.locator("button[id='Dir-publish-toggle-status']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/docs/{folder.ref_id}"))
    page.wait_for_selector("#trunk-panel")

    # Wait until the activation has actually committed (the panel reflects the
    # active status) before navigating to the public URL. Otherwise the guest
    # load can race the activation and 404, since publishEntityLoadByExternalId
    # only serves active entities.
    open_trunk_publish_panel(page, "Dir-publish")
    expect(page.locator("#Dir-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(rf"/publish/doc/dirtree/[^/]+/{folder.ref_id}$"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator(f"#doc-{doc.ref_id}")).to_contain_text("Nested Published Doc")

    page.locator(f"#doc-{doc.ref_id} a").click()
    page.wait_for_url(
        re.compile(rf"/publish/doc/dirtree/[^/]+/{folder.ref_id}/{doc.ref_id}")
    )
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Nested Published Doc")
