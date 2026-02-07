"""Use case for creating a tag."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.tags.domain import TagDomain
from jupiter.core.common.sub.tags.name import TagName
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import Tag
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
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
class TagCreateArgs(UseCaseArgsBase):
    """TagCreate args."""

    namespace: TagNamespace
    name: TagName


@use_case_result
class TagCreateResult(UseCaseResultBase):
    """TagCreate result."""

    new_tag: Tag


@mutation_use_case(exclude_component=[AppCore.CLI])
class TagCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TagCreateArgs, TagCreateResult]
):
    """Use case for creating a tag."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TagCreateArgs,
    ) -> TagCreateResult:
        """Execute the command's action."""
        workspace = context.workspace
        tag_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)

        new_tag = Tag.new_tag(
            ctx=context.domain_context,
            tag_domain_ref_id=tag_domain.ref_id,
            namespace=args.namespace,
            name=args.name,
        )
        new_tag = await uow.get_for(Tag).create(new_tag)
        await progress_reporter.mark_created(new_tag)
        return TagCreateResult(new_tag=new_tag)

