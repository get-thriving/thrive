"""Use case for upserting a tag link."""

from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLink, TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.name import TagName
from jupiter.core.common.sub.tags.sub.tag.root import TagRepository
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TagLinkUpsertArgs(UseCaseArgsBase):
    """TagLinkUpsert args."""

    namespace: TagNamespace
    source_entity_ref_id: EntityId
    tag_names: set[TagName]


@use_case_result
class TagLinkUpsertResult(UseCaseResultBase):
    """TagLinkUpsert result."""

    tag_link: TagLink


@mutation_use_case()
class TagLinkUpsertUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TagLinkUpsertArgs, TagLinkUpsertResult]
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
        workspace = context.workspace
        tag_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)

        tag_ref_ids = []
        for tag_name in set(args.tag_names):
            tag = await uow.get(TagRepository).upsert(
                parent_ref_id=tag_domain.ref_id,
                namespace=args.namespace,
                name=tag_name,
            )
            tag_ref_ids.append(tag.ref_id)

        tag_link = await uow.get(TagLinkRepository).upsert_for_namespace_and_source(
            parent_ref_id=tag_domain.ref_id,
            namespace=args.namespace,
            source_entity_ref_id=args.source_entity_ref_id,
            tag_ref_ids=tag_ref_ids,
        )

        return TagLinkUpsertResult(tag_link=tag_link)
