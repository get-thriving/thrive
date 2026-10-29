"""Tests for deciding which stored images to garbage collect."""

from datetime import UTC, datetime, timedelta

import pytest
from jupiter.core.images.service.plan_image_gc import (
    MAX_REMOVED_PER_RUN,
    ImageGcRefusedError,
    plan_image_gc,
)
from jupiter.core.images.store.image_path import ImagePath
from jupiter.core.images.store.stored_image_info import StoredImageInfo
from jupiter.framework.base.timestamp import Timestamp

_NOW = Timestamp(datetime(2026, 10, 29, 12, 0, tzinfo=UTC))


def _info(name: str, age: timedelta) -> StoredImageInfo:
    return StoredImageInfo(ImagePath(f"{name}.webp"), 10, Timestamp(_NOW.the_ts - age))


def _path(name: str) -> ImagePath:
    return ImagePath(f"{name}.webp")


def test_an_old_object_without_a_row_is_removed() -> None:
    plan = plan_image_gc(
        [_info("a", timedelta(days=3)), _info("b", timedelta(days=3))],
        [_path("a")],
        _NOW,
    )

    assert plan.to_remove == [_path("b")]


def test_a_young_object_without_a_row_is_left_alone() -> None:
    plan = plan_image_gc(
        [_info("a", timedelta(days=3)), _info("b", timedelta(hours=2))],
        [_path("a")],
        _NOW,
    )

    assert plan.to_remove == []
    assert plan.young_orphans == 1


def test_rows_without_an_object_are_counted_and_not_touched() -> None:
    plan = plan_image_gc(
        [_info("a", timedelta(days=3))], [_path("a"), _path("x")], _NOW
    )

    assert plan.to_remove == []
    assert plan.rows_without_object == 1


def test_a_small_store_with_no_rows_is_just_cleaned() -> None:
    plan = plan_image_gc([_info("a", timedelta(days=3))], [], _NOW)

    assert plan.to_remove == [_path("a")]


def test_refuses_when_the_database_has_no_images_but_the_store_has_many() -> None:
    stored = [_info(f"i{n}", timedelta(days=3)) for n in range(11)]

    with pytest.raises(ImageGcRefusedError):
        plan_image_gc(stored, [], _NOW)


def test_refuses_when_most_of_a_sizeable_store_looks_orphaned() -> None:
    stored = [_info(f"i{n}", timedelta(days=3)) for n in range(20)]

    with pytest.raises(ImageGcRefusedError):
        plan_image_gc(stored, [_path("i0"), _path("i1")], _NOW)


def test_removes_at_most_a_cap_per_run_oldest_first() -> None:
    stored = [
        _info(f"o{n}", timedelta(days=2, minutes=n))
        for n in range(MAX_REMOVED_PER_RUN + 5)
    ]
    known = [_path(f"k{n}") for n in range(2 * len(stored))]
    stored += [_info(f"k{n}", timedelta(days=2)) for n in range(2 * len(stored))]

    plan = plan_image_gc(stored, known, _NOW)

    assert len(plan.to_remove) == MAX_REMOVED_PER_RUN
    assert plan.left_for_next_run == 5
    assert plan.to_remove[0] == _path(f"o{MAX_REMOVED_PER_RUN + 4}")
