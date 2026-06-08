"""Shared service for loading a metric and its dependent entities."""

from typing import cast

from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.root import InboxTask, InboxTaskRepository
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.publish.sub.entity.root import (
    PublishEntity,
    PublishEntityRepository,
)
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.metrics.root import Metric
from jupiter.core.metrics.sub.entry.root import MetricEntry
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_result,
    use_case_result_part,
)


@use_case_result_part
class MetricLoadMetricEntryTags(UseCaseResultBase):
    """The tags associated with a metric entry."""

    metric_entry_ref_id: EntityId
    tags: list[Tag]


@use_case_result
class MetricLoadResult(UseCaseResultBase):
    """MetricLoadResult."""

    metric: Metric
    note: Note | None
    tags: list[Tag]
    metric_entries: list[MetricEntry]
    metric_entry_tags: list[MetricLoadMetricEntryTags]
    metric_entry_contacts: dict[EntityId, list[Contact]] | None
    collection_tasks: list[InboxTask]
    collection_tasks_total_cnt: int
    collection_tasks_page_size: int
    publish_entity: PublishEntity | None


class MetricLoadService:
    """Shared service for loading a metric and its dependent entities."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
        metric: Metric,
        *,
        allow_archived: bool = False,
        allow_archived_entries: bool = False,
        allow_archived_tags: bool = False,
        include_entry_tags_and_contacts: bool = False,
        include_collection_tasks: bool = True,
        collection_task_retrieve_offset: int | None = None,
        include_publish_entity: bool = True,
    ) -> MetricLoadResult:
        """Load a metric and its dependent entities."""
        if (
            collection_task_retrieve_offset is not None
            and collection_task_retrieve_offset < 0
        ):
            raise InputValidationError("Invalid inbox_task_retrieve_offset")

        metric = await uow.get_for(Metric).load_by_id(
            metric.ref_id,
            allow_archived=allow_archived,
        )
        owner = EntityLink.std(NamedEntityTag.METRIC.value, metric.ref_id)

        metric_entries = await uow.get_for(MetricEntry).find_all(
            metric.ref_id, allow_archived=allow_archived_entries
        )

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=owner,
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=allow_archived_tags,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        metric_entry_tags: list[MetricLoadMetricEntryTags] = []
        metric_entry_contacts: dict[EntityId, list[Contact]] | None = None

        if include_entry_tags_and_contacts and len(metric_entries) > 0:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(
                workspace_ref_id,
            )
            entry_tag_links = await uow.get(TagLinkRepository).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=allow_archived_tags,
                owner=[
                    EntityLink.std(NamedEntityTag.METRIC_ENTRY.value, entry.ref_id)
                    for entry in metric_entries
                ],
            )
            entry_tag_links_by_ref_id = {
                cast(EntityId, tl.owner.ref_id): tl for tl in entry_tag_links
            }
            all_entry_tag_ref_ids: list[EntityId] = []
            for tl in entry_tag_links:
                all_entry_tag_ref_ids.extend(tl.ref_ids)
            if all_entry_tag_ref_ids:
                all_entry_tags = await uow.get_for(Tag).find_all_generic(
                    parent_ref_id=tags_domain.ref_id,
                    allow_archived=allow_archived_tags,
                    ref_id=list(set(all_entry_tag_ref_ids)),
                )
                all_entry_tags_by_ref_id = {t.ref_id: t for t in all_entry_tags}
            else:
                all_entry_tags_by_ref_id = {}

            metric_entry_tags = [
                MetricLoadMetricEntryTags(
                    metric_entry_ref_id=entry.ref_id,
                    tags=(
                        [
                            all_entry_tags_by_ref_id[rid]
                            for rid in entry_tag_links_by_ref_id[entry.ref_id].ref_ids
                            if rid in all_entry_tags_by_ref_id
                        ]
                        if entry.ref_id in entry_tag_links_by_ref_id
                        else []
                    ),
                )
                for entry in metric_entries
            ]

            contact_domain = await uow.get_for(ContactDomain).load_by_parent(
                workspace_ref_id,
            )
            entry_contact_links = await uow.get(ContactLinkRepository).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                owner=[
                    EntityLink.std(NamedEntityTag.METRIC_ENTRY.value, entry.ref_id)
                    for entry in metric_entries
                ],
            )
            all_entry_contact_ref_ids: list[EntityId] = []
            for cl in entry_contact_links:
                all_entry_contact_ref_ids.extend(cl.contacts_ref_ids)
            if all_entry_contact_ref_ids:
                all_entry_contacts = await uow.get_for(Contact).find_all_generic(
                    parent_ref_id=contact_domain.ref_id,
                    allow_archived=False,
                    ref_id=list(set(all_entry_contact_ref_ids)),
                )
                all_entry_contacts_by_ref_id = {c.ref_id: c for c in all_entry_contacts}
            else:
                all_entry_contacts_by_ref_id = {}

            metric_entry_contacts = {
                cast(EntityId, cl.owner.ref_id): [
                    all_entry_contacts_by_ref_id[rid]
                    for rid in cl.contacts_ref_ids
                    if rid in all_entry_contacts_by_ref_id
                ]
                for cl in entry_contact_links
            }
        elif len(metric_entries) > 0:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(
                workspace_ref_id,
            )
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=allow_archived_tags,
                owner=[
                    EntityLink.std(NamedEntityTag.METRIC_ENTRY.value, e.ref_id)
                    for e in metric_entries
                ],
            )
            tag_links_by_entry_ref_id = {
                cast(EntityId, tl.owner.ref_id): tl for tl in tag_links
            }
            tag_ref_ids: list[EntityId] = []
            for tl in tag_links:
                tag_ref_ids.extend(tl.ref_ids)
            if tag_ref_ids:
                all_tags = await uow.get_for(Tag).find_all_generic(
                    parent_ref_id=tags_domain.ref_id,
                    allow_archived=allow_archived_tags,
                    ref_id=list(set(tag_ref_ids)),
                )
                all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            else:
                all_tags_by_ref_id = {}
            metric_entry_tags = [
                MetricLoadMetricEntryTags(
                    metric_entry_ref_id=e.ref_id,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_entry_ref_id[e.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if e.ref_id in tag_links_by_entry_ref_id
                        else []
                    ),
                )
                for e in metric_entries
            ]

        collection_tasks: list[InboxTask] = []
        collection_tasks_total_cnt = 0
        collection_tasks_page_size = InboxTaskRepository.PAGE_SIZE

        if include_collection_tasks:
            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(workspace_ref_id)

            collection_tasks_total_cnt = await uow.get(
                InboxTaskRepository
            ).count_all_for_owner(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                owner=owner,
            )

            collection_tasks = await uow.get(
                InboxTaskRepository
            ).find_all_for_owner_created_desc(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                owner=owner,
                retrieve_offset=collection_task_retrieve_offset or 0,
                retrieve_limit=InboxTaskRepository.PAGE_SIZE,
            )

        note = await uow.get(NoteRepository).load_optional_for_owner(
            owner,
            allow_archived=allow_archived,
        )

        publish_entity = None
        if include_publish_entity:
            publish_entity = await uow.get(
                PublishEntityRepository
            ).load_optional_for_owner(
                owner,
                allow_archived=allow_archived,
            )

        return MetricLoadResult(
            metric=metric,
            note=note,
            tags=tags,
            metric_entries=metric_entries,
            metric_entry_tags=metric_entry_tags,
            metric_entry_contacts=metric_entry_contacts,
            collection_tasks=collection_tasks,
            collection_tasks_total_cnt=collection_tasks_total_cnt,
            collection_tasks_page_size=collection_tasks_page_size,
            publish_entity=publish_entity,
        )
