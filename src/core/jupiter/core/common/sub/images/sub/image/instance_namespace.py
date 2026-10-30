"""The namespace an instance's images live under in a store."""

import re
from typing import Final

from jupiter.core.instance import Instance
from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, hashable_value

_UNSAFE_CHARS: Final[re.Pattern[str]] = re.compile(r"[^A-Za-z0-9._-]")
_SAFE_NAMESPACE: Final[re.Pattern[str]] = re.compile(r"[A-Za-z0-9._-]+")


@hashable_value
class InstanceNamespace(AtomicValue[str]):
    """The namespace an instance's images live under in a store.

    Instances of one environment (the per-PR ones on staging) share a bucket,
    and the namespace keeps their images apart, and lets one instance's
    cleanup list its own images only. It is also a directory on disk, so it is
    a single segment of safe characters and never starts with a dot: it can
    neither climb out of a directory nor be a hidden one.
    """

    the_namespace: str

    @staticmethod
    def from_instance(instance: Instance) -> "InstanceNamespace":
        """The namespace of an instance.

        The name comes from things like branch names, so anything unusual is
        flattened: two instances can only clash if they differ in nothing but
        such characters.
        """
        namespace = _UNSAFE_CHARS.sub("-", str(instance)).lstrip(".")
        if not namespace:
            raise InputValidationError(
                f"Instance '{instance}' has no usable image namespace"
            )
        return InstanceNamespace(namespace)

    def _validate(self) -> None:
        """Validate this namespace."""
        if not _SAFE_NAMESPACE.fullmatch(self.the_namespace) or (
            self.the_namespace.startswith(".")
        ):
            raise InputValidationError(
                f"Invalid instance namespace '{self.the_namespace}'"
            )

    def __str__(self) -> str:
        """Transform this to a string version."""
        return self.the_namespace


class InstanceNamespaceDatabaseEncoder(
    PrimitiveAtomicValueDatabaseEncoder[InstanceNamespace]
):
    """Encode to a database primitive."""

    def to_primitive(self, value: InstanceNamespace) -> Primitive:
        """Encode to a database primitive."""
        return value.the_namespace


class InstanceNamespaceDatabaseDecoder(
    PrimitiveAtomicValueDatabaseDecoder[InstanceNamespace]
):
    """Decode from a database primitive."""

    def from_raw_str(self, value: str) -> InstanceNamespace:
        """Decode from a raw string."""
        return InstanceNamespace(value)
