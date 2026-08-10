"""Use case for finding all directories in the workspace doc collection."""

from typing import cast

from jupiter.core.app import AppCore
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterFindCrownEntityArgs,
    JupiterFindCrownEntityUseCase,
)
from jupiter.core.docs.sub.dir.root import Dir
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
class DirFindArgs(JupiterFindCrownEntityArgs):
    """DirFind args."""

    allow_archived: bool | None
    include_tags: bool | None


@use_case_result_part
class DirFindResultEntry(UseCaseResultBase):
    """One directory row in the find-all response."""

    dir: Dir
    tags: list[Tag]
    owner: UserLight
    access_status: AccessStatus


@use_case_result
class DirFindResult(UseCaseResultBase):
    """All directories in the doc collection."""

    entries: list[DirFindResultEntry]


@readonly_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DirFindUseCase(JupiterFindCrownEntityUseCase[DirFindArgs, DirFindResult]):
    """Load every directory in the workspace docs tree (optionally with tags)."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: DirFindArgs,
    ) -> DirFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_tags = args.include_tags if args.include_tags is not None else True

        dirs = await self.find_all_entities(
            uow,
            context.user.ref_id,
            Dir,
            allow_archived=allow_archived,
        )
        dirs_sorted = sorted(dirs, key=lambda d: str(d.name))
        if not dirs_sorted:
            return DirFindResult(entries=[])

        dir_owner_links = [
            EntityLink.std(NamedEntityTag.DIR.value, d.ref_id) for d in dirs_sorted
        ]

        if include_tags:
            dir_tag_links = await uow.get(TagLinkRepository).find_all_generic(
                allow_archived=False,
                owner=dir_owner_links,
            )
            dir_tag_links_by_dir_ref_id = {
                cast(EntityId, tl.owner.ref_id): tl for tl in dir_tag_links
            }
            all_tag_ref_ids: list[EntityId] = []
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
        else:
            all_tags_by_ref_id = {}
            dir_tag_links_by_dir_ref_id = {}

        owner_ref_ids_by_dir_ref_id = await OwnerUserRefIdsForEntitiesService().do_it(
            uow,
            dir_owner_links,
        )
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            list(set(owner_ref_ids_by_dir_ref_id.values()))
        )
        owners_by_ref_id = {owner.ref_id: owner for owner in owners}

        access_statuses = await uow.get(
            AccessStatusRepository
        ).load_all_for_entities_and_user(dir_owner_links, context.user.ref_id)
        access_status_by_dir_ref_id = {
            status.entity.ref_id: status for status in access_statuses
        }

        entries = [
            DirFindResultEntry(
                dir=d,
                tags=(
                    [
                        all_tags_by_ref_id[rid]
                        for rid in dir_tag_links_by_dir_ref_id[d.ref_id].ref_ids
                        if rid in all_tags_by_ref_id
                    ]
                    if d.ref_id in dir_tag_links_by_dir_ref_id
                    else []
                ),
                owner=owners_by_ref_id[owner_ref_ids_by_dir_ref_id[d.ref_id]],
                access_status=access_status_by_dir_ref_id[d.ref_id],
            )
            for d in dirs_sorted
        ]

        return DirFindResult(entries=entries)
