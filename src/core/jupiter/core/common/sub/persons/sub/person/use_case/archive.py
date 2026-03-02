"""Use case for archiving a person."""

from jupiter.core.app import AppCore
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.persons.root import PersonDomain
from jupiter.core.common.sub.persons.sub.link.root import PersonLink
from jupiter.core.common.sub.persons.sub.person.root import Person
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
class PersonArchiveArgs(UseCaseArgsBase):
    """PersonArchive args."""

    ref_id: EntityId


@mutation_use_case(exclude_component=[AppCore.CLI])
class PersonArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[PersonArchiveArgs, None]
):
    """Use case for archiving a person."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: PersonArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        person_domain = await uow.get_for(PersonDomain).load_by_parent(
            workspace.ref_id
        )
        person = await uow.get_for(Person).load_by_id(args.ref_id)
        person = person.mark_archived(
            context.domain_context, JupiterArchivalReason.USER
        )
        await uow.get_for(Person).save(person)

        all_person_links = await uow.get_for(PersonLink).find_all_generic(
            parent_ref_id=person_domain.ref_id,
            allow_archived=True,
            namespace=[person.namespace],
        )

        for person_link in all_person_links:
            if person.ref_id not in person_link.ref_ids:
                continue
            new_ref_ids = [
                ref_id for ref_id in person_link.ref_ids if ref_id != person.ref_id
            ]
            person_link = person_link.update(
                context.domain_context,
                ref_ids=UpdateAction.change_to(new_ref_ids),
            )
            await uow.get_for(PersonLink).save(person_link)
