"""Token payload returned by Apple's OAuth token endpoint."""

from jupiter.core.auth.sub.apple.apple_auth_code import AppleAuthCode
from jupiter.core.auth.sub.apple.refresh_token_plain import AppleRefreshTokenPlain
from jupiter.framework.realm.realm import (
    WebRealm,
    only_in_realm,
)
from jupiter.framework.value import CompositeValue, value


@value
@only_in_realm(WebRealm)
class AppleOAuthTokenResponse(CompositeValue):
    """Fields we read from Apple's token endpoint response."""

    access_token: AppleAuthCode
    id_token: str
    refresh_token: AppleRefreshTokenPlain | None
