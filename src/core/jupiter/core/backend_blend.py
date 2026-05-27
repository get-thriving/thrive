"""Backend blend tokens for WebAPI composition (see ADR 0008)."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class JupiterWebApiStorageEngine(EnumValue):
    """Primary domain persistence engine."""

    SQLITE = "sqlite"
    POSTGRES = "postgres"


@enum_value
class JupiterWebApiTelemetry(EnumValue):
    """Telemetry sink."""

    SENTRY = "sentry"
    LOCAL = "local"


@enum_value
class JupiterWebApiSearchBackend(EnumValue):
    """Search query / document storage engine."""

    SQL = "sql"
    ALGOLIA = "algolia"


@enum_value
class JupiterWebApiCrmBackend(EnumValue):
    """CRM integration."""

    WIX = "wix"
    NOOP = "noop"
