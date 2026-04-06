"""Retrieve the history of mutations for a particular entity."""

from typing import ClassVar

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterLoggedInReadonlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.named_entity_tag_to_cls import NAMED_ENTITY_TAG_TO_CLS
from jupiter.core.users.root import User
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.errors import InputValidationError
from jupiter.framework.mutation_inovcation.entity_event import MutationEntityEvent
from jupiter.framework.mutation_inovcation.invocation_record import (
    MutationInvocationRecord,
)
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)
from jupiter.framework.utils.generic_support_entity_explorer import (
    generic_support_entity_explorer,
)


@use_case_args
class GetEntityMutationHistoryArgs(UseCaseArgsBase):
    """Arguments for the entity mutation history."""

    entity_type: NamedEntityTag
    entity_ref_id: EntityId
    retrieve_offset: int | None
    retrieve_limit: int | None


@use_case_result_part
class HistoryEntry(UseCaseResultBase):
    """An instance of the history."""

    # Which mutation
    mutation_id: MutationId
    # Which entity
    entity_name: str
    # What
    mutation_name: str
    event_kind: str
    event_name: str
    # When
    timestamp: Timestamp
    # Who
    source: str
    user_ref_id: EntityId
    # Data
    entity_version: int
    data: str


@use_case_result
class GetEntityMutationHistoryResult(UseCaseResultBase):
    """Results for the entity mutation history."""

    entries: list[HistoryEntry]
    users: list[User]
    total_cnt: int
    page_size: int


@readonly_use_case()
class GetEntityMutationHistoryUseCase(
    JupiterLoggedInReadonlyUseCase[
        GetEntityMutationHistoryArgs, GetEntityMutationHistoryResult
    ]
):
    """Use case for loading the history of mutations for an entity."""

    _DEFAULT_OFFSET: ClassVar[int] = 0
    _DEFAULT_LIMIT: ClassVar[int] = 4
    _MAX_LIMIT: ClassVar[int] = 100

    async def _execute(
        self,
        context: JupiterLoggedInReadonlyContext,
        args: GetEntityMutationHistoryArgs,
    ) -> GetEntityMutationHistoryResult:
        """Execute the command's action."""
        retrieve_offset = args.retrieve_offset or self._DEFAULT_OFFSET
        retrieve_limit = args.retrieve_limit or self._DEFAULT_LIMIT
        if retrieve_offset < 0:
            raise InputValidationError(
                f"Retrieve limit needs to be positive but was {retrieve_offset}"
            )
        if retrieve_limit <= 0 or retrieve_limit > self._MAX_LIMIT:
            raise InputValidationError(
                f"Retrieve limit needs to be between 0 and {self._MAX_LIMIT} but was {retrieve_limit}"
            )

        main_events, total_cnt = (
            await self._invocation_recorder.find_all_entity_events_by_timestamp_desc(
                args.entity_type.value,
                args.entity_ref_id,
                retrieve_offset,
                retrieve_limit,
            )
        )

        linked_events: list[MutationEntityEvent] = []
        if main_events:
            earliest = min(e.timestamp for e in main_events).subtract_minutes(10)
            latest = max(e.timestamp for e in main_events).add_minutes(30)

            entity_cls = NAMED_ENTITY_TAG_TO_CLS.get(args.entity_type)
            if entity_cls is not None:
                async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                    entity = await uow.get_for(entity_cls).load_by_id(
                        args.entity_ref_id,
                        allow_archived=True,
                    )
                    linked_refs = await generic_support_entity_explorer(uow, entity)

                for linked_type_name, linked_ref_id in linked_refs:
                    events = (
                        await self._invocation_recorder.find_all_entity_events_between(
                            linked_type_name,
                            linked_ref_id,
                            earliest,
                            latest,
                        )
                    )
                    linked_events.extend(events)

        all_events = main_events + linked_events
        all_events.sort(key=lambda e: e.timestamp, reverse=True)

        all_mutations: list[MutationInvocationRecord] = (
            await self._invocation_recorder.find_all_invocation_records(
                list({m.mutation_id for m in all_events})
            )
        )
        all_mutations_by_ref_id = {m.mutation_id: m for m in all_mutations}

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            all_users = await uow.get_for(User).find_all(
                allow_archived=True,
                filter_ref_ids=[
                    JupiterLoggedInReadonlyContext.unwrap_str(e.context_str)[0]
                    for e in all_events
                ],
            )

        return GetEntityMutationHistoryResult(
            entries=[
                HistoryEntry(
                    mutation_id=e.mutation_id,
                    entity_name=e.entity_type,
                    mutation_name=all_mutations_by_ref_id[e.mutation_id].name,
                    event_kind=e.kind.value,
                    event_name=e.name,
                    timestamp=e.timestamp,
                    source=e.source,
                    user_ref_id=JupiterLoggedInReadonlyContext.unwrap_str(
                        e.context_str
                    )[0],
                    entity_version=e.entity_version,
                    data=e.data,
                )
                for e in all_events
            ],
            users=all_users,
            total_cnt=total_cnt,
            page_size=self._DEFAULT_LIMIT,
        )
