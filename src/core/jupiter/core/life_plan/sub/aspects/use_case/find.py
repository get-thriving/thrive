"""The command for finding projects."""

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
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.framework.base.entity_id import EntityId
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
class ProjectFindArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    allow_archived: bool
    include_notes: bool
    include_tags: bool
    filter_ref_ids: list[EntityId] | None


@use_case_result
class ProjectFindResultEntry(UseCaseResultBase):
    """A single project result."""

    project: Project
    tags: list[Tag]
    note: Note | None


@use_case_result
class ProjectFindResult(UseCaseResultBase):
    """PersonFindResult object."""

    entries: list[ProjectFindResultEntry]


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class ProjectFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[ProjectFindArgs, ProjectFindResult]
):
    """The command for finding projects."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ProjectFindArgs,
    ) -> ProjectFindResult:
        """Execute the command's action."""
        workspace = context.workspace
        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )
        projects = await uow.get_for(Project).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=args.allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
        )

        notes_by_project_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if args.include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id,
            )
            notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=note_collection.ref_id,
                namespace=NoteNamespace.PROJECT,
                allow_archived=True,
                ref_id=[p.ref_id for p in projects],
            )
            for note in notes:
                notes_by_project_ref_id[note.parent_ref_id] = note

        if args.include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            all_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.PROJECT,
            )
            all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.PROJECT,
                source_entity_ref_id=[p.ref_id for p in projects],
            )
            tag_links_by_project_ref_id = {t.source_entity_ref_id: t for t in tag_links}
        else:
            all_tags_by_ref_id = {}
            tag_links_by_project_ref_id = {}

        return ProjectFindResult(
            entries=[
                ProjectFindResultEntry(
                    project=project,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_project_ref_id[
                                project.ref_id
                            ].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if project.ref_id in tag_links_by_project_ref_id
                        else []
                    ),
                    note=notes_by_project_ref_id.get(project.ref_id, None),
                )
                for project in projects
            ]
        )
