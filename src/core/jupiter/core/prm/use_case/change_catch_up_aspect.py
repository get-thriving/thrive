"""Update the persons catch up aspect."""

from typing import cast

from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.prm.root import PRM
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class PersonChangeCatchUpAspectArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    catch_up_aspect_ref_id: EntityId


@mutation_use_case([WorkspaceFeature.PRM, WorkspaceFeature.LIFE_PLAN])
class PersonChangeCatchUpAspectUseCase(
    JupiterTransactionalLoggedInMutationUseCase[PersonChangeCatchUpAspectArgs, None],
):
    """The command for updating the catch up aspect for persons."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: PersonChangeCatchUpAspectArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace

        prm = await uow.get_for(PRM).load_by_parent(
            workspace.ref_id,
        )
        old_catch_up_aspect_ref_id = prm.catch_up_aspect_ref_id

        await uow.get_for(Aspect).load_by_id(
            args.catch_up_aspect_ref_id,
        )

        persons = await uow.get_for(Person).find_all(
            parent_ref_id=prm.ref_id,
            allow_archived=False,
        )
        persons_by_ref_id = {p.ref_id: p for p in persons}
        person_contact_links = await uow.get(ContactLinkRepository).find_all_generic(
            namespace=ContactNamespace.PERSON,
            source_entity_ref_id=[p.ref_id for p in persons] if persons else [],
        )
        person_contact_ref_id_by_person_ref_id = {
            link.source_entity_ref_id: link.contacts_ref_ids[0]
            for link in person_contact_links
            if len(link.contacts_ref_ids) > 0
        }
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace.ref_id
        )
        contacts = await uow.get_for(Contact).find_all_generic(
            parent_ref_id=contact_domain.ref_id,
            allow_archived=True,
            ref_id=list(person_contact_ref_id_by_person_ref_id.values()),
        )
        contacts_by_ref_id = {c.ref_id: c for c in contacts}

        if len(persons) > 0:
            occasions = await uow.get_for(Occasion).find_all_generic(
                person_ref_id=[p.ref_id for p in persons],
                allow_archived=False,
            )
            occasions_by_ref_id = {o.ref_id: o for o in occasions}

            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(
                workspace.ref_id,
            )
            all_catch_up_inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                source=[InboxTaskSource.PERSON_CATCH_UP],
                source_entity_ref_id=[p.ref_id for p in persons],
            )
            all_occasion_inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                source=[InboxTaskSource.PERSON_OCCASION],
                source_entity_ref_id=[o.ref_id for o in occasions],
            )
        else:
            occasions_by_ref_id = {}
            all_catch_up_inbox_tasks = []
            all_occasion_inbox_tasks = []

        if (
            old_catch_up_aspect_ref_id != args.catch_up_aspect_ref_id
            and len(persons) > 0
        ):
            for inbox_task in all_catch_up_inbox_tasks:
                inbox_task = inbox_task.update_link_to_person_catch_up(
                    ctx=context.domain_context,
                    aspect_ref_id=args.catch_up_aspect_ref_id,
                    name=inbox_task.name,
                    recurring_timeline=cast(str, inbox_task.recurring_timeline),
                    eisen=inbox_task.eisen,
                    difficulty=inbox_task.difficulty,
                    actionable_date=inbox_task.actionable_date,
                    due_time=cast(ADate, inbox_task.due_date),
                )

                await uow.get_for(InboxTask).save(inbox_task)
                await progress_reporter.mark_updated(inbox_task)

            for inbox_task in all_occasion_inbox_tasks:
                occasion = occasions_by_ref_id[inbox_task.source_entity_ref_id_for_sure]
                person = persons_by_ref_id[occasion.person.ref_id]
                person_contact = contacts_by_ref_id[
                    person_contact_ref_id_by_person_ref_id[person.ref_id]
                ]
                inbox_task = inbox_task.update_link_to_person_occasion(
                    ctx=context.domain_context,
                    aspect_ref_id=args.catch_up_aspect_ref_id,
                    name=inbox_task.name,
                    occasion_kind=occasion.kind,
                    occasion_person_name=person_contact.name,
                    recurring_timeline=cast(str, inbox_task.recurring_timeline),
                    preparation_days_cnt=person.preparation_days_cnt_for_birthday,
                    due_time=cast(ADate, inbox_task.due_date),
                )

                await uow.get_for(InboxTask).save(inbox_task)
                await progress_reporter.mark_updated(inbox_task)

        prm = prm.change_catch_up_aspect(
            ctx=context.domain_context,
            catch_up_aspect_ref_id=args.catch_up_aspect_ref_id,
        )

        await uow.get_for(PRM).save(prm)
