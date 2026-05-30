"""Claims from a verified Google OpenID Connect ID token."""

from jupiter.core.auth.sub.google.subject_id import GoogleSubjectId
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.users.name import UserName
from jupiter.framework.realm.realm import (
    WebRealm,
    only_in_realm,
)
from jupiter.framework.value import CompositeValue, value


@value
@only_in_realm(WebRealm)
class GoogleIdTokenClaims(CompositeValue):
    """Profile fields extracted from a Google ID token payload."""

    sub: GoogleSubjectId
    email: EmailAddress
    name: str | None

    def to_user_name(self) -> UserName:
        """Resolve a display name from claims, with email local-part as fallback."""
        if self.name is not None and self.name.strip():
            return UserName(self.name.strip())
        return UserName(self.email.the_address.split("@", maxsplit=1)[0])
