"""Use case for loading a schedule full days event."""

from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.schedule.sub.event_full_days.root import (
    ScheduleEventFullDays,
)
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
from jupiter.framework.utils.generic_loader import generic_loader


@use_case_args
class ScheduleEventFullDaysLoadArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class ScheduleEventFullDaysLoadResult(UseCaseResultBase):
    """Result."""

    schedule_event_full_days: ScheduleEventFullDays
    time_event_full_days_block: TimeEventFullDaysBlock
    note: Note | None
    tags: list[Tag]
    contacts: list[Contact]


@readonly_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleEventFullDaysLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        ScheduleEventFullDaysLoadArgs, ScheduleEventFullDaysLoadResult
    ]
):
    """Use case for loading a schedule full days event."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ScheduleEventFullDaysLoadArgs,
    ) -> ScheduleEventFullDaysLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        (
            schedule_event_full_days,
            time_event_full_days_block,
            note,
        ) = await generic_loader(
            uow,
            ScheduleEventFullDays,
            args.ref_id,
            ScheduleEventFullDays.time_event_full_days_block,
            ScheduleEventFullDays.note,
            allow_archived=allow_archived,
        )

        tag_link = await uow.get(
            TagLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=TagNamespace.SCHEDULE_EVENT_FULL_DAYS_BLOCK,
            source_entity_ref_id=schedule_event_full_days.ref_id,
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
            EntityLink.std(
                NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
                schedule_event_full_days.ref_id,
            ),
        )
        if contact_link is not None:
            contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=contact_link.contacts_ref_ids,
            )
        else:
            contacts = []

        return ScheduleEventFullDaysLoadResult(
            schedule_event_full_days=schedule_event_full_days,
            time_event_full_days_block=time_event_full_days_block,
            note=note,
            tags=tags,
            contacts=contacts,
        )
