"""Apply search indexing for a single completed mutation (post-transaction work)."""

from typing import Final

from jupiter.core.common.search.domain import SearchDomain
from jupiter.core.common.search.service.entity_index import (
    ENTITY_TYPES_SKIPPED_BY_SEARCH_INDEXER,
    SearchEntityIndexService,
    SupportsSearchEntityIndexing,
)
from jupiter.core.common.sub.access.sub.grant.root import AccessGrant
from jupiter.core.common.sub.access.sub.status.service.affected_entities_for_access_grant_event import (
    AffectedEntitiesForAccessGrantEventService,
)
from jupiter.core.common.sub.access.sub.status.service.reader_user_ref_ids_for_entity import (
    ReaderUserRefIdsForEntityService,
)
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.locations.root import LocationDomain
from jupiter.core.common.sub.locations.sub.link.root import (
    LocationLink,
    LocationLinkRepository,
)
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.entity import CrownEntity, StubEntity
from jupiter.framework.mutation_inovcation.entity_event import MutationEntityEvent
from jupiter.framework.mutation_inovcation.recorder import MutationInvocationRecorder
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.time_provider import TimeProvider


def mutation_produces_search_indexing_work(
    all_events: list[MutationEntityEvent],
    concept_registry: ConceptRegistry,
) -> bool:
    """Whether the former post-mutation search loops would have done anything."""
    for event in all_events:
        if event.entity_type == AccessGrant.__name__:
            return True

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
        if event.entity_type not in (
            "Note",
            "TagLink",
            "ContactLink",
            "LocationLink",
            "Location",
            "Contact",
        ):
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
        if not issubclass(entity_clm, (CrownEntity, StubEntity)):
            continue
        return True

    return False


