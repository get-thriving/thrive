"""OAuth state payload for Google login via a hosted redirect URL."""

import base64
import json
import secrets
from typing import Final

from jupiter.core.common.system_url import SystemUrl
from jupiter.framework.realm.realm import (
    RealmDecoder,
    RealmDecodingError,
    RealmEncoder,
    RealmThing,
    WebRealm,
    only_in_realm,
)
from jupiter.framework.value import CompositeValue, value

_STATE_VERSION: Final[int] = 1


@value
@only_in_realm(WebRealm)
class GoogleOauthRedirectState(CompositeValue):
    """OAuth state embedding post-auth redirect targets."""

    nonce: str
    callback_success_url: SystemUrl
    callback_failure_url: SystemUrl

    @staticmethod
    def new(
        callback_success_url: SystemUrl,
        callback_failure_url: SystemUrl,
    ) -> "GoogleOauthRedirectState":
        """Build a fresh OAuth state value."""
        return GoogleOauthRedirectState(
            nonce=secrets.token_urlsafe(16),
            callback_success_url=callback_success_url,
            callback_failure_url=callback_failure_url,
        )


class GoogleOauthRedirectStateWebEncoder(
    RealmEncoder[GoogleOauthRedirectState, WebRealm]
):
    """Encode OAuth redirect state for the Google authorisation URL."""

    def encode(self, value: GoogleOauthRedirectState) -> RealmThing:
        """Encode to a base64url JSON string."""
        payload = {
            "v": _STATE_VERSION,
            "nonce": value.nonce,
            "callback_success_url": value.callback_success_url.the_url,
            "callback_failure_url": value.callback_failure_url.the_url,
        }
        encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode()
        return encoded.rstrip("=")


class GoogleOauthRedirectStateWebDecoder(
    RealmDecoder[GoogleOauthRedirectState, WebRealm]
):
    """Decode OAuth redirect state from the Google authorisation URL."""

    def decode(self, value: RealmThing) -> GoogleOauthRedirectState:
        """Decode from a base64url JSON string."""
        if not isinstance(value, str):
            raise RealmDecodingError("Expected Google OAuth state to be a string")

        padding = "=" * (-len(value) % 4)
        try:
            raw = base64.urlsafe_b64decode(f"{value}{padding}")
            payload = json.loads(raw)
        except (ValueError, json.JSONDecodeError) as err:
            raise RealmDecodingError("Invalid Google OAuth state") from err

        if not isinstance(payload, dict):
            raise RealmDecodingError("Invalid Google OAuth state")

        version = payload.get("v")
        nonce = payload.get("nonce")
        callback_success_url = payload.get("callback_success_url")
        callback_failure_url = payload.get("callback_failure_url")

        if (
            version != _STATE_VERSION
            or not isinstance(nonce, str)
            or not isinstance(callback_success_url, str)
            or not isinstance(callback_failure_url, str)
        ):
            raise RealmDecodingError("Invalid Google OAuth state")

        return GoogleOauthRedirectState(
            nonce=nonce,
            callback_success_url=SystemUrl(callback_success_url),
            callback_failure_url=SystemUrl(callback_failure_url),
        )
