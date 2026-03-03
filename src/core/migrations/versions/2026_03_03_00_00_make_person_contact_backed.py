"""Make person contact-backed

Revision ID: c8aa3ea7a4d1
Revises: b34b53f95a4a
Create Date: 2026-03-03 00:00:00.000000

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "c8aa3ea7a4d1"
down_revision = "b34b53f95a4a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        WITH person_contact_seed AS (
            SELECT
                cd.ref_id AS contact_domain_ref_id,
                p.name AS contact_name,
                MIN(p.created_time) AS created_time,
                MAX(p.last_modified_time) AS last_modified_time
            FROM person p
            JOIN prm ON prm.ref_id = p.prm_ref_id
            JOIN contact_domain cd ON cd.workspace_ref_id = prm.workspace_ref_id
            GROUP BY cd.ref_id, p.name
        ),
        seed_without_existing AS (
            SELECT pcs.*
            FROM person_contact_seed pcs
            WHERE NOT EXISTS (
                SELECT 1
                FROM contact c
                WHERE c.contact_domain_ref_id = pcs.contact_domain_ref_id
                  AND c.name = pcs.contact_name
            )
        ),
        numbered AS (
            SELECT
                (SELECT IFNULL(MAX(ref_id), 0) FROM contact)
                + ROW_NUMBER() OVER (ORDER BY contact_domain_ref_id, contact_name) AS ref_id,
                contact_domain_ref_id,
                contact_name,
                created_time,
                last_modified_time
            FROM seed_without_existing
        )
        INSERT INTO contact (
            ref_id,
            version,
            archived,
            archival_reason,
            created_time,
            last_modified_time,
            archived_time,
            contact_domain_ref_id,
            name
        )
        SELECT
            ref_id,
            1,
            0,
            NULL,
            created_time,
            last_modified_time,
            NULL,
            contact_domain_ref_id,
            contact_name
        FROM numbered
        """
    )

    op.execute(
        """
        INSERT INTO contact_event (
            owner_ref_id,
            timestamp,
            session_index,
            name,
            source,
            owner_version,
            kind,
            data
        )
        SELECT
            c.ref_id,
            c.created_time,
            0,
            'Created',
            'Cli',
            1,
            'Created',
            '{}'
        FROM contact c
        JOIN contact_domain cd ON cd.ref_id = c.contact_domain_ref_id
        WHERE EXISTS (
            SELECT 1
            FROM person p
            JOIN prm ON prm.ref_id = p.prm_ref_id
            WHERE prm.workspace_ref_id = cd.workspace_ref_id
              AND p.name = c.name
        )
        AND NOT EXISTS (
            SELECT 1
            FROM contact_event ce
            WHERE ce.owner_ref_id = c.ref_id
              AND ce.name = 'Created'
        )
        """
    )

    op.execute(
        """
        WITH person_link_seed AS (
            SELECT
                p.ref_id AS person_ref_id,
                cd.ref_id AS contact_domain_ref_id,
                c.ref_id AS contact_ref_id,
                p.created_time AS created_time,
                p.last_modified_time AS last_modified_time
            FROM person p
            JOIN prm ON prm.ref_id = p.prm_ref_id
            JOIN contact_domain cd ON cd.workspace_ref_id = prm.workspace_ref_id
            JOIN contact c
                ON c.contact_domain_ref_id = cd.ref_id
               AND c.name = p.name
            WHERE NOT EXISTS (
                SELECT 1
                FROM contact_link cl
                WHERE cl.namespace = 'person'
                  AND cl.source_entity_ref_id = p.ref_id
            )
        ),
        numbered AS (
            SELECT
                (SELECT IFNULL(MAX(ref_id), 0) FROM contact_link)
                + ROW_NUMBER() OVER (ORDER BY person_ref_id) AS ref_id,
                person_ref_id,
                contact_domain_ref_id,
                contact_ref_id,
                created_time,
                last_modified_time
            FROM person_link_seed
        )
        INSERT INTO contact_link (
            ref_id,
            version,
            archived,
            archival_reason,
            created_time,
            last_modified_time,
            archived_time,
            name,
            contact_domain_ref_id,
            namespace,
            source_entity_ref_id,
            contacts_ref_ids
        )
        SELECT
            ref_id,
            1,
            0,
            NULL,
            created_time,
            last_modified_time,
            NULL,
            'NOT-USED',
            contact_domain_ref_id,
            'person',
            person_ref_id,
            json_array(contact_ref_id)
        FROM numbered
        """
    )

    op.execute(
        """
        INSERT INTO contact_link_event (
            owner_ref_id,
            timestamp,
            session_index,
            name,
            source,
            owner_version,
            kind,
            data
        )
        SELECT
            cl.ref_id,
            cl.created_time,
            0,
            'Created',
            'Cli',
            1,
            'Created',
            '{}'
        FROM contact_link cl
        WHERE cl.namespace = 'person'
        AND NOT EXISTS (
            SELECT 1
            FROM contact_link_event cle
            WHERE cle.owner_ref_id = cl.ref_id
              AND cle.name = 'Created'
        )
        """
    )

    op.execute("""ALTER TABLE person DROP COLUMN name""")


def downgrade() -> None:
    op.execute(
        """ALTER TABLE person ADD COLUMN name VARCHAR(255) NOT NULL DEFAULT 'Unknown person'"""
    )

    op.execute(
        """
        UPDATE person
        SET name = (
            SELECT c.name
            FROM prm
            JOIN contact_domain cd ON cd.workspace_ref_id = prm.workspace_ref_id
            JOIN contact_link cl
                ON cl.contact_domain_ref_id = cd.ref_id
               AND cl.namespace = 'person'
               AND cl.source_entity_ref_id = person.ref_id
            JOIN contact c
                ON c.contact_domain_ref_id = cd.ref_id
               AND c.ref_id = json_extract(cl.contacts_ref_ids, '$[0]')
            WHERE prm.ref_id = person.prm_ref_id
            LIMIT 1
        )
        """
    )
