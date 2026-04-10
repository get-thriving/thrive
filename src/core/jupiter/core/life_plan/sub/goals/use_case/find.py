"""The command for finding goals."""

from collections import defaultdict

from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note, NoteRepository
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
from jupiter.core.life_plan.sub.goals.root import Goal
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
)


@use_case_args
class GoalFindArgs(UseCaseArgsBase):
    """GoalFindArgs."""

    allow_archived: bool | None
    include_notes: bool | None
    include_tags: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result
class GoalFindResultEntry(UseCaseResultBase):
    """A single goal result."""

    goal: Goal
    tags: list[Tag]
    note: Note | None


@use_case_result
class GoalFindResult(UseCaseResultBase):
    """GoalFindResult object."""

    entries: list[GoalFindResultEntry]


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class GoalFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[GoalFindArgs, GoalFindResult]
):
    """The command for finding goals."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: GoalFindArgs,
    ) -> GoalFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_notes = args.include_notes or False
        include_tags = args.include_tags or False

        workspace = context.workspace

        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )
        goals = await uow.get_for(Goal).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
        )

        notes_by_goal_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id,
            )
            notes = await uow.get(NoteRepository).find_all_for_note_collection(
                note_collection_ref_id=note_collection.ref_id,
                allow_archived=True,
                filter_owners=[
                    EntityLink.std(NamedEntityTag.GOAL.value, rid)
                    for rid in [g.ref_id for g in goals]
                ],
            )
            for note in notes:
                notes_by_goal_ref_id[note.owner.ref_id] = note

        if include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            all_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.GOAL,
            )
            all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.GOAL,
                source_entity_ref_id=[g.ref_id for g in goals],
            )
            tag_links_by_goal_ref_id = {t.source_entity_ref_id: t for t in tag_links}
        else:
            all_tags_by_ref_id = {}
            tag_links_by_goal_ref_id = {}

        return GoalFindResult(
            entries=[
                GoalFindResultEntry(
                    goal=goal,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_goal_ref_id[goal.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if goal.ref_id in tag_links_by_goal_ref_id
                        else []
                    ),
                    note=notes_by_goal_ref_id.get(goal.ref_id, None),
                )
                for goal in goals
            ]
        )
