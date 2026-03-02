"""Use case for upserting a person link."""

from jupiter.core.common.sub.persons.namespace import PersonNamespace
from jupiter.core.common.sub.persons.root import PersonDomain
from jupiter.core.common.sub.persons.sub.link.root import PersonLink, PersonLinkRepository
from jupiter.core.common.sub.persons.sub.person.name import PersonName
from jupiter.core.common.sub.persons.sub.person.root import Person, PersonRepository
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
class PersonLinkUpsertArgs(UseCaseArgsBase):
    """PersonLinkUpsert args."""

    namespace: PersonNamespace
    source_entity_ref_id: EntityId
    person_names: set[PersonName]


@use_case_result
class PersonLinkUpsertResult(UseCaseResultBase):
    """PersonLinkUpsert result."""

    person_link: PersonLink


@mutation_use_case()
class PersonLinkUpsertUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        PersonLinkUpsertArgs, PersonLinkUpsertResult
    ]
):
    """Use case for upserting a person link."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: PersonLinkUpsertArgs,
    ) -> PersonLinkUpsertResult:
        """Execute the command's action."""
        workspace = context.workspace
        person_domain = await uow.get_for(PersonDomain).load_by_parent(
            workspace.ref_id
        )

        person_ref_ids = []
        for person_name in set(args.person_names):
            person = Person.new_person(
                ctx=context.domain_context,
                person_domain_ref_id=person_domain.ref_id,
                namespace=args.namespace,
                name=person_name,
            )
            person = await uow.get(PersonRepository).upsert(person)
            person_ref_ids.append(person.ref_id)

        person_link = PersonLink.new_person_link(
            ctx=context.domain_context,
            person_domain_ref_id=person_domain.ref_id,
            namespace=args.namespace,
            source_entity_ref_id=args.source_entity_ref_id,
            ref_ids=person_ref_ids,
        )
        person_link = await uow.get(PersonLinkRepository).upsert(person_link)

        return PersonLinkUpsertResult(person_link=person_link)
