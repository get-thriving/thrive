"""Use case for loading a metric."""

from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.metrics.root import Metric
from jupiter.core.metrics.sub.entry.root import MetricEntry
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
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
class MetricLoadArgs(UseCaseArgsBase):
    """MetricLoadArgs."""

    ref_id: EntityId
    allow_archived: bool
    allow_archived_entries: bool
    collection_task_retrieve_offset: int | None


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
    collection_tasks: list[InboxTask]
    collection_tasks_total_cnt: int
    collection_tasks_page_size: int


@readonly_use_case(WorkspaceFeature.METRICS)
class MetricLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[MetricLoadArgs, MetricLoadResult]
):
    """Use case for loading a metric."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: MetricLoadArgs,
    ) -> MetricLoadResult:
        """Execute the command's action."""
        if (
            args.collection_task_retrieve_offset is not None
            and args.collection_task_retrieve_offset < 0
        ):
            raise InputValidationError("Invalid inbox_task_retrieve_offset")

        metric = await uow.get_for(Metric).load_by_id(
            args.ref_id, allow_archived=args.allow_archived
        )
        metric_entries = await uow.get_for(MetricEntry).find_all(
            metric.ref_id, allow_archived=args.allow_archived_entries
        )

        tag_link = await uow.get(
            TagLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=TagNamespace.METRIC,
            source_entity_ref_id=metric.ref_id,
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        tags_domain = await uow.get_for(TagDomain).load_by_parent(
            context.workspace.ref_id
        )
        all_tags = await uow.get_for(Tag).find_all_generic(
            parent_ref_id=tags_domain.ref_id,
            allow_archived=False,
            namespace=TagNamespace.METRIC_ENTRY,
        )
        all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
        tag_links = await uow.get(TagLinkRepository).find_all_generic(
            namespace=TagNamespace.METRIC_ENTRY,
            source_entity_ref_id=[e.ref_id for e in metric_entries],
        )
        tag_links_by_entry_ref_id = {t.source_entity_ref_id: t for t in tag_links}
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

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            context.workspace.ref_id
        )

        collection_tasks_total_cnt = await uow.get(
            InboxTaskRepository
        ).count_all_for_source(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.METRIC,
            source_entity_ref_id=metric.ref_id,
        )

        collection_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.METRIC,
            source_entity_ref_id=metric.ref_id,
            retrieve_offset=args.collection_task_retrieve_offset or 0,
            retrieve_limit=InboxTaskRepository.PAGE_SIZE,
        )

        note = await uow.get(NoteRepository).load_optional_for_source(
            NoteNamespace.METRIC,
            metric.ref_id,
            allow_archived=args.allow_archived,
        )

        return MetricLoadResult(
            metric=metric,
            note=note,
            tags=tags,
            metric_entries=metric_entries,
            metric_entry_tags=metric_entry_tags,
            collection_tasks=collection_tasks,
            collection_tasks_total_cnt=collection_tasks_total_cnt,
            collection_tasks_page_size=InboxTaskRepository.PAGE_SIZE,
        )
