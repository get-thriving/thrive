from enum import StrEnum


class JupiterWebApiImageStore(StrEnum):
    GCS = "gcs"
    LOCAL = "local"

    def __str__(self) -> str:
        return str(self.value)
