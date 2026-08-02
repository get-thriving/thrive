"""Use case for upserting a tag link."""

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import (
    ALLOWED_TAG_LINK_OWNER_TYPES,
    TagLink,
    TagLinkRepository,
)
from jupiter.core.common.sub.tags.sub.tag.name import TagName
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterUpsertLeafSupportEntityArgs,
    JupiterUpsertLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TagLinkUpsertArgs(JupiterUpsertLeafSupportEntityArgs):
    """TagLinkUpsert args."""

    owner: EntityLink
    tag_names: set[TagName]


@use_case_result
class TagLinkUpsertResult(UseCaseResultBase):
    """TagLinkUpsert result."""

    tag_link: TagLink


@mutation_use_case()
class TagLinkUpsertUseCase(
    JupiterUpsertLeafSupportEntityUseCase[TagLinkUpsertArgs, TagLinkUpsertResult]
):
    """Use case for upserting a tag link."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TagLinkUpsertArgs,
    ) -> TagLinkUpsertResult:
        """Execute the command's action."""
        # Tags are a per-workspace namespace: only the entity owner may assign
        # them, and only to entities in this workspace.
        await self.check_owner_and_find_workspace(
            uow,
            context.user.ref_id,
            context.workspace.ref_id,
            args.owner,
            ALLOWED_TAG_LINK_OWNER_TYPES,
            AccessLevel.OWNER,
            require_in_caller_workspace=True,
        )
        tag_domain = await self.load_parent(uow, TagDomain, context.workspace.ref_id)

        tag_ref_ids = []
        for tag_name in set(args.tag_names):
            tag = Tag.new_tag(
                ctx=context.domain_context,
                tag_domain_ref_id=tag_domain.ref_id,
                name=tag_name,
            )
            tag = await uow.get(TagRepository).upsert(tag)
            tag_ref_ids.append(tag.ref_id)

        tag_link = TagLink.new_tag_link(
            ctx=context.domain_context,
            tag_domain_ref_id=tag_domain.ref_id,
            owner=args.owner,
            ref_ids=tag_ref_ids,
        )
        tag_link = await uow.get(TagLinkRepository).upsert(tag_link)

        return TagLinkUpsertResult(tag_link=tag_link)
