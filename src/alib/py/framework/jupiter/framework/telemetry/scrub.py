"""Removing anything secret from telemetry payloads before it leaves the process.

Nothing we deliberately attach is a secret, so in the normal case this finds
nothing. It exists for the cases we did not think of - a header the SDK picked
up, a repr that embedded a connection string, an exception that quoted its own
arguments.
"""

from typing import Final

SCRUBBED: Final[str] = "[scrubbed]"

_SECRET_KEY_MARKERS: Final[tuple[str, ...]] = (
    "api_key",
    "apikey",
    "authorization",
    "cookie",
    "credential",
    "dsn",
    "passwd",
    "password",
    "private_key",
    "secret",
    "session",
    "token",
)

_MAX_DEPTH: Final[int] = 8


def is_secret_key(key: str) -> bool:
    """Whether a key's name suggests its value should never leave the process."""
    lowered = key.lower()
    return any(marker in lowered for marker in _SECRET_KEY_MARKERS)


def scrub_value(value: object, depth: int = 0) -> object:
    """Replace the value of every secret-looking key, however deeply nested.

    Anything deeper than `_MAX_DEPTH` is replaced wholesale rather than walked:
    an event nested that far is malformed, and a cyclic one would not terminate.
    """
    if depth > _MAX_DEPTH:
        return SCRUBBED

    if isinstance(value, dict):
        return {
            key: (
                SCRUBBED
                if isinstance(key, str) and is_secret_key(key)
                else scrub_value(item, depth + 1)
            )
            for key, item in value.items()
        }

    if isinstance(value, (list, tuple)):
        scrubbed = [scrub_value(item, depth + 1) for item in value]
        return tuple(scrubbed) if isinstance(value, tuple) else scrubbed

    return value


def scrub_event(event: dict[str, object]) -> dict[str, object]:
    """Scrub the parts of an event that can carry values we did not choose."""
    for section in ("extra", "contexts", "request", "tags", "user"):
        if section in event:
            event[section] = scrub_value(event[section])

    breadcrumbs = event.get("breadcrumbs")
    if isinstance(breadcrumbs, dict) and "values" in breadcrumbs:
        breadcrumbs["values"] = scrub_value(breadcrumbs["values"])
    elif isinstance(breadcrumbs, list):
        event["breadcrumbs"] = scrub_value(breadcrumbs)

    return event
