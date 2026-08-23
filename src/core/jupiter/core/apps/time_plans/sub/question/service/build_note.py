"""Build an unsaved time plan note from standard questions."""

from uuid import uuid4

from jupiter.core.apps.time_plans.domain import TimePlanDomain
from jupiter.core.apps.time_plans.root import TimePlan
from jupiter.core.apps.time_plans.sub.question.root import TimePlanQuestion
from jupiter.core.common.sub.notes.content_block import (
    CorrelationId,
    HeadingBlock,
    OneOfNoteContentBlock,
    ParagraphBlock,
)
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork


def _sort_questions(
    questions: list[TimePlanQuestion],
    order: list[EntityId],
) -> list[TimePlanQuestion]:
    """Sort questions according to a stored order, appending any missing ones."""
    by_ref_id = {question.ref_id: question for question in questions}
    ordered = [by_ref_id[ref_id] for ref_id in order if ref_id in by_ref_id]
    leftover = [question for question in questions if question.ref_id not in set(order)]
    return ordered + leftover


def _build_note_content(
    questions: list[TimePlanQuestion],
) -> list[OneOfNoteContentBlock]:
    """Build time plan note content from selected questions."""
    content: list[OneOfNoteContentBlock] = []
    for question in questions:
        content.append(
            HeadingBlock(
                kind="heading",
                correlation_id=CorrelationId(str(uuid4())),
                text=str(question.name),
                level=1,
            )
        )
        content.append(
            ParagraphBlock(
                kind="paragraph",
                correlation_id=CorrelationId(str(uuid4())),
                text="",
            )
        )
    return content


class BuildNoteFromQuestionsService:
    """Build a time plan note from standard questions without saving it."""

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        *,
        time_plan_domain: TimePlanDomain,
        note_collection_ref_id: EntityId,
        time_plan: TimePlan,
        filter_question_ref_ids: list[EntityId] | None = None,
    ) -> Note:
        """Load saved questions for the time plan period, optionally filter, and build a note."""
        if filter_question_ref_ids is not None and len(filter_question_ref_ids) == 0:
            questions: list[TimePlanQuestion] = []
        else:
            questions = await uow.get_for(TimePlanQuestion).find_all_generic(
                parent_ref_id=time_plan_domain.ref_id,
                allow_archived=False,
                period=time_plan.period,
                ref_id=filter_question_ref_ids or NoFilter(),
            )
            questions = _sort_questions(
                questions,
                time_plan_domain.order_of_questions.get(time_plan.period, []),
            )

        return Note.new_note(
            ctx,
            note_collection_ref_id=note_collection_ref_id,
            owner=EntityLink.std(
                NamedEntityTag.TIME_PLAN.value,
                time_plan.ref_id,
            ),
            content=_build_note_content(questions),
        )
