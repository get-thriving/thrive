"""Tests for publish external id."""

import uuid

import pytest
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.framework.errors import InputValidationError


def test_new_external_id_is_valid_uuid_v4() -> None:
    external_id = PublishExternalId.new_external_id()
    parsed = uuid.UUID(str(external_id), version=4)
    assert parsed.version == 4


def test_construction_accepts_valid_uuid_v4() -> None:
    value = str(uuid.uuid4())
    external_id = PublishExternalId(value)
    assert str(external_id) == value


def test_construction_rejects_invalid_uuid() -> None:
    with pytest.raises(InputValidationError):
        PublishExternalId("not-a-uuid")
