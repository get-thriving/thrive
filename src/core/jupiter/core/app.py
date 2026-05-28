"""A client facing application."""

import re

from jupiter.framework.errors import InputValidationError
from jupiter.framework.value import AtomicValue, EnumValue, enum_value, value


@enum_value
class AppComponent(EnumValue):
    """The component of the app."""

    _OLD_WEB = "web"
    _OLD_CLI = "cli"
    APP = "app"
    GC_CRON = "gc-cron"
    GEN_CRON = "gen-cron"
    STATS_CRON = "stats-cron"
    SCHEDULE_EXTERNAL_SYNC_CRON = "schedule-external-sync-cron"
    SEARCH_INDEX_BACKFILL = "search-index-backfill"
    SEARCH_MUTATION_LOG_DRAIN = "search-mutation-log-drain"
    SEARCH_MUTATION_REQUEUE = "search-mutation-requeue"


@enum_value
class AppCore(EnumValue):
    """A client facing application."""

    CLI = "cli"
    WEBUI = "webui"
    API = "api"
    MCP = "mcp"


@enum_value
class AppShell(EnumValue):
    """A shell that wraps a given app."""

    CLI = "cli"
    BROWSER = "browser"
    DESKTOP_ELECTRON = "desktop-electron"
    MOBILE_CAPACITOR = "mobile-capacitor"
    PWA = "pwa"
    API = "api"
    MCP = "mcp"


@enum_value
class AppPlatform(EnumValue):
    """The platform on which the app is running."""

    DESKTOP_MACOS = "desktop-macos"
    MOBILE_IOS = "mobile-ios"
    MOBILE_ANDROID = "mobile-android"
    TABLET_IOS = "tablet-ios"
    TABLET_ANDROID = "tablet-android"
    API = "api"
    MCP = "mcp"


@enum_value
class AppDistribution(EnumValue):
    """The distribution channel of the app."""

    WEB = "web"
    MAC_WEB = "mac-web"
    MAC_STORE = "mac-store"
    APP_STORE = "app-store"
    GOOGLE_PLAY_STORE = "google-play-store"
    API = "api"
    MCP = "mcp"


@enum_value
class AppDistributionState(EnumValue):
    """The distribution state of the app."""

    READY = "ready"
    IN_REVIEW = "in-review"
    NOT_AVAILABLE = "not-available"


_VERSION_RE = re.compile(r"^(\d+)\.(\d+)\.(\d+)$")


@value
class AppVersion(AtomicValue[str]):
    """The version of the app."""

    the_version: str

    def _validate(self) -> None:
        """Validate this version."""
        match = _VERSION_RE.match(self.the_version)
        if match is None:
            raise InputValidationError(f"Invalid version: {self.the_version}")

    def __str__(self) -> str:
        """Transform this to a string version."""
        return self.the_version

    @property
    def major_version(self) -> int:
        """Get the major version."""
        return int(self.the_version.split(".")[0])
