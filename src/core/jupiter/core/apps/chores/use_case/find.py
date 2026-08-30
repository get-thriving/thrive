"""The command for finding a chore."""

from collections import defaultdict
from typing import cast

from jupiter.core.apps.chores.root import Chore
from jupiter.core.apps.life_plan.sub.aspects.root import Aspect
from jupiter.core.apps.life_plan.sub.chapters.root import Chapter
from jupiter.core.apps.life_plan.sub.goals.root import Goal
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
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
from jupiter.core.features import (
    WorkspaceFeature,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
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
class ChoreFindArgs(JupiterFindCrownEntityArgs):
    """PersonFindArgs."""

    allow_archived: bool | None
    include_tags: bool | None
    include_life_plan: bool | None
    include_inbox_tasks: bool | None
    include_notes: bool | None
    filter_ref_ids: list[EntityId] | None
    filter_aspect_ref_ids: list[EntityId] | None


@use_case_result_part
class ChoreFindResultEntry(UseCaseResultBase):
    """A single entry in the load all chores response."""

    chore: Chore
    note: Note | None
    aspect: Aspect | None
    chapter: Chapter | None
    goal: Goal | None
    inbox_tasks: list[InboxTask] | None
    tags: list[Tag]
    contacts: list[Contact]
    locations: list[Location]
    owner: UserLight
    access_status: AccessStatus


@use_case_result
class ChoreFindResult(UseCaseResultBase):
    """The result."""

    entries: list[ChoreFindResultEntry]


@readonly_use_case(WorkspaceFeature.CHORES)
class ChoreFindUseCase(JupiterFindCrownEntityUseCase[ChoreFindArgs, ChoreFindResult]):
    """The command for finding a chore."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ChoreFindArgs,
    ) -> ChoreFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_tags = args.include_tags or False
        include_life_plan = args.include_life_plan or False
        include_inbox_tasks = args.include_inbox_tasks or False
        include_notes = args.include_notes or False
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

        chores = await self.find_all_entities(
            uow,
            context.user.ref_id,
            Chore,
            allow_archived=allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )
        if args.filter_aspect_ref_ids is not None:
            filter_aspect_ref_ids = set(args.filter_aspect_ref_ids)
            chores = [c for c in chores if c.aspect_ref_id in filter_aspect_ref_ids]
        if not chores:
            return ChoreFindResult(entries=[])

        chore_owner_links = [
            EntityLink.std(NamedEntityTag.CHORE.value, c.ref_id) for c in chores
        ]

        if include_life_plan:
            aspect_ref_ids = list({c.aspect_ref_id for c in chores})
            chapter_ref_ids = list(
                {c.chapter_ref_id for c in chores if c.chapter_ref_id is not None}
            )
            goal_ref_ids = list(
                {c.goal_ref_id for c in chores if c.goal_ref_id is not None}
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
            inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                allow_archived=True,
                owner=chore_owner_links,
            )
        else:
            inbox_tasks = None

        notes_by_chore_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            notes = await uow.get_for(Note).find_all_generic(
                allow_archived=True,
                owner=chore_owner_links,
            )
            for note in notes:
                notes_by_chore_ref_id[note.owner.ref_id] = note

        if include_tags:
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                allow_archived=False,
                owner=chore_owner_links,
            )
            tag_links_by_chore_ref_id = {
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
                all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            else:
                all_tags_by_ref_id = {}

        else:
            all_tags_by_ref_id = {}
            tag_links_by_chore_ref_id = {}

        contact_links = await uow.get_for(ContactLink).find_all_generic(
            allow_archived=False,
            owner=chore_owner_links,
        )
        chore_contacts_by_ref_id = {
            link.owner.ref_id: link.contacts_ref_ids for link in contact_links
        }
        all_chore_contact_ref_ids = []
        for contact_ref_ids in chore_contacts_by_ref_id.values():
            all_chore_contact_ref_ids.extend(contact_ref_ids)
        contacts = []
        if all_chore_contact_ref_ids:
            contacts = await uow.get_for(Contact).find_all_generic(
                allow_archived=False,
                ref_id=list(set(all_chore_contact_ref_ids)),
            )
        contacts_by_ref_id = {c.ref_id: c for c in contacts}

        location_links = await uow.get_for(LocationLink).find_all_generic(
            allow_archived=False,
            owner=chore_owner_links,
        )
        chore_locations_by_ref_id = {
            link.owner.ref_id: link.locations_ref_ids for link in location_links
        }
        all_chore_location_ref_ids = []
        for location_ref_ids in chore_locations_by_ref_id.values():
            all_chore_location_ref_ids.extend(location_ref_ids)
        locations = []
        if all_chore_location_ref_ids:
            locations = await uow.get_for(Location).find_all_generic(
                allow_archived=False,
                ref_id=list(set(all_chore_location_ref_ids)),
            )
        locations_by_ref_id = {loc.ref_id: loc for loc in locations}

        owner_ref_ids_by_chore_ref_id = await OwnerUserRefIdsForEntitiesService().do_it(
            uow,
            chore_owner_links,
        )
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            list(set(owner_ref_ids_by_chore_ref_id.values()))
        )
        owners_by_ref_id = {owner.ref_id: owner for owner in owners}

        access_statuses = await uow.get(
            AccessStatusRepository
        ).load_all_for_entities_and_user(chore_owner_links, context.user.ref_id)
        access_status_by_chore_ref_id = {
            status.entity.ref_id: status for status in access_statuses
        }

        return ChoreFindResult(
            entries=[
                ChoreFindResultEntry(
                    chore=rt,
                    aspect=(
                        aspect_by_ref_id.get(rt.aspect_ref_id)
                        if aspect_by_ref_id is not None
                        else None
                    ),
                    chapter=(
                        chapter_by_ref_id.get(rt.chapter_ref_id)
                        if rt.chapter_ref_id is not None
                        and chapter_by_ref_id is not None
                        else None
                    ),
                    goal=(
                        goal_by_ref_id.get(rt.goal_ref_id)
                        if rt.goal_ref_id is not None and goal_by_ref_id is not None
                        else None
                    ),
                    inbox_tasks=(
                        [it for it in inbox_tasks if it.owner.ref_id == rt.ref_id]
                        if inbox_tasks is not None
                        else None
                    ),
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_chore_ref_id[rt.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if rt.ref_id in tag_links_by_chore_ref_id
                        else []
                    ),
                    contacts=[
                        contacts_by_ref_id[contact_ref_id]
                        for contact_ref_id in chore_contacts_by_ref_id.get(
                            rt.ref_id, []
                        )
                        if contact_ref_id in contacts_by_ref_id
                    ],
                    locations=[
                        locations_by_ref_id[location_ref_id]
                        for location_ref_id in chore_locations_by_ref_id.get(
                            rt.ref_id, []
                        )
                        if location_ref_id in locations_by_ref_id
                    ],
                    note=notes_by_chore_ref_id.get(rt.ref_id, None),
                    owner=owners_by_ref_id[owner_ref_ids_by_chore_ref_id[rt.ref_id]],
                    access_status=access_status_by_chore_ref_id[rt.ref_id],
                )
                for rt in chores
            ],
        )
