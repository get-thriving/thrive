"""Annotations for codepaths that deal with security in some way."""

from typing import TypeVar

_X = TypeVar("_X")


def secure_class(cls: type[_X]) -> type[_X]:
    """Mark this class as dealing with security, auth, etc but it's noop otherwise."""
    return cls
