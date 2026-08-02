"""Use case for archiving a tag."""

from jupiter.core.app import AppCore
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterArchiveLeafSupportEntityArgs,
    JupiterArchiveLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class TagArchiveArgs(JupiterArchiveLeafSupportEntityArgs):
    """TagArchive args."""

    ref_id: EntityId


@mutation_use_case(exclude_component=[AppCore.CLI])
class TagArchiveUseCase(JupiterArchiveLeafSupportEntityUseCase[TagArchiveArgs, None]):
    """Use case for archiving a tag."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TagArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        tag_domain, tag = await self.load_in_parent(
            uow,
            TagDomain,
            Tag,
            args.ref_id,
            context.workspace.ref_id,
        )
        tag = tag.mark_archived(context.domain_context, JupiterArchivalReason.USER)
        await uow.get_for(Tag).save(tag)

        # Tag links for this domain already sit in the caller's workspace
        # namespace; only the entity owner can assign tags there, so walking
        # those links needs no further per-owner ACL check.
        all_tag_links = await uow.get_for(TagLink).find_all_generic(
            parent_ref_id=tag_domain.ref_id,
            allow_archived=True,
        )

        for tag_link in all_tag_links:
            if tag.ref_id not in tag_link.ref_ids:
                continue
            new_ref_ids = [
                ref_id for ref_id in tag_link.ref_ids if ref_id != tag.ref_id
            ]
            tag_link = tag_link.update(
                context.domain_context,
                ref_ids=UpdateAction.change_to(new_ref_ids),
            )
            await uow.get_for(TagLink).save(tag_link)
