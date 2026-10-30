"""Tests for the instance namespace."""

import pytest
from jupiter.core.common.sub.images.sub.image.instance_namespace import (
    InstanceNamespace,
)
from jupiter.core.instance import Instance


def test_plain_instances_are_kept() -> None:
    assert InstanceNamespace.from_instance(Instance("Main")) == InstanceNamespace(
        "Main"
    )
    assert InstanceNamespace.from_instance(
        Instance("feature--multiple-auth-methods")
    ) == InstanceNamespace("feature--multiple-auth-methods")


def test_unusual_characters_are_flattened() -> None:
    assert InstanceNamespace.from_instance(
        Instance("dependabot/npm@1.2 x")
    ) == InstanceNamespace("dependabot-npm-1.2-x")


def test_cant_climb_out_of_a_directory() -> None:
    namespace = InstanceNamespace.from_instance(Instance("../../etc"))
    assert "/" not in str(namespace)
    assert not str(namespace).startswith(".")


def test_unusable_instance_is_rejected() -> None:
    with pytest.raises(ValueError, match="no usable image namespace"):
        InstanceNamespace.from_instance(Instance(".."))


def test_unsafe_namespace_is_rejected() -> None:
    with pytest.raises(ValueError, match="Invalid instance namespace"):
        InstanceNamespace("../etc")
