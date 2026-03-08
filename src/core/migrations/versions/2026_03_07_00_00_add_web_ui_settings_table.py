"""Add web_ui_settings table

Revision ID: a1b2c3d4e5f6
Revises: c8aa3ea7a4d1
Create Date: 2026-03-07 00:00:00.000000

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "a1b2c3d4e5f6"
down_revision = "c8aa3ea7a4d1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE web_ui_settings (
        ref_id INTEGER NOT NULL,
        version INTEGER NOT NULL,
        archived BOOLEAN NOT NULL,
        created_time DATETIME NOT NULL,
        last_modified_time DATETIME NOT NULL,
        archived_time DATETIME,
        user_ref_id INTEGER NOT NULL UNIQUE,
        use_night_mode BOOLEAN NOT NULL,
        PRIMARY KEY (ref_id),
        FOREIGN KEY(user_ref_id) REFERENCES user (ref_id)
        );
        """
    )
    op.execute(
        """
        CREATE UNIQUE INDEX ix_web_ui_settings_user_ref_id ON web_ui_settings (user_ref_id);
        """
    )
    op.execute(
        """
        CREATE TABLE web_ui_settings_event (
        owner_ref_id INTEGER NOT NULL,
        timestamp DATETIME NOT NULL,
        session_index INTEGER NOT NULL,
        name VARCHAR(32) NOT NULL,
        source VARCHAR(16) NOT NULL,
        owner_version INTEGER NOT NULL,
        kind VARCHAR(16) NOT NULL,
        data JSON,
        PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
        FOREIGN KEY(owner_ref_id) REFERENCES web_ui_settings (ref_id)
        );
        """
    )
    op.execute(
        """
        INSERT INTO web_ui_settings
        SELECT
            ref_id as ref_id,
            1 as version,
            0 as archived,
            created_time as created_time,
            created_time as last_modified_time,
            null as archived_time,
            ref_id as user_ref_id,
            0 as use_night_mode
        FROM user;
        """
    )
    op.execute(
        """
        INSERT INTO web_ui_settings_event
        SELECT
            ref_id as owner_ref_id,
            created_time as timestamp,
            0 as session_index,
            'new_web_ui_settings' as name,
            'CLI' as source,
            1 as owner_version,
            'Created' as kind,
            '{}' as data
        FROM user;
        """
    )


def downgrade() -> None:
    op.execute("""DROP TABLE IF EXISTS web_ui_settings_event""")
    op.execute("""DROP TABLE IF EXISTS web_ui_settings""")
