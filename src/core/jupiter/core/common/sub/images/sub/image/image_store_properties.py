"""The settings that decide which image store to build, and how."""

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Final, cast

from jupiter.core.backend_blend import JupiterWebApiImageStore
from jupiter.core.common.sub.images.impl.gcs import GcsImageBucket
from jupiter.core.common.sub.images.sub.image.image_purpose import ImagePurpose

_DEFAULT_LOCAL_ROOT: Final[str] = "images"


@dataclass(frozen=True)
class ImageStoreProperties:
    """The settings that decide which image store to build, and how.

    ``WEBAPI_IMAGE_STORE`` picks the store (ADR 0008), and the rest is what the
    chosen one needs (ADR 0018): a directory for ``local``, and credentials and
    a bucket per purpose for ``gcs``. Only the settings of the chosen store are
    checked, so a local setup needs none of the Google ones.
    """

    backend: JupiterWebApiImageStore
    local_root: Path
    # A service account key, as JSON. A secret, so kept out of reprs and logs.
    gcs_credentials: str = field(repr=False)
    gcs_buckets: dict[ImagePurpose, GcsImageBucket]

    @staticmethod
    def local_root_from_env() -> Path:
        """Read where the local store keeps its images from the environment."""
        local_root = Path(os.getenv("IMAGE_STORE_LOCAL_ROOT", _DEFAULT_LOCAL_ROOT))
        return local_root.resolve()

    @staticmethod
    def from_env() -> "ImageStoreProperties":
        """Read the settings from the environment."""
        backend = JupiterWebApiImageStore(os.getenv("WEBAPI_IMAGE_STORE", "local"))
        gcs_credentials = cast(str, os.getenv("IMAGE_STORE_GCS_CREDENTIALS", ""))
        gcs_buckets: dict[ImagePurpose, GcsImageBucket] = {}

        if backend == JupiterWebApiImageStore.GCS:
            if not gcs_credentials:
                raise Exception(
                    "IMAGE_STORE_GCS_CREDENTIALS is required when WEBAPI_IMAGE_STORE=gcs"
                )
            for purpose in ImagePurpose:
                bucket_var = f"IMAGE_STORE_GCS_{purpose.name}_BUCKET"
                bucket_name = os.getenv(bucket_var, "")
                if not bucket_name:
                    raise Exception(
                        f"{bucket_var} is required when WEBAPI_IMAGE_STORE=gcs"
                    )
                gcs_buckets[purpose] = GcsImageBucket(
                    name=bucket_name,
                    public_base_url=os.getenv(
                        f"IMAGE_STORE_GCS_{purpose.name}_PUBLIC_BASE_URL", ""
                    ),
                )

        return ImageStoreProperties(
            backend=backend,
            local_root=ImageStoreProperties.local_root_from_env(),
            gcs_credentials=gcs_credentials,
            gcs_buckets=gcs_buckets,
        )
