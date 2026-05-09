"""Initial reset of the database.

Revision ID: 6e5f8bc8fcd2
Revises: None
Create Date: 2026-05-04 18:60:00.000000

"""

from alembic import op


revision = "6e5f8bc8fcd2"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # -------------------------------------------------------------------------
    # Core / root tables (no foreign key deps)
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "workspace" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            name VARCHAR(100) NOT NULL,
            feature_flags JSON NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "user" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            email_address VARCHAR NOT NULL,
            name VARCHAR NOT NULL,
            timezone VARCHAR NOT NULL,
            avatar VARCHAR,
            feature_flags JSON NOT NULL,
            category VARCHAR,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            UNIQUE (email_address)
        )
    """
    )

    # -------------------------------------------------------------------------
    # Auth / user links
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE auth (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            user_ref_id INTEGER NOT NULL UNIQUE,
            password_hash VARCHAR NOT NULL,
            recovery_token_hash VARCHAR NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (user_ref_id) REFERENCES "user" (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE TABLE user_workspace_link (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            user_ref_id INTEGER NOT NULL UNIQUE,
            workspace_ref_id INTEGER NOT NULL UNIQUE,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (user_ref_id) REFERENCES "user" (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE TABLE web_ui_settings (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            user_ref_id INTEGER NOT NULL UNIQUE,
            use_night_mode BOOLEAN NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (user_ref_id) REFERENCES "user" (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE TABLE api_key (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            user_ref_id INTEGER NOT NULL,
            name VARCHAR(255) NOT NULL,
            key_hash VARCHAR(255) NOT NULL,
            key_size INTEGER NOT NULL,
            last_four_digits VARCHAR(16) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (user_ref_id) REFERENCES "user" (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_api_key_user_ref_id ON api_key (user_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE mcp_key (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            user_ref_id INTEGER NOT NULL,
            name VARCHAR(255) NOT NULL,
            key_hash VARCHAR(255) NOT NULL,
            key_size INTEGER NOT NULL,
            last_four_digits VARCHAR(16) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (user_ref_id) REFERENCES "user" (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_mcp_key_user_ref_id ON mcp_key (user_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Gamification
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE gamification_score_log (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            user_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (user_ref_id) REFERENCES "user" (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_gamification_score_log_user_ref_id ON gamification_score_log (user_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE gamification_score_log_entry (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            score_log_ref_id INTEGER NOT NULL,
            source VARCHAR(128) NOT NULL,
            task_ref_id INTEGER NOT NULL,
            difficulty VARCHAR(30),
            success BOOL NOT NULL,
            score INTEGER NOT NULL,
            has_lucky_puppy_bonus BOOLEAN,
            name VARCHAR,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (score_log_ref_id) REFERENCES gamification_score_log (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_gamification_score_log_entry_score_log_ref_id_source_task_ref_id
            ON gamification_score_log_entry (score_log_ref_id, source, task_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_gamification_score_log_entry_score_log_ref_id
            ON gamification_score_log_entry (score_log_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE gamification_score_stats (
            score_log_ref_id INTEGER NOT NULL,
            period VARCHAR(12),
            timeline VARCHAR(24) NOT NULL,
            total_score INTEGER NOT NULL,
            inbox_task_cnt INTEGER NOT NULL,
            big_plan_cnt INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            PRIMARY KEY (score_log_ref_id, period, timeline),
            FOREIGN KEY (score_log_ref_id) REFERENCES gamification_score_log (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_gamification_score_stats_score_log_ref_id_period_created_time
            ON gamification_score_stats (score_log_ref_id, period, created_time)
    """
    )

    op.execute(
        """
        CREATE TABLE gamification_score_period_best (
            score_log_ref_id INTEGER NOT NULL,
            period VARCHAR(12),
            timeline VARCHAR(24) NOT NULL,
            sub_period VARCHAR(12) NOT NULL,
            total_score INTEGER NOT NULL,
            inbox_task_cnt INTEGER NOT NULL,
            big_plan_cnt INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            PRIMARY KEY (score_log_ref_id, period, timeline, sub_period),
            FOREIGN KEY (score_log_ref_id) REFERENCES gamification_score_log (ref_id)
        )
    """
    )

    # -------------------------------------------------------------------------
    # Vacation
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE vacation_collection (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_vacation_collection_workspace_ref_id ON vacation_collection (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE vacation (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            name VARCHAR(100) NOT NULL,
            start_date DATETIME NOT NULL,
            end_date DATETIME NOT NULL,
            vacation_collection_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            CONSTRAINT pk_vacation PRIMARY KEY (ref_id),
            CONSTRAINT fk_vacation_vacation_collection_ref_id_vacation_collection
                FOREIGN KEY (vacation_collection_ref_id) REFERENCES vacation_collection (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_vacation_vacation_collection_ref_id ON vacation (vacation_collection_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Inbox tasks
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE inbox_task_collection (
            ref_id INTEGER NOT NULL,
            workspace_ref_id INTEGER,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            archival_reason VARCHAR,
            CONSTRAINT pk_inbox_task_collection PRIMARY KEY (ref_id),
            CONSTRAINT fk_inbox_task_collection_workspace_ref_id_workspace
                FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_inbox_task_collection_workspace_ref_id ON inbox_task_collection (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "inbox_task" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            inbox_task_collection_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL,
            status VARCHAR(16) NOT NULL,
            eisen VARCHAR(20) NOT NULL,
            difficulty VARCHAR(10),
            actionable_date DATETIME,
            due_date DATETIME,
            recurring_timeline VARCHAR,
            recurring_repeat_index INTEGER,
            recurring_gen_right_now DATETIME,
            working_time DATETIME,
            completed_time DATETIME,
            notes VARCHAR,
            archival_reason VARCHAR,
            is_key BOOLEAN NOT NULL,
            owner VARCHAR NOT NULL,
            CONSTRAINT pk_inbox_task PRIMARY KEY (ref_id),
            CONSTRAINT fk_inbox_task_inbox_task_collection_ref_id_inbox_task_collection
                FOREIGN KEY (inbox_task_collection_ref_id) REFERENCES inbox_task_collection (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_inbox_task_inbox_task_collection_ref_id ON inbox_task (inbox_task_collection_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_inbox_task_inbox_task_collection_ref_id_completed_time
            ON inbox_task (inbox_task_collection_ref_id, completed_time)
            WHERE completed_time IS NOT NULL
    """
    )

    op.execute(
        """
        CREATE INDEX ix_inbox_task_pagination
            ON inbox_task (inbox_task_collection_ref_id, owner, created_time)
    """
    )

    # -------------------------------------------------------------------------
    # Habits
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE habit_collection (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_habit_collection_workspace_ref_id ON habit_collection (workspace_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Chores
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE chore_collection (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_chore_collection_workspace_ref_id ON chore_collection (workspace_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Big plans
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE big_plan_collection (
            ref_id INTEGER NOT NULL,
            workspace_ref_id INTEGER,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            archival_reason VARCHAR,
            CONSTRAINT pk_big_plan_collection PRIMARY KEY (ref_id),
            CONSTRAINT fk_recurring_task_collection_workspace_ref_id_workspace
                FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_big_plan_collection_workspace_ref_id ON big_plan_collection (workspace_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Smart lists
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE smart_list_collection (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_smart_list_collection_workspace_ref_id ON smart_list_collection (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "smart_list" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            smart_list_collection_ref_id INTEGER,
            name VARCHAR(100) NOT NULL,
            icon VARCHAR(4),
            archival_reason VARCHAR,
            CONSTRAINT pk_smart_list PRIMARY KEY (ref_id),
            CONSTRAINT fk_smart_list_smart_list_collection_ref_id_smart_list_collection
                FOREIGN KEY (smart_list_collection_ref_id) REFERENCES smart_list_collection (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_smart_list_smart_list_collection_ref_id ON smart_list (smart_list_collection_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "smart_list_item" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            smart_list_ref_id INTEGER NOT NULL,
            name VARCHAR(100) NOT NULL,
            is_done BOOLEAN NOT NULL,
            url VARCHAR,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (smart_list_ref_id) REFERENCES smart_list (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_smart_list_item_smart_list_ref_id ON smart_list_item (smart_list_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Push integrations
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE push_integration_group (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_push_integration_group_workspace_ref_id ON push_integration_group (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "slack_task_collection" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            push_integration_group_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (push_integration_group_ref_id) REFERENCES push_integration_group (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_slack_task_collection_push_integration_group_ref_id
            ON slack_task_collection (push_integration_group_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "slack_task" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            slack_task_collection_ref_id INTEGER NOT NULL,
            user VARCHAR NOT NULL,
            channel VARCHAR,
            message VARCHAR NOT NULL,
            generation_extra_info VARCHAR NOT NULL,
            has_generated_task BOOLEAN NOT NULL,
            name VARCHAR,
            archival_reason VARCHAR,
            CONSTRAINT pk_slack_task PRIMARY KEY (ref_id),
            CONSTRAINT fk_slack_task_slack_task_collection_ref_id_slack_task_collection
                FOREIGN KEY (slack_task_collection_ref_id) REFERENCES slack_task_collection (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_slack_task_slack_task_collection_ref_id ON slack_task (slack_task_collection_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "email_task_collection" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            push_integration_group_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (push_integration_group_ref_id) REFERENCES push_integration_group (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_email_task_collection_push_integration_group_ref_id
            ON email_task_collection (push_integration_group_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE email_task (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            email_task_collection_ref_id INTEGER NOT NULL,
            from_address VARCHAR NOT NULL,
            from_name VARCHAR NOT NULL,
            to_address VARCHAR NOT NULL,
            subject VARCHAR NOT NULL,
            body VARCHAR NOT NULL,
            generation_extra_info VARCHAR,
            has_generated_task BOOLEAN NOT NULL,
            name VARCHAR,
            archival_reason VARCHAR,
            CONSTRAINT pk_email_task PRIMARY KEY (ref_id),
            CONSTRAINT fk_email_task_email_task_collection_ref_id_email_task_collection
                FOREIGN KEY (email_task_collection_ref_id) REFERENCES email_task_collection (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_email_task_email_task_collection_ref_id ON email_task (email_task_collection_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Notes & docs
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE note_collection (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_note_collection_workspace_ref_id ON note_collection (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "note" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            note_collection_ref_id INTEGER NOT NULL,
            content JSON NOT NULL,
            name VARCHAR,
            archival_reason VARCHAR,
            owner VARCHAR(256) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (note_collection_ref_id) REFERENCES note_collection (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_note_owner ON note (owner)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_note_note_collection_ref_id ON note (note_collection_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_note_note_collection_ref_id_owner ON note (note_collection_ref_id, owner)
    """
    )

    op.execute(
        """
        CREATE TABLE doc_collection (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_doc_collection_workspace_ref_id ON doc_collection (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE dir (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            doc_collection_ref_id INTEGER NOT NULL,
            parent_dir_ref_id INTEGER,
            name VARCHAR(100) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (doc_collection_ref_id) REFERENCES doc_collection (ref_id),
            FOREIGN KEY (parent_dir_ref_id) REFERENCES dir (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_dir_doc_collection_ref_id ON dir (doc_collection_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_dir_parent_dir_ref_id ON dir (parent_dir_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "doc" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            doc_collection_ref_id INTEGER NOT NULL,
            name VARCHAR(64) NOT NULL,
            archival_reason VARCHAR,
            idempotency_key VARCHAR(36),
            parent_dir_ref_id INTEGER NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (doc_collection_ref_id) REFERENCES doc_collection (ref_id)
            FOREIGN KEY (parent_dir_ref_id) REFERENCES dir (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX idx_doc_idempotency_key ON doc (idempotency_key)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_doc_doc_collection_ref_id ON doc (doc_collection_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_doc_parent_dir_ref_id ON doc (parent_dir_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Metrics
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "metric_collection" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_metric_collection_workspace_ref_id ON metric_collection (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "metric" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            metric_collection_ref_id INTEGER,
            name VARCHAR NOT NULL,
            metric_unit VARCHAR,
            icon VARCHAR(4),
            collection_params JSON,
            archival_reason VARCHAR,
            is_key BOOLEAN NOT NULL,
            metric_direction VARCHAR NOT NULL,
            CONSTRAINT pk_metric PRIMARY KEY (ref_id),
            CONSTRAINT fk_metric_metric_collection_ref_id_metric_collection
                FOREIGN KEY (metric_collection_ref_id) REFERENCES metric_collection (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_metric_metric_collection_ref_id ON metric (metric_collection_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "metric_entry" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            metric_ref_id INTEGER NOT NULL,
            collection_time DATETIME NOT NULL,
            value FLOAT NOT NULL,
            name VARCHAR,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (metric_ref_id) REFERENCES metric (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_metric_entry_metric_ref_id ON metric_entry (metric_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Journals
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "journal_collection" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            periods JSON NOT NULL,
            writing_task_gen_params JSON,
            archival_reason VARCHAR,
            generation_approach VARCHAR,
            generation_in_advance_days JSON,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_journal_collection_workspace_ref_id ON journal_collection (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "journal" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            journal_collection_ref_id INTEGER NOT NULL,
            name VARCHAR(64) NOT NULL,
            source VARCHAR(16) NOT NULL,
            right_now DATE NOT NULL,
            period VARCHAR(16) NOT NULL,
            timeline VARCHAR(16) NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (journal_collection_ref_id) REFERENCES journal_collection (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_journal_journal_collection_ref_id_period_timeline
            ON journal (journal_collection_ref_id, period, timeline)
            WHERE archived=0
    """
    )

    op.execute(
        """
        CREATE INDEX ix_journal_journal_collection_ref_id ON journal (journal_collection_ref_id)
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_journal_journal_collection_ref_id_period_right_now
            ON journal (journal_collection_ref_id, period, right_now)
            WHERE archived=0
    """
    )

    op.execute(
        """
        CREATE TABLE journal_stats (
            journal_ref_id INTEGER NOT NULL,
            report JSON NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            FOREIGN KEY (journal_ref_id) REFERENCES journal (ref_id),
            UNIQUE (journal_ref_id)
        )
    """
    )

    # -------------------------------------------------------------------------
    # Working memory
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "working_mem_collection" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            generation_period VARCHAR(16) NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_working_mem_collection_workspace_ref_id ON working_mem_collection (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "working_mem" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            working_mem_collection_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (working_mem_collection_ref_id) REFERENCES working_mem_collection (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_working_mem_working_mem_collection_ref_id
            ON working_mem (working_mem_collection_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # GC & gen logs
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE gc_log (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_gc_log_workspace_ref_id ON gc_log (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE gc_log_entry (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            gc_log_ref_id INTEGER NOT NULL,
            source VARCHAR(128) NOT NULL,
            gc_targets JSON NOT NULL,
            opened BOOLEAN NOT NULL,
            entity_records JSON NOT NULL,
            name VARCHAR,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (gc_log_ref_id) REFERENCES gc_log (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_gc_log_entry_gc_log_ref_id ON gc_log_entry (gc_log_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE gen_log (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_gen_log_workspace_ref_id ON gen_log (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE gen_log_entry (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            gen_log_ref_id INTEGER NOT NULL,
            source VARCHAR(128) NOT NULL,
            gen_even_if_not_modified BOOLEAN NOT NULL,
            today DATE NOT NULL,
            gen_targets JSON NOT NULL,
            period JSON,
            filter_aspect_ref_ids JSON,
            filter_habit_ref_ids JSON,
            filter_chore_ref_ids JSON,
            filter_metric_ref_ids JSON,
            filter_person_ref_ids JSON,
            filter_slack_task_ref_ids JSON,
            filter_email_task_ref_ids JSON,
            opened BOOLEAN NOT NULL,
            entity_created_records JSON NOT NULL,
            entity_updated_records JSON NOT NULL,
            entity_removed_records JSON NOT NULL,
            name VARCHAR,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (gen_log_ref_id) REFERENCES gen_log (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_gen_log_entry_gen_log_ref_id ON gen_log_entry (gen_log_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Stats log
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE stats_log (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            archival_reason VARCHAR,
            workspace_ref_id INTEGER NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_stats_log_workspace_ref_id ON stats_log (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE stats_log_entry (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            archival_reason VARCHAR,
            stats_log_ref_id INTEGER NOT NULL,
            source VARCHAR(128) NOT NULL,
            name VARCHAR NOT NULL,
            stats_targets JSON NOT NULL,
            today DATE NOT NULL,
            filter_habit_ref_ids JSON,
            filter_big_plan_ref_ids JSON,
            filter_journal_ref_ids JSON,
            entity_records JSON NOT NULL,
            opened BOOLEAN NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (stats_log_ref_id) REFERENCES stats_log (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_stats_log_entry_stats_log_ref_id ON stats_log_entry (stats_log_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Mutation / invocation audit tables
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE mutation_entity_event (
            entity_type VARCHAR(48) NOT NULL,
            entity_ref_id INTEGER NOT NULL,
            entity_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            name VARCHAR(128) NOT NULL,
            trace_id VARCHAR(64) NOT NULL,
            mutation_id VARCHAR(64) NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            source VARCHAR(128) NOT NULL,
            context_str VARCHAR(128) NOT NULL,
            data JSON NOT NULL,
            PRIMARY KEY (
                entity_type, entity_ref_id, entity_version, kind, name,
                trace_id, mutation_id, timestamp, session_index
            )
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_mutation_entity_event_entity_type_entity_ref_id_timestamp
            ON mutation_entity_event (entity_type, entity_ref_id, timestamp)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_mutation_entity_event_mutation_id ON mutation_entity_event (mutation_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "mutation_invocation_record" (
            timestamp DATETIME NOT NULL,
            name VARCHAR NOT NULL,
            args JSON NOT NULL,
            result VARCHAR NOT NULL,
            error_str VARCHAR,
            context_str VARCHAR NOT NULL,
            trace_id VARCHAR NOT NULL,
            mutation_id VARCHAR NOT NULL,
            source VARCHAR NOT NULL,
            PRIMARY KEY (timestamp, name)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_use_case_mutation_use_case_invocation_record_context_str_timestamp_name
            ON mutation_invocation_record (context_str, timestamp, name)
    """
    )

    # -------------------------------------------------------------------------
    # Home config / tabs / widgets
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "home_config" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            order_of_tabs JSON,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_home_config_workspace_ref_id ON home_config (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE home_tab (
            ref_id INTEGER NOT NULL PRIMARY KEY,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            home_config_ref_id INTEGER NOT NULL,
            target VARCHAR(32) NOT NULL,
            name VARCHAR(256) NOT NULL,
            icon VARCHAR(64),
            widget_placement JSON NOT NULL,
            FOREIGN KEY (home_config_ref_id) REFERENCES home_config (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_home_tab_home_config_ref_id ON home_tab (home_config_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE home_widget (
            ref_id INTEGER NOT NULL PRIMARY KEY,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            home_tab_ref_id INTEGER NOT NULL,
            name VARCHAR(256) NOT NULL,
            the_type VARCHAR(32) NOT NULL,
            geometry JSON NOT NULL,
            FOREIGN KEY (home_tab_ref_id) REFERENCES home_tab (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_home_widget_home_tab_ref_id ON home_widget (home_tab_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Life plan, aspects, chapters, goals, vision
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "life_plan" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            birthday VARCHAR NOT NULL,
            birth_year INTEGER NOT NULL,
            max_age INTEGER NOT NULL,
            time_plan_max_life_plan_links INTEGER NOT NULL,
            eval_periods TEXT NOT NULL,
            eval_approach VARCHAR NOT NULL,
            eval_task_gen_params VARCHAR,
            eval_task_generation_in_advance_days TEXT NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_life_plan_workspace_ref_id ON life_plan (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "aspect" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            life_plan_ref_id INTEGER NOT NULL,
            name VARCHAR(100) NOT NULL,
            parent_aspect_ref_id INTEGER,
            order_of_child_aspects JSON,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            CONSTRAINT fk_aspect_aspect_collection_ref_id_aspect_collection
                FOREIGN KEY (life_plan_ref_id) REFERENCES life_plan (ref_id),
            CONSTRAINT fk_aspect_parent_aspect_ref_id_aspect
                FOREIGN KEY (parent_aspect_ref_id) REFERENCES aspect (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_aspect_parent_aspect_ref_id ON aspect (parent_aspect_ref_id)
            WHERE parent_aspect_ref_id IS NOT NULL
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "chapter" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            life_plan_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL,
            start_date VARCHAR NOT NULL,
            end_date VARCHAR NOT NULL,
            aspect_ref_id INTEGER NOT NULL,
            PRIMARY KEY (ref_id),
            CONSTRAINT fk_chapter_aspect_ref_id_aspect
                FOREIGN KEY (aspect_ref_id) REFERENCES aspect (ref_id),
            FOREIGN KEY (life_plan_ref_id) REFERENCES life_plan (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_chapter_aspect_ref_id ON chapter (aspect_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_chapter_life_plan_ref_id ON chapter (life_plan_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "goal" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            life_plan_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL,
            aspect_ref_id INTEGER NOT NULL,
            parent_goal_ref_id INTEGER,
            PRIMARY KEY (ref_id),
            CONSTRAINT fk_goal_aspect_ref_id_aspect
                FOREIGN KEY (aspect_ref_id) REFERENCES aspect (ref_id),
            CONSTRAINT fk_goal_life_plan_ref_id_life_plan
                FOREIGN KEY (life_plan_ref_id) REFERENCES life_plan (ref_id),
            CONSTRAINT fk_goal_parent_goal_ref_id_goal
                FOREIGN KEY (parent_goal_ref_id) REFERENCES goal (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_goal_aspect_ref_id ON goal (aspect_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_goal_life_plan_ref_id ON goal (life_plan_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_goal_parent_goal_ref_id ON goal (parent_goal_ref_id)
            WHERE parent_goal_ref_id IS NOT NULL
    """
    )

    op.execute(
        """
        CREATE TABLE vision (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            name VARCHAR NOT NULL,
            life_plan_ref_id INTEGER NOT NULL,
            status VARCHAR NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (life_plan_ref_id) REFERENCES life_plan (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_vision_life_plan_ref_id ON vision (life_plan_ref_id)
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_vision_life_plan_ref_id_active ON vision (life_plan_ref_id)
            WHERE archived=0 AND status='active'
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_vision_life_plan_ref_id_draft ON vision (life_plan_ref_id)
            WHERE archived=0 AND status='draft'
    """
    )

    op.execute(
        """
        CREATE TABLE milestone (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            life_plan_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL,
            date DATE NOT NULL,
            aspect_ref_id INTEGER NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (life_plan_ref_id) REFERENCES life_plan (ref_id),
            FOREIGN KEY (aspect_ref_id) REFERENCES aspect (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_milestone_life_plan_ref_id ON milestone (life_plan_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_milestone_aspect_ref_id ON milestone (aspect_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Big plan (needs aspect, chapter, goal)
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "big_plan" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            big_plan_collection_ref_id INTEGER NOT NULL,
            aspect_ref_id INTEGER,
            name VARCHAR NOT NULL,
            status VARCHAR(16) NOT NULL,
            actionable_date DATETIME,
            due_date DATETIME,
            working_time DATETIME,
            completed_time DATETIME,
            archival_reason VARCHAR,
            eisen VARCHAR,
            difficulty VARCHAR,
            is_key BOOLEAN NOT NULL,
            chapter_ref_id INTEGER,
            goal_ref_id INTEGER,
            CONSTRAINT pk_big_plan PRIMARY KEY (ref_id),
            CONSTRAINT fk_big_plan_aspect_ref_id_aspect
                FOREIGN KEY (aspect_ref_id) REFERENCES aspect (ref_id),
            CONSTRAINT fk_big_plan_big_plan_collection_ref_id_big_plan_collection
                FOREIGN KEY (big_plan_collection_ref_id) REFERENCES big_plan_collection (ref_id),
            CONSTRAINT fk_big_plan_chapter_ref_id_chapter
                FOREIGN KEY (chapter_ref_id) REFERENCES chapter (ref_id),
            CONSTRAINT fk_big_plan_goal_ref_id_goal
                FOREIGN KEY (goal_ref_id) REFERENCES goal (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_big_plan_big_plan_collection_ref_id ON big_plan (big_plan_collection_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_big_plan_big_plan_collection_ref_id_completed_time
            ON big_plan (big_plan_collection_ref_id, completed_time)
            WHERE completed_time IS NOT NULL
    """
    )

    op.execute(
        """
        CREATE INDEX ix_big_plan_aspect_ref_id ON big_plan (aspect_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_big_plan_chapter_ref_id ON big_plan (chapter_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_big_plan_goal_ref_id ON big_plan (goal_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE big_plan_stats (
            big_plan_ref_id INTEGER NOT NULL,
            all_inbox_tasks_cnt INTEGER NOT NULL,
            completed_inbox_tasks_cnt INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            FOREIGN KEY (big_plan_ref_id) REFERENCES big_plan (ref_id),
            UNIQUE (big_plan_ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE TABLE big_plan_milestone (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            big_plan_ref_id INTEGER NOT NULL,
            date DATE NOT NULL,
            name VARCHAR NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (big_plan_ref_id) REFERENCES big_plan (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_big_plan_milestone_big_plan_ref_id ON big_plan_milestone (big_plan_ref_id)
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_big_plan_milestone_big_plan_ref_id_date
            ON big_plan_milestone (big_plan_ref_id, date)
    """
    )

    # -------------------------------------------------------------------------
    # Habit & chore (need aspect, chapter, goal)
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "habit" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            habit_collection_ref_id INTEGER NOT NULL,
            aspect_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL,
            suspended BOOLEAN NOT NULL,
            repeats_in_period_count INTEGER,
            gen_params JSON,
            repeats_strategy VARCHAR,
            archival_reason VARCHAR,
            is_key BOOLEAN NOT NULL,
            chapter_ref_id INTEGER,
            goal_ref_id INTEGER,
            PRIMARY KEY (ref_id),
            CONSTRAINT fk_habit_chapter_ref_id_chapter
                FOREIGN KEY (chapter_ref_id) REFERENCES chapter (ref_id),
            CONSTRAINT fk_habit_goal_ref_id_goal
                FOREIGN KEY (goal_ref_id) REFERENCES goal (ref_id),
            FOREIGN KEY (habit_collection_ref_id) REFERENCES habit_collection (ref_id),
            FOREIGN KEY (aspect_ref_id) REFERENCES aspect (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_habit_aspect_ref_id ON habit (aspect_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_habit_habit_collection_ref_id ON habit (habit_collection_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_habit_chapter_ref_id ON habit (chapter_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_habit_goal_ref_id ON habit (goal_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "habit_streak_marks" (
            habit_ref_id INTEGER NOT NULL,
            date DATE NOT NULL,
            statuses JSON NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            PRIMARY KEY (habit_ref_id, date),
            FOREIGN KEY (habit_ref_id) REFERENCES habit (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "chore" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            chore_collection_ref_id INTEGER NOT NULL,
            aspect_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL,
            suspended BOOLEAN NOT NULL,
            must_do BOOLEAN NOT NULL,
            start_at_date DATETIME NOT NULL,
            end_at_date DATETIME,
            gen_params JSON,
            archival_reason VARCHAR,
            is_key BOOLEAN NOT NULL,
            chapter_ref_id INTEGER,
            goal_ref_id INTEGER,
            PRIMARY KEY (ref_id),
            CONSTRAINT fk_chore_chapter_ref_id_chapter
                FOREIGN KEY (chapter_ref_id) REFERENCES chapter (ref_id),
            CONSTRAINT fk_chore_goal_ref_id_goal
                FOREIGN KEY (goal_ref_id) REFERENCES goal (ref_id),
            FOREIGN KEY (chore_collection_ref_id) REFERENCES chore_collection (ref_id),
            FOREIGN KEY (aspect_ref_id) REFERENCES aspect (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_chore_aspect_ref_id ON chore (aspect_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_chore_chore_collection_ref_id ON chore (chore_collection_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_chore_chapter_ref_id ON chore (chapter_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_chore_goal_ref_id ON chore (goal_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # PRM (people relationship manager)
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "prm" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            max_circles_per_person INTEGER NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_prm_workspace_ref_id ON prm (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "person" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            prm_ref_id INTEGER,
            name VARCHAR NOT NULL,
            catch_up_params JSON,
            archival_reason VARCHAR,
            CONSTRAINT pk_person PRIMARY KEY (ref_id),
            CONSTRAINT fk_person_person_collection_ref_id_person_collection
                FOREIGN KEY (prm_ref_id) REFERENCES prm (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_person_prm_ref_id ON person (prm_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "circle" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            prm_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (prm_ref_id) REFERENCES prm (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_circle_prm_ref_id ON circle (prm_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE person_circle_link (
            prm_ref_id INTEGER NOT NULL,
            person_ref_id INTEGER NOT NULL,
            circle_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            PRIMARY KEY (prm_ref_id, person_ref_id, circle_ref_id),
            FOREIGN KEY (prm_ref_id) REFERENCES prm (ref_id),
            FOREIGN KEY (person_ref_id) REFERENCES person (ref_id),
            FOREIGN KEY (circle_ref_id) REFERENCES circle (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_person_circle_link_person_ref_id ON person_circle_link (person_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_person_circle_link_circle_ref_id ON person_circle_link (circle_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE occasion (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            person_ref_id INTEGER NOT NULL,
            kind VARCHAR NOT NULL,
            name VARCHAR NOT NULL,
            date VARCHAR NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (person_ref_id) REFERENCES person (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_occasion_person_ref_id ON occasion (person_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Time plan domain
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "time_plan_domain" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            periods JSON,
            generation_approach VARCHAR,
            generation_in_advance_days JSON,
            planning_task_gen_params JSON,
            PRIMARY KEY (ref_id),
            CONSTRAINT fk_time_plan_domain_workspace_ref_id_workspace
                FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_time_plan_domain_workspace_ref_id ON time_plan_domain (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE time_plan (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            time_plan_domain_ref_id INTEGER NOT NULL,
            name VARCHAR(64) NOT NULL,
            source VARCHAR(16) NOT NULL,
            right_now DATE NOT NULL,
            period VARCHAR(16) NOT NULL,
            timeline VARCHAR(16) NOT NULL,
            start_date DATE,
            end_date DATE,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (time_plan_domain_ref_id) REFERENCES time_plan_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_plan_time_plan_domain_ref_id ON time_plan (time_plan_domain_ref_id)
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_time_plan_time_plan_domain_ref_id_period_timeline
            ON time_plan (time_plan_domain_ref_id, period, timeline)
            WHERE archived=0
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_time_plan_time_plan_domain_ref_id_period_right_now
            ON time_plan (time_plan_domain_ref_id, period, right_now)
            WHERE archived=0
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "time_plan_activity" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            time_plan_ref_id INTEGER NOT NULL,
            name VARCHAR(64) NOT NULL,
            target VARCHAR(128) NOT NULL,
            kind VARCHAR(16) NOT NULL,
            feasability VARCHAR(16) NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (time_plan_ref_id) REFERENCES time_plan (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_plan_activity_time_plan_ref_id ON time_plan_activity (time_plan_ref_id)
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_time_plan_activity_time_plan_ref_id_target
            ON time_plan_activity (time_plan_ref_id, target)
            WHERE archived=0
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_plan_activity_target ON time_plan_activity (target)
    """
    )

    op.execute(
        """
        CREATE TABLE time_plan_chapter_link (
            time_plan_ref_id INTEGER NOT NULL,
            chapter_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            PRIMARY KEY (time_plan_ref_id, chapter_ref_id),
            FOREIGN KEY (time_plan_ref_id) REFERENCES time_plan (ref_id),
            FOREIGN KEY (chapter_ref_id) REFERENCES chapter (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_plan_chapter_link_chapter_ref_id ON time_plan_chapter_link (chapter_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE time_plan_aspect_link (
            time_plan_ref_id INTEGER NOT NULL,
            aspect_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            PRIMARY KEY (time_plan_ref_id, aspect_ref_id),
            FOREIGN KEY (time_plan_ref_id) REFERENCES time_plan (ref_id),
            FOREIGN KEY (aspect_ref_id) REFERENCES aspect (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_plan_aspect_link_aspect_ref_id ON time_plan_aspect_link (aspect_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE time_plan_goal_link (
            time_plan_ref_id INTEGER NOT NULL,
            goal_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            PRIMARY KEY (time_plan_ref_id, goal_ref_id),
            FOREIGN KEY (time_plan_ref_id) REFERENCES time_plan (ref_id),
            FOREIGN KEY (goal_ref_id) REFERENCES goal (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_plan_goal_link_goal_ref_id ON time_plan_goal_link (goal_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Time event domain & blocks
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE time_event_domain (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_time_event_domain_workspace_ref_id ON time_event_domain (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "time_event_in_day_block" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            time_event_domain_ref_id INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            start_date DATE NOT NULL,
            start_time_in_day VARCHAR(5) NOT NULL,
            duration_mins INTEGER NOT NULL,
            archival_reason VARCHAR,
            owner VARCHAR(256) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (time_event_domain_ref_id) REFERENCES time_event_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_event_in_day_block_time_event_domain_ref_id
            ON time_event_in_day_block (time_event_domain_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_event_in_day_block_time_event_domain_ref_id_start_date
            ON time_event_in_day_block (time_event_domain_ref_id, start_date)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_event_in_day_block_owner ON time_event_in_day_block (owner)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_event_in_day_block_time_event_domain_ref_id_owner
            ON time_event_in_day_block (time_event_domain_ref_id, owner)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "time_event_full_days_block" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            time_event_domain_ref_id INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            start_date DATE NOT NULL,
            duration_days INTEGER NOT NULL,
            end_date DATE NOT NULL,
            archival_reason VARCHAR,
            owner VARCHAR(256) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (time_event_domain_ref_id) REFERENCES time_event_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_event_full_days_block_time_event_domain_ref_id
            ON time_event_full_days_block (time_event_domain_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_event_full_days_block_time_event_domain_ref_id_start_date
            ON time_event_full_days_block (time_event_domain_ref_id, start_date)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_event_full_days_block_time_event_domain_ref_id_end_date
            ON time_event_full_days_block (time_event_domain_ref_id, end_date)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_event_full_days_block_owner ON time_event_full_days_block (owner)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_event_full_days_block_time_event_domain_ref_id_owner
            ON time_event_full_days_block (time_event_domain_ref_id, owner)
    """
    )

    # -------------------------------------------------------------------------
    # Schedule domain, streams, events, exports
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE schedule_domain (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_schedule_domain_workspace_ref_id ON schedule_domain (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE schedule_stream (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            schedule_domain_ref_id INTEGER NOT NULL,
            source VARCHAR(16) NOT NULL,
            name VARCHAR NOT NULL,
            color VARCHAR(12) NOT NULL,
            source_ical_url VARCHAR,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (schedule_domain_ref_id) REFERENCES schedule_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_schedule_stream_schedule_domain_ref_id ON schedule_stream (schedule_domain_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE schedule_event_in_day (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            schedule_domain_ref_id INTEGER NOT NULL,
            schedule_stream_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL,
            source VARCHAR,
            external_uid VARCHAR,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (schedule_domain_ref_id) REFERENCES schedule_domain (ref_id),
            FOREIGN KEY (schedule_stream_ref_id) REFERENCES schedule_stream (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_schedule_event_in_day_schedule_domain_ref_id
            ON schedule_event_in_day (schedule_domain_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_schedule_event_in_day_schedule_stream_ref_id
            ON schedule_event_in_day (schedule_stream_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE schedule_event_full_days (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            schedule_domain_ref_id INTEGER NOT NULL,
            schedule_stream_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL,
            source VARCHAR,
            external_uid VARCHAR,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (schedule_domain_ref_id) REFERENCES schedule_domain (ref_id),
            FOREIGN KEY (schedule_stream_ref_id) REFERENCES schedule_stream (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_schedule_event_full_days_schedule_domain_ref_id
            ON schedule_event_full_days (schedule_domain_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_schedule_event_full_days_schedule_stream_ref_id
            ON schedule_event_full_days (schedule_stream_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE schedule_export (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            schedule_domain_ref_id INTEGER NOT NULL,
            external_id VARCHAR(64) NOT NULL,
            name VARCHAR(255) NOT NULL,
            schedule_stream_ref_ids JSON NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (schedule_domain_ref_id) REFERENCES schedule_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_schedule_export_schedule_domain_ref_id ON schedule_export (schedule_domain_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_schedule_export_external_id ON schedule_export (external_id)
    """
    )

    op.execute(
        """
        CREATE TABLE schedule_external_sync_log (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            schedule_domain_ref_id INTEGER NOT NULL,
            name VARCHAR(64) NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (schedule_domain_ref_id) REFERENCES schedule_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_schedule_external_sync_log_schedule_domain_ref_id
            ON schedule_external_sync_log (schedule_domain_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE schedule_external_sync_log_entry (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            schedule_external_sync_log_ref_id INTEGER NOT NULL,
            name VARCHAR(64) NOT NULL,
            source VARCHAR(16) NOT NULL,
            filter_schedule_stream_ref_id JSON,
            opened BOOLEAN NOT NULL,
            per_stream_results JSON NOT NULL,
            entity_records JSON NOT NULL,
            even_more_entity_records BOOLEAN,
            today DATE,
            start_of_window DATE,
            end_of_window DATE,
            sync_even_if_not_modified BOOLEAN,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (schedule_external_sync_log_ref_id)
                REFERENCES schedule_external_sync_log (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_schedule_external_sync_log_entry_schedule_external_sync_log_ref_id
            ON schedule_external_sync_log_entry (schedule_external_sync_log_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Tags & contacts
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE tag_domain (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_tag_domain_workspace_ref_id ON tag_domain (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "tag" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            tag_domain_ref_id INTEGER NOT NULL,
            name VARCHAR(255) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (tag_domain_ref_id) REFERENCES tag_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_tag_tag_domain_ref_id_name ON tag (tag_domain_ref_id, name)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "tag_link" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            name VARCHAR(255) NOT NULL,
            tag_domain_ref_id INTEGER NOT NULL,
            ref_ids JSON NOT NULL,
            owner VARCHAR(256) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (tag_domain_ref_id) REFERENCES tag_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_tag_link_owner ON tag_link (owner)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_tag_link_tag_domain_ref_id_owner ON tag_link (tag_domain_ref_id, owner)
    """
    )

    op.execute(
        """
        CREATE TABLE contact_domain (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_contact_domain_workspace_ref_id ON contact_domain (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE contact (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            contact_domain_ref_id INTEGER NOT NULL,
            name VARCHAR(255) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (contact_domain_ref_id) REFERENCES contact_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_contact_contact_domain_ref_id_name ON contact (contact_domain_ref_id, name)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "contact_link" (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            name VARCHAR(255) NOT NULL,
            contact_domain_ref_id INTEGER NOT NULL,
            contacts_ref_ids JSON NOT NULL,
            owner VARCHAR(256) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (contact_domain_ref_id) REFERENCES contact_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_contact_link_owner ON contact_link (owner)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_contact_link_contact_domain_ref_id_owner ON contact_link (contact_domain_ref_id, owner)
    """
    )

    # -------------------------------------------------------------------------
    # Todo domain & tasks
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE todo_domain (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_todo_domain_workspace_ref_id ON todo_domain (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE todo_task (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            todo_domain_ref_id INTEGER NOT NULL,
            name VARCHAR(255) NOT NULL,
            aspect_ref_id INTEGER NOT NULL,
            chapter_ref_id INTEGER,
            goal_ref_id INTEGER,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (todo_domain_ref_id) REFERENCES todo_domain (ref_id),
            FOREIGN KEY (aspect_ref_id) REFERENCES aspect (ref_id),
            FOREIGN KEY (chapter_ref_id) REFERENCES chapter (ref_id),
            FOREIGN KEY (goal_ref_id) REFERENCES goal (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_todo_task_todo_domain_ref_id ON todo_task (todo_domain_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_todo_task_aspect_ref_id ON todo_task (aspect_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_todo_task_chapter_ref_id ON todo_task (chapter_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_todo_task_goal_ref_id ON todo_task (goal_ref_id)
    """
    )

    # -------------------------------------------------------------------------
    # Search infrastructure
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE VIRTUAL TABLE "search_index" USING fts5(
            workspace_ref_id,
            entity_tag,
            parent_ref_id UNINDEXED,
            ref_id UNINDEXED,
            name,
            note,
            archived UNINDEXED,
            created_time,
            last_modified_time,
            archived_time,
            tokenize="porter unicode61 remove_diacritics 1"
        )
    """
    )

    op.execute(
        """
        CREATE TABLE search_entity_indexing_map (
            workspace_ref_id INTEGER NOT NULL,
            entity_type VARCHAR NOT NULL,
            entity_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            object_id VARCHAR NOT NULL,
            CONSTRAINT fk_search_entity_indexing_map_workspace_ref_id
                FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id),
            CONSTRAINT uq_search_entity_indexing_map_workspace_entity
                UNIQUE (workspace_ref_id, entity_type, entity_ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_search_entity_indexing_map_workspace_entity_type
            ON search_entity_indexing_map (workspace_ref_id, entity_type)
    """
    )

    op.execute(
        """
        CREATE TABLE search_mutation_log (
            mutation_id VARCHAR NOT NULL,
            workspace_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            status VARCHAR NOT NULL,
            CONSTRAINT pk_search_mutation_log_mutation_id PRIMARY KEY (mutation_id),
            CONSTRAINT fk_search_mutation_log_workspace_ref_id
                FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_search_mutation_log_status ON search_mutation_log (status)
    """
    )

    op.execute(
        """
        CREATE TABLE search_index_tag (
            workspace_ref_id INTEGER NOT NULL,
            entity_tag VARCHAR NOT NULL,
            entity_ref_id INTEGER NOT NULL,
            tag_ref_id INTEGER NOT NULL,
            PRIMARY KEY (workspace_ref_id, entity_tag, entity_ref_id, tag_ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id),
            FOREIGN KEY (workspace_ref_id, entity_tag, entity_ref_id) 
                REFERENCES search_index (workspace_ref_id, entity_tag, ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_search_index_tag_workspace_ref_id ON search_index_tag (workspace_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE search_index_contact (
            workspace_ref_id INTEGER NOT NULL,
            entity_tag VARCHAR NOT NULL,
            entity_ref_id INTEGER NOT NULL,
            contact_ref_id INTEGER NOT NULL,
            PRIMARY KEY (workspace_ref_id, entity_tag, entity_ref_id, contact_ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id),
            FOREIGN KEY (workspace_ref_id, entity_tag, entity_ref_id) 
                REFERENCES search_index (workspace_ref_id, entity_tag, ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_search_index_contact_workspace_ref_id ON search_index_contact (workspace_ref_id)
    """
    )


def downgrade() -> None:
    pass
