"""Local telemetry provider."""

import logging

from jupiter.framework.telemetry.telemetry import Telemetry
from rich.console import Console
from rich.logging import RichHandler


class LocalTelemetry(Telemetry):
    """Local telemetry provider."""

    def prepare(self) -> None:
        """Prepare the telemetry service."""
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
