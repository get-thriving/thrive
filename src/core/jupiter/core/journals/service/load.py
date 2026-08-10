"""Shared service for loading a journal and its dependent entities."""

from jupiter.core.common import schedules
from jupiter.core.common.sub.access.sub.grant.service.get_access_level_for_entity import (
    GetAccessLevelForEntityService,
)
from jupiter.core.common.sub.access.sub.grant.service.load_user_that_owns_entity import (
    LoadUserThatOwnsEntityService,
)
from jupiter.core.common.sub.access.sub.status.root import AccessStatus
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.publish.sub.entity.root import (
    PublishEntity,
    PublishEntityRepository,
)
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.journals.root import Journal, JournalRepository
from jupiter.core.journals.stats import JournalStats, JournalStatsRepository
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import (
    DomainUnitOfWork,
    EntityNotFoundError,
)
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result


@use_case_result
class JournalLoadResult(UseCaseResultBase):
    """JournalLoadResult."""

    journal: Journal
    tags: list[Tag]
    note: Note
    journal_stats: JournalStats
    writing_task: InboxTask | None
    sub_period_journals: list[Journal]
    publish_entity: PublishEntity | None
    owner: UserLight
    access_status: AccessStatus | None


class JournalLoadService:
    """Shared service for loading a journal and its dependent entities."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        journal: Journal,
        *,
        user_ref_id: EntityId | None = None,
        allow_archived: bool = False,
        include_sub_period_journals: bool = True,
        include_publish_entity: bool = True,
    ) -> JournalLoadResult:
        """Load a journal together with the entities that hang off it."""
        journal = await uow.get_for(Journal).load_by_id(
            journal.ref_id, allow_archived=allow_archived
        )
        owner_link = EntityLink.std(NamedEntityTag.JOURNAL.value, journal.ref_id)
        notes = await uow.get_for(Note).find_all_generic(
            parent_ref_id=None,
            allow_archived=True,
            owner=owner_link,
        )
        if not notes:
            raise EntityNotFoundError(
                f"Could not find note for journal {journal.ref_id}"
            )
        note = notes[0]
        writing_tasks = await uow.get_for(InboxTask).find_all_generic(
            parent_ref_id=None,
            allow_archived=True,
            owner=owner_link,
        )
        writing_task = writing_tasks[0] if writing_tasks else None

        journal_stats = await uow.get(JournalStatsRepository).load_by_key_optional(
            journal.ref_id
        )

        if journal_stats is None:
            raise Exception("Journal stats not found")

        if include_sub_period_journals:
            schedule = schedules.get_schedule(
                period=journal.period,
                name=journal.name,
                right_now=journal.right_now.to_timestamp_at_end_of_day(),
            )

            sub_period_journals = await uow.get(JournalRepository).find_all_in_range(
                parent_ref_id=journal.journal_collection.ref_id,
                allow_archived=False,
                filter_periods=journal.period.all_smaller_periods,
                filter_start_date=schedule.first_day,
                filter_end_date=schedule.end_day,
            )
        else:
            sub_period_journals = []

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(NamedEntityTag.JOURNAL.value, journal.ref_id),
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        publish_entity = None
        if include_publish_entity:
            publish_entity = await uow.get(
                PublishEntityRepository
            ).load_optional_for_owner(
                EntityLink.std(NamedEntityTag.JOURNAL.value, journal.ref_id),
                allow_archived=allow_archived,
            )

        journal_entity_link = EntityLink.std(
            NamedEntityTag.JOURNAL.value, journal.ref_id
        )
        owner = await LoadUserThatOwnsEntityService().do_it(uow, journal_entity_link)
        access_status = (
            await GetAccessLevelForEntityService().do_it(
                uow, journal_entity_link, user_ref_id
            )
            if user_ref_id is not None
            else None
        )

        return JournalLoadResult(
            journal=journal,
            tags=tags,
            note=note,
            journal_stats=journal_stats,
            writing_task=writing_task,
            sub_period_journals=sub_period_journals,
            publish_entity=publish_entity,
            owner=owner,
            access_status=access_status,
        )
