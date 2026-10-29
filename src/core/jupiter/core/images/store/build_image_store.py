"""Builds the image store the settings ask for."""

import json

from google.cloud import storage
from jupiter.core.backend_blend import JupiterWebApiImageStore
from jupiter.core.images.store.image_store import ImageStore
from jupiter.core.images.store.image_store_properties import ImageStoreProperties
from jupiter.core.images.store.impl.gcs import GcsImageStore
from jupiter.core.images.store.impl.local import LocalImageStore
from jupiter.core.instance import Instance


def build_image_store(
    properties: ImageStoreProperties, instance: Instance
) -> ImageStore:
    """Build the image store the settings ask for."""
    if properties.backend == JupiterWebApiImageStore.GCS:
        try:
            credentials_info = json.loads(properties.gcs_credentials)
        except json.JSONDecodeError:
            raise Exception(
                "IMAGE_STORE_GCS_CREDENTIALS is not valid service account JSON"
            ) from None
        return GcsImageStore(
            storage.Client.from_service_account_info(credentials_info),
            properties.gcs_buckets,
            instance,
        )
    return LocalImageStore(properties.local_root, instance)
