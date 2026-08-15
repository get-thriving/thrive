"""Tests for telemetry scrubbing."""

from jupiter.framework.telemetry.scrub import (
    SCRUBBED,
    is_secret_key,
    scrub_event,
    scrub_value,
)


def test_is_secret_key_matches_on_substring_and_case():
    """Keys are recognised regardless of casing or surrounding words."""
    assert is_secret_key("auth_token_secret")
    assert is_secret_key("Authorization")
    assert is_secret_key("GOOGLE_REFRESH_TOKEN_ENCRYPTION_KEY")
    assert is_secret_key("sentry_dsn")
    assert not is_secret_key("universe")
    assert not is_secret_key("trace_id")


def test_scrub_value_replaces_secrets_and_keeps_the_rest():
    """Only the secret-looking keys lose their values."""
    scrubbed = scrub_value(
        {"trace_id": "abc", "auth_token_secret": "hunter2", "port": 8010}
    )

    assert scrubbed == {
        "trace_id": "abc",
        "auth_token_secret": SCRUBBED,
        "port": 8010,
    }


def test_scrub_value_reaches_into_nested_structures():
    """A secret nested inside lists and dicts is still found."""
    scrubbed = scrub_value(
        {"headers": [{"cookie": "session=1"}, {"accept": "application/json"}]}
    )

    assert scrubbed == {
        "headers": [{"cookie": SCRUBBED}, {"accept": "application/json"}]
    }


def test_scrub_value_preserves_tuples_as_tuples():
    """Scrubbing does not change the shape of what it walks."""
    scrubbed = scrub_value(({"password": "x"}, {"name": "y"}))

    assert isinstance(scrubbed, tuple)
    assert scrubbed == ({"password": SCRUBBED}, {"name": "y"})


def test_scrub_value_stops_at_max_depth():
    """A structure too deep to be legitimate is dropped rather than walked."""
    deep = current = {}
    for _ in range(20):
        nxt: dict[str, object] = {}
        current["next"] = nxt
        current = nxt

    assert scrub_value(deep) is not None


def test_scrub_event_covers_every_section_that_can_carry_secrets():
    """Extras, contexts, request data and breadcrumbs are all scrubbed."""
    event = {
        "message": "boom",
        "extra": {"api_key": "k"},
        "contexts": {"runtime": {"dsn": "postgres://u:p@h/db"}},
        "request": {"headers": {"Authorization": "Bearer x"}},
        "breadcrumbs": {"values": [{"data": {"token": "t"}}]},
    }

    scrubbed = scrub_event(event)

    assert scrubbed["message"] == "boom"
    assert scrubbed["extra"]["api_key"] == SCRUBBED
    assert scrubbed["contexts"]["runtime"]["dsn"] == SCRUBBED
    assert scrubbed["request"]["headers"]["Authorization"] == SCRUBBED
    assert scrubbed["breadcrumbs"]["values"][0]["data"]["token"] == SCRUBBED


def test_scrub_event_handles_breadcrumbs_given_as_a_bare_list():
    """Breadcrumbs arrive either wrapped or bare depending on the SDK path."""
    event = {"breadcrumbs": [{"data": {"password": "p"}}]}

    scrubbed = scrub_event(event)

    assert scrubbed["breadcrumbs"][0]["data"]["password"] == SCRUBBED


def test_scrub_event_leaves_an_event_with_nothing_secret_alone():
    """The normal case finds nothing, and changes nothing."""
    event = {"message": "boom", "extra": {"operation": "GCDoAllUseCase"}}

    assert scrub_event(dict(event)) == event
