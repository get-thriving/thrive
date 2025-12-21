"""A source of time, kept constant across each request."""

from contextvars import ContextVar
from typing import Final

import pendulum
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.timestamp import Timestamp
from pendulum import UTC


class TimeProvider:
    """A source of time, kept constant for the lifetime of this object."""

    _right_now: Final[Timestamp]

    def __init__(self) -> None:
        """Constructor."""
        self._right_now = Timestamp(pendulum.now(tz=UTC))

    def get_current_time(self) -> Timestamp:
        """Get the current time."""
        return self._right_now

    def get_current_date(self) -> ADate:
        """Get the current date."""
        return ADate.from_date(self._right_now.as_date())


_RIGHT_NOW: ContextVar[Timestamp | None] = ContextVar(
    "time_provider_right_now", default=None
)


class PerRequestTimeProvider(TimeProvider):
    """A source of time, kept constant across each request."""

    def set_request_time(self) -> None:
        """Prepare the time provider so that there is a time for the whole request."""
        _RIGHT_NOW.set(Timestamp(pendulum.now(tz=UTC)))

    def get_current_time(self) -> Timestamp:
        """Get the current time."""
        right_now = _RIGHT_NOW.get()
        if right_now is None:
            raise Exception("Invalid time provider state")
        return right_now


class CronRunTimeProvider(TimeProvider):
    """A source of time, to be used in crons, varies across time."""

    def get_current_time(self) -> Timestamp:
        """Get the current time."""
        return Timestamp(pendulum.now(tz=UTC))

    def get_current_date(self) -> ADate:
        """Get the current date."""
        return ADate.from_date(pendulum.today())
