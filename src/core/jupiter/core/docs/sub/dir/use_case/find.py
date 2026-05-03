"""Use case for finding all directories in the workspace doc collection."""

from typing import cast

from jupiter.core.app import AppCore
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.docs.root import DocCollection
from jupiter.core.docs.sub.dir.root import Dir
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class DirFindArgs(UseCaseArgsBase):
    """DirFind args."""

    allow_archived: bool | None
    include_tags: bool | None


@use_case_result_part
class DirFindResultEntry(UseCaseResultBase):
    """One directory row in the find-all response."""

    dir: Dir
    tags: list[Tag]


@use_case_result
class DirFindResult(UseCaseResultBase):
    """All directories in the doc collection."""

    entries: list[DirFindResultEntry]


@readonly_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DirFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[DirFindArgs, DirFindResult]
):
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
        workspace = context.workspace
        doc_collection = await uow.get_for(DocCollection).load_by_parent(
            workspace.ref_id
        )

        dirs = await uow.get_for(Dir).find_all_generic(
            parent_ref_id=doc_collection.ref_id,
            allow_archived=allow_archived,
            parent_dir_ref_id=NoFilter(),
        )
        dirs_sorted = sorted(dirs, key=lambda d: str(d.name))

        if include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            dir_tag_links = (
                await uow.get(TagLinkRepository).find_all_generic(
                    parent_ref_id=tags_domain.ref_id,
                    allow_archived=False,
                    owner=[
                        EntityLink.std(NamedEntityTag.DIR.value, d.ref_id)
                        for d in dirs_sorted
                    ],
                )
                if dirs_sorted
                else []
            )
            dir_tag_links_by_dir_ref_id = {
                cast(EntityId, tl.owner.ref_id): tl for tl in dir_tag_links
            }
            all_tag_ref_ids: list[EntityId] = []
            for tl in dir_tag_links:
                all_tag_ref_ids.extend(tl.ref_ids)
            if all_tag_ref_ids:
                all_tags = await uow.get_for(Tag).find_all_generic(
                    parent_ref_id=tags_domain.ref_id,
                    allow_archived=False,
                    ref_id=list(set(all_tag_ref_ids)),
                )
                all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            else:
                all_tags_by_ref_id = {}
        else:
            all_tags_by_ref_id = {}
            dir_tag_links_by_dir_ref_id = {}

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
            )
            for d in dirs_sorted
        ]

        return DirFindResult(entries=entries)
