"""Service for resolving entities affected by an access-grant mutation event."""

import json

from jupiter.core.common.sub.access.sub.status.root import AccessStatusRepository
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.realm.realm import (
    EventStoreRealm,
    RealmCodecRegistry,
    RealmDecodingError,
)
from jupiter.framework.storage.repository import DomainUnitOfWork


class AffectedEntitiesForAccessGrantEventService:
    """Find entities whose ACL visibility may have changed due to a grant event."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        realm_codec_registry: RealmCodecRegistry,
        access_grant_ref_id: EntityId,
        event_data: str,
    ) -> set[EntityLink]:
        """Return entities tied to the grant, or the grant target from the event snapshot."""
        statuses = await uow.get(AccessStatusRepository).find_all_for_grant(
            access_grant_ref_id,
        )

        affected_entities = {status.entity for status in statuses}
        if len(affected_entities) > 0:
            return affected_entities

        entity_link = self._entity_link_from_access_grant_event_data(
            realm_codec_registry,
            event_data,
        )
        if entity_link is None:
            return set()
        return {entity_link}

    def _entity_link_from_access_grant_event_data(
        self,
        realm_codec_registry: RealmCodecRegistry,
        data: str,
    ) -> EntityLink | None:
        """Parse the grant's target entity from an access-grant event snapshot."""
        parsed = json.loads(data)
        entity_raw = parsed.get("entity")
        if entity_raw is None:
            return None
        try:
            return realm_codec_registry.get_decoder(
                EntityLink,
                EventStoreRealm,
            ).decode(entity_raw)
        except RealmDecodingError:
            return None
