"""Index searchable leaf entities created during workspace initialization."""

from typing import Final

from jupiter.core.apps.docs.sub.dir.root import Dir
from jupiter.core.apps.life_plan.sub.aspects.root import Aspect
from jupiter.core.apps.life_plan.sub.milestones.root import Milestone
from jupiter.core.apps.prm.sub.circle.root import Circle
from jupiter.core.apps.schedule.sub.stream.root import ScheduleStream
from jupiter.core.apps.working_mem.root import WorkingMem
from jupiter.core.common.search.service.entity_index import (
    SearchEntityIndexService,
    SupportsSearchEntityIndexing,
)
from jupiter.core.common.sub.access.sub.status.service.reader_user_ref_ids_for_entity import (
    ReaderUserRefIdsForEntityService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.storage.repository import DomainStorageEngine
from jupiter.framework.time_provider import TimeProvider


class IndexWorkspaceSeedEntitiesService:
    """Index the leaf crown/stub entities seeded when a workspace is created."""

    _domain_storage_engine: Final[DomainStorageEngine]
    _ports: Final[SupportsSearchEntityIndexing]
    _concept_registry: Final[ConceptRegistry]
    _time_provider: Final[TimeProvider]

    def __init__(
        self,
        domain_storage_engine: DomainStorageEngine,
        ports: SupportsSearchEntityIndexing,
        concept_registry: ConceptRegistry,
        time_provider: TimeProvider,
    ) -> None:
        """Constructor."""
        self._domain_storage_engine = domain_storage_engine
        self._ports = ports
        self._concept_registry = concept_registry
        self._time_provider = time_provider

    async def do_it(
        self,
        *,
        workspace_ref_id: EntityId,
        search_domain_ref_id: EntityId,
        root_aspect_ref_id: EntityId,
        birth_milestone_ref_id: EntityId,
        first_schedule_stream_ref_id: EntityId,
        root_doc_dir_ref_id: EntityId,
        working_mem_ref_id: EntityId,
        circle_ref_ids: list[EntityId],
    ) -> None:
        """Index each seeded entity after resolving ACL visibility."""
        index_service = SearchEntityIndexService(
            self._ports, self._concept_registry, self._time_provider
        )
        reader_user_ref_ids_service = ReaderUserRefIdsForEntityService()

        entities_to_index: list[tuple[str, EntityId]] = [
            (Aspect.__name__, root_aspect_ref_id),
            (Milestone.__name__, birth_milestone_ref_id),
            (ScheduleStream.__name__, first_schedule_stream_ref_id),
            (Dir.__name__, root_doc_dir_ref_id),
            (WorkingMem.__name__, working_mem_ref_id),
            *[(Circle.__name__, circle_ref_id) for circle_ref_id in circle_ref_ids],
        ]

        for entity_type, entity_ref_id in entities_to_index:
            async with self._domain_storage_engine.get_unit_of_work() as uow:
                visible_to = await reader_user_ref_ids_service.do_it(
                    uow,
                    EntityLink.std(entity_type, entity_ref_id),
                )
            await index_service.index(
                workspace_ref_id,
                search_domain_ref_id,
                entity_type,
                entity_ref_id,
                visible_to,
            )
