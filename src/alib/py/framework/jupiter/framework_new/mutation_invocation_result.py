"""The results of a mutation."""

import abc
from dataclasses import dataclass
import enum
from typing import Mapping

from jupiter.framework_new.base.entity_id import EntityId
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

    user_ref_id: EntityId
    workspace_ref_id: EntityId
    timestamp: Timestamp
    name: str
    args: Mapping[str, RealmThing]
    result: MutationUseCaseInvocationResult
    error_str: str | None

    @staticmethod
    def build_success(
        user_ref_id: EntityId,
        workspace_ref_id: EntityId,
        timestamp: Timestamp,
        name: str,
        args: Mapping[str, RealmThing],
    ) -> "MutationUseCaseInvocationRecord":
        """Build a success case for an invocation."""
        return MutationUseCaseInvocationRecord(
            user_ref_id=user_ref_id,
            workspace_ref_id=workspace_ref_id,
            timestamp=timestamp,
            name=name,
            args=args,
            result=MutationUseCaseInvocationResult.SUCCESS,
            error_str=None,
        )

    @staticmethod
    def build_failure(
        user_ref_id: EntityId,
        workspace_ref_id: EntityId,
        timestamp: Timestamp,
        name: str,
        args: Mapping[str, RealmThing],
        error: Exception,
    ) -> "MutationUseCaseInvocationRecord":
        """Build a success case for an invocation."""
        return MutationUseCaseInvocationRecord(
            user_ref_id=user_ref_id,
            workspace_ref_id=workspace_ref_id,
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
