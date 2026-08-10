"""The use case for finding docs."""

from typing import cast

from jupiter.core.app import AppCore
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterFindCrownEntityArgs,
    JupiterFindCrownEntityUseCase,
)
from jupiter.core.docs.sub.doc.root import Doc
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class DocFindArgs(JupiterFindCrownEntityArgs):
    """DocFind args."""

    include_notes: bool | None
    allow_archived: bool | None
    include_tags: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result_part
class DocFindResultEntry(UseCaseResultBase):
    """A single entry in the load all docs response."""

    doc: Doc
    tags: list[Tag]
    note: Note | None
    owner: UserLight
    access_status: AccessStatus


@use_case_result
class DocFindResult(UseCaseResultBase):
    """The result."""

    entries: list[DocFindResultEntry]


@readonly_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DocFindUseCase(JupiterFindCrownEntityUseCase[DocFindArgs, DocFindResult]):
    """The use case for finding docs."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: DocFindArgs,
    ) -> DocFindResult:
        """Execute the command's action."""
        include_notes = args.include_notes or False
        allow_archived = args.allow_archived or False
        include_tags = args.include_tags or False

        docs = await self.find_all_entities(
            uow,
            context.user.ref_id,
            Doc,
            allow_archived=allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )
        if not docs:
            return DocFindResult(entries=[])

        doc_owner_links = [
            EntityLink.std(NamedEntityTag.DOC.value, doc.ref_id) for doc in docs
        ]

        notes_by_doc_ref_id: dict[EntityId, Note] = {}
        if include_notes:
            notes = await uow.get_for(Note).find_all_generic(
                allow_archived=True,
                owner=doc_owner_links,
            )
            for n in notes:
                notes_by_doc_ref_id[n.owner.ref_id] = n

        if include_tags:
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                allow_archived=False,
                owner=doc_owner_links,
            )
            tag_links_by_doc_ref_id = {
                cast(EntityId, tl.owner.ref_id): tl for tl in tag_links
            }
            all_tag_ref_ids: list[EntityId] = []
            for tl in tag_links:
                all_tag_ref_ids.extend(tl.ref_ids)
            if all_tag_ref_ids:
                all_tags = await uow.get_for(Tag).find_all_generic(
                    allow_archived=False,
                    ref_id=list(set(all_tag_ref_ids)),
                )
                all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            else:
                all_tags_by_ref_id = {}

        else:
            all_tags_by_ref_id = {}
            tag_links_by_doc_ref_id = {}

        owner_ref_ids_by_doc_ref_id = await OwnerUserRefIdsForEntitiesService().do_it(
            uow,
            doc_owner_links,
        )
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            list(set(owner_ref_ids_by_doc_ref_id.values()))
        )
        owners_by_ref_id = {owner.ref_id: owner for owner in owners}

        access_statuses = await uow.get(
            AccessStatusRepository
        ).load_all_for_entities_and_user(doc_owner_links, context.user.ref_id)
        access_status_by_doc_ref_id = {
            status.entity.ref_id: status for status in access_statuses
        }

        return DocFindResult(
            entries=[
                DocFindResultEntry(
                    doc=doc,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_doc_ref_id[doc.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if doc.ref_id in tag_links_by_doc_ref_id
                        else []
                    ),
                    note=notes_by_doc_ref_id.get(doc.ref_id, None),
                    owner=owners_by_ref_id[owner_ref_ids_by_doc_ref_id[doc.ref_id]],
                    access_status=access_status_by_doc_ref_id[doc.ref_id],
                )
                for doc in docs
            ]
        )
