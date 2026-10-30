"""Tests for the image entity."""

import pytest
from jupiter.core.common.sub.images.sub.image.image_content_hash import (
    ImageContentHash,
)
from jupiter.core.common.sub.images.sub.image.image_path import ImagePath
from jupiter.core.common.sub.images.sub.image.image_purpose import ImagePurpose
from jupiter.core.common.sub.images.sub.image.image_source import ImageSource
from jupiter.core.common.sub.images.sub.image.root import (
    MAX_IMAGE_PIXELS,
    MAX_IMAGE_SIZE_IN_BYTES,
    Image,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.errors import InputValidationError


def _ctx() -> DomainContext:
    return DomainContext(
        trace_id=TraceId.new(),
        mutation_id=MutationId.new(),
        event_source="test",
        action_timestamp=Timestamp.from_unix_timestamp(0),
        _context_str="test",
    )


def _image(*, size_in_bytes: int, width: int, height: int) -> Image:
    return Image.new_image(
        _ctx(),
        image_domain_ref_id=EntityId("1"),
        owner=EntityLink.std("User", EntityId("2")),
        purpose=ImagePurpose.AVATARS,
        store_path=ImagePath("abc123.webp"),
        content_hash=ImageContentHash.from_content(b"a picture"),
        size_in_bytes=size_in_bytes,
        width=width,
        height=height,
        source=ImageSource.UPLOADED,
    )


def test_decent_sizes_are_accepted() -> None:
    image = _image(size_in_bytes=1024, width=256, height=256)
    assert (image.size_in_bytes, image.width, image.height) == (1024, 256, 256)

    at_the_bounds = _image(
        size_in_bytes=MAX_IMAGE_SIZE_IN_BYTES,
        width=MAX_IMAGE_PIXELS,
        height=1,
    )
    assert at_the_bounds.width * at_the_bounds.height == MAX_IMAGE_PIXELS


@pytest.mark.parametrize(
    "overrides",
    [
        {"size_in_bytes": 0},
        {"size_in_bytes": -1},
        {"size_in_bytes": MAX_IMAGE_SIZE_IN_BYTES + 1},
        {"width": 0},
        {"width": -1},
        {"height": 0},
        {"height": -256},
        {"width": MAX_IMAGE_PIXELS + 1, "height": 1},
        {"width": 8000, "height": 8000},
    ],
)
def test_undecent_sizes_are_rejected(overrides: dict[str, int]) -> None:
    sizes: dict[str, int] = {"size_in_bytes": 1024, "width": 256, "height": 256}
    sizes.update(overrides)
    with pytest.raises(InputValidationError):
        _image(**sizes)
