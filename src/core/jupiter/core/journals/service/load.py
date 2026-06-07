"""Shared service for loading a journal and its dependent entities."""

from jupiter.core.common import schedules
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
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result
from jupiter.framework.utils.generic_loader import generic_loader


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


class JournalLoadService:
    """Shared service for loading a journal and its dependent entities."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        journal: Journal,
        *,
        allow_archived: bool = False,
        include_sub_period_journals: bool = True,
        include_publish_entity: bool = True,
    ) -> JournalLoadResult:
        """Load a journal together with the entities that hang off it."""
        journal, note, writing_task = await generic_loader(
            uow,
            Journal,
            journal.ref_id,
            Journal.note,
            Journal.writing_task,
            allow_archived=allow_archived,
            allow_subentity_archived=True,
        )

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
                parent_ref_id=tag_link.tag_domain.ref_id,
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

        return JournalLoadResult(
            journal=journal,
            tags=tags,
            note=note,
            journal_stats=journal_stats,
            writing_task=writing_task,
            sub_period_journals=sub_period_journals,
            publish_entity=publish_entity,
        )
