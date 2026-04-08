"""The results of a mutation."""

import enum
from dataclasses import dataclass
from typing import Mapping

from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.realm.realm import RealmThing


@enum.unique
class MutationInvocationResult(enum.Enum):
    """The result of a mutation use case invocation."""

    SUCCESS = "success"
    FAILURE = "failure"


@dataclass(frozen=True)
class MutationInvocationRecord:
    """The record of a mutation use case invocation."""

    trace_id: TraceId
    mutation_id: MutationId
    timestamp: Timestamp
    context_str: str
    source: str
    name: str
    args: Mapping[str, RealmThing]
    result: MutationInvocationResult
    error_str: str | None

    @staticmethod
    def build_success(
        trace_id: TraceId,
        mutation_id: MutationId,
        timestamp: Timestamp,
        context_str: str,
        source: str,
        name: str,
        args: Mapping[str, RealmThing],
    ) -> "MutationInvocationRecord":
        """Build a success case for an invocation."""
        return MutationInvocationRecord(
            trace_id=trace_id,
            mutation_id=mutation_id,
            timestamp=timestamp,
            context_str=context_str,
            source=source,
            name=name,
            args=args,
            result=MutationInvocationResult.SUCCESS,
            error_str=None,
        )

    @staticmethod
    def build_failure(
        trace_id: TraceId,
        mutation_id: MutationId,
        timestamp: Timestamp,
        context_str: str,
        source: str,
        name: str,
        args: Mapping[str, RealmThing],
        error: Exception,
    ) -> "MutationInvocationRecord":
        """Build a failure case for an invocation."""
        return MutationInvocationRecord(
            trace_id=trace_id,
            mutation_id=mutation_id,
            context_str=context_str,
            timestamp=timestamp,
            source=source,
            name=name,
            args=args,
            result=MutationInvocationResult.FAILURE,
            error_str=str(error),
        )
