"""Cron process execution mode.

Set ``WEBAPI_CRON_EXECUTION_MODE`` to ``start-run-stop`` (Render) or ``run-forever`` (PM2, Compose).
"""

import enum


class CronExecutionMode(enum.Enum):
    """How the cron process runs after startup."""

    START_RUN_STOP = "start-run-stop"
    """Start, run the use case once, then exit."""

    RUN_FOREVER = "run-forever"
    """Start and keep running the use case on its crontab (in-process scheduler)."""
