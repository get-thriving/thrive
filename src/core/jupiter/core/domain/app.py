"""A client facing application."""

from jupiter.framework_new.value import AtomicValue, EnumValue, enum_value, value


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


@value
class AppVersion(AtomicValue[str]):
    """The version of the app."""

    the_version: str

    def __str__(self) -> str:
        """Transform this to a string version."""
        return self.the_version


@enum_value
class AppCore(EnumValue):
    """A client facing application."""

    CLI = "cli"
    WEBUI = "webui"


@enum_value
class AppShell(EnumValue):
    """A shell that wraps a given app."""

    CLI = "cli"
    BROWSER = "browser"
    DESKTOP_ELECTRON = "desktop-electron"
    MOBILE_CAPACITOR = "mobile-capacitor"
    PWA = "pwa"


@enum_value
class AppPlatform(EnumValue):
    """The platform on which the app is running."""

    DESKTOP_MACOS = "desktop-macos"
    MOBILE_IOS = "mobile-ios"
    MOBILE_ANDROID = "mobile-android"
    TABLET_IOS = "tablet-ios"
    TABLET_ANDROID = "tablet-android"


@enum_value
class AppDistribution(EnumValue):
    """The distribution channel of the app."""

    WEB = "web"
    MAC_WEB = "mac-web"
    MAC_STORE = "mac-store"
    APP_STORE = "app-store"
    GOOGLE_PLAY_STORE = "google-play-store"


@enum_value
class AppDistributionState(EnumValue):
    """The distribution state of the app."""

    READY = "ready"
    IN_REVIEW = "in-review"
    NOT_AVAILABLE = "not-available"
