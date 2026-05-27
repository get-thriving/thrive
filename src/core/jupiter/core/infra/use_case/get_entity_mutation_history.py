"""Retrieve the history of mutations for a particular entity."""

from typing import cast

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterLoggedInReadonlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.root import User
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.concepts.registry import ConceptNotFoundError
from jupiter.framework.entity import CrownEntity
from jupiter.framework.mutation_inovcation.invocation_record import (
    MutationInvocationRecord,
)
from jupiter.framework.storage.repository import EntityNotFoundError
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


@readonly_use_case()
class GetEntityMutationHistoryUseCase(
    JupiterLoggedInReadonlyUseCase[
        GetEntityMutationHistoryArgs, GetEntityMutationHistoryResult
    ]
):
    """Use case for loading the history of mutations for an entity."""

    async def _execute(
        self,
        context: JupiterLoggedInReadonlyContext,
        args: GetEntityMutationHistoryArgs,
    ) -> GetEntityMutationHistoryResult:
        """Execute the command's action."""
        all_events = (
            await self._invocation_recorder.find_all_entity_events_by_timestamp_desc(
                args.entity_type.value,
                args.entity_ref_id,
            )
        )

        linked_support_entities: list[tuple[str, EntityId]] = []
        crown_cls: type[CrownEntity] | None = None
        try:
            entity_cls = self._concept_registry.get_entity_by_name(
                args.entity_type.value,
            )
        except ConceptNotFoundError:
            pass
        else:
            if issubclass(entity_cls, CrownEntity):
                crown_cls = cast(type[CrownEntity], entity_cls)

        if crown_cls is not None:
            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                try:
                    root_entity = await uow.get_for(crown_cls).load_by_id(
                        args.entity_ref_id, allow_archived=True
                    )
                    linked_support_entities = await generic_support_entity_explorer(
                        uow, root_entity
                    )
                except EntityNotFoundError:
                    pass

        for linked_type_name, linked_ref_id in linked_support_entities:
            all_events.extend(
                await self._invocation_recorder.find_all_entity_events_by_timestamp_desc(
                    linked_type_name,
                    linked_ref_id,
                )
            )

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
        )
