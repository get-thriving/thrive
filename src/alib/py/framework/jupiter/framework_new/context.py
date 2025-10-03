"""A domain-level context for calls that are made."""

from dataclasses import dataclass

from jupiter.framework_new.app_particulars import AppParticulars
from jupiter.framework_new.base.timestamp import Timestamp


@dataclass(frozen=True)
class DomainContext:
    """A domain-level context for calls that are made."""

    event_source: str
    action_timestamp: Timestamp

    @staticmethod
    def from_app_particulars(
        app_particulars: AppParticulars,
        action_timestamp: Timestamp,
    ) -> "DomainContext":
        """Create a domain context from an app."""
        return DomainContext(
            event_source=app_particulars.as_event_source(),
            action_timestamp=action_timestamp,
        )
