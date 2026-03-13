"""UseCase for showing the aspects."""

from collections import defaultdict

from jupiter.cli.command.rendering import (
    entity_id_to_rich_text,
    entity_name_to_rich_text,
)
from jupiter.cli.config import JupiterLoggedInReadonlyCommand
from jupiter.core.config import JupiterLoggedInReadonlyContext
from jupiter.core.life_plan.sub.aspects.use_case.find import (
    AspectFindResult,
    AspectFindResultEntry,
    AspectFindUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from rich.console import Console
from rich.text import Text
from rich.tree import Tree


class AspectShow(JupiterLoggedInReadonlyCommand[AspectFindUseCase, AspectFindResult]):
    """UseCase class for showing the aspects."""

    def _render_result(
        self,
        console: Console,
        context: JupiterLoggedInReadonlyContext,
        result: AspectFindResult,
    ) -> None:
        aspect_tree: defaultdict[EntityId | None, list[AspectFindResultEntry]] = (
            defaultdict(list)
        )
        for entry in result.entries:
            aspect_tree[entry.aspect.parent_aspect_ref_id].append(entry)

        root_rich_tree = Tree("💡 Aspects", guide_style="bold bright_blue")

        root = aspect_tree[None]
        if len(root) != 1:
            raise Exception("Root aspect not found.")
        self._render_aspect_tree(root[0], aspect_tree, root_rich_tree)

        console.print(root_rich_tree)

    def _render_aspect_tree(
        self,
        root: AspectFindResultEntry,
        aspect_tree: defaultdict[EntityId | None, list[AspectFindResultEntry]],
        tree: Tree,
    ) -> None:
        aspect_text = Text("")
        aspect_text.append(entity_id_to_rich_text(root.aspect.ref_id))
        aspect_text.append(" ")
        aspect_text.append(entity_name_to_rich_text(root.aspect.name))

        if root.aspect.archived:
            aspect_text.stylize("gray62")

        child_aspects = aspect_tree[root.aspect.ref_id]
        sorted_child_aspects = sorted(
            child_aspects,
            key=lambda pe: (
                pe.aspect.archived,
                _index_in_list_or_none(
                    root.aspect.order_of_child_aspects, pe.aspect.ref_id
                ),
                pe.aspect.created_time,
            ),
        )

        rich_aspect_tree = tree.add(aspect_text)

        for child_aspect in sorted_child_aspects:
            self._render_aspect_tree(child_aspect, aspect_tree, rich_aspect_tree)


def _index_in_list_or_none(list_: list[EntityId], item: EntityId) -> int:
    try:
        return list_.index(item)
    except ValueError:
        return -1
