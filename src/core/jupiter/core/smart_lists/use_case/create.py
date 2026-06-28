"""The command for creating a smart list."""

from jupiter.core.common.entity_icon import EntityIcon
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.smart_lists.collection import (
    SmartListCollection,
)
from jupiter.core.smart_lists.name import SmartListName
from jupiter.core.smart_lists.root import SmartList
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class SmartListCreateArgs(JupiterCreateCrownEntityArgs):
    """SmartListCreate args."""

    name: SmartListName
    icon: EntityIcon | None


@use_case_result
class SmartListCreateResult(UseCaseResultBase):
    """SmartListCreate result."""

    new_smart_list: SmartList


@mutation_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListCreateUseCase(
    JupiterCreateCrownEntityUseCase[SmartListCreateArgs, SmartListCreateResult]
):
    """The command for creating a smart list."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: SmartListCreateArgs,
    ) -> SmartListCreateResult:
        """Execute the command's action."""
        workspace = context.workspace

        smart_list_collection = await uow.get_for(SmartListCollection).load_by_parent(
            workspace.ref_id,
        )

        new_smart_list = SmartList.new_smart_list(
            ctx=context.domain_context,
            smart_list_collection_ref_id=smart_list_collection.ref_id,
            name=args.name,
            icon=args.icon,
        )
        new_smart_list = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_smart_list,
        )

        return SmartListCreateResult(new_smart_list=new_smart_list)
