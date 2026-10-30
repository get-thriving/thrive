"""Tests for the image path."""

import pytest
from jupiter.core.common.sub.images.sub.image.image_content_type import ImageContentType
from jupiter.core.common.sub.images.sub.image.image_path import ImagePath
from jupiter.framework.errors import InputValidationError


def test_simple_path() -> None:
    path = ImagePath("abc123.webp")
    assert str(path) == "abc123.webp"
    assert path.content_type == ImageContentType.WEBP


def test_nested_path() -> None:
    assert (
        ImagePath("some-dir/some_image.v2.webp").content_type == ImageContentType.WEBP
    )


@pytest.mark.parametrize(
    "bad_path",
    [
        "",
        "/abc.webp",
        "abc.webp/",
        "../abc.webp",
        "a/../abc.webp",
        "./abc.webp",
        "a//b.webp",
        ".hidden.webp",
        "a/.hidden.webp",
        "..webp",
        "a..b.webp",
        "ABC.webp",
        "a b.webp",
        "a\\b.webp",
        "abc.webp\n",
        "abc\x00.webp",
        "abc.svg",
        "abc.exe",
        "abc",
        "a.b/c",
        "abc." + "webp" * 100,
    ],
)
def test_bad_paths_are_rejected(bad_path: str) -> None:
    with pytest.raises(InputValidationError):
        ImagePath(bad_path)


def test_random_paths_are_valid_and_distinct() -> None:
    paths = {ImagePath.new_random(ImageContentType.WEBP) for _ in range(50)}
    assert len(paths) == 50
    for path in paths:
        assert path.content_type == ImageContentType.WEBP
        # 24 random bytes, in hex, plus the extension.
        assert len(path.the_path) == 48 + len(".webp")
