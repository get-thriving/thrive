from enum import StrEnum


class AppCore(StrEnum):
    API = "api"
    CLI = "cli"
    MCP = "mcp"
    PUBLISHED = "published"
    WEBUI = "webui"

    def __str__(self) -> str:
        return str(self.value)
