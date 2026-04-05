"""Retrieve the history of mutation invocations for a user and workspace."""

import json
from typing import ClassVar

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterLoggedInReadonlyUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.errors import InputValidationError
from jupiter.framework.mutation_inovcation.invocation_record import (
    MutationInvocationResult,
)
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class GetMutationInvocationHistoryArgs(UseCaseArgsBase):
    """Arguments for the mutation invocation history."""

    retrieve_offset: int | None
    retrieve_limit: int | None


@use_case_result_part
class HistoryEntry(UseCaseResultBase):
    """A single mutation invocation history entry."""

    mutation_name: str
    timestamp: Timestamp
    source: str
    result: str
    args_str: str
    error_str: str | None


@use_case_result
class GetMutationInvocationHistoryResult(UseCaseResultBase):
    """Results for the mutation invocation history."""

    entries: list[HistoryEntry]
    total_cnt: int
    page_size: int


@readonly_use_case()
class GetMutationInvocationHistoryUseCase(
    JupiterLoggedInReadonlyUseCase[
        GetMutationInvocationHistoryArgs, GetMutationInvocationHistoryResult
    ]
):
    """Use case for loading the history of mutation invocations for a user and workspace."""

    _DEFAULT_OFFSET: ClassVar[int] = 0
    _DEFAULT_LIMIT: ClassVar[int] = 20
    _MAX_LIMIT: ClassVar[int] = 100

    async def _execute(
        self,
        context: JupiterLoggedInReadonlyContext,
        args: GetMutationInvocationHistoryArgs,
    ) -> GetMutationInvocationHistoryResult:
        """Execute the command's action."""
        retrieve_offset = args.retrieve_offset or self._DEFAULT_OFFSET
        retrieve_limit = args.retrieve_limit or self._DEFAULT_LIMIT
        if retrieve_offset < 0:
            raise InputValidationError(
                f"Retrieve offset needs to be positive but was {retrieve_offset}"
            )
        if retrieve_limit <= 0 or retrieve_limit > self._MAX_LIMIT:
            raise InputValidationError(
                f"Retrieve limit needs to be between 0 and {self._MAX_LIMIT} but was {retrieve_limit}"
            )

        context_str = context.as_str()

        records, total_cnt = (
            await self._invocation_recorder.find_all_invocation_records_by_context_str(
                context_str,
                retrieve_offset,
                retrieve_limit,
            )
        )

        return GetMutationInvocationHistoryResult(
            entries=[
                HistoryEntry(
                    mutation_name=r.name,
                    timestamp=r.timestamp,
                    source=r.source,
                    result=str(r.result.value),
                    args_str=json.dumps(r.args, indent=2, default=str),
                    error_str=r.error_str,
                )
                for r in records
            ],
            total_cnt=total_cnt,
            page_size=self._DEFAULT_LIMIT,
        )