class SearchIndexingForMutationService:
    """Runs search upsert/remove for all entity events recorded for one mutation."""

    _ports: Final[SupportsSearchEntityIndexing]
    _concept_registry: Final[ConceptRegistry]
    _realm_codec_registry: Final[RealmCodecRegistry]
    _time_provider: Final[TimeProvider]
    _invocation_recorder: Final[MutationInvocationRecorder]

    def __init__(
        self,
        ports: SupportsSearchEntityIndexing,
        concept_registry: ConceptRegistry,
        realm_codec_registry: RealmCodecRegistry,
        time_provider: TimeProvider,
        invocation_recorder: MutationInvocationRecorder,
    ) -> None:
        """Constructor."""
        self._ports = ports
        self._concept_registry = concept_registry
        self._realm_codec_registry = realm_codec_registry
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

        workspace_ref_id = workspace_ref_id_from_events(all_events)

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            search_domain = await uow.get_for(SearchDomain).load_by_parent(
                workspace_ref_id
            )

        index_service = SearchEntityIndexService(
            self._ports, self._concept_registry, self._time_provider
        )
        reader_user_ref_ids_service = ReaderUserRefIdsForEntityService()
        affected_entities_service = AffectedEntitiesForAccessGrantEventService()

        updated_visible_to_entities: set[tuple[str, EntityId]] = set()
        for event in all_events:
            if event.entity_type != AccessGrant.__name__:
                continue

            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                affected_entities = await affected_entities_service.do_it(
                    uow,
                    self._realm_codec_registry,
                    event.entity_ref_id,
                    event.data,
                )
            for entity_link in affected_entities:
                if entity_link.the_type not in NamedEntityTag:
                    continue
                if entity_link.the_type in ENTITY_TYPES_SKIPPED_BY_SEARCH_INDEXER:
                    continue

                dedup_key = (entity_link.the_type, entity_link.ref_id)
                if dedup_key in updated_visible_to_entities:
                    continue
                updated_visible_to_entities.add(dedup_key)

                async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                    visible_to = await reader_user_ref_ids_service.do_it(
                        uow,
                        entity_link,
                    )
                await index_service.update_visible_to(
                    workspace_ref_id,
                    search_domain.ref_id,
                    entity_link.the_type,
                    entity_link.ref_id,
                    visible_to,
                )

        for event in all_events:
            if event.entity_type == AccessGrant.__name__:
                continue
            if not NamedEntityTag.is_valid(event.entity_type):
                continue
            if event.kind.is_removed:
                continue
            if event.entity_type not in NamedEntityTag:
                continue
            if event.entity_type in ENTITY_TYPES_SKIPPED_BY_SEARCH_INDEXER:
                continue

            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                visible_to = await reader_user_ref_ids_service.do_it(
                    uow,
                    EntityLink.std(event.entity_type, event.entity_ref_id),
                )
            await index_service.index(
                workspace_ref_id,
                search_domain.ref_id,
                event.entity_type,
                event.entity_ref_id,
                visible_to,
            )

        for event in all_events:
            if event.entity_type not in (
                "Note",
                "TagLink",
                "ContactLink",
                "LocationLink",
            ):
                continue
            if event.kind.is_removed:
                continue

            link: Note | TagLink | ContactLink | LocationLink | None = None
            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                if event.entity_type == "Note":
                    link = await uow.get(NoteRepository).load_by_id(
                        event.entity_ref_id, allow_archived=True
                    )
                elif event.entity_type == "TagLink":
                    link = await uow.get_for(TagLink).load_by_id(
                        event.entity_ref_id, allow_archived=True
                    )
                elif event.entity_type == "ContactLink":
                    link = await uow.get_for(ContactLink).load_by_id(
                        event.entity_ref_id, allow_archived=True
                    )
                else:
                    link = await uow.get_for(LocationLink).load_by_id(
                        event.entity_ref_id, allow_archived=True
                    )

            if link.owner.the_type not in NamedEntityTag:
                continue
            if link.owner.the_type in ENTITY_TYPES_SKIPPED_BY_SEARCH_INDEXER:
                continue

            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                visible_to = await reader_user_ref_ids_service.do_it(
                    uow,
                    link.owner,
                )
            await index_service.index(
                workspace_ref_id,
                search_domain.ref_id,
                link.owner.the_type,
                link.owner.ref_id,
                visible_to,
            )

        for event in all_events:
            if event.entity_type != "Location":
                continue
            if event.kind.is_removed:
                continue

            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                location_domain = await uow.get_for(LocationDomain).load_by_parent(
                    workspace_ref_id
                )
                location_links = await uow.get(
                    LocationLinkRepository
                ).find_all_containing_location(
                    location_domain.ref_id,
                    event.entity_ref_id,
                    allow_archived=True,
                )

            for location_link in location_links:
                if location_link.owner.the_type not in NamedEntityTag:
                    continue
                if (
                    location_link.owner.the_type
                    in ENTITY_TYPES_SKIPPED_BY_SEARCH_INDEXER
                ):
                    continue
                async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                    visible_to = await reader_user_ref_ids_service.do_it(
                        uow,
                        location_link.owner,
                    )
                await index_service.index(
                    workspace_ref_id,
                    search_domain.ref_id,
                    location_link.owner.the_type,
                    location_link.owner.ref_id,
                    visible_to,
                )

        # A person is indexed under the name of its contact, so renaming a contact
        # must refresh the persons that link to it.
        for event in all_events:
            if event.entity_type != "Contact":
                continue
            if event.kind.is_removed:
                continue

            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                contact_domain = await uow.get_for(ContactDomain).load_by_parent(
                    workspace_ref_id
                )
                contact_links = await uow.get_for(ContactLink).find_all_generic(
                    parent_ref_id=contact_domain.ref_id,
                    allow_archived=True,
                )

            for contact_link in contact_links:
                if contact_link.owner.the_type != NamedEntityTag.PERSON.value:
                    continue
                if event.entity_ref_id not in contact_link.contacts_ref_ids:
                    continue
                async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                    visible_to = await reader_user_ref_ids_service.do_it(
                        uow,
                        contact_link.owner,
                    )
                await index_service.index(
                    workspace_ref_id,
                    search_domain.ref_id,
                    contact_link.owner.the_type,
                    contact_link.owner.ref_id,
                    visible_to,
                )

        for event in all_events:
            if not NamedEntityTag.is_valid(event.entity_type):
                continue
            if not event.kind.is_removed:
                continue

            entity_clm = self._concept_registry.get_entity_by_name(event.entity_type)
            if not issubclass(entity_clm, (CrownEntity, StubEntity)):
                continue

            await index_service.remove(
                workspace_ref_id=workspace_ref_id,
                search_domain_ref_id=search_domain.ref_id,
                entity_type=event.entity_type,
                entity_ref_id=event.entity_ref_id,
            )


def workspace_ref_id_from_events(
    all_events: list[MutationEntityEvent],
) -> EntityId:
    """The workspace a mutation was for.

    A logged-in mutation says it in its context, as ``user:…+workspace:…``, which
    all its events share. A guest mutation, one that signs up or makes a workspace,
    has no workspace yet when its context is built (the context is ``guest``): it is
    the one it created, which has an event of its own.
    """
    from jupiter.core.config import JupiterLoggedInMutationContext

    if len(all_events) == 0:
        raise ValueError("Cannot infer workspace from empty mutation events")
    if all_events[0].context_str == "guest":
        for event in all_events:
            if event.entity_type == "Workspace" and not event.kind.is_removed:
                return event.entity_ref_id
        raise ValueError("Guest mutation did not create a workspace to index")
    return JupiterLoggedInMutationContext.unwrap_str(all_events[0].context_str)[1]
