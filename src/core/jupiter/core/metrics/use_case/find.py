"""The command for finding metrics."""

import itertools
from collections import defaultdict
from typing import cast

from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.metrics.collection import MetricCollection
from jupiter.core.metrics.root import Metric
from jupiter.core.metrics.sub.entry.root import MetricEntry
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
    use_case_result_part,
)


@use_case_args
class MetricFindArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    allow_archived: bool | None
    include_notes: bool | None
    include_entries: bool | None
    include_collection_inbox_tasks: bool | None
    include_metric_entry_notes: bool | None
    include_tags: bool | None
    filter_ref_ids: list[EntityId] | None
    filter_entry_ref_ids: list[EntityId] | None


@use_case_result_part
class MetricFindResponseEntry(UseCaseResultBase):
    """A single entry in the LoadAllMetricsResponse."""

    metric: Metric
    tags: list[Tag]
    contacts: list[Contact]
    note: Note | None
    metric_entries: list[MetricEntry] | None
    metric_collection_inbox_tasks: list[InboxTask] | None
    metric_entry_notes: list[Note] | None


@use_case_result
class MetricFindResult(UseCaseResultBase):
    """PersonFindResult object."""

    entries: list[MetricFindResponseEntry]


@readonly_use_case(WorkspaceFeature.METRICS)
class MetricFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[MetricFindArgs, MetricFindResult]
):
    """The command for finding metrics."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: MetricFindArgs,
    ) -> MetricFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_notes = args.include_notes or False
        include_entries = args.include_entries or False
        include_collection_inbox_tasks = args.include_collection_inbox_tasks or False
        include_metric_entry_notes = args.include_metric_entry_notes or False
        include_tags = args.include_tags or False

        workspace = context.workspace

        metric_collection = await uow.get_for(MetricCollection).load_by_parent(
            workspace.ref_id,
        )
        metrics = await uow.get_for(Metric).find_all(
            parent_ref_id=metric_collection.ref_id,
            allow_archived=allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )

        all_notes_by_metric_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id
            )
            all_notes = await uow.get(NoteRepository).find_all_for_note_collection(
                note_collection_ref_id=note_collection.ref_id,
                allow_archived=True,
                filter_owners=[
                    EntityLink.std(NamedEntityTag.METRIC.value, rid)
                    for rid in [m.ref_id for m in metrics]
                ],
            )
            for n in all_notes:
                all_notes_by_metric_ref_id[n.owner.ref_id] = n

        if include_entries:
            metric_entries_raw = []
            for metric in metrics:
                metric_entries_raw.append(
                    await uow.get_for(MetricEntry).find_all(
                        parent_ref_id=metric.ref_id,
                        allow_archived=allow_archived,
                        filter_ref_ids=args.filter_entry_ref_ids,
                    ),
                )
            metric_entries = itertools.chain(*metric_entries_raw)

            metric_entries_by_ref_ids: dict[EntityId, list[MetricEntry]] = {}

            for metric_entry in metric_entries:
                if metric_entry.metric.ref_id not in metric_entries_by_ref_ids:
                    metric_entries_by_ref_ids[metric_entry.metric.ref_id] = [
                        metric_entry,
                    ]
                else:
                    metric_entries_by_ref_ids[metric_entry.metric.ref_id].append(
                        metric_entry,
                    )
        else:
            metric_entries_by_ref_ids = {}

        if include_collection_inbox_tasks:
            metric_collection_inbox_tasks_by_ref_id: defaultdict[
                EntityId,
                list[InboxTask],
            ] = defaultdict(list)
            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(
                workspace.ref_id,
            )
            all_inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                owner=[
                    EntityLink.std(NamedEntityTag.METRIC.value, m.ref_id)
                    for m in metrics
                ],
            )

            for inbox_task in all_inbox_tasks:
                metric_collection_inbox_tasks_by_ref_id[inbox_task.owner.ref_id].append(
                    inbox_task
                )
        else:
            metric_collection_inbox_tasks_by_ref_id = defaultdict(list)

        all_notes_by_metric_entry_ref_id: defaultdict[EntityId, Note] = defaultdict(
            None
        )
        if include_metric_entry_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id
            )
            all_notes = await uow.get(NoteRepository).find_all_for_note_collection(
                note_collection_ref_id=note_collection.ref_id,
                allow_archived=True,
                filter_owners=[
                    EntityLink.std(NamedEntityTag.METRIC_ENTRY.value, rid)
                    for rid in [me.ref_id for me in metric_entries]
                ],
            )
            for n in all_notes:
                all_notes_by_metric_entry_ref_id[cast(EntityId, n.owner.ref_id)] = n

        if include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                owner=[
                    EntityLink.std(NamedEntityTag.METRIC.value, m.ref_id)
                    for m in metrics
                ],
            )
            tag_links_by_metric_ref_id = {
                cast(EntityId, tl.owner.ref_id): tl for tl in tag_links
            }
            all_tag_ref_ids: list[EntityId] = []
            for tl in tag_links:
                all_tag_ref_ids.extend(tl.ref_ids)
            if all_tag_ref_ids:
                all_tags = await uow.get_for(Tag).find_all_generic(
                    parent_ref_id=tags_domain.ref_id,
                    allow_archived=False,
                    ref_id=list(set(all_tag_ref_ids)),
                )
                all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            else:
                all_tags_by_ref_id = {}

        else:
            all_tags_by_ref_id = {}
            tag_links_by_metric_ref_id = {}

        # Load contacts linked to metrics
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace.ref_id,
        )
        contact_links = await uow.get_for(ContactLink).find_all_generic(
            parent_ref_id=contact_domain.ref_id,
            allow_archived=False,
            owner=[
                EntityLink.std(NamedEntityTag.METRIC_ENTRY.value, m.ref_id)
                for m in metrics
            ],
        )
        metric_contacts_by_ref_id = {
            link.owner.ref_id: link.contacts_ref_ids for link in contact_links
        }
        all_metric_contact_ref_ids = []
        for contact_ref_ids in metric_contacts_by_ref_id.values():
            all_metric_contact_ref_ids.extend(contact_ref_ids)
        contacts = []
        if all_metric_contact_ref_ids:
            contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=list(set(all_metric_contact_ref_ids)),
            )
        contacts_by_ref_id = {c.ref_id: c for c in contacts}

        return MetricFindResult(
            entries=[
                MetricFindResponseEntry(
                    metric=m,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_metric_ref_id[m.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if m.ref_id in tag_links_by_metric_ref_id
                        else []
                    ),
                    contacts=[
                        contacts_by_ref_id[contact_ref_id]
                        for contact_ref_id in metric_contacts_by_ref_id.get(
                            m.ref_id, []
                        )
                        if contact_ref_id in contacts_by_ref_id
                    ],
                    note=all_notes_by_metric_ref_id.get(m.ref_id, None),
                    metric_entries=(
                        metric_entries_by_ref_ids.get(m.ref_id, [])
                        if len(metric_entries_by_ref_ids) > 0
                        else None
                    ),
                    metric_collection_inbox_tasks=(
                        metric_collection_inbox_tasks_by_ref_id.get(
                            m.ref_id,
                            [],
                        )
                        if len(metric_collection_inbox_tasks_by_ref_id) > 0
                        else None
                    ),
                    metric_entry_notes=[
                        all_notes_by_metric_entry_ref_id[me.ref_id]
                        for me in metric_entries_by_ref_ids.get(m.ref_id, [])
                        if (me.ref_id in all_notes_by_metric_entry_ref_id)
                    ],
                )
                for m in metrics
            ],
        )
