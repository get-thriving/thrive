"""Tests for the Google Cloud Storage image store."""

import asyncio
from collections.abc import Iterator
from datetime import UTC, datetime
from typing import Any, cast

import pytest
from google.api_core.exceptions import NotFound
from google.cloud import storage
from jupiter.core.common.sub.images.image_store import ImageNotFoundError
from jupiter.core.common.sub.images.impl.gcs import (
    GcsImageBucket,
    GcsImageStore,
)
from jupiter.core.common.sub.images.sub.image.image_content_type import ImageContentType
from jupiter.core.common.sub.images.sub.image.image_path import ImagePath
from jupiter.core.common.sub.images.sub.image.image_purpose import ImagePurpose
from jupiter.core.common.sub.images.sub.image.stored_image import StoredImage
from jupiter.core.instance import Instance

_IMAGE = StoredImage(b"not really a webp", ImageContentType.WEBP)
_BUCKET = "jupiter-thrive-staging-avatars"


class _FakeObject:
    def __init__(self, content: bytes, content_type: str, cache_control: str | None):
        self.content = content
        self.content_type = content_type
        self.cache_control = cache_control
        self.time_created = datetime(2026, 10, 1, 12, 30, tzinfo=UTC)


class _FakeBlob:
    def __init__(
        self, objects: dict[tuple[str, str], _FakeObject], key: tuple[str, str]
    ):
        self._objects = objects
        self._key = key
        self.cache_control: str | None = None

    @property
    def name(self) -> str:
        return self._key[1]

    @property
    def size(self) -> int:
        return len(self._objects[self._key].content)

    @property
    def time_created(self) -> datetime:
        return self._objects[self._key].time_created

    def upload_from_string(self, data: bytes, content_type: str) -> None:
        self._objects[self._key] = _FakeObject(data, content_type, self.cache_control)

    def download_as_bytes(self) -> bytes:
        if self._key not in self._objects:
            raise NotFound("no such object")
        return self._objects[self._key].content

    def delete(self) -> None:
        if self._key not in self._objects:
            raise NotFound("no such object")
        del self._objects[self._key]


class _FakeBucket:
    def __init__(self, objects: dict[tuple[str, str], _FakeObject], name: str):
        self._objects = objects
        self._name = name

    def blob(self, blob_name: str) -> _FakeBlob:
        return _FakeBlob(self._objects, (self._name, blob_name))


class _FakeClient:
    """Just enough of the storage client, with objects held in memory."""

    def __init__(self) -> None:
        self.objects: dict[tuple[str, str], _FakeObject] = {}

    def bucket(self, bucket_name: str) -> _FakeBucket:
        return _FakeBucket(self.objects, bucket_name)

    def list_blobs(self, bucket_name: str, prefix: str) -> Iterator[_FakeBlob]:
        return iter(
            [
                _FakeBlob(self.objects, key)
                for key in sorted(self.objects)
                if key[0] == bucket_name and key[1].startswith(prefix)
            ]
        )


def _store(
    client: _FakeClient,
    instance: str = "Main",
    public_base_url: str = "",
) -> GcsImageStore:
    return GcsImageStore(
        cast(storage.Client, client),
        {ImagePurpose.AVATARS: GcsImageBucket(_BUCKET, public_base_url)},
        Instance(instance),
    )


def _list_paths(store: GcsImageStore) -> set[str]:
    async def collect() -> set[str]:
        return {
            info.path.the_path async for info in store.list_images(ImagePurpose.AVATARS)
        }

    return asyncio.run(collect())


def test_put_stores_a_cacheable_object_under_the_instance() -> None:
    client = _FakeClient()
    asyncio.run(_store(client).put(ImagePurpose.AVATARS, ImagePath("abc.webp"), _IMAGE))

    stored = client.objects[(_BUCKET, "Main/abc.webp")]
    assert stored.content == _IMAGE.content
    assert stored.content_type == "image/webp"
    assert stored.cache_control == "public, max-age=31536000, immutable"


