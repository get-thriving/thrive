"""The results of a mutation."""

import abc
import enum
from dataclasses import dataclass
from typing import Mapping

from jupiter.framework_new.base.timestamp import Timestamp
from jupiter.framework_new.realm import RealmThing


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


class MutationInvocationRecorder(abc.ABC):
    """A special type of recorder for mutations which records the outcome of a particular mutation."""

    @abc.abstractmethod
    async def record(
        self,
        invocation_record: MutationInvocationRecord,
    ) -> None:
        """Record the invocation of the mutation."""
