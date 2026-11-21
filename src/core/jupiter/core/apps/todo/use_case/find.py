"""The command for finding todo tasks."""

from collections import defaultdict
from typing import cast

from jupiter.core.apps.life_plan.sub.aspects.root import Aspect
from jupiter.core.apps.life_plan.sub.chapters.root import Chapter
from jupiter.core.apps.life_plan.sub.goals.root import Goal
from jupiter.core.apps.todo.root import TodoTask
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.grant.root import AccessGrantRepository
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.parent_link_namespace import TODO_TASK
from jupiter.core.common.sub.inbox_tasks.root import InboxTask, InboxTaskRepository
from jupiter.core.common.sub.locations.sub.link.root import LocationLink
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
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
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    UnavailableForContextError,
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class TodoTaskFindArgs(JupiterFindCrownEntityArgs):
    """TodoTaskFind args."""

    allow_archived: bool | None
    # Return only the todo tasks whose inbox task was finished (done or not
    # done) at or after this time, archived ones too if `allow_archived` says so.
    # What it costs follows the number of todo tasks finished since, not the
    # number there are: asking for what was finished in the last week does not
    # load every archived todo task there ever was.
    filter_finished_after: Timestamp | None
    include_tags: bool | None
    include_contacts: bool | None
    include_locations: bool | None
    include_notes: bool | None
    include_life_plan: bool | None
    include_inbox_tasks: bool | None
    filter_ref_ids: list[EntityId] | None
    filter_aspect_ref_ids: list[EntityId] | None


@use_case_result_part
class TodoTaskFindResultEntry(UseCaseResultBase):
    """A single entry in the todo task find response."""

    todo_task: TodoTask
    inbox_task: InboxTask | None
    note: Note | None
    aspect: Aspect | None
    chapter: Chapter | None
    goal: Goal | None
    tags: list[Tag]
    contacts: list[Contact]
    location: Location | None
    owner: UserLight
    access_status: AccessStatus


@use_case_result
class TodoTaskFindResult(UseCaseResultBase):
    """Todo task find result."""

    entries: list[TodoTaskFindResultEntry]


