"""Use case for updating a tag."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.tags.name import TagName
from jupiter.core.common.sub.tags.root import Tag
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TagUpdateArgs(UseCaseArgsBase):
    """TagUpdate args."""

    ref_id: EntityId
    name: UpdateAction[TagName]


@mutation_use_case(exclude_component=[AppCore.CLI])
class TagUpdateUseCase(JupiterTransactionalLoggedInMutationUseCase[TagUpdateArgs, None]):
    """Use case for updating a tag."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TagUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        tag = await uow.get_for(Tag).load_by_id(args.ref_id)
        tag = tag.update(
            ctx=context.domain_context,
            name=args.name,
        )
        await uow.get_for(Tag).save(tag)
        await progress_reporter.mark_updated(tag)
