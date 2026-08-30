"""Shared service for loading a doc."""

from jupiter.core.apps.docs.sub.doc.root import Doc
from jupiter.core.common.sub.access.sub.grant.service.get_access_level_for_entity import (
    GetAccessLevelForEntityService,
)
from jupiter.core.common.sub.access.sub.grant.service.load_user_that_owns_entity import (
    LoadUserThatOwnsEntityService,
)
from jupiter.core.common.sub.access.sub.status.root import AccessStatus
from jupiter.core.common.sub.locations.sub.link.root import LocationLinkRepository
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.publish.sub.entity.root import (
    PublishEntity,
    PublishEntityRepository,
)
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.crown_entity_reader import CrownEntityReader
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result


@use_case_result
class DocLoadResult(UseCaseResultBase):
    """DocLoad result."""

    doc: Doc
    note: Note
    tags: list[Tag]
    location: Location | None
    publish_entity: PublishEntity | None
    owner: UserLight
    access_status: AccessStatus | None


class DocLoadService:
    """Shared service for loading a doc and its dependent entities."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        doc: Doc,
        *,
        crown_entity_reader: CrownEntityReader,
        user_ref_id: EntityId | None = None,
        allow_archived: bool = False,
        include_publish_entity: bool = True,
    ) -> DocLoadResult:
        """Load a doc and its dependent entities.

        Callers must have already authorized access to the doc (via ACL or
        publish). Pass ``user_ref_id`` for authenticated loads; omit it for
        public/guest loads so ``access_status`` stays ``None``.
        """
        doc = await crown_entity_reader.load_entity(
            Doc, doc.ref_id, allow_archived=allow_archived
        )
        note = await uow.get(NoteRepository).load_for_owner(
            EntityLink.std(NamedEntityTag.DOC.value, doc.ref_id),
            allow_archived=allow_archived,
        )

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(NamedEntityTag.DOC.value, doc.ref_id),
        )
        tags = (
            await uow.get(TagRepository).find_all_generic(
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
            if tag_link is not None
            else []
        )

        location_link = await uow.get(LocationLinkRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.DOC.value, doc.ref_id),
        )
        location = None
        if location_link is not None and location_link.location_ref_id is not None:
            location = await uow.get_for(Location).load_by_id(
                location_link.location_ref_id, allow_archived=False
            )

        publish_entity = None
        if include_publish_entity:
            publish_entity = await uow.get(
                PublishEntityRepository
            ).load_optional_for_owner(
                EntityLink.std(NamedEntityTag.DOC.value, doc.ref_id),
                allow_archived=allow_archived,
            )

        doc_entity_link = EntityLink.std(NamedEntityTag.DOC.value, doc.ref_id)
        owner = await LoadUserThatOwnsEntityService().do_it(uow, doc_entity_link)
        access_status = (
            await GetAccessLevelForEntityService().do_it(
                uow, doc_entity_link, user_ref_id
            )
            if user_ref_id is not None
            else None
        )

        return DocLoadResult(
            doc=doc,
            note=note,
            tags=tags,
            location=location,
            publish_entity=publish_entity,
            owner=owner,
            access_status=access_status,
        )
