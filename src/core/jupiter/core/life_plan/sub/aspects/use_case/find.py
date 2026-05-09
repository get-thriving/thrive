"""The command for finding aspects."""

from collections import defaultdict
import traceback
from typing import cast

from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class AspectFindArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    allow_archived: bool | None
    include_notes: bool | None
    include_tags: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result
class AspectFindResultEntry(UseCaseResultBase):
    """A single aspect result."""

    aspect: Aspect
    tags: list[Tag]
    note: Note | None


@use_case_result
class AspectFindResult(UseCaseResultBase):
    """PersonFindResult object."""

    entries: list[AspectFindResultEntry]


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class AspectFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[AspectFindArgs, AspectFindResult]
):
    """The command for finding aspects."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: AspectFindArgs,
    ) -> AspectFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_notes = args.include_notes or False
        include_tags = args.include_tags or False

        workspace = context.workspace
        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )
        aspects = await uow.get_for(Aspect).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
        )

        notes_by_aspect_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id,
            )
            notes = await uow.get(NoteRepository).find_all_for_note_collection(
                note_collection_ref_id=note_collection.ref_id,
                allow_archived=True,
                filter_owners=[
                    EntityLink.std(NamedEntityTag.ASPECT.value, rid)
                    for rid in [p.ref_id for p in aspects]
                ],
            )
            for note in notes:
                notes_by_aspect_ref_id[note.owner.ref_id] = note

        if include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                owner=[
                    EntityLink.std(NamedEntityTag.ASPECT.value, p.ref_id)
                    for p in aspects
                ],
            )
            tag_links_by_aspect_ref_id = {
                cast(EntityId, tl.owner.ref_id): tl for tl in tag_links
            }
            all_tag_ref_ids: list[EntityId] = []
            for tl in tag_links:
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
            tag_links_by_aspect_ref_id = {}

        return AspectFindResult(
            entries=[
                AspectFindResultEntry(
                    aspect=aspect,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_aspect_ref_id[aspect.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if aspect.ref_id in tag_links_by_aspect_ref_id
                        else []
                    ),
                    note=notes_by_aspect_ref_id.get(aspect.ref_id, None),
                )
                for aspect in aspects
            ]
        )
