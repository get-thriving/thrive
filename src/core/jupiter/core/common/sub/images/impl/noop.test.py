"""Tests for the no-op image store."""

import asyncio

import pytest
from jupiter.core.common.sub.images.impl.noop import NoOpImageStore
from jupiter.core.common.sub.images.sub.image.image_content_type import ImageContentType
from jupiter.core.common.sub.images.sub.image.image_path import ImagePath
from jupiter.core.common.sub.images.sub.image.image_purpose import ImagePurpose
from jupiter.core.common.sub.images.sub.image.stored_image import StoredImage

_PATH = ImagePath("abc.webp")


def test_put_throws() -> None:
    image = StoredImage(b"not really a webp", ImageContentType.WEBP)
    with pytest.raises(Exception, match="no image store"):
        asyncio.run(NoOpImageStore().put(ImagePurpose.AVATARS, _PATH, image))


def test_load_throws() -> None:
    with pytest.raises(Exception, match="no image store"):
        asyncio.run(NoOpImageStore().load(ImagePurpose.AVATARS, _PATH))


def test_remove_throws() -> None:
    with pytest.raises(Exception, match="no image store"):
        asyncio.run(NoOpImageStore().remove(ImagePurpose.AVATARS, _PATH))


def test_list_images_throws() -> None:
    with pytest.raises(Exception, match="no image store"):
        NoOpImageStore().list_images(ImagePurpose.AVATARS)


def test_get_serving_link_throws() -> None:
    with pytest.raises(Exception, match="no image store"):
        asyncio.run(NoOpImageStore().get_serving_link(ImagePurpose.AVATARS, _PATH))
