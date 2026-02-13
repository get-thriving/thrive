"""The Jupiter external API."""

import asyncio

from rich import print as rich_print


async def main() -> None:
    """Application main function."""
    rich_print("=" * 80)
    rich_print("Starting Jupiter WebAPI:")
    # rich_print(f"  Version: {global_properties.version}")
    # rich_print(f"  Universe: {global_properties.universe}")
    # rich_print(f"  Environment: {global_properties.env}")
    # rich_print(f"  Instance: {global_properties.instance}")
    # rich_print(f"  Hosting: {global_properties.universe.hosting}")
    rich_print("=" * 80)

    # app = JupiterRestAPIAppForm(
    #     APIVersion(
    #         "v1",
    #         APIResource(
    #             "inbox-tasks",
    #             APIPostMethod(
    #                 inbox_task_create_async
    #                 InboxTaskCreateArgs,
    #                 InboxTaskCreateResult,
    #             ),
    #             APIGetMethod(
    #                 inbox_task_find_async,
    #                 InboxTaskCreateArgs,
    #                 InboxTaskCreateResult
    #             ),
    #             APIResource(
    #                 ":refId",
    #                 APIGetMethod(
    #                     inbox_task_get_async,
    #                     InboxTaskCreateArgs,
    #                     InboxTaskCreateResult
    #                 )
    #             )
    #         )
    #     )
    # )


def sync_main() -> None:
    """Run the main function synchronously."""
    asyncio.run(main())


if __name__ == "__main__":
    sync_main()
