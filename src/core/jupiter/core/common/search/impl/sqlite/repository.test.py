"""Tests for SQLite FTS5 query construction."""

from jupiter.core.common.search.impl.sqlite.repository import SqliteSearchRepository


def test_fts5_match_query_covers_location_columns() -> None:
    query = SqliteSearchRepository._fts5_match_query("cafe")
    assert query == (
        'name:"cafe" OR note:"cafe" OR location_name:"cafe" OR '
        'location_address:"cafe" OR location_country:"cafe" OR location_gps:"cafe"'
    )
