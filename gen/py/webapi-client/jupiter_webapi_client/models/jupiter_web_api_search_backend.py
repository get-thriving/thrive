from enum import Enum


class JupiterWebApiSearchBackend(str, Enum):
    ALGOLIA = "algolia"
    SQL = "sql"

    def __str__(self) -> str:
        return str(self.value)
