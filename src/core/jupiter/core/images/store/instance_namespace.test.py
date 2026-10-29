"""Tests for the instance namespace."""

import pytest
from jupiter.core.images.store.instance_namespace import instance_namespace
from jupiter.core.instance import Instance


def test_plain_instances_are_kept() -> None:
    assert instance_namespace(Instance("Main")) == "Main"
    assert instance_namespace(Instance("feature--multiple-auth-methods")) == (
        "feature--multiple-auth-methods"
    )


def test_unusual_characters_are_flattened() -> None:
    assert instance_namespace(Instance("dependabot/npm@1.2 x")) == (
        "dependabot-npm-1.2-x"
    )


def test_cant_climb_out_of_a_directory() -> None:
    assert "/" not in instance_namespace(Instance("../../etc"))
    assert not instance_namespace(Instance("../../etc")).startswith(".")


def test_unusable_instance_is_rejected() -> None:
    with pytest.raises(ValueError, match="no usable image namespace"):
        instance_namespace(Instance(".."))
