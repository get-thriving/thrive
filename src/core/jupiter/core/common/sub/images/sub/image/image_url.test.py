"""Tests for the image url."""

import pytest
from jupiter.core.common.sub.images.sub.image.image_url import ImageUrl
from jupiter.framework.errors import InputValidationError


def test_relative_url() -> None:
    url = ImageUrl("/images/avatars/abc.webp")
    assert url.is_relative
    assert str(url) == "/images/avatars/abc.webp"


@pytest.mark.parametrize(
    "good_url",
    [
        "https://storage.googleapis.com/bucket/Main/abc.webp",
        "http://localhost:3000/images/avatars/abc.webp",
    ],
)
def test_absolute_url(good_url: str) -> None:
    assert not ImageUrl(good_url).is_relative


def test_the_inline_svg_of_a_generated_avatar() -> None:
    url = ImageUrl("data:image/svg+xml;base64,PHN2Zy8+")

    assert not url.is_relative
    assert str(url) == "data:image/svg+xml;base64,PHN2Zy8+"


@pytest.mark.parametrize(
    "bad_url",
    [
        "",
        "images/abc.webp",
        "//evil.example/abc.webp",
        "javascript:alert(1)",
        "data:x",
        "data:text/html;base64,PHNjcmlwdD4=",
        "data:image/svg+xml,<svg/>",
    ],
)
def test_bad_urls_are_rejected(bad_url: str) -> None:
    with pytest.raises(InputValidationError):
        ImageUrl(bad_url)
