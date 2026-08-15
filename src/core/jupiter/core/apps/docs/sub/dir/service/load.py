"""Shared service for loading a directory listing."""

from typing import cast

from jupiter.core.apps.docs.sub.dir.root import Dir
from jupiter.core.apps.docs.sub.doc.root import Doc
from jupiter.core.common.sub.access.sub.grant.service.get_access_level_for_entity import (
    GetAccessLevelForEntityService,
)
from jupiter.core.common.sub.access.sub.grant.service.load_user_that_owns_entity import (
    LoadUserThatOwnsEntityService,
)
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.publish.sub.entity.root import (
    PublishEntity,
    PublishEntityRepository,
)
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.crown_entity_reader import CrownEntityReader
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import NoFilter
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_result,
    use_case_result_part,
)


@use_case_result_part
class DirLoadResultEntry(UseCaseResultBase):
    """One doc in the loaded directory."""

    doc: Doc
    tags: list[Tag]
    note: Note
    owner: UserLight
    access_status: AccessStatus | None


@use_case_result_part
class DirLoadSubdirEntry(UseCaseResultBase):
    """One subdirectory row (tags only; no note body)."""

    dir: Dir
    tags: list[Tag]
    owner: UserLight
    access_status: AccessStatus | None


@use_case_result
class DirLoadResult(UseCaseResultBase):
    """Loaded directory, its docs, and immediate child directories."""

    dir: Dir
    entries: list[DirLoadResultEntry]
    subdirs: list[DirLoadSubdirEntry]
    publish_entity: PublishEntity | None
    owner: UserLight
    access_status: AccessStatus | None
    parent_dir: Dir | None
    parent_dir_access_status: AccessStatus | None


