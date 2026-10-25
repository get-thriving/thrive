"""The method a PKCE code challenge was made with (RFC 7636)."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class PkceCodeChallengeMethod(EnumValue):
    """The method a PKCE code challenge was made with.

    Only S256, the SHA-256 form, is supported. The plain method, where the challenge
    is the verifier itself, gives no protection against an intercepted code.
    """

    S256 = "S256"
