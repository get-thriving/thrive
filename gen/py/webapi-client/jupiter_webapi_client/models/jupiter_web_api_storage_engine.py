from enum import StrEnum


class JupiterWebApiStorageEngine(StrEnum):
    POSTGRES = "postgres"
    REMOTE_POSTGRES = "remote-postgres"
    SQLITE = "sqlite"

    def __str__(self) -> str:
        return str(self.value)
