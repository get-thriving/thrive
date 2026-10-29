"""Tests for the image store properties."""

from pathlib import Path

import pytest
from jupiter.core.backend_blend import JupiterWebApiImageStore
from jupiter.core.images.store.image_purpose import ImagePurpose
from jupiter.core.images.store.image_store_properties import ImageStoreProperties

_VARS = [
    "WEBAPI_IMAGE_STORE",
    "IMAGE_STORE_LOCAL_ROOT",
    "IMAGE_STORE_GCS_CREDENTIALS",
    "IMAGE_STORE_GCS_AVATARS_BUCKET",
    "IMAGE_STORE_GCS_AVATARS_PUBLIC_BASE_URL",
]


@pytest.fixture(autouse=True)
def _clean_env(monkeypatch: pytest.MonkeyPatch) -> None:
    for var in _VARS:
        monkeypatch.delenv(var, raising=False)


def test_defaults_to_a_local_store(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    monkeypatch.chdir(tmp_path)
    properties = ImageStoreProperties.from_env()
    assert properties.backend == JupiterWebApiImageStore.LOCAL
    assert properties.local_root == (tmp_path / "images").resolve()
    assert properties.gcs_buckets == {}


def test_local_root_can_be_set(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.setenv("WEBAPI_IMAGE_STORE", "local")
    monkeypatch.setenv("IMAGE_STORE_LOCAL_ROOT", str(tmp_path / "somewhere"))
    properties = ImageStoreProperties.from_env()
    assert properties.local_root == (tmp_path / "somewhere").resolve()


def test_gcs_needs_credentials(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("WEBAPI_IMAGE_STORE", "gcs")
    monkeypatch.setenv("IMAGE_STORE_GCS_AVATARS_BUCKET", "a-bucket")
    with pytest.raises(Exception, match="IMAGE_STORE_GCS_CREDENTIALS"):
        ImageStoreProperties.from_env()


def test_gcs_needs_a_bucket_per_purpose(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("WEBAPI_IMAGE_STORE", "gcs")
    monkeypatch.setenv("IMAGE_STORE_GCS_CREDENTIALS", "{}")
    with pytest.raises(Exception, match="IMAGE_STORE_GCS_AVATARS_BUCKET"):
        ImageStoreProperties.from_env()


def test_gcs_settings(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("WEBAPI_IMAGE_STORE", "gcs")
    monkeypatch.setenv("IMAGE_STORE_GCS_CREDENTIALS", '{"type": "service_account"}')
    monkeypatch.setenv("IMAGE_STORE_GCS_AVATARS_BUCKET", "thrive-staging-avatars")
    properties = ImageStoreProperties.from_env()
    assert properties.backend == JupiterWebApiImageStore.GCS
    bucket = properties.gcs_buckets[ImagePurpose.AVATARS]
    assert bucket.name == "thrive-staging-avatars"
    assert bucket.public_base_url == ""


def test_credentials_stay_out_of_the_repr(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("WEBAPI_IMAGE_STORE", "gcs")
    monkeypatch.setenv("IMAGE_STORE_GCS_CREDENTIALS", "super-secret-key-material")
    monkeypatch.setenv("IMAGE_STORE_GCS_AVATARS_BUCKET", "thrive-staging-avatars")
    assert "super-secret-key-material" not in repr(ImageStoreProperties.from_env())


def test_unknown_store_is_rejected(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("WEBAPI_IMAGE_STORE", "s3")
    with pytest.raises(ValueError, match="s3"):
        ImageStoreProperties.from_env()
