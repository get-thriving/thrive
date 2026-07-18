"""Archive a person."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.contacts.sub.link.service.archive import (
    ContactLinkArchiveService,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterArchiveCrownEntityArgs,
    JupiterArchiveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.prm.sub.person.root import Person
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class PersonArchiveArgs(JupiterArchiveCrownEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.PRM)
class PersonArchiveUseCase(JupiterArchiveCrownEntityUseCase[PersonArchiveArgs, None]):
    """The command for archiving a person."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: PersonArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        await self.check_entity(uow, context.user.ref_id, Person, args.ref_id)

        await ContactLinkArchiveService().archive_for_entity(
            context.domain_context,
            uow,
            EntityLink.std(NamedEntityTag.PERSON.value, args.ref_id),
            archival_reason=JupiterArchivalReason.USER,
        )

        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            Person,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
