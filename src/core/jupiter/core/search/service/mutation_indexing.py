"""Apply search indexing for a single completed mutation (post-transaction work)."""

from typing import Final

from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.search.service.entity_index import (
    ENTITY_TYPES_SKIPPED_BY_SEARCH_INDEXER,
    SearchEntityIndexService,
    SupportsSearchEntityIndexing,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.entity import CrownEntity
from jupiter.framework.mutation_inovcation.entity_event import MutationEntityEvent
from jupiter.framework.mutation_inovcation.recorder import MutationInvocationRecorder
from jupiter.framework.time_provider import TimeProvider


def mutation_produces_search_indexing_work(
    all_events: list[MutationEntityEvent],
    concept_registry: ConceptRegistry,
) -> bool:
    """Whether the former post-mutation search loops would have done anything."""
    for event in all_events:
        if not NamedEntityTag.is_valid(event.entity_type):
            continue
        if event.kind.is_removed:
            continue
        if event.entity_type not in NamedEntityTag:
            continue
        if event.entity_type in ENTITY_TYPES_SKIPPED_BY_SEARCH_INDEXER:
            continue
        return True

    for event in all_events:
        if event.entity_type not in ("Note", "TagLink", "ContactLink"):
            continue
        if event.kind.is_removed:
            continue
        return True

    for event in all_events:
        if not NamedEntityTag.is_valid(event.entity_type):
            continue
        if not event.kind.is_removed:
            continue

        entity_clm = concept_registry.get_entity_by_name(event.entity_type)
        if not issubclass(entity_clm, CrownEntity):
            continue
        return True

    return False


class SearchIndexingForMutationService:
    """Runs search upsert/remove for all entity events recorded for one mutation."""

    _ports: Final[SupportsSearchEntityIndexing]
    _concept_registry: Final[ConceptRegistry]
    _time_provider: Final[TimeProvider]
    _invocation_recorder: Final[MutationInvocationRecorder]

    def __init__(
        self,
        ports: SupportsSearchEntityIndexing,
        concept_registry: ConceptRegistry,
        time_provider: TimeProvider,
        invocation_recorder: MutationInvocationRecorder,
    ) -> None:
        """Constructor."""
        self._ports = ports
        self._concept_registry = concept_registry
        self._time_provider = time_provider
        self._invocation_recorder = invocation_recorder

    async def apply_for_mutation(self, mutation_id: MutationId) -> None:
        """Mirror the search follow-up enqueued by :meth:`JupiterLoggedInMutationUseCase._perform_pre_mutation_work`."""
        all_events = (
            await self._invocation_recorder.find_all_entity_events_for_mutation(
                mutation_id,
            )
        )
        if len(all_events) == 0:
            return
        if not mutation_produces_search_indexing_work(
            all_events, self._concept_registry
        ):
            return

        workspace_ref_id = workspace_ref_id_from_first_event_context(all_events)

        index_service = SearchEntityIndexService(
            self._ports, self._concept_registry, self._time_provider
        )

        for event in all_events:
            if not NamedEntityTag.is_valid(event.entity_type):
                continue
            if event.kind.is_removed:
                continue
            if event.entity_type not in NamedEntityTag:
                continue
            if event.entity_type in ENTITY_TYPES_SKIPPED_BY_SEARCH_INDEXER:
                continue

            await index_service.index(
                workspace_ref_id,
                event.entity_type,
                event.entity_ref_id,
            )

        for event in all_events:
            if event.entity_type not in ("Note", "TagLink", "ContactLink"):
                continue
            if event.kind.is_removed:
                continue

            link: Note | TagLink | ContactLink | None = None
            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                if event.entity_type == "Note":
                    link = await uow.get(NoteRepository).load_by_id(
                        event.entity_ref_id, allow_archived=True
                    )
                elif event.entity_type == "TagLink":
                    link = await uow.get_for(TagLink).load_by_id(
                        event.entity_ref_id, allow_archived=True
                    )
                else:
                    link = await uow.get_for(ContactLink).load_by_id(
                        event.entity_ref_id, allow_archived=True
                    )

            if link.owner.the_type not in NamedEntityTag:
                continue
            if link.owner.the_type in ENTITY_TYPES_SKIPPED_BY_SEARCH_INDEXER:
                continue

            await index_service.index(
                workspace_ref_id,
                link.owner.the_type,
                link.owner.ref_id,
            )

        for event in all_events:
            if not NamedEntityTag.is_valid(event.entity_type):
                continue
            if not event.kind.is_removed:
                continue

            entity_clm = self._concept_registry.get_entity_by_name(event.entity_type)
            if not issubclass(entity_clm, CrownEntity):
                continue

            await index_service.remove(
                workspace_ref_id=workspace_ref_id,
                entity_type=event.entity_type,
                entity_ref_id=event.entity_ref_id,
            )


def workspace_ref_id_from_first_event_context(
    all_events: list[MutationEntityEvent],
) -> EntityId:
    """Parse ``user:…+workspace:…`` from the first event (all share the same mutation context)."""
    from jupiter.core.config import JupiterLoggedInMutationContext

    if len(all_events) == 0:
        raise ValueError("Cannot infer workspace from empty mutation events")
    return JupiterLoggedInMutationContext.unwrap_str(all_events[0].context_str)[1]
