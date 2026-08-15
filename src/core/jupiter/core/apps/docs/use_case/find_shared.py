"""Find directories and docs shared with the current user (entry points).

Hierarchical browsing only shows children of folders the user can open. Shared
items live in another workspace's tree, so without this listing there is no
way to discover them. We return only *direct* non-owner grants (not inherited
cascade rows) — those are the natural entry points into a shared subtree.
"""

from typing import cast

from jupiter.core.app import AppCore
from jupiter.core.apps.docs.sub.dir.root import Dir
from jupiter.core.apps.docs.sub.doc.root import Doc
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.reason import AccessStatusReason
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.sub.link.root import TagLink, TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterFindCrownEntityArgs,
    JupiterFindCrownEntityUseCase,
)
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
class DocsFindSharedArgs(JupiterFindCrownEntityArgs):
    """Args for finding shared docs entry points."""

    allow_archived: bool | None


@use_case_result_part
class DocsFindSharedDirEntry(UseCaseResultBase):
    """A directory shared directly with the current user."""

    dir: Dir
    tags: list[Tag]
    owner: UserLight
    access_status: AccessStatus


@use_case_result_part
class DocsFindSharedDocEntry(UseCaseResultBase):
    """A doc shared directly with the current user."""

    doc: Doc
    note: Note | None
    tags: list[Tag]
    owner: UserLight
    access_status: AccessStatus


@use_case_result
class DocsFindSharedResult(UseCaseResultBase):
    """Shared directories and docs that are entry points for the current user."""

    dirs: list[DocsFindSharedDirEntry]
    docs: list[DocsFindSharedDocEntry]


@readonly_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DocsFindSharedUseCase(
    JupiterFindCrownEntityUseCase[DocsFindSharedArgs, DocsFindSharedResult]
):
    """List directories/docs the user was invited to, for the root Shared section."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: DocsFindSharedArgs,
    ) -> DocsFindSharedResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        user_ref_id = context.user.ref_id

        dir_statuses = await uow.get(AccessStatusRepository).find_all_for_user(
            NamedEntityTag.DIR.value,
            user_ref_id,
        )
        doc_statuses = await uow.get(AccessStatusRepository).find_all_for_user(
            NamedEntityTag.DOC.value,
            user_ref_id,
        )

        shared_dir_status_by_ref_id = {
            status.entity.ref_id: status
            for status in dir_statuses
            if status.reason == AccessStatusReason.GRANT
            and status.access_level != AccessLevel.OWNER
            and status.access_level.allows(AccessLevel.READER)
        }
        shared_doc_status_by_ref_id = {
            status.entity.ref_id: status
            for status in doc_statuses
            if status.reason == AccessStatusReason.GRANT
            and status.access_level != AccessLevel.OWNER
            and status.access_level.allows(AccessLevel.READER)
        }

        dirs = (
            await self.find_all_entities(
                uow,
                user_ref_id,
                Dir,
                allow_archived=allow_archived,
                filter_ref_ids=list(shared_dir_status_by_ref_id.keys()),
            )
            if shared_dir_status_by_ref_id
            else []
        )
        docs = (
            await self.find_all_entities(
                uow,
                user_ref_id,
                Doc,
                allow_archived=allow_archived,
                filter_ref_ids=list(shared_doc_status_by_ref_id.keys()),
            )
            if shared_doc_status_by_ref_id
            else []
        )

        dirs_sorted = sorted(dirs, key=lambda d: str(d.name))
        docs_sorted = sorted(docs, key=lambda d: str(d.name))

        if not dirs_sorted and not docs_sorted:
            return DocsFindSharedResult(dirs=[], docs=[])

        dir_owner_links = [
            EntityLink.std(NamedEntityTag.DIR.value, d.ref_id) for d in dirs_sorted
        ]
        doc_owner_links = [
            EntityLink.std(NamedEntityTag.DOC.value, d.ref_id) for d in docs_sorted
        ]
        all_owner_links = dir_owner_links + doc_owner_links

        owner_ref_ids_by_entity_ref_id = (
            await OwnerUserRefIdsForEntitiesService().do_it(uow, all_owner_links)
        )
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            list(set(owner_ref_ids_by_entity_ref_id.values()))
        )
        owners_by_ref_id = {owner.ref_id: owner for owner in owners}

        dir_tag_links = (
            await uow.get(TagLinkRepository).find_all_generic(
                allow_archived=False,
                owner=dir_owner_links,
            )
            if dir_owner_links
            else []
        )
        doc_tag_links = (
            await uow.get(TagLinkRepository).find_all_generic(
                allow_archived=False,
                owner=doc_owner_links,
            )
            if doc_owner_links
            else []
        )
        dir_tag_links_by_ref_id = {
            cast(EntityId, tl.owner.ref_id): tl for tl in dir_tag_links
        }
        doc_tag_links_by_ref_id = {
            cast(EntityId, tl.owner.ref_id): tl for tl in doc_tag_links
        }

        all_tag_ref_ids: list[EntityId] = []
        for tl in dir_tag_links:
            all_tag_ref_ids.extend(tl.ref_ids)
        for tl in doc_tag_links:
            all_tag_ref_ids.extend(tl.ref_ids)
        if all_tag_ref_ids:
            all_tags = await uow.get_for(Tag).find_all_generic(
                allow_archived=False,
                ref_id=list(set(all_tag_ref_ids)),
            )
            all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
        else:
            all_tags_by_ref_id = {}

        notes_by_doc_ref_id: dict[EntityId, Note] = {}
        if doc_owner_links:
            notes = await uow.get_for(Note).find_all_generic(
                allow_archived=True,
                owner=doc_owner_links,
            )
            for note in notes:
                notes_by_doc_ref_id[cast(EntityId, note.owner.ref_id)] = note

        def tags_for(link_map: dict[EntityId, TagLink], ref_id: EntityId) -> list[Tag]:
            tag_link = link_map.get(ref_id)
            if tag_link is None:
                return []
            return [
                all_tags_by_ref_id[rid]
                for rid in tag_link.ref_ids
                if rid in all_tags_by_ref_id
            ]

        return DocsFindSharedResult(
            dirs=[
                DocsFindSharedDirEntry(
                    dir=d,
                    tags=tags_for(dir_tag_links_by_ref_id, d.ref_id),
                    owner=owners_by_ref_id[owner_ref_ids_by_entity_ref_id[d.ref_id]],
                    access_status=shared_dir_status_by_ref_id[d.ref_id],
                )
                for d in dirs_sorted
            ],
            docs=[
                DocsFindSharedDocEntry(
                    doc=d,
                    note=notes_by_doc_ref_id.get(d.ref_id),
                    tags=tags_for(doc_tag_links_by_ref_id, d.ref_id),
                    owner=owners_by_ref_id[owner_ref_ids_by_entity_ref_id[d.ref_id]],
                    access_status=shared_doc_status_by_ref_id[d.ref_id],
                )
                for d in docs_sorted
            ],
        )
