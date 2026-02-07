"""Rename person-birthday to person-occasion in inbox_task source and time_event namespace

This migration:
1. Creates occasions for persons that have birthdays (with kind='birthday')
2. Updates inbox_task.source_entity_ref_id from person.ref_id to occasion.ref_id
3. Updates time_event_full_days_block.source_entity_ref_id similarly
4. Changes the source/namespace values from 'person-birthday' to 'person-occasion'

Revision ID: f4a9c8b2d6e1
Revises: d33c1d34e857
Create Date: 2026-01-10 15:00:00.000000

"""

from alembic import op
import sqlalchemy as sa
from datetime import datetime

# revision identifiers, used by Alembic.
revision = "f4a9c8b2d6e1"
down_revision = "d33c1d34e857"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()

    # Step 1: Get the next ref_id to use for creating new occasions
    result = bind.execute(sa.text("SELECT MAX(ref_id) + 100 FROM occasion"))
    max_occasion_ref_id = result.scalar() or 0

    # Step 2: Find all persons with birthdays that don't have a corresponding birthday occasion
    persons_with_birthdays = bind.execute(
        sa.text(
            """
            SELECT p.ref_id, p.birthday
            FROM person p
            WHERE p.birthday IS NOT NULL
            AND p.archived = 0
            AND NOT EXISTS (
                SELECT 1 FROM occasion o
                WHERE o.person_ref_id = p.ref_id
                AND o.kind = 'birthday'
            )
        """
        )
    ).fetchall()

    # Step 3: Create occasions for persons with birthdays
    now = datetime.utcnow()
    occasion_mapping = {}  # Maps person_ref_id to occasion_ref_id

    for person in persons_with_birthdays:
        max_occasion_ref_id += 1
        occasion_ref_id = max_occasion_ref_id
        person_ref_id = person[0]
        birthday = person[1]

        bind.execute(
            sa.text(
                """
                INSERT INTO occasion (
                    ref_id, version, archived, archival_reason, created_time,
                    last_modified_time, archived_time, person_ref_id, kind, name, date
                ) VALUES (
                    :ref_id, 1, 0, NULL, :created_time,
                    :last_modified_time, NULL, :person_ref_id, 'birthday', 'Birthday', :date
                )
            """
            ),
            {
                "ref_id": occasion_ref_id,
                "created_time": now,
                "last_modified_time": now,
                "person_ref_id": person_ref_id,
                "date": birthday,
            },
        )
        occasion_mapping[person_ref_id] = occasion_ref_id

    # Also get existing birthday occasions
    existing_occasions = bind.execute(
        sa.text(
            """
            SELECT person_ref_id, ref_id
            FROM occasion
            WHERE kind = 'birthday'
        """
        )
    ).fetchall()

    for row in existing_occasions:
        occasion_mapping[row[0]] = row[1]

    # Step 4: Update inbox_task source_entity_ref_id from person to occasion
    for person_ref_id, occasion_ref_id in occasion_mapping.items():
        bind.execute(
            sa.text(
                """
                UPDATE inbox_task
                SET source_entity_ref_id = :occasion_ref_id
                WHERE source = 'person-birthday'
                AND source_entity_ref_id = :person_ref_id
            """
            ),
            {"occasion_ref_id": occasion_ref_id, "person_ref_id": person_ref_id},
        )

    # Step 5: Update time_event_full_days_block source_entity_ref_id from person to occasion
    for person_ref_id, occasion_ref_id in occasion_mapping.items():
        bind.execute(
            sa.text(
                """
                UPDATE time_event_full_days_block
                SET source_entity_ref_id = :occasion_ref_id
                WHERE namespace = 'person-birthday'
                AND source_entity_ref_id = :person_ref_id
            """
            ),
            {"occasion_ref_id": occasion_ref_id, "person_ref_id": person_ref_id},
        )

    # Step 6: Update the source column in inbox_task table
    op.execute(
        """
        UPDATE inbox_task
        SET source = 'person-occasion'
        WHERE source = 'person-birthday'
        """
    )

    # Step 7: Update the namespace column in time_event_full_days_block table
    op.execute(
        """
        UPDATE time_event_full_days_block
        SET namespace = 'person-occasion'
        WHERE namespace = 'person-birthday'
        """
    )

    with op.batch_alter_table("person") as batch_op:
        batch_op.drop_column("birthday")


def downgrade() -> None:
    pass
