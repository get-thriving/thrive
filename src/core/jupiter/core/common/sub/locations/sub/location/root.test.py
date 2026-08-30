"""Tests for the location entity constructor."""

import pytest
from jupiter.core.common.sub.locations.sub.location.address_line import AddressLine
from jupiter.core.common.sub.locations.sub.location.country import CountryCode
from jupiter.core.common.sub.locations.sub.location.gps import GpsCoordinates
from jupiter.core.common.sub.locations.sub.location.name import LocationName
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.errors import InputValidationError
from jupiter.framework.update_action import UpdateAction


def _ctx() -> DomainContext:
    return DomainContext(
        trace_id=TraceId.new(),
        mutation_id=MutationId.new(),
        event_source="test",
        action_timestamp=Timestamp.from_components(2024, 1, 1, 0, 0),
        _context_str="test",
    )


def test_new_location_requires_at_least_one_field() -> None:
    with pytest.raises(InputValidationError, match="At least one"):
        Location.new_location(
            ctx=_ctx(),
            location_domain_ref_id=EntityId("1"),
            name=None,
            address_line=None,
            country=None,
            gps=None,
        )


def test_new_location_with_only_name() -> None:
    location = Location.new_location(
        ctx=_ctx(),
        location_domain_ref_id=EntityId("1"),
        name=LocationName("Home"),
        address_line=None,
        country=None,
        gps=None,
    )
    assert str(location.name) == "Home"
    assert location.address_line is None
    assert location.country is None
    assert location.gps is None


def test_new_location_derives_name_from_address() -> None:
    location = Location.new_location(
        ctx=_ctx(),
        location_domain_ref_id=EntityId("1"),
        name=None,
        address_line=AddressLine("123 Main St"),
        country=None,
        gps=None,
    )
    assert str(location.name) == "123 Main St"
    assert str(location.address_line) == "123 Main St"


def test_new_location_derives_name_from_country() -> None:
    location = Location.new_location(
        ctx=_ctx(),
        location_domain_ref_id=EntityId("1"),
        name=None,
        address_line=None,
        country=CountryCode("US"),
        gps=None,
    )
    assert str(location.name) == "US"


def test_new_location_derives_name_from_gps() -> None:
    location = Location.new_location(
        ctx=_ctx(),
        location_domain_ref_id=EntityId("1"),
        name=None,
        address_line=None,
        country=None,
        gps=GpsCoordinates(latitude=40.0, longitude=-74.0),
    )
    assert str(location.name) == "40.0, -74.0"


def test_update_clearing_name_without_other_fields_fails() -> None:
    location = Location.new_location(
        ctx=_ctx(),
        location_domain_ref_id=EntityId("1"),
        name=LocationName("Home"),
        address_line=None,
        country=None,
        gps=None,
    )
    with pytest.raises(InputValidationError, match="At least one"):
        location.update(
            ctx=_ctx(),
            name=UpdateAction.change_to(None),
            address_line=UpdateAction.do_nothing(),
            country=UpdateAction.do_nothing(),
            gps=UpdateAction.do_nothing(),
        )
