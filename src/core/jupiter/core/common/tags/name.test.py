"""Tests for tag name."""

from jupiter.core.common.tags.name import TagName


def test_construction() -> None:
    tag_name = TagName("tag-name")
    assert str(tag_name) == "tag-name"
