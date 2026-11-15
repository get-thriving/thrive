"""Tiny templating for the screenshots config.

Strings may contain ``{{ expression }}`` pieces. A string that is exactly one
expression keeps the type of the result (so ``"{{ i * 2 }}"`` is an int); any
other string has the pieces substituted as text. The expressions are
evaluated with a small fixed namespace, see ``Context.namespace``. The config
is checked into the repository and run by developers, which is the reason a
restricted ``eval`` is fine here.
"""

import datetime as dt
import re
from typing import Any
from zoneinfo import ZoneInfo

_EXPRESSION = re.compile(r"\{\{(.*?)\}\}", re.S)


class Context:
    """What the expressions in the config can see."""

    def __init__(self, today: dt.date | None = None, timezone: str = "UTC") -> None:
        """Start with no saved references, on the given day (today by default)."""
        self.today = today or dt.datetime.now().astimezone().date()
        self.timezone = timezone
        self.refs: dict[str, Any] = {}
        self.variables: dict[str, Any] = {}

    def day(self, offset: int = 0) -> str:
        """An ISO date, offset days from today."""
        return (self.today + dt.timedelta(days=offset)).isoformat()

    def pdate(self, offset: int = 0) -> str:
        """A day as a life plan partial date, offset days from today."""
        date = self.today + dt.timedelta(days=offset)
        return f"absolute-year-month-day {date.year} {date.month} {date.day}"

    def weekday(self, offset: int = 0) -> int:
        """The day of the week, 0 for Monday, of the day offset days from today."""
        return (self.today + dt.timedelta(days=offset)).weekday()

    def utc(self, local_time: str, offset: int = 0) -> str:
        """A wall clock time of the demo user, as the UTC time the WebAPI takes for events."""
        hours, minutes = (int(part) for part in local_time.split(":"))
        local = dt.datetime.combine(
            self.today + dt.timedelta(days=offset),
            dt.time(hours, minutes),
            tzinfo=ZoneInfo(self.timezone),
        )
        return local.astimezone(dt.UTC).strftime("%H:%M")

    def shortdate(self, offset: int = 0) -> str:
        """A day as day and month name (``20 Nov``), offset days from today."""
        date = self.today + dt.timedelta(days=offset)
        return f"{date.day} {date.strftime('%b')}"

    def ref(self, name: str) -> Any:
        """The id (or list of ids) saved under a name by an earlier step."""
        if name not in self.refs:
            raise KeyError(f"No saved reference called {name!r}")
        return self.refs[name]

    def namespace(self) -> dict[str, Any]:
        """The names available inside ``{{ }}``."""
        return {
            "day": self.day,
            "pdate": self.pdate,
            "shortdate": self.shortdate,
            "weekday": self.weekday,
            "utc": self.utc,
            "ref": self.ref,
            "round": round,
            "min": min,
            "max": max,
            "len": len,
            "range": range,
            "list": list,
            "enumerate": enumerate,
            "zip": zip,
            "str": str,
            "int": int,
            "float": float,
            **self.variables,
        }

    def evaluate(self, expression: str) -> Any:
        """Evaluate a single expression."""
        return eval(  # nosec B307
            expression.strip(),
            {"__builtins__": {}, **self.namespace()},
        )

    def render(self, value: Any) -> Any:
        """Render every string inside a nested value."""
        if isinstance(value, str):
            whole = _EXPRESSION.fullmatch(value.strip())
            if whole is not None:
                return self.evaluate(whole.group(1))
            return _EXPRESSION.sub(lambda m: str(self.evaluate(m.group(1))), value)
        if isinstance(value, dict):
            return {key: self.render(item) for key, item in value.items()}
        if isinstance(value, list):
            return [self.render(item) for item in value]
        return value
