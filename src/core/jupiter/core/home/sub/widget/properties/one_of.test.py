"""Tests for the properties of a home widget."""

import jupiter.core
import pytest
from jupiter.core.home.sub.widget.properties.empty import EmptyHomeWidgetProperties
from jupiter.core.home.sub.widget.properties.key_habits_streaks import (
    KeyHabitsStreaksHomeWidgetProperties,
)
from jupiter.core.home.sub.widget.properties.one_of import (
    OneOfHomeWidgetProperties,
    build_default_home_widget_properties,
    check_home_widget_properties_fit_type,
)
from jupiter.core.home.widget import WidgetType
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.realm import DatabaseRealm, Realm, WebRealm
from jupiter.framework.realm.standard import ModuleExplorerRealmCodecRegistry


@pytest.fixture(scope="module")
def realm_codec_registry() -> ModuleExplorerRealmCodecRegistry:
    """Codec registry covering the core package."""
    return ModuleExplorerRealmCodecRegistry.build_from_module_root(jupiter.core)


def _habits(*ref_ids: str) -> KeyHabitsStreaksHomeWidgetProperties:
    return KeyHabitsStreaksHomeWidgetProperties.new([EntityId(r) for r in ref_ids])


@pytest.mark.parametrize("realm", [DatabaseRealm, WebRealm])
@pytest.mark.parametrize(
    "properties",
    [
        _habits("3", "1", "2"),
        _habits(),
        EmptyHomeWidgetProperties.new(),
    ],
)
def test_properties_round_trip_picks_the_right_variant(
    realm_codec_registry: ModuleExplorerRealmCodecRegistry,
    realm: type[Realm],
    properties: OneOfHomeWidgetProperties,
) -> None:
    """A stored value comes back as the same variant, with the same order."""
    encoded = realm_codec_registry.get_encoder(OneOfHomeWidgetProperties, realm).encode(
        properties
    )
    decoded = realm_codec_registry.get_decoder(OneOfHomeWidgetProperties, realm).decode(
        encoded
    )

    assert decoded == properties
    assert type(decoded) is type(properties)


def test_properties_are_stored_with_integer_ids(
    realm_codec_registry: ModuleExplorerRealmCodecRegistry,
) -> None:
    """The database holds ids as integers, which the migration relies on."""
    encoded = realm_codec_registry.get_encoder(
        OneOfHomeWidgetProperties, DatabaseRealm
    ).encode(_habits("3", "1"))

    assert encoded == {"kind": "key-habits-streaks", "habit_ref_ids": [3, 1]}


def test_properties_with_an_unknown_kind_do_not_decode(
    realm_codec_registry: ModuleExplorerRealmCodecRegistry,
) -> None:
    """Something that is neither variant is refused rather than guessed at."""
    decoder = realm_codec_registry.get_decoder(OneOfHomeWidgetProperties, WebRealm)

    with pytest.raises(Exception, match="Could not decode"):
        decoder.decode({"kind": "nope"})


def test_the_same_habit_cannot_appear_twice() -> None:
    """Showing a habit twice in one widget makes no sense."""
    with pytest.raises(InputValidationError, match="only appear once"):
        _habits("1", "2", "1")


@pytest.mark.parametrize("the_type", list(WidgetType))
def test_every_widget_type_has_default_properties_that_fit_it(
    the_type: WidgetType,
) -> None:
    """New widgets of any type start with properties that fit their type."""
    properties = build_default_home_widget_properties(the_type)

    check_home_widget_properties_fit_type(the_type, properties)


def test_key_habits_streaks_start_with_no_habits() -> None:
    """A fresh key habits streaks widget has nothing selected yet."""
    assert build_default_home_widget_properties(WidgetType.KEY_HABITS_STREAKS) == (
        _habits()
    )


@pytest.mark.parametrize(
    ("the_type", "properties"),
    [
        (WidgetType.MOTD, _habits("1")),
        (WidgetType.KEY_HABITS_STREAKS, EmptyHomeWidgetProperties.new()),
    ],
)
def test_properties_of_another_type_are_refused(
    the_type: WidgetType, properties: OneOfHomeWidgetProperties
) -> None:
    """A widget cannot take properties meant for another type of widget."""
    with pytest.raises(InputValidationError, match="does not take"):
        check_home_widget_properties_fit_type(the_type, properties)
