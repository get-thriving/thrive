from enum import StrEnum


class AppPlatform(StrEnum):
    API = "api"
    DESKTOP_MACOS = "desktop-macos"
    MCP = "mcp"
    MOBILE_ANDROID = "mobile-android"
    MOBILE_IOS = "mobile-ios"
    TABLET_ANDROID = "tablet-android"
    TABLET_IOS = "tablet-ios"

    def __str__(self) -> str:
        return str(self.value)
