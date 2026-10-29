"""Tests for building the image store."""

import json
from pathlib import Path

import pytest
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from jupiter.core.backend_blend import JupiterWebApiImageStore
from jupiter.core.images.store.build_image_store import build_image_store
from jupiter.core.images.store.image_purpose import ImagePurpose
from jupiter.core.images.store.image_store_properties import ImageStoreProperties
from jupiter.core.images.store.impl.gcs import GcsImageBucket, GcsImageStore
from jupiter.core.images.store.impl.local import LocalImageStore
from jupiter.core.instance import Instance


def _throwaway_credentials() -> str:
    """A well formed service account key, for nothing: made up on the spot."""
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    pem = key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.PKCS8,
        serialization.NoEncryption(),
    ).decode()
    return json.dumps(
        {
            "type": "service_account",
            "project_id": "not-a-project",
            "private_key_id": "not-a-key",
            "private_key": pem,
            "client_email": "image-store@not-a-project.iam.gserviceaccount.com",
            "client_id": "1",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    )


def test_builds_a_local_store(tmp_path: Path) -> None:
    properties = ImageStoreProperties(
        backend=JupiterWebApiImageStore.LOCAL,
        local_root=tmp_path,
        gcs_credentials="",
        gcs_buckets={},
    )

    assert isinstance(build_image_store(properties, Instance("Main")), LocalImageStore)


def test_builds_a_gcs_store_without_calling_google(tmp_path: Path) -> None:
    properties = ImageStoreProperties(
        backend=JupiterWebApiImageStore.GCS,
        local_root=tmp_path,
        gcs_credentials=_throwaway_credentials(),
        gcs_buckets={ImagePurpose.AVATARS: GcsImageBucket("thrive-staging-avatars")},
    )

    assert isinstance(build_image_store(properties, Instance("Main")), GcsImageStore)


def test_rejects_credentials_that_are_not_json(tmp_path: Path) -> None:
    properties = ImageStoreProperties(
        backend=JupiterWebApiImageStore.GCS,
        local_root=tmp_path,
        gcs_credentials="this is not json",
        gcs_buckets={ImagePurpose.AVATARS: GcsImageBucket("thrive-staging-avatars")},
    )

    with pytest.raises(Exception, match="not valid service account JSON") as error:
        build_image_store(properties, Instance("Main"))
    # The message must not echo the secret back.
    assert "this is not json" not in str(error.value)
