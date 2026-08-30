"""Load life plan aspects and goals in tree order."""

from dataclasses import dataclass

from jupiter.core.apps.life_plan.root import LifePlan
from jupiter.core.apps.life_plan.sub.aspects.root import Aspect, AspectRepository
from jupiter.core.apps.life_plan.sub.goals.root import Goal
from jupiter.core.features import WorkspaceFeature
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork


@dataclass(frozen=True)
class LifePlanTree:
    """Aspects and goals in tree order, with lookups for parent paths."""

    nodes: tuple[Aspect | Goal, ...]
    aspects_by_ref_id: dict[EntityId, Aspect]
    goals_by_ref_id: dict[EntityId, Goal]


def _ordered_child_aspects(
    parent: Aspect,
    children_by_parent: dict[EntityId, list[Aspect]],
) -> list[Aspect]:
    """Order a parent's child aspects by stored order, then leftovers by name."""
    children = children_by_parent.get(parent.ref_id, [])
    by_ref_id = {child.ref_id: child for child in children}
    ordered = [
        by_ref_id[ref_id]
        for ref_id in parent.order_of_child_aspects
        if ref_id in by_ref_id
    ]
    leftover = [
        child
        for child in children
        if child.ref_id not in set(parent.order_of_child_aspects)
    ]
    leftover.sort(key=lambda child: str(child.name))
    return ordered + leftover


class LoadLifePlanTreeService:
    """Load life plan aspects and goals in tree order."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        *,
        workspace: Workspace,
    ) -> LifePlanTree:
        """Walk aspects, then their goals, then nested children, in stored order."""
        empty = LifePlanTree(nodes=(), aspects_by_ref_id={}, goals_by_ref_id={})
        if not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            return empty

        life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)
        root_aspect = await uow.get(AspectRepository).load_root_aspect(life_plan.ref_id)

        all_aspects = await uow.get_for(Aspect).find_all(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
        )
        aspects_by_ref_id = {aspect.ref_id: aspect for aspect in all_aspects}
        children_by_parent: dict[EntityId, list[Aspect]] = {}
        for aspect in all_aspects:
            if aspect.parent_aspect_ref_id is None:
                continue
            children_by_parent.setdefault(aspect.parent_aspect_ref_id, []).append(
                aspect
            )

        all_goals = await uow.get_for(Goal).find_all(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
        )
        goals_by_ref_id = {goal.ref_id: goal for goal in all_goals}
        root_goals_by_aspect: dict[EntityId, list[Goal]] = {}
        goals_by_parent: dict[EntityId, list[Goal]] = {}
        for goal in all_goals:
            if goal.parent_goal_ref_id is None:
                root_goals_by_aspect.setdefault(goal.aspect_ref_id, []).append(goal)
            else:
                goals_by_parent.setdefault(goal.parent_goal_ref_id, []).append(goal)

        for goals in root_goals_by_aspect.values():
            goals.sort(key=lambda goal: str(goal.name))
        for goals in goals_by_parent.values():
            goals.sort(key=lambda goal: str(goal.name))

        nodes: list[Aspect | Goal] = []

        def emit_goal(goal: Goal) -> None:
            nodes.append(goal)
            for child_goal in goals_by_parent.get(goal.ref_id, []):
                emit_goal(child_goal)

        def emit_aspect(aspect: Aspect) -> None:
            nodes.append(aspect)
            for goal in root_goals_by_aspect.get(aspect.ref_id, []):
                emit_goal(goal)
            for child_aspect in _ordered_child_aspects(aspect, children_by_parent):
                emit_aspect(child_aspect)

        for aspect in _ordered_child_aspects(root_aspect, children_by_parent):
            emit_aspect(aspect)

        return LifePlanTree(
            nodes=tuple(nodes),
            aspects_by_ref_id=aspects_by_ref_id,
            goals_by_ref_id=goals_by_ref_id,
        )
