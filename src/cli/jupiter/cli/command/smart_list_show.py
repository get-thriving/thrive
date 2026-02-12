"""UseCase for showing a smart list."""

from jupiter.cli.command.rendering import (
    entity_id_to_rich_text,
    entity_name_to_rich_text,
)
from jupiter.cli.config import JupiterLoggedInReadonlyCommand
from jupiter.core.config import JupiterLoggedInReadonlyContext
from jupiter.core.smart_lists.use_case.find import (
    SmartListFindResult,
    SmartListFindUseCase,
)
from rich.console import Console
from rich.text import Text
from rich.tree import Tree


class SmartListShow(
    JupiterLoggedInReadonlyCommand[SmartListFindUseCase, SmartListFindResult]
):
    """UseCase for showing the smart list."""

    def _render_result(
        self,
        console: Console,
        context: JupiterLoggedInReadonlyContext,
        result: SmartListFindResult,
    ) -> None:
        sorted_smart_lists = sorted(
            result.entries,
            key=lambda sl: (sl.smart_list.archived, sl.smart_list.created_time),
        )

        rich_tree = Tree("🏛️  Smart Lists", guide_style="bold bright_blue")

        for smart_list_entry in sorted_smart_lists:
            smart_list = smart_list_entry.smart_list

            smart_list_text = Text("")
            smart_list_text.append(entity_id_to_rich_text(smart_list.ref_id))
            if smart_list.icon:
                smart_list_text.append(" ")
                smart_list_text.append(str(smart_list.icon))
            smart_list_text.append(" ")
            smart_list_text.append(str(smart_list.name))

            smart_list_info_text = Text("")

            if smart_list.archived:
                smart_list_text.stylize("gray62")
                smart_list_info_text.stylize("gray62")

            smart_list_tree = rich_tree.add(
                smart_list_text,
                guide_style="gray62" if smart_list.archived else "blue",
            )
            smart_list_tree.add(smart_list_info_text)

            if smart_list_entry.smart_list_items is None:
                continue

            generic_tags_by_item_ref_id = (
                smart_list_entry.smart_list_item_generic_tags
                if smart_list_entry.smart_list_item_generic_tags
                else {}
            )

            for smart_list_item in smart_list_entry.smart_list_items:
                smart_list_item_text = Text("")
                smart_list_item_text.append(
                    entity_id_to_rich_text(smart_list_item.ref_id),
                )
                smart_list_item_text.append(" ")
                smart_list_item_text.append(
                    entity_name_to_rich_text(smart_list_item.name),
                )

                if smart_list_item.is_done:
                    smart_list_item_text.append(" ")
                    smart_list_item_text.append("✅")
                else:
                    smart_list_item_text.append(" ")
                    smart_list_item_text.append("🔲")

                for tag in generic_tags_by_item_ref_id.get(smart_list_item.ref_id, []):
                    smart_list_item_text.append(" #")
                    smart_list_item_text.append(str(tag.name))

                if smart_list_item.url and str(smart_list_item.url) != "None":
                    smart_list_item_text.append(" ")
                    smart_list_item_text.append(str(smart_list_item.url))

                if smart_list_item.archived:
                    smart_list_info_text.stylize("gray62")

                smart_list_tree.add(smart_list_item_text)

        console.print(rich_tree)
