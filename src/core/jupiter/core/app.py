"""A client facing application."""

import re

from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, EnumValue, enum_value, value

_USE_CASE_CLASS_SUFFIX = "UseCase"
_CAMEL_CASE_COMPONENT_RE = re.compile(r"^[A-Z][A-Za-z0-9]*$")
_APP_COMPONENT_NAME = "App"


@value
class AppComponent(AtomicValue[str]):
    """The component of the app."""

    the_component: str

    def _validate(self) -> None:
        """Validate this component name."""
        if self.the_component == _APP_COMPONENT_NAME:
            return
        if not _CAMEL_CASE_COMPONENT_RE.match(self.the_component):
            raise InputValidationError(
                f"Invalid app component: {self.the_component!r} "
                "(expected CamelCase or App)"
            )

    @staticmethod
    def app() -> "AppComponent":
        """The interactive app component."""
        return AppComponent(_APP_COMPONENT_NAME)

    @staticmethod
    def from_use_case_class_name(use_case_class_name: str) -> "AppComponent":
        """Build a cron component from a use case class name."""
        if not use_case_class_name.endswith(_USE_CASE_CLASS_SUFFIX):
            raise InputValidationError(
                f"Use case class name must end with {_USE_CASE_CLASS_SUFFIX!r} "
                f"but was {use_case_class_name!r}"
            )
        return AppComponent(
            use_case_class_name[: -len(_USE_CASE_CLASS_SUFFIX)],
        )

    def is_app(self) -> bool:
        """Whether this is the interactive app component."""
        return self.the_component == _APP_COMPONENT_NAME

    @property
    def value(self) -> str:
        """The string value of this component."""
        return self.the_component

    def __str__(self) -> str:
        """Transform this to a string version."""
        return self.the_component


class AppComponentDatabaseEncoder(PrimitiveAtomicValueDatabaseEncoder[AppComponent]):
    """Encode to a database primitive."""

    def to_primitive(self, value: AppComponent) -> Primitive:
        """Encode to a database primitive."""
        return value.the_component


class AppComponentDatabaseDecoder(PrimitiveAtomicValueDatabaseDecoder[AppComponent]):
    """Decode from a database primitive."""

    def from_raw_str(self, value: str) -> AppComponent:
        """Decode from a raw string."""
        return AppComponent(value.strip())


@enum_value
class AppCore(EnumValue):
    """A client facing application."""

    CLI = "cli"
    WEBUI = "webui"
    PUBLISHED = "published"
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
