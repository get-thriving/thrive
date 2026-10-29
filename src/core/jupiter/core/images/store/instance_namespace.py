"""The namespace an instance's images live under in a store."""

import re
from typing import Final

from jupiter.core.instance import Instance

_UNSAFE_CHARS: Final[re.Pattern[str]] = re.compile(r"[^A-Za-z0-9._-]")


def instance_namespace(instance: Instance) -> str:
    """The namespace an instance's images live under in a store.

    Instances of one environment (the per-PR ones on staging) share a bucket,
    and the namespace keeps their images apart, and lets one instance's
    cleanup list its own images only. The name is also a directory on disk,
    and comes from things like branch names, so anything unusual is flattened:
    two instances can only clash if they differ in nothing but such characters.
    """
    namespace = _UNSAFE_CHARS.sub("-", str(instance)).lstrip(".")
    if not namespace:
        raise ValueError(f"Instance '{instance}' has no usable image namespace")
    return namespace
