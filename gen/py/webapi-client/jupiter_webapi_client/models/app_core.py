from enum import Enum


class AppCore(str, Enum):
    API = "api"
    CLI = "cli"
    MCP = "mcp"
    PUBLISHED = "published"
    WEBUI = "webui"

    def __str__(self) -> str:
        return str(self.value)
