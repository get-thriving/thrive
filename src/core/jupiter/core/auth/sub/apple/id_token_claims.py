"""Claims from a verified Apple OpenID Connect ID token."""

from jupiter.core.auth.sub.apple.subject_id import AppleSubjectId
from jupiter.core.common.email_address import EmailAddress
from jupiter.framework.realm.realm import (
    WebRealm,
    only_in_realm,
)
from jupiter.framework.value import CompositeValue, value


@value
@only_in_realm(WebRealm)
class AppleIdTokenClaims(CompositeValue):
    """Profile fields extracted from an Apple ID token payload."""

    sub: AppleSubjectId
    email: EmailAddress
    email_verified: bool
    is_private_email: bool | None