def test_put_then_load() -> None:
    store = _store(_FakeClient())
    path = ImagePath("abc.webp")

    asyncio.run(store.put(ImagePurpose.AVATARS, path, _IMAGE))

    assert asyncio.run(store.load(ImagePurpose.AVATARS, path)) == _IMAGE


def test_load_missing_image() -> None:
    with pytest.raises(ImageNotFoundError):
        asyncio.run(
            _store(_FakeClient()).load(ImagePurpose.AVATARS, ImagePath("a.webp"))
        )


def test_remove_is_idempotent() -> None:
    client = _FakeClient()
    store = _store(client)
    path = ImagePath("abc.webp")
    asyncio.run(store.put(ImagePurpose.AVATARS, path, _IMAGE))

    asyncio.run(store.remove(ImagePurpose.AVATARS, path))
    asyncio.run(store.remove(ImagePurpose.AVATARS, path))

    assert client.objects == {}


def test_list_images_only_sees_its_own_instance() -> None:
    client = _FakeClient()
    main = _store(client, "Main")
    preview = _store(client, "some-branch")
    asyncio.run(main.put(ImagePurpose.AVATARS, ImagePath("one.webp"), _IMAGE))
    asyncio.run(main.put(ImagePurpose.AVATARS, ImagePath("two.webp"), _IMAGE))
    asyncio.run(preview.put(ImagePurpose.AVATARS, ImagePath("three.webp"), _IMAGE))

    assert _list_paths(main) == {"one.webp", "two.webp"}
    assert _list_paths(preview) == {"three.webp"}


def test_a_prefix_is_not_a_namespace() -> None:
    # 'Main2' starts with 'Main', but isn't the same instance. Without the
    # slash in the listing prefix, its '2/a.webp' would look like Main's.
    client = _FakeClient()
    asyncio.run(
        _store(client, "Main2").put(ImagePurpose.AVATARS, ImagePath("a.webp"), _IMAGE)
    )

    assert _list_paths(_store(client, "Main")) == set()


def test_list_images_skips_objects_it_does_not_understand() -> None:
    client = _FakeClient()
    store = _store(client)
    asyncio.run(store.put(ImagePurpose.AVATARS, ImagePath("one.webp"), _IMAGE))
    client.objects[(_BUCKET, "Main/")] = _FakeObject(b"", "text/plain", None)
    client.objects[(_BUCKET, "Main/notes.txt")] = _FakeObject(b"x", "text/plain", None)

    assert _list_paths(store) == {"one.webp"}


def test_list_images_reports_size_and_time() -> None:
    store = _store(_FakeClient())
    asyncio.run(store.put(ImagePurpose.AVATARS, ImagePath("one.webp"), _IMAGE))

    async def collect() -> list[Any]:
        return [info async for info in store.list_images(ImagePurpose.AVATARS)]

    (info,) = asyncio.run(collect())
    assert info.size_in_bytes == len(_IMAGE.content)
    assert info.created_time.the_ts.year == 2026
    assert info.created_time.the_ts.hour == 12


def test_serving_link_is_the_public_bucket_url() -> None:
    link = asyncio.run(
        _store(_FakeClient()).get_serving_link(
            ImagePurpose.AVATARS, ImagePath("abc.webp")
        )
    )

    assert str(link.url) == f"https://storage.googleapis.com/{_BUCKET}/Main/abc.webp"
    assert not link.url.is_relative
    assert link.expires_at is None


def test_serving_link_can_use_another_domain() -> None:
    store = _store(_FakeClient(), public_base_url="https://images.example.com/")

    link = asyncio.run(
        store.get_serving_link(ImagePurpose.AVATARS, ImagePath("abc.webp"))
    )

    assert str(link.url) == "https://images.example.com/Main/abc.webp"


def test_a_purpose_without_a_bucket_is_an_error() -> None:
    store = GcsImageStore(cast(storage.Client, _FakeClient()), {}, Instance("Main"))
    with pytest.raises(ValueError, match="No bucket configured"):
        asyncio.run(store.put(ImagePurpose.AVATARS, ImagePath("abc.webp"), _IMAGE))
