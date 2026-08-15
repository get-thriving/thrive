"""An abastract provider of telemetry services."""

import logging
from abc import ABC, abstractmethod
from collections.abc import Iterator, Mapping
from contextlib import AbstractContextManager, contextmanager
from dataclasses import dataclass

LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True)
class TelemetryDeployment:
    """Which process, in which deployment, is emitting telemetry."""

    service: str
    universe: str
    env: str
    instance: str
    hosting: str
    version: str

    @property
    def environment(self) -> str:
        """The environment, which separates production from staging and previews."""
        return f"{self.universe}-{self.env}"

    @property
    def release(self) -> str:
        """The release, which attributes a regression to a version."""
        return f"thrive@{self.version}"

    @property
    def server_name(self) -> str:
        """The name identifying this process in this deployment."""
        return f"{self.service}@{self.instance}"

    def as_tags(self) -> Mapping[str, str]:
        """The deployment identity, as tags to attach to every event."""
        return {
            "service": self.service,
            "universe": self.universe,
            "env": self.env,
            "instance": self.instance,
            "hosting": self.hosting,
        }


@dataclass(frozen=True)
class TelemetryActor:
    """Who an operation is running on behalf of.

    Only the context string is carried - the same value persisted as
    `mutation_invocation_record.context_str` (see ADR 0005), so an issue can be
    joined against the invocation that produced it. Never a name, an email
    address, or an IP.
    """

    context_str: str


class Telemetry(ABC):
    """An abastract provider of telemetry services."""

    @abstractmethod
    def prepare(self) -> None:
        """Prepare the telemetry service."""

    @abstractmethod
    def scope(self) -> AbstractContextManager[None]:
        """Isolate what is bound inside it to one request, job run, or tool call."""

    @abstractmethod
    def bind_actor(self, actor: TelemetryActor) -> None:
        """Attach who the current operation is running on behalf of."""

    @abstractmethod
    def bind_operation(
        self, operation: str, tags: Mapping[str, str] | None = None
    ) -> None:
        """Attach what the current operation is, and what locates it."""

    @abstractmethod
    def record_expected_error(self, error: Exception, operation: str) -> None:
        """Record an outcome the caller can act on - never an issue."""

    @abstractmethod
    def record_unexpected_error(self, error: Exception, operation: str) -> None:
        """Record a defect or an infrastructure failure - always an issue."""


class NoOpTelemetry(Telemetry):
    """A telemetry provider that does nothing, used before one is chosen."""

    def prepare(self) -> None:
        """Prepare the telemetry service."""

    @contextmanager
    def scope(self) -> Iterator[None]:
        """Isolate what is bound inside it to one request, job run, or tool call."""
        yield

    def bind_actor(self, actor: TelemetryActor) -> None:
        """Attach who the current operation is running on behalf of."""

    def bind_operation(
        self, operation: str, tags: Mapping[str, str] | None = None
    ) -> None:
        """Attach what the current operation is, and what locates it."""

    def record_expected_error(self, error: Exception, operation: str) -> None:
        """Record an outcome the caller can act on - never an issue."""

    def record_unexpected_error(self, error: Exception, operation: str) -> None:
        """Record a defect or an infrastructure failure - always an issue."""
        LOGGER.error("Unexpected error in %s: %s", operation, error, exc_info=error)
