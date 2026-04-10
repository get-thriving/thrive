"""Use case for loading a smart list item."""

from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.smart_lists.sub.item.root import SmartListItem
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
class SmartListItemLoadArgs(UseCaseArgsBase):
    """SmartListItemLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class SmartListItemLoadResult(UseCaseResultBase):
    """SmartListItemLoadResult."""

    item: SmartListItem
    generic_tags: list[Tag]
    contacts: list[Contact]
    note: Note | None


@readonly_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListItemLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        SmartListItemLoadArgs, SmartListItemLoadResult
    ]
):
    """Use case for loading a smart list item."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: SmartListItemLoadArgs,
    ) -> SmartListItemLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        item, note = await generic_loader(
            uow,
            SmartListItem,
            args.ref_id,
            SmartListItem.note,
            allow_archived=allow_archived,
            allow_subentity_archived=allow_archived,
        )
        tag_link = await uow.get(
            TagLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=TagNamespace.SMART_LIST_ITEM,
            source_entity_ref_id=item.ref_id,
        )
        if tag_link is not None:
            generic_tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            generic_tags = []
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            context.workspace.ref_id,
        )
        contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.SMART_LIST_ITEM.value, item.ref_id),
        )
        if contact_link is not None:
            contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=contact_link.contacts_ref_ids,
            )
        else:
            contacts = []

        return SmartListItemLoadResult(
            item=item,
            generic_tags=generic_tags,
            contacts=contacts,
            note=note,
        )
