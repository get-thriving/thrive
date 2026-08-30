from enum import StrEnum


class JupiterWebApiSearchBackend(StrEnum):
    ALGOLIA = "algolia"
    SQL = "sql"

    def __str__(self) -> str:
        return str(self.value)
