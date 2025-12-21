"""The command for finding projects."""

from collections import defaultdict

from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.projects.collection import ProjectCollection
from jupiter.core.projects.root import Project
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
    filter_ref_ids: list[EntityId] | None


@use_case_result
class ProjectFindResultEntry(UseCaseResultBase):
    """A single project result."""

    project: Project
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

        project_collection = await uow.get_for(ProjectCollection).load_by_parent(
            workspace.ref_id,
        )
        projects = await uow.get_for(Project).find_all_generic(
            parent_ref_id=project_collection.ref_id,
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
                domain=NoteDomain.PROJECT,
                allow_archived=True,
                ref_id=[p.ref_id for p in projects],
            )
            for note in notes:
                notes_by_project_ref_id[note.parent_ref_id] = note

        return ProjectFindResult(
            entries=[
                ProjectFindResultEntry(
                    project=project,
                    note=notes_by_project_ref_id.get(project.ref_id, None),
                )
                for project in projects
            ]
        )
