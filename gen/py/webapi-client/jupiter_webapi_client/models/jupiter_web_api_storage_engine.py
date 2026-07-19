from enum import Enum


class JupiterWebApiStorageEngine(str, Enum):
    POSTGRES = "postgres"
    REMOTE_POSTGRES = "remote-postgres"
    SQLITE = "sqlite"

    def __str__(self) -> str:
        return str(self.value)
