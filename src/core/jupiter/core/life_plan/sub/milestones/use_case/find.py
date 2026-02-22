"""The command for finding milestones."""

from collections import defaultdict

from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class MilestoneFindArgs(UseCaseArgsBase):
    """MilestoneFindArgs."""

    allow_archived: bool | None
    include_notes: bool | None
    include_tags: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result
class MilestoneFindResultEntry(UseCaseResultBase):
    """A single milestone result."""

    milestone: Milestone
    tags: list[Tag]
    note: Note | None


@use_case_result
class MilestoneFindResult(UseCaseResultBase):
    """MilestoneFindResult object."""

    entries: list[MilestoneFindResultEntry]


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class MilestoneFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[MilestoneFindArgs, MilestoneFindResult]
):
    """The command for finding milestones."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: MilestoneFindArgs,
    ) -> MilestoneFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_notes = args.include_notes or False
        include_tags = args.include_tags or False

        workspace = context.workspace

        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )
        milestones = await uow.get_for(Milestone).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
        )

        notes_by_milestone_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id,
            )
            notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=note_collection.ref_id,
                namespace=NoteNamespace.MILESTONE,
                allow_archived=True,
                ref_id=[m.ref_id for m in milestones],
            )
            for note in notes:
                notes_by_milestone_ref_id[note.parent_ref_id] = note

        if include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            all_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.MILESTONE,
            )
            all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.MILESTONE,
                source_entity_ref_id=[m.ref_id for m in milestones],
            )
            tag_links_by_milestone_ref_id = {
                t.source_entity_ref_id: t for t in tag_links
            }
        else:
            all_tags_by_ref_id = {}
            tag_links_by_milestone_ref_id = {}

        return MilestoneFindResult(
            entries=[
                MilestoneFindResultEntry(
                    milestone=milestone,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_milestone_ref_id[
                                milestone.ref_id
                            ].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if milestone.ref_id in tag_links_by_milestone_ref_id
                        else []
                    ),
                    note=notes_by_milestone_ref_id.get(milestone.ref_id, None),
                )
                for milestone in milestones
            ]
        )
