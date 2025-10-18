"""The results of a mutation."""

import abc
import enum
from dataclasses import dataclass
from typing import Mapping

from jupiter.framework_new.base.timestamp import Timestamp
from jupiter.framework_new.realm import RealmThing


@enum.unique
class MutationUseCaseInvocationResult(enum.Enum):
    """The result of a mutation use case invocation."""

    SUCCESS = "success"
    FAILURE = "failure"


@dataclass(frozen=True)
class MutationUseCaseInvocationRecord:
    """The record of a mutation use case invocation."""

    context_str: str
    timestamp: Timestamp
    name: str
    args: Mapping[str, RealmThing]
    result: MutationUseCaseInvocationResult
    error_str: str | None

    @staticmethod
    def build_success(
        context_str: str,
        timestamp: Timestamp,
        name: str,
        args: Mapping[str, RealmThing],
    ) -> "MutationUseCaseInvocationRecord":
        """Build a success case for an invocation."""
        return MutationUseCaseInvocationRecord(
            context_str=context_str,
            timestamp=timestamp,
            name=name,
            args=args,
            result=MutationUseCaseInvocationResult.SUCCESS,
            error_str=None,
        )

    @staticmethod
    def build_failure(
        context_str: str,
        timestamp: Timestamp,
        name: str,
        args: Mapping[str, RealmThing],
        error: Exception,
    ) -> "MutationUseCaseInvocationRecord":
        """Build a success case for an invocation."""
        return MutationUseCaseInvocationRecord(
            context_str=context_str,
            timestamp=timestamp,
            name=name,
            args=args,
            result=MutationUseCaseInvocationResult.FAILURE,
            error_str=str(error),
        )


class MutationUseCaseInvocationRecorder(abc.ABC):
    """A special type of recorder for mutation use cases which records the outcome of a particular use case."""

    @abc.abstractmethod
    async def record(
        self,
        invocation_record: MutationUseCaseInvocationRecord,
    ) -> None:
        """Record the invocation of the use case."""
