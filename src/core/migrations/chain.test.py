"""Tests that the SQLite migration chain runs end to end.

The ``BigPlan`` -> ``Project`` rename rewrote a few already-released migrations
in place, which is only safe as long as every revision still works against the
schema that actually exists when it runs. These tests walk the chain for both
populations: a database created from scratch, and one that predates the rename.
"""

import re
from collections.abc import Iterator
from pathlib import Path

import pytest
import sqlalchemy as sa
from alembic import command
from alembic.config import Config

_REPO_ROOT = Path(__file__).parent.parent.parent.parent
_ALEMBIC_INI = _REPO_ROOT / "src" / "core" / "migrations" / "alembic.sqlite.ini"
_MIGRATIONS = _REPO_ROOT / "src" / "core" / "migrations" / "sqlite"

# The last revision before the dependencies migration, which is where a database
# that has not been touched since before the rename sits.
_BEFORE_DEPENDENCIES = "a4b2c8d1e059"

_PRE_RENAME_TABLES = (
    ("project_collection", "big_plan_collection"),
    ("project", "big_plan"),
    ("project_stats", "big_plan_stats"),
    ("project_milestone", "big_plan_milestone"),
)


@pytest.fixture()
def db_path(tmp_path: Path) -> Iterator[Path]:
    """A throwaway SQLite database file."""
    yield tmp_path / "test.sqlite"


def _upgrade(db_path: Path, target: str) -> None:
    config = Config(str(_ALEMBIC_INI))
    config.set_main_option("script_location", str(_MIGRATIONS))
    engine = sa.create_engine(f"sqlite:///{db_path}")
    try:
        with engine.begin() as connection:
            config.attributes["connection"] = connection
            command.upgrade(config, target)
    finally:
        engine.dispose()


def _tables(db_path: Path) -> set[str]:
    engine = sa.create_engine(f"sqlite:///{db_path}")
    try:
        with engine.connect() as connection:
            return set(sa.inspect(connection).get_table_names())
    finally:
        engine.dispose()


def _columns(db_path: Path, table: str) -> set[str]:
    engine = sa.create_engine(f"sqlite:///{db_path}")
    try:
        with engine.connect() as connection:
            return {c["name"] for c in sa.inspect(connection).get_columns(table)}
    finally:
        engine.dispose()


def _rewind_to_pre_rename_names(db_path: Path) -> None:
    """Put the project tables back under their pre-rename names.

    The pre-rename migration files no longer exist in the repository - the
    rename rewrote them - so a database from before the rename is emulated by
    walking the chain to just before the dependencies migration and undoing the
    naming there.
    """
    engine = sa.create_engine(f"sqlite:///{db_path}")
    try:
        with engine.begin() as connection:
            for new_name, old_name in _PRE_RENAME_TABLES:
                connection.execute(
                    sa.text(f'ALTER TABLE "{new_name}" RENAME TO "{old_name}"')
                )
            connection.execute(
                sa.text(
                    'ALTER TABLE "big_plan" '
                    'RENAME COLUMN "project_collection_ref_id" '
                    'TO "big_plan_collection_ref_id"'
                )
            )
    finally:
        engine.dispose()


def test_migration_chain_runs_on_a_fresh_database(db_path: Path) -> None:
    """A database created from scratch reaches head."""
    _upgrade(db_path, "head")

    tables = _tables(db_path)
    assert "project" in tables
    assert "big_plan" not in tables
    assert "dependency_ref_ids" in _columns(db_path, "project")


def test_migration_chain_runs_on_a_pre_rename_database(db_path: Path) -> None:
    """A database that still has the big_plan tables reaches head too.

    This is the case the rename broke: the dependencies migration runs one
    revision before the rename, so at that point the table is still called
    ``big_plan`` on any database that has been around for a while.
    """
    _upgrade(db_path, _BEFORE_DEPENDENCIES)
    _rewind_to_pre_rename_names(db_path)
    assert "big_plan" in _tables(db_path)

    _upgrade(db_path, "head")

    tables = _tables(db_path)
    assert "project" in tables
    assert "big_plan" not in tables
    assert "dependency_ref_ids" in _columns(db_path, "project")


def test_follow_up_rename_rewrites_the_columns_the_rename_missed(
    db_path: Path,
) -> None:
    """The columns holding the old name as data are rewritten."""
    _upgrade(db_path, "f3a91c62d70e")

    engine = sa.create_engine(f"sqlite:///{db_path}")
    try:
        with engine.begin() as connection:
            connection.execute(
                sa.text(
                    "INSERT INTO time_plan_activity "
                    "(ref_id, version, archived, created_time, last_modified_time, "
                    " time_plan_ref_id, name, target, kind, feasability) "
                    "VALUES (1, 1, 0, '2026-08-29', '2026-08-29', 1, "
                    " 'Work on big-plan 1', 'BigPlan:std:1', 'finish', 'must-do')"
                )
            )
            connection.execute(
                sa.text(
                    "INSERT INTO journal_stats "
                    "(created_time, last_modified_time, journal_ref_id, report) "
                    "VALUES ('2026-08-29', '2026-08-29', 1, "
                    """ '{"sources": ["BigPlan:std"], "global_big_plans_summary": {}}')"""
                )
            )
    finally:
        engine.dispose()

    _upgrade(db_path, "head")

    engine = sa.create_engine(f"sqlite:///{db_path}")
    try:
        with engine.connect() as connection:
            name, target = connection.execute(
                sa.text("SELECT name, target FROM time_plan_activity WHERE ref_id = 1")
            ).one()
            report = connection.execute(
                sa.text("SELECT report FROM journal_stats WHERE journal_ref_id = 1")
            ).scalar_one()
    finally:
        engine.dispose()

    assert target == "Project:std:1"
    assert name == "Work on project 1"
    assert not re.search(r"BigPlan|big_plan|big-plan", str(report))
    assert "global_projects_summary" in str(report)
