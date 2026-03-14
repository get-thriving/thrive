from enum import Enum


class AppDistribution(str, Enum):
    API = "api"
    APP_STORE = "app-store"
    GOOGLE_PLAY_STORE = "google-play-store"
    MAC_STORE = "mac-store"
    MAC_WEB = "mac-web"
    MCP = "mcp"
    WEB = "web"

    def __str__(self) -> str:
        return str(self.value)