class DirLoadService:
    """Shared service for loading a directory and its immediate children."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
        dir_entity: Dir,
        *,
        crown_entity_reader: CrownEntityReader,
        user_ref_id: EntityId | None = None,
        allow_archived: bool = False,
        filter_ref_ids: list[EntityId] | None = None,
        include_publish_entity: bool = True,
    ) -> DirLoadResult:
        """Load a directory with docs, child dirs, and optional publish entity.

        Callers must have already authorized access to the directory (via ACL or
        publish). Child docs/dirs are retained by the crown reader. Pass
        ``user_ref_id`` for authenticated loads; omit it for public/guest loads
        so ``access_status`` on the directory stays ``None``.
        """
        dir_entity = await crown_entity_reader.load_entity(
            Dir, dir_entity.ref_id, allow_archived=allow_archived
        )

        subdirs_sorted = sorted(
            await crown_entity_reader.find_all_entities(
                Dir,
                allow_archived=allow_archived,
                parent_dir_ref_id=[dir_entity.ref_id],
            ),
            key=lambda d: str(d.name),
        )

        docs = await crown_entity_reader.find_all_entities(
            Doc,
            allow_archived=allow_archived,
            ref_id=filter_ref_ids or NoFilter(),
            parent_dir_ref_id=[dir_entity.ref_id],
        )

        notes = await uow.get_for(Note).find_all_generic(
            allow_archived=True,
            owner=[
                EntityLink.std(NamedEntityTag.DOC.value, rid)
                for rid in [d.ref_id for d in docs]
            ],
        )
        notes_by_doc_ref_id: dict[EntityId, Note] = {}
        for n in notes:
            notes_by_doc_ref_id[n.owner.ref_id] = n

        doc_tag_links = await uow.get(TagLinkRepository).find_all_generic(
            allow_archived=False,
            owner=[EntityLink.std(NamedEntityTag.DOC.value, d.ref_id) for d in docs],
        )
        doc_tag_links_by_doc_ref_id = {
            cast(EntityId, tl.owner.ref_id): tl for tl in doc_tag_links
        }
        dir_tag_links = (
            await uow.get(TagLinkRepository).find_all_generic(
                allow_archived=False,
                owner=[
                    EntityLink.std(NamedEntityTag.DIR.value, sd.ref_id)
                    for sd in subdirs_sorted
                ],
            )
            if subdirs_sorted
            else []
        )
        dir_tag_links_by_dir_ref_id = {
            cast(EntityId, tl.owner.ref_id): tl for tl in dir_tag_links
        }
        all_tag_ref_ids: list[EntityId] = []
        for tl in doc_tag_links:
            all_tag_ref_ids.extend(tl.ref_ids)
        for tl in dir_tag_links:
            all_tag_ref_ids.extend(tl.ref_ids)
        if all_tag_ref_ids:
            all_tags = await uow.get_for(Tag).find_all_generic(
                allow_archived=False,
                ref_id=list(set(all_tag_ref_ids)),
            )
            all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
        else:
            all_tags_by_ref_id = {}

        doc_owner_links = [
            EntityLink.std(NamedEntityTag.DOC.value, d.ref_id) for d in docs
        ]
        subdir_owner_links = [
            EntityLink.std(NamedEntityTag.DIR.value, sd.ref_id) for sd in subdirs_sorted
        ]
        child_owner_links = doc_owner_links + subdir_owner_links

        owner_ref_ids_by_entity_ref_id: dict[EntityId, EntityId] = {}
        owners_by_ref_id: dict[EntityId, UserLight] = {}
        access_status_by_entity_ref_id: dict[EntityId, AccessStatus] = {}
        if child_owner_links:
            owner_ref_ids_by_entity_ref_id = (
                await OwnerUserRefIdsForEntitiesService().do_it(uow, child_owner_links)
            )
            owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
                list(set(owner_ref_ids_by_entity_ref_id.values()))
            )
            owners_by_ref_id = {owner.ref_id: owner for owner in owners}
            if user_ref_id is not None:
                access_statuses = await uow.get(
                    AccessStatusRepository
                ).load_all_for_entities_and_user(child_owner_links, user_ref_id)
                access_status_by_entity_ref_id = {
                    status.entity.ref_id: status for status in access_statuses
                }

        entries: list[DirLoadResultEntry] = []
        for doc in docs:
            note = notes_by_doc_ref_id.get(doc.ref_id)
            if note is None:
                raise InputValidationError(
                    f"Doc {doc.ref_id} has no associated note.",
                )
            entries.append(
                DirLoadResultEntry(
                    doc=doc,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in doc_tag_links_by_doc_ref_id[doc.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if doc.ref_id in doc_tag_links_by_doc_ref_id
                        else []
                    ),
                    note=note,
                    owner=owners_by_ref_id[owner_ref_ids_by_entity_ref_id[doc.ref_id]],
                    access_status=access_status_by_entity_ref_id.get(doc.ref_id),
                )
            )

        subdir_entries = [
            DirLoadSubdirEntry(
                dir=sd,
                tags=(
                    [
                        all_tags_by_ref_id[rid]
                        for rid in dir_tag_links_by_dir_ref_id[sd.ref_id].ref_ids
                        if rid in all_tags_by_ref_id
                    ]
                    if sd.ref_id in dir_tag_links_by_dir_ref_id
                    else []
                ),
                owner=owners_by_ref_id[owner_ref_ids_by_entity_ref_id[sd.ref_id]],
                access_status=access_status_by_entity_ref_id.get(sd.ref_id),
            )
            for sd in subdirs_sorted
        ]

        publish_entity = None
        if include_publish_entity:
            publish_entity = await uow.get(
                PublishEntityRepository
            ).load_optional_for_owner(
                EntityLink.std(NamedEntityTag.DIR.value, dir_entity.ref_id),
                allow_archived=allow_archived,
            )

        dir_entity_link = EntityLink.std(NamedEntityTag.DIR.value, dir_entity.ref_id)
        owner = await LoadUserThatOwnsEntityService().do_it(uow, dir_entity_link)
        access_status = (
            await GetAccessLevelForEntityService().do_it(
                uow, dir_entity_link, user_ref_id
            )
            if user_ref_id is not None
            else None
        )

        parent_dir: Dir | None = None
        parent_dir_access_status: AccessStatus | None = None
        if dir_entity.parent_dir_ref_id is not None:
            # Load without ACL so the UI can hide ".." when the parent is shared
            # out of reach; do not raise if the viewer has no grant on it.
            parent_dir = await uow.get_for(Dir).load_by_id(
                dir_entity.parent_dir_ref_id,
                allow_archived=allow_archived,
            )
            if user_ref_id is not None:
                parent_dir_access_status = await uow.get(
                    AccessStatusRepository
                ).load_optional_for_entity_and_user(
                    EntityLink.std(
                        NamedEntityTag.DIR.value, dir_entity.parent_dir_ref_id
                    ),
                    user_ref_id,
                )

        return DirLoadResult(
            dir=dir_entity,
            entries=entries,
            subdirs=subdir_entries,
            publish_entity=publish_entity,
            owner=owner,
            access_status=access_status,
            parent_dir=parent_dir,
            parent_dir_access_status=parent_dir_access_status,
        )
