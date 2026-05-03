"""Use case for creating a directory."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.docs.root import DocCollection
from jupiter.core.docs.sub.dir.name import DirName
from jupiter.core.docs.sub.dir.root import Dir
from jupiter.core.features import WorkspaceFeature
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
class DirCreateArgs(UseCaseArgsBase):
    """DirCreate args."""

    name: DirName
    parent_dir_ref_id: EntityId


@use_case_result
class DirCreateResult(UseCaseResultBase):
    """DirCreate result."""

    new_dir: Dir


@mutation_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DirCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[DirCreateArgs, DirCreateResult]
):
    """Use case for creating a directory."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: DirCreateArgs,
    ) -> DirCreateResult:
        """Execute the command's action."""
        workspace = context.workspace
        doc_collection = await uow.get_for(DocCollection).load_by_parent(
            workspace.ref_id
        )

        parent_dir = await uow.get_for(Dir).load_by_id(args.parent_dir_ref_id)

        new_dir = Dir.new_dir(
            ctx=context.domain_context,
            doc_collection_ref_id=doc_collection.ref_id,
            parent_dir_ref_id=parent_dir.ref_id,
            name=args.name,
        )
        new_dir = await uow.get_for(Dir).create(new_dir)
        await progress_reporter.mark_created(new_dir)

        return DirCreateResult(new_dir=new_dir)
