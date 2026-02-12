"""'Backfill items'

Revision ID: e0140eec1788
Revises: e3a68a179304
Create Date: 2026-02-11 22:18:59.389731

"""

from alembic import op
import sqlalchemy as sa

import json


# revision identifiers, used by Alembic.
revision = "e0140eec1788"
down_revision = "e3a68a179304"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()

    # Allocate IDs above current maxima.
    max_tag_ref_id = bind.execute(
        sa.text("SELECT COALESCE(MAX(ref_id), 0) FROM tag")
    ).scalar_one()
    max_tag_link_ref_id = bind.execute(
        sa.text("SELECT COALESCE(MAX(ref_id), 0) FROM tag_link")
    ).scalar_one()
    next_tag_ref_id = int(max_tag_ref_id) + 1
    next_tag_link_ref_id = int(max_tag_link_ref_id) + 1

    # We are migrating SmartListTag -> generic Tag(namespace=SMART_LIST_ITEM),
    # then creating TagLinks for SmartListItems based on smart_list_item.tags_ref_id.
    namespace = "smart-list-item"
    not_used_name = "NOT-USED"

    # Load all existing smart list tags together with their workspace.
    smart_list_tag_rows = (
        bind.execute(
            sa.text(
                """
                SELECT
                    slt.ref_id                 AS old_tag_ref_id,
                    slt.smart_list_ref_id      AS smart_list_ref_id,
                    slt.tag_name               AS tag_name,
                    slt.archived               AS archived,
                    slt.created_time           AS created_time,
                    slt.last_modified_time     AS last_modified_time,
                    slt.archived_time          AS archived_time,
                    slc.workspace_ref_id       AS workspace_ref_id
                FROM smart_list_tag slt
                JOIN smart_list sl
                    ON sl.ref_id = slt.smart_list_ref_id
                JOIN smart_list_collection slc
                    ON slc.ref_id = sl.smart_list_collection_ref_id
                """
            )
        )
        .mappings()
        .all()
    )

    # Create (workspace, tag_name) -> Tag mapping, so we comply with the unique index
    # (tag_domain_ref_id, namespace, name).
    tag_ref_id_by_workspace_and_name: dict[tuple[int, str], int] = {}
    new_tag_ref_id_by_old_smart_list_tag_ref_id: dict[int, int] = {}

    for row in smart_list_tag_rows:
        workspace_ref_id = int(row["workspace_ref_id"])
        tag_name = str(row["tag_name"])
        key = (workspace_ref_id, tag_name)

        if key not in tag_ref_id_by_workspace_and_name:
            new_tag_ref_id = next_tag_ref_id
            next_tag_ref_id += 1
            tag_ref_id_by_workspace_and_name[key] = new_tag_ref_id

            bind.execute(
                sa.text(
                    """
                    INSERT INTO tag (
                        ref_id,
                        version,
                        archived,
                        archival_reason,
                        created_time,
                        last_modified_time,
                        archived_time,
                        tag_domain_ref_id,
                        namespace,
                        name
                    ) VALUES (
                        :ref_id,
                        1,
                        :archived,
                        NULL,
                        :created_time,
                        :last_modified_time,
                        :archived_time,
                        :tag_domain_ref_id,
                        :namespace,
                        :name
                    )
                    """
                ),
                {
                    "ref_id": new_tag_ref_id,
                    "archived": row["archived"],
                    "created_time": row["created_time"],
                    "last_modified_time": row["last_modified_time"],
                    "archived_time": row["archived_time"],
                    "tag_domain_ref_id": workspace_ref_id,
                    "namespace": namespace,
                    "name": tag_name,
                },
            )
            bind.execute(
                sa.text(
                    """
                    INSERT INTO tag_event (
                        owner_ref_id,
                        timestamp,
                        session_index,
                        name,
                        source,
                        owner_version,
                        kind,
                        data
                    ) VALUES (
                        :owner_ref_id,
                        :timestamp,
                        0,
                        'Created',
                        'Cli',
                        1,
                        'Created',
                        '{}'
                    )
                    """
                ),
                {
                    "owner_ref_id": new_tag_ref_id,
                    "timestamp": row["created_time"],
                },
            )

        new_tag_ref_id = tag_ref_id_by_workspace_and_name[key]
        new_tag_ref_id_by_old_smart_list_tag_ref_id[int(row["old_tag_ref_id"])] = (
            new_tag_ref_id
        )

    # Create tag links for smart list items based on their tags_ref_id.
    smart_list_item_rows = (
        bind.execute(
            sa.text(
                """
                SELECT
                    it.ref_id               AS item_ref_id,
                    it.smart_list_ref_id    AS smart_list_ref_id,
                    it.tags_ref_id          AS tags_ref_id,
                    it.archived             AS archived,
                    it.created_time         AS created_time,
                    it.last_modified_time   AS last_modified_time,
                    it.archived_time        AS archived_time,
                    slc.workspace_ref_id    AS workspace_ref_id
                FROM smart_list_item it
                JOIN smart_list sl
                    ON sl.ref_id = it.smart_list_ref_id
                JOIN smart_list_collection slc
                    ON slc.ref_id = sl.smart_list_collection_ref_id
                """
            )
        )
        .mappings()
        .all()
    )

    for row in smart_list_item_rows:
        item_ref_id = int(row["item_ref_id"])
        workspace_ref_id = int(row["workspace_ref_id"])

        old_tag_ref_ids = []
        if row["tags_ref_id"] is not None and str(row["tags_ref_id"]).strip() != "":
            old_tag_ref_ids = json.loads(row["tags_ref_id"])

        new_tag_ref_ids_set: set[int] = set()
        for old_tid in old_tag_ref_ids:
            new_tid = new_tag_ref_id_by_old_smart_list_tag_ref_id.get(int(old_tid))
            if new_tid is not None:
                new_tag_ref_ids_set.add(int(new_tid))
        new_tag_ref_ids = sorted(new_tag_ref_ids_set)
        if not new_tag_ref_ids:
            continue

        new_tag_link_ref_id = next_tag_link_ref_id
        next_tag_link_ref_id += 1

        bind.execute(
            sa.text(
                """
                INSERT INTO tag_link (
                    ref_id,
                    version,
                    archived,
                    archival_reason,
                    created_time,
                    last_modified_time,
                    archived_time,
                    name,
                    tag_domain_ref_id,
                    namespace,
                    source_entity_ref_id,
                    ref_ids
                ) VALUES (
                    :ref_id,
                    1,
                    :archived,
                    NULL,
                    :created_time,
                    :last_modified_time,
                    :archived_time,
                    :name,
                    :tag_domain_ref_id,
                    :namespace,
                    :source_entity_ref_id,
                    :ref_ids
                )
                """
            ),
            {
                "ref_id": new_tag_link_ref_id,
                "archived": row["archived"],
                "created_time": row["created_time"],
                "last_modified_time": row["last_modified_time"],
                "archived_time": row["archived_time"],
                "name": not_used_name,
                "tag_domain_ref_id": workspace_ref_id,
                "namespace": namespace,
                "source_entity_ref_id": item_ref_id,
                "ref_ids": json.dumps(new_tag_ref_ids),
            },
        )
        bind.execute(
            sa.text(
                """
                INSERT INTO tag_link_event (
                    owner_ref_id,
                    timestamp,
                    session_index,
                    name,
                    source,
                    owner_version,
                    kind,
                    data
                ) VALUES (
                    :owner_ref_id,
                    :timestamp,
                    0,
                    'Created',
                    'Cli',
                    1,
                    'Created',
                    '{}'
                )
                """
            ),
            {
                "owner_ref_id": new_tag_link_ref_id,
                "timestamp": row["created_time"],
            },
        )


def downgrade() -> None:
    pass
