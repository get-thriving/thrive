"""Build an unsaved journal note from standard questions, aspects, and goals."""

from uuid import uuid4

from jupiter.core.apps.journals.collection import JournalCollection
from jupiter.core.apps.journals.root import Journal
from jupiter.core.apps.journals.sub.question.root import JournalQuestion
from jupiter.core.apps.life_plan.service.load_top_level import (
    LifePlanTree,
    LoadLifePlanTreeService,
)
from jupiter.core.apps.life_plan.sub.aspects.root import Aspect
from jupiter.core.apps.life_plan.sub.goals.root import Goal
from jupiter.core.common.sub.notes.content_block import (
    CorrelationId,
    HeadingBlock,
    OneOfNoteContentBlock,
    ParagraphBlock,
)
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork

_ASPECT_NOTE_ICON = "⭐"
_GOAL_NOTE_ICON = "🎯"


def _sort_questions(
    questions: list[JournalQuestion],
    order: list[EntityId],
) -> list[JournalQuestion]:
    """Sort questions according to a stored order, appending any missing ones."""
    by_ref_id = {question.ref_id: question for question in questions}
    ordered = [by_ref_id[ref_id] for ref_id in order if ref_id in by_ref_id]
    leftover = [question for question in questions if question.ref_id not in set(order)]
    return ordered + leftover


def _aspect_path(aspect: Aspect, aspects_by_ref_id: dict[EntityId, Aspect]) -> str:
    """Build an aspect path from the top level down, skipping the synthetic root."""
    parts: list[str] = []
    current: Aspect | None = aspect
    visited: set[EntityId] = set()
    while current is not None:
        if current.ref_id in visited:
            break
        visited.add(current.ref_id)
        if current.parent_aspect_ref_id is None:
            break
        parts.append(str(current.name))
        current = aspects_by_ref_id.get(current.parent_aspect_ref_id)
    return " / ".join(reversed(parts))


def _goal_path(
    goal: Goal,
    aspects_by_ref_id: dict[EntityId, Aspect],
    goals_by_ref_id: dict[EntityId, Goal],
) -> str:
    """Build a goal path as Aspect / Parent / Goal."""
    aspect = aspects_by_ref_id.get(goal.aspect_ref_id)
    aspect_path = (
        _aspect_path(aspect, aspects_by_ref_id) if aspect is not None else None
    )

    goal_parts: list[str] = []
    current: Goal | None = goal
    visited: set[EntityId] = set()
    while current is not None:
        if current.ref_id in visited:
            break
        visited.add(current.ref_id)
        goal_parts.append(str(current.name))
        if current.parent_goal_ref_id is None:
            break
        current = goals_by_ref_id.get(current.parent_goal_ref_id)
    goal_path = " / ".join(reversed(goal_parts))

    if aspect_path:
        return f"{aspect_path} / {goal_path}"
    return goal_path


def _aspect_heading(aspect: Aspect, aspects_by_ref_id: dict[EntityId, Aspect]) -> str:
    """Heading for an aspect in a journal note."""
    return f"{_ASPECT_NOTE_ICON} {_aspect_path(aspect, aspects_by_ref_id)}"


def _goal_heading(
    goal: Goal,
    aspects_by_ref_id: dict[EntityId, Aspect],
    goals_by_ref_id: dict[EntityId, Goal],
) -> str:
    """Heading for a goal in a journal note."""
    return f"{_GOAL_NOTE_ICON} {_goal_path(goal, aspects_by_ref_id, goals_by_ref_id)}"


def _build_section(title: str) -> list[OneOfNoteContentBlock]:
    """Build a titled section with an empty paragraph to write in."""
    return [
        HeadingBlock(
            kind="heading",
            correlation_id=CorrelationId(str(uuid4())),
            text=title,
            level=1,
        ),
        ParagraphBlock(
            kind="paragraph",
            correlation_id=CorrelationId(str(uuid4())),
            text="",
        ),
    ]


def _life_plan_section_headings(
    tree: LifePlanTree,
    include_aspects: bool,
    include_goals: bool,
) -> list[str]:
    """Format life plan tree nodes as note headings."""
    headings: list[str] = []
    for node in tree.nodes:
        if isinstance(node, Aspect):
            if include_aspects:
                headings.append(_aspect_heading(node, tree.aspects_by_ref_id))
        elif include_goals:
            headings.append(
                _goal_heading(node, tree.aspects_by_ref_id, tree.goals_by_ref_id)
            )
    return headings


def _build_note_content(
    questions: list[JournalQuestion],
    section_headings: list[str],
) -> list[OneOfNoteContentBlock]:
    """Build journal note content from selected questions and life plan sections."""
    content: list[OneOfNoteContentBlock] = []
    for question in questions:
        content.extend(_build_section(str(question.name)))
    for heading in section_headings:
        content.extend(_build_section(heading))
    return content


class BuildNoteService:
    """Build a journal note from standard questions, aspects, and goals."""

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        *,
        workspace: Workspace,
        journal_collection: JournalCollection,
        note_collection_ref_id: EntityId,
        journal: Journal,
        filter_question_ref_ids: list[EntityId] | None = None,
        include_aspects: bool | None = None,
        include_goals: bool | None = None,
    ) -> Note:
        """Load saved questions and life plan sections, and build a note."""
        if filter_question_ref_ids is not None and len(filter_question_ref_ids) == 0:
            questions: list[JournalQuestion] = []
        else:
            questions = await uow.get_for(JournalQuestion).find_all_generic(
                parent_ref_id=journal_collection.ref_id,
                allow_archived=False,
                period=journal.period,
                ref_id=filter_question_ref_ids or NoFilter(),
            )
            questions = _sort_questions(
                questions,
                journal_collection.order_of_questions.get(journal.period, []),
            )

        final_include_aspects = (
            include_aspects
            if include_aspects is not None
            else journal_collection.include_aspects_in_note
        )
        final_include_goals = (
            include_goals
            if include_goals is not None
            else journal_collection.include_goals_in_note
        )

        section_headings: list[str] = []
        if final_include_aspects or final_include_goals:
            tree = await LoadLifePlanTreeService().do_it(
                uow,
                workspace=workspace,
            )
            section_headings = _life_plan_section_headings(
                tree, final_include_aspects, final_include_goals
            )

        return Note.new_note(
            ctx,
            note_collection_ref_id=note_collection_ref_id,
            owner=EntityLink.std(
                NamedEntityTag.JOURNAL.value,
                journal.ref_id,
            ),
            content=_build_note_content(questions, section_headings),
        )
