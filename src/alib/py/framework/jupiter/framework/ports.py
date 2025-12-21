"""Ports for a use case."""

from dataclasses import dataclass

from jupiter.framework.storage.repository import DomainStorageEngine


@dataclass(frozen=True)
class Ports:
    """A port for a use case."""


@dataclass(frozen=True)
class DomainPorts(Ports):
    """A port with some knowledge of the domain."""

    domain_storage_engine: DomainStorageEngine
