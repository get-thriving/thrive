"""The results of a mutation."""

import enum
from dataclasses import dataclass
from typing import Mapping

from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.realm.realm import RealmThing


@enum.unique
class MutationInvocationResult(enum.Enum):
    """The result of a mutation use case invocation."""

    SUCCESS = "success"
    FAILURE = "failure"


@dataclass(frozen=True)
class MutationInvocationRecord:
    """The record of a mutation use case invocation."""

    context_str: str
    timestamp: Timestamp
    name: str
    args: Mapping[str, RealmThing]
    result: MutationInvocationResult
    error_str: str | None

    @staticmethod
    def build_success(
        context_str: str,
        timestamp: Timestamp,
        name: str,
        args: Mapping[str, RealmThing],
    ) -> "MutationInvocationRecord":
        """Build a success case for an invocation."""
        return MutationInvocationRecord(
            context_str=context_str,
            timestamp=timestamp,
            name=name,
            args=args,
            result=MutationInvocationResult.SUCCESS,
            error_str=None,
        )

    @staticmethod
    def build_failure(
        context_str: str,
        timestamp: Timestamp,
        name: str,
        args: Mapping[str, RealmThing],
        error: Exception,
    ) -> "MutationInvocationRecord":
        """Build a success case for an invocation."""
        return MutationInvocationRecord(
            context_str=context_str,
            timestamp=timestamp,
            name=name,
            args=args,
            result=MutationInvocationResult.FAILURE,
            error_str=str(error),
        )
