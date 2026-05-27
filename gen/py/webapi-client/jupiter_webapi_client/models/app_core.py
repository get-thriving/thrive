from enum import Enum


class AppCore(str, Enum):
    API = "api"
    CLI = "cli"
    MCP = "mcp"
    WEBUI = "webui"

    def __str__(self) -> str:
        return str(self.value)
