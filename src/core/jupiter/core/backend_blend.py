"""Backend blend tokens for Jupiter composition (see ADR 0008)."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class JupiterAuthProvider(EnumValue):
    """Authentication backend."""

    LOCAL_GOOGLE_APPLE = "local-google-apple"
    LOCAL = "local"


@enum_value
class JupiterEmailVerificationStrategy(EnumValue):
    """Whether new users must verify email before full access."""

    NONE = "none"
    VERIFY = "verify"


@enum_value
class JupiterCrmBackend(EnumValue):
    """CRM integration."""

    WIX = "wix"
    NOOP = "noop"


@enum_value
class JupiterTelemetry(EnumValue):
    """Telemetry sink."""

    SENTRY = "sentry"
    LOCAL = "local"


@enum_value
class JupiterWebApiStorageEngine(EnumValue):
    """Primary domain persistence engine."""

    SQLITE = "sqlite"
    POSTGRES = "postgres"


@enum_value
class JupiterWebApiEmailSender(EnumValue):
    """Email sender for verification messages."""

    NOOP = "noop"
    RESEND = "resend"


@enum_value
class JupiterWebApiSearchBackend(EnumValue):
    """Search query / document storage engine."""

    SQL = "sql"
    ALGOLIA = "algolia"
