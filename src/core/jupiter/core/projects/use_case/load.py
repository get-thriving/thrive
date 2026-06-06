"""Use case for loading projects."""

from jupiter.core.projects.root import Project
from jupiter.core.projects.stats import ProjectStats, ProjectStatsRepository
from jupiter.core.projects.sub.milestones.root import ProjectMilestone
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
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
class ProjectLoadArgs(UseCaseArgsBase):
    """ProjectLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class ProjectLoadResult(UseCaseResultBase):
    """ProjectLoadResult."""

    project: Project
    aspect: Aspect
    chapter: Chapter | None
    goal: Goal | None
    milestones: list[ProjectMilestone]
    inbox_tasks: list[InboxTask]
    tags: list[Tag]
    contacts: list[Contact]
    note: Note | None
    time_event_blocks: list[TimeEventInDayBlock]
    stats: ProjectStats


@readonly_use_case(WorkspaceFeature.PROJECTS)
class ProjectLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[ProjectLoadArgs, ProjectLoadResult]
):
    """The use case for loading a particular project."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ProjectLoadArgs,
    ) -> ProjectLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        workspace = context.workspace

        project = await uow.get_for(Project).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )
        aspect = await uow.get_for(Aspect).load_by_id(project.aspect_ref_id)
        chapter = (
            await uow.get_for(Chapter).load_by_id(project.chapter_ref_id)
            if project.chapter_ref_id
            else None
        )
        goal = (
            await uow.get_for(Goal).load_by_id(project.goal_ref_id)
            if project.goal_ref_id
            else None
        )
        milestones = await uow.get_for(ProjectMilestone).find_all_generic(
            parent_ref_id=project.ref_id,
            allow_archived=False,
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_owner_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=allow_archived,
            owner=EntityLink.std(NamedEntityTag.PROJECT.value, project.ref_id),
        )

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(NamedEntityTag.PROJECT.value, project.ref_id),
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace.ref_id,
        )
        contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.PROJECT.value, project.ref_id),
        )
        if contact_link is not None:
            contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=contact_link.contacts_ref_ids,
            )
        else:
            contacts = []

        note = await uow.get(NoteRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.PROJECT.value, project.ref_id),
            allow_archived=allow_archived,
        )
        time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
            workspace.ref_id
        )
        time_event_blocks = await uow.get_for(TimeEventInDayBlock).find_all_generic(
            parent_ref_id=time_event_domain.ref_id,
            allow_archived=False,
            owner=EntityLink.std(NamedEntityTag.PROJECT.value, project.ref_id),
        )
        stats = await uow.get(ProjectStatsRepository).load_by_key_optional(
            project.ref_id
        )
        if stats is None:
            raise Exception("Stats not found")

        return ProjectLoadResult(
            project=project,
            aspect=aspect,
            chapter=chapter,
            goal=goal,
            milestones=milestones,
            inbox_tasks=inbox_tasks,
            tags=tags,
            contacts=contacts,
            note=note,
            time_event_blocks=time_event_blocks,
            stats=stats,
        )