@readonly_use_case(WorkspaceFeature.TODO_TASK)
class TodoTaskFindUseCase(
    JupiterFindCrownEntityUseCase[TodoTaskFindArgs, TodoTaskFindResult]
):
    """The command for finding todo tasks."""

    # How many todo tasks are looked up at once. Keeps the number of query
    # parameters well under what the databases accept.
    _CHUNK_SIZE = 1000

    @staticmethod
    def _chunks(items: list[EntityId], size: int) -> list[list[EntityId]]:
        return [items[start : start + size] for start in range(0, len(items), size)]

    async def _find_finished_inbox_tasks(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        finished_after: Timestamp,
        filter_ref_ids: list[EntityId] | None,
    ) -> dict[EntityId, InboxTask]:
        """Find the inbox tasks of the todo tasks finished at or after a time, by todo task.

        This must not cost more as a user accumulates todo tasks, so it never
        goes through the list of all the todo tasks the user can access:

        - the user's own todo tasks have their inbox tasks in the workspace's
          inbox task collection, which is searched by finish time with the
          (collection, completed time) index;
        - todo tasks shared by others are found through the grants that were
          made to the user, which, unlike owner grants, are few.

        Access is then checked for just the todo tasks that were found.
        """
        user_ref_id = context.user.ref_id
        inbox_task_repository = uow.get(InboxTaskRepository)

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            context.workspace.ref_id
        )
        inbox_tasks = await inbox_task_repository.find_all_for_parent_link_namespaces(
            parent_ref_id=inbox_task_collection.ref_id,
            parent_link_namespaces=[TODO_TASK],
            allow_archived=True,
            filter_completed_after=finished_after,
        )

        shared_grants = await uow.get(AccessGrantRepository).find_all_shared_with_user(
            user_ref_id, allow_archived=True
        )
        shared_todo_ref_ids = list(
            {
                grant.entity.ref_id
                for grant in shared_grants
                if grant.entity.the_type == NamedEntityTag.TODO_TASK.value
            }
        )
        for chunk in self._chunks(shared_todo_ref_ids, self._CHUNK_SIZE):
            inbox_tasks.extend(
                await inbox_task_repository.find_all_for_owner_created_desc(
                    owner=[
                        EntityLink.std(NamedEntityTag.TODO_TASK.value, ref_id)
                        for ref_id in chunk
                    ],
                    allow_archived=True,
                    filter_completed_after=finished_after,
                )
            )

        by_todo_ref_id = {
            inbox_task.owner.ref_id: inbox_task for inbox_task in inbox_tasks
        }
        if filter_ref_ids is not None:
            wanted = set(filter_ref_ids)
            by_todo_ref_id = {
                ref_id: inbox_task
                for ref_id, inbox_task in by_todo_ref_id.items()
                if ref_id in wanted
            }

        readable: set[EntityId] = set()
        for chunk in self._chunks(list(by_todo_ref_id), self._CHUNK_SIZE):
            statuses = await uow.get(
                AccessStatusRepository
            ).load_all_for_entities_and_user(
                [
                    EntityLink.std(NamedEntityTag.TODO_TASK.value, ref_id)
                    for ref_id in chunk
                ],
                user_ref_id,
            )
            readable.update(
                status.entity.ref_id
                for status in statuses
                if status.access_level.allows(AccessLevel.READER)
            )
        return {
            ref_id: inbox_task
            for ref_id, inbox_task in by_todo_ref_id.items()
            if ref_id in readable
        }

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TodoTaskFindArgs,
    ) -> TodoTaskFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_tags = args.include_tags or False
        include_contacts = args.include_contacts or False
        include_locations = args.include_locations or False
        include_notes = args.include_notes or False
        include_life_plan = args.include_life_plan or False
        include_inbox_tasks = args.include_inbox_tasks or False
        workspace = context.workspace

        if (
            not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and args.filter_aspect_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        if args.filter_aspect_ref_ids:
            await self.check_entities(
                uow,
                context.user.ref_id,
                Aspect,
                args.filter_aspect_ref_ids,
                allow_archived,
            )

        finished_inbox_tasks_by_todo_ref_id: dict[EntityId, InboxTask] | None = None
        if args.filter_finished_after is not None:
            # Finishing is a property of the inbox task, so that is where the
            # candidates come from. Only the todo tasks of those are loaded.
            finished_inbox_tasks_by_todo_ref_id = await self._find_finished_inbox_tasks(
                uow, context, args.filter_finished_after, args.filter_ref_ids
            )
            todo_tasks = (
                await uow.get_for(TodoTask).find_all_generic(
                    parent_ref_id=None,
                    allow_archived=allow_archived,
                    ref_id=list(finished_inbox_tasks_by_todo_ref_id),
                )
                if finished_inbox_tasks_by_todo_ref_id
                else []
            )
        else:
            todo_tasks = await self.find_all_entities(
                uow,
                context.user.ref_id,
                TodoTask,
                allow_archived=allow_archived,
                filter_ref_ids=args.filter_ref_ids,
            )
        if args.filter_aspect_ref_ids is not None:
            filter_aspect_ref_ids = set(args.filter_aspect_ref_ids)
            todo_tasks = [
                todo_task
                for todo_task in todo_tasks
                if todo_task.aspect_ref_id in filter_aspect_ref_ids
            ]
        if not todo_tasks:
            return TodoTaskFindResult(entries=[])

        todo_owner_links = [
            EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id)
            for todo_task in todo_tasks
        ]

        if include_life_plan:
            aspect_ref_ids = list({todo_task.aspect_ref_id for todo_task in todo_tasks})
            chapter_ref_ids = list(
                {
                    todo_task.chapter_ref_id
                    for todo_task in todo_tasks
                    if todo_task.chapter_ref_id is not None
                }
            )
            goal_ref_ids = list(
                {
                    todo_task.goal_ref_id
                    for todo_task in todo_tasks
                    if todo_task.goal_ref_id is not None
                }
            )
            aspects = (
                await uow.get_for(Aspect).find_all_generic(
                    allow_archived=allow_archived,
                    ref_id=aspect_ref_ids,
                )
                if aspect_ref_ids
                else []
            )
            aspect_by_ref_id = {it.ref_id: it for it in aspects}
            chapters = (
                await uow.get_for(Chapter).find_all_generic(
                    allow_archived=allow_archived,
                    ref_id=chapter_ref_ids,
                )
                if chapter_ref_ids
                else []
            )
            chapter_by_ref_id = {it.ref_id: it for it in chapters}
            goals = (
                await uow.get_for(Goal).find_all_generic(
                    allow_archived=allow_archived,
                    ref_id=goal_ref_ids,
                )
                if goal_ref_ids
                else []
            )
            goal_by_ref_id = {it.ref_id: it for it in goals}
        else:
            aspect_by_ref_id = None
            chapter_by_ref_id = None
            goal_by_ref_id = None

        if include_inbox_tasks:
            if finished_inbox_tasks_by_todo_ref_id is not None:
                inbox_tasks_by_todo_ref_id = finished_inbox_tasks_by_todo_ref_id
            else:
                inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                    allow_archived=True,
                    owner=todo_owner_links,
                )
                inbox_tasks_by_todo_ref_id = {it.owner.ref_id: it for it in inbox_tasks}
        else:
            inbox_tasks_by_todo_ref_id = {}

        notes_by_todo_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            notes = await uow.get_for(Note).find_all_generic(
                allow_archived=True,
                owner=todo_owner_links,
            )
            for note in notes:
                notes_by_todo_ref_id[note.owner.ref_id] = note

        if include_tags:
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                allow_archived=False,
                owner=todo_owner_links,
            )
            tag_links_by_todo_ref_id = {
                cast(EntityId, tl.owner.ref_id): tl for tl in tag_links
            }
            all_tag_ref_ids: list[EntityId] = []
            for tl in tag_links:
                all_tag_ref_ids.extend(tl.ref_ids)
            if all_tag_ref_ids:
                all_tags = await uow.get_for(Tag).find_all_generic(
                    allow_archived=False,
                    ref_id=list(set(all_tag_ref_ids)),
                )
                all_tags_by_ref_id = {it.ref_id: it for it in all_tags}
            else:
                all_tags_by_ref_id = {}

        else:
            all_tags_by_ref_id = {}
            tag_links_by_todo_ref_id = {}

        if include_contacts:
            contact_links = await uow.get_for(ContactLink).find_all_generic(
                allow_archived=False,
                owner=todo_owner_links,
            )
            todo_contacts_by_ref_id = {
                link.owner.ref_id: link.contacts_ref_ids for link in contact_links
            }
            all_contact_ref_ids: list[EntityId] = []
            for contact_ref_ids in todo_contacts_by_ref_id.values():
                all_contact_ref_ids.extend(contact_ref_ids)
            if all_contact_ref_ids:
                contacts = await uow.get_for(Contact).find_all_generic(
                    allow_archived=False,
                    ref_id=list(set(all_contact_ref_ids)),
                )
            else:
                contacts = []
            contacts_by_ref_id = {it.ref_id: it for it in contacts}
        else:
            todo_contacts_by_ref_id = {}
            contacts_by_ref_id = {}

        if include_locations:
            location_links = await uow.get_for(LocationLink).find_all_generic(
                allow_archived=False,
                owner=todo_owner_links,
            )
            todo_location_ref_id = {
                link.owner.ref_id: link.locations_ref_ids[0]
                for link in location_links
                if link.locations_ref_ids
            }
            if todo_location_ref_id:
                locations = await uow.get_for(Location).find_all_generic(
                    allow_archived=False,
                    ref_id=list(set(todo_location_ref_id.values())),
                )
            else:
                locations = []
            locations_by_ref_id = {it.ref_id: it for it in locations}
        else:
            todo_location_ref_id = {}
            locations_by_ref_id = {}

        owner_ref_ids_by_todo_ref_id = await OwnerUserRefIdsForEntitiesService().do_it(
            uow,
            todo_owner_links,
        )
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            list(set(owner_ref_ids_by_todo_ref_id.values()))
        )
        owners_by_ref_id = {owner.ref_id: owner for owner in owners}

        access_statuses = await uow.get(
            AccessStatusRepository
        ).load_all_for_entities_and_user(todo_owner_links, context.user.ref_id)
        access_status_by_todo_ref_id = {
            status.entity.ref_id: status for status in access_statuses
        }

        return TodoTaskFindResult(
            entries=[
                TodoTaskFindResultEntry(
                    todo_task=todo_task,
                    inbox_task=inbox_tasks_by_todo_ref_id.get(todo_task.ref_id, None),
                    note=notes_by_todo_ref_id.get(todo_task.ref_id, None),
                    aspect=(
                        aspect_by_ref_id.get(todo_task.aspect_ref_id)
                        if aspect_by_ref_id is not None
                        else None
                    ),
                    chapter=(
                        chapter_by_ref_id.get(todo_task.chapter_ref_id)
                        if todo_task.chapter_ref_id is not None
                        and chapter_by_ref_id is not None
                        else None
                    ),
                    goal=(
                        goal_by_ref_id.get(todo_task.goal_ref_id)
                        if todo_task.goal_ref_id is not None
                        and goal_by_ref_id is not None
                        else None
                    ),
                    tags=(
                        [
                            all_tags_by_ref_id[tag_ref_id]
                            for tag_ref_id in tag_links_by_todo_ref_id[
                                todo_task.ref_id
                            ].ref_ids
                            if tag_ref_id in all_tags_by_ref_id
                        ]
                        if todo_task.ref_id in tag_links_by_todo_ref_id
                        else []
                    ),
                    contacts=[
                        contacts_by_ref_id[contact_ref_id]
                        for contact_ref_id in todo_contacts_by_ref_id.get(
                            todo_task.ref_id, []
                        )
                        if contact_ref_id in contacts_by_ref_id
                    ],
                    location=(
                        locations_by_ref_id.get(todo_location_ref_id[todo_task.ref_id])
                        if todo_task.ref_id in todo_location_ref_id
                        else None
                    ),
                    owner=owners_by_ref_id[
                        owner_ref_ids_by_todo_ref_id[todo_task.ref_id]
                    ],
                    access_status=access_status_by_todo_ref_id[todo_task.ref_id],
                )
                for todo_task in todo_tasks
            ]
        )
