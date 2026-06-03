from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="VerifyEmailVerificationAttemptResult")


@_attrs_define
class VerifyEmailVerificationAttemptResult:
    """Verify email verification attempt result.

    Attributes:
        verified (bool):
        can_retry (bool):
    """

    verified: bool
    can_retry: bool
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        verified = self.verified

        can_retry = self.can_retry

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "verified": verified,
                "can_retry": can_retry,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        verified = d.pop("verified")

        can_retry = d.pop("can_retry")

        verify_email_verification_attempt_result = cls(
            verified=verified,
            can_retry=can_retry,
        )

        verify_email_verification_attempt_result.additional_properties = d
        return verify_email_verification_attempt_result

    @property
    def additional_keys(self) -> list[str]:
        return list(self.additional_properties.keys())

    def __getitem__(self, key: str) -> Any:
        return self.additional_properties[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.additional_properties[key] = value

    def __delitem__(self, key: str) -> None:
        del self.additional_properties[key]

    def __contains__(self, key: str) -> bool:
        return key in self.additional_properties
