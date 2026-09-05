"""Tests for the NoOp location resolver."""

import asyncio

from jupiter.core.common.search.limit import SearchLimit
from jupiter.core.common.search.query import SearchQuery
from jupiter.core.common.sub.locations.resolver.impl.noop import NoOpLocationResolver


def test_resolve_returns_no_candidates() -> None:
    resolver = NoOpLocationResolver()
    page = asyncio.run(resolver.resolve(SearchQuery("paris"), SearchLimit(5)))
    assert page.candidates == []
