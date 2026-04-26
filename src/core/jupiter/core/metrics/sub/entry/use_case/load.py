"""Use case for loading a metric entry."""

from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
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
)


@use_case_args
class MetricEntryLoadArgs(UseCaseArgsBase):
    """MetricEntryLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class MetricEntryLoadResult(UseCaseResultBase):
    """MetricEntryLoadResult."""

    metric_entry: MetricEntry
    tags: list[Tag]
    contacts: list[Contact]
    note: Note | None


@readonly_use_case(WorkspaceFeature.METRICS)
class MetricEntryLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        MetricEntryLoadArgs, MetricEntryLoadResult
    ]
):
    """Use case for loading a metric entry."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: MetricEntryLoadArgs,
    ) -> MetricEntryLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        metric_entry = await uow.get_for(MetricEntry).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )

        note = await uow.get(NoteRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.METRIC_ENTRY.value, metric_entry.ref_id),
            allow_archived=allow_archived,
        )

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(
                NamedEntityTag.METRIC_ENTRY.value, metric_entry.ref_id
            ),
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
            context.workspace.ref_id,
        )
        contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.METRIC_ENTRY.value, metric_entry.ref_id),
        )
        if contact_link is not None:
            contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=contact_link.contacts_ref_ids,
            )
        else:
            contacts = []

        return MetricEntryLoadResult(
            metric_entry=metric_entry,
            tags=tags,
            contacts=contacts,
            note=note,
        )
