"""Local telemetry provider."""

import logging

from jupiter.framework.telemetry.telemetry import Telemetry
from rich.console import Console
from rich.logging import RichHandler


def prepare_local_logging() -> None:
    """Send the standard library's logging to the console.

    Every provider does this, whatever else it reports to. Without it the root
    logger has no handlers at all, so anything below a warning is dropped and
    the rest goes out through logging's last resort - a bare message, with no
    level, time or logger name - which is as good as invisible in a hosted
    log stream.
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[
            RichHandler(
                console=Console(width=128),
                show_path=False,
                omit_repeated_times=False,
                rich_tracebacks=True,
                markup=True,
                enable_link_path=False,
                log_time_format="%Y-%m-%d %H:%M:%S",
            )
        ],
    )


class LocalTelemetry(Telemetry):
    """Local telemetry provider."""

    def prepare(self) -> None:
        """Prepare the telemetry service."""
        prepare_local_logging()
