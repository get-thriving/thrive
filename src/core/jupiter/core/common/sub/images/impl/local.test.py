"""Tests for the local image store."""

import asyncio
from pathlib import Path

import pytest
from jupiter.core.common.sub.images.image_store import ImageNotFoundError
from jupiter.core.common.sub.images.impl.local import LocalImageStore
from jupiter.core.common.sub.images.sub.image.image_content_type import ImageContentType
from jupiter.core.common.sub.images.sub.image.image_path import ImagePath
from jupiter.core.common.sub.images.sub.image.image_purpose import ImagePurpose
from jupiter.core.common.sub.images.sub.image.stored_image import StoredImage
from jupiter.core.instance import Instance

_IMAGE = StoredImage(b"not really a webp", ImageContentType.WEBP)


def _list_paths(store: LocalImageStore) -> set[str]:
    async def collect() -> set[str]:
        return {
            info.path.the_path async for info in store.list_images(ImagePurpose.AVATARS)
        }

    return asyncio.run(collect())


def test_put_then_load(tmp_path: Path) -> None:
    store = LocalImageStore(tmp_path, Instance("Main"))
    path = ImagePath("abc.webp")

    asyncio.run(store.put(ImagePurpose.AVATARS, path, _IMAGE))

    assert asyncio.run(store.load(ImagePurpose.AVATARS, path)) == _IMAGE
    assert (tmp_path / "avatars" / "Main" / "abc.webp").read_bytes() == _IMAGE.content


def test_put_replaces_and_leaves_no_temp_files(tmp_path: Path) -> None:
    store = LocalImageStore(tmp_path, Instance("Main"))
    path = ImagePath("abc.webp")

    asyncio.run(store.put(ImagePurpose.AVATARS, path, _IMAGE))
    asyncio.run(
        store.put(
            ImagePurpose.AVATARS, path, StoredImage(b"newer", ImageContentType.WEBP)
        )
    )

    assert asyncio.run(store.load(ImagePurpose.AVATARS, path)).content == b"newer"
    assert [f.name for f in (tmp_path / "avatars" / "Main").iterdir()] == ["abc.webp"]


def test_load_missing_image(tmp_path: Path) -> None:
    store = LocalImageStore(tmp_path, Instance("Main"))
    with pytest.raises(ImageNotFoundError):
        asyncio.run(store.load(ImagePurpose.AVATARS, ImagePath("nope.webp")))


def test_load_when_a_directory_is_in_the_way(tmp_path: Path) -> None:
    store = LocalImageStore(tmp_path, Instance("Main"))
    asyncio.run(store.put(ImagePurpose.AVATARS, ImagePath("a.webp"), _IMAGE))
    with pytest.raises(ImageNotFoundError):
        asyncio.run(store.load(ImagePurpose.AVATARS, ImagePath("a.webp/b.webp")))


def test_remove_is_idempotent(tmp_path: Path) -> None:
    store = LocalImageStore(tmp_path, Instance("Main"))
    path = ImagePath("abc.webp")
    asyncio.run(store.put(ImagePurpose.AVATARS, path, _IMAGE))

    asyncio.run(store.remove(ImagePurpose.AVATARS, path))
    asyncio.run(store.remove(ImagePurpose.AVATARS, path))

    with pytest.raises(ImageNotFoundError):
        asyncio.run(store.load(ImagePurpose.AVATARS, path))


def test_list_images(tmp_path: Path) -> None:
    store = LocalImageStore(tmp_path, Instance("Main"))
    asyncio.run(store.put(ImagePurpose.AVATARS, ImagePath("one.webp"), _IMAGE))
    asyncio.run(store.put(ImagePurpose.AVATARS, ImagePath("dir/two.webp"), _IMAGE))
    # An upload in flight, and something that was never ours.
    (tmp_path / "avatars" / "Main" / ".partial.tmp").write_bytes(b"x")
    (tmp_path / "avatars" / "Main" / "README.txt").write_bytes(b"x")

    assert _list_paths(store) == {"one.webp", "dir/two.webp"}


def test_list_images_reports_size_and_time(tmp_path: Path) -> None:
    store = LocalImageStore(tmp_path, Instance("Main"))
    asyncio.run(store.put(ImagePurpose.AVATARS, ImagePath("one.webp"), _IMAGE))

    async def collect() -> list:
        return [info async for info in store.list_images(ImagePurpose.AVATARS)]

    (info,) = asyncio.run(collect())
    assert info.size_in_bytes == len(_IMAGE.content)
    assert info.created_time.the_ts.year >= 2026


def test_list_images_of_an_empty_store(tmp_path: Path) -> None:
    assert _list_paths(LocalImageStore(tmp_path, Instance("Main"))) == set()


def test_instances_do_not_see_each_other(tmp_path: Path) -> None:
    main = LocalImageStore(tmp_path, Instance("Main"))
    preview = LocalImageStore(tmp_path, Instance("some-branch"))
    path = ImagePath("abc.webp")

    asyncio.run(main.put(ImagePurpose.AVATARS, path, _IMAGE))

    with pytest.raises(ImageNotFoundError):
        asyncio.run(preview.load(ImagePurpose.AVATARS, path))
    assert _list_paths(preview) == set()
    assert _list_paths(main) == {"abc.webp"}


def test_a_symlink_cant_lead_out_of_the_store(tmp_path: Path) -> None:
    store = LocalImageStore(tmp_path / "root", Instance("Main"))
    asyncio.run(store.put(ImagePurpose.AVATARS, ImagePath("abc.webp"), _IMAGE))
    outside = tmp_path / "outside"
    outside.mkdir()
    (outside / "secret.webp").write_bytes(b"secret")
    (tmp_path / "root" / "avatars" / "Main" / "link").symlink_to(outside)

    with pytest.raises(ValueError, match="leads out of the store"):
        asyncio.run(store.load(ImagePurpose.AVATARS, ImagePath("link/secret.webp")))
    with pytest.raises(ValueError, match="leads out of the store"):
        asyncio.run(store.put(ImagePurpose.AVATARS, ImagePath("link/new.webp"), _IMAGE))
    assert not (outside / "new.webp").exists()


def test_serving_link_goes_through_the_webui(tmp_path: Path) -> None:
    store = LocalImageStore(tmp_path, Instance("Main"))

    link = asyncio.run(
        store.get_serving_link(ImagePurpose.AVATARS, ImagePath("abc.webp"))
    )

    assert str(link.url) == "/images/avatars/abc.webp"
    assert link.url.is_relative
    assert link.expires_at is None
