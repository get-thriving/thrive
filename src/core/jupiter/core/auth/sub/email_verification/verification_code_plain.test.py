"""Tests for verification code plain."""

import re
from unittest.mock import patch

import pytest
from jupiter.core.auth.sub.email_verification.verification_code_plain import (
    VerificationCodePlain,
)

_DIGIT_CODE_RE = re.compile(r"^\d{6}$")


@pytest.mark.parametrize(
    ("random_value", "expected_code"),
    [
        (0, "000000"),
        (1, "000001"),
        (42, "000042"),
        (12345, "012345"),
        (999_999, "999999"),
    ],
)
def test_generate_formats_random_value(random_value: int, expected_code: str) -> None:
    """Generated codes are six digits with leading zeros preserved."""
    with patch(
        "jupiter.core.auth.sub.email_verification.verification_code_plain.secrets.randbelow",
        return_value=random_value,
    ):
        code = VerificationCodePlain.generate()

    assert code.code_raw == expected_code
    assert _DIGIT_CODE_RE.match(code.code_raw)


def test_generate_produces_six_digit_strings() -> None:
    """Random generation always yields a six-character numeric string."""
    for _ in range(100):
        code = VerificationCodePlain.generate()
        assert len(code.code_raw) == 6
        assert code.code_raw.isdigit()
        assert _DIGIT_CODE_RE.match(code.code_raw)
