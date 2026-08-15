"""The telemetry provider the running process settled on.

Appforms and framework services receive their `Telemetry` by constructor
injection. `UseCase.execute` is the one place that cannot: it is the chokepoint
that knows the operation and the actor, but threading a parameter there would
mean changing the constructor of every use case in the codebase. It reaches for
the current provider instead, which `Telemetry.prepare` installs at startup.
"""

from typing import Final

from jupiter.framework.telemetry.telemetry import NoOpTelemetry, Telemetry

_NO_OP: Final[Telemetry] = NoOpTelemetry()

_current: Telemetry = _NO_OP


def set_current_telemetry(telemetry: Telemetry) -> None:
    """Install the provider this process reports through."""
    global _current
    _current = telemetry


def current_telemetry() -> Telemetry:
    """The provider this process reports through, or a no-op before startup."""
    return _current
