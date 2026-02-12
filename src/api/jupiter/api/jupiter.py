"""The Jupiter external API."""

import asyncio


async def main() -> None:
    """Application main function."""
    print("Hello, World!")


def sync_main() -> None:
    """Run the main function synchronously."""
    asyncio.run(main())


if __name__ == "__main__":
    sync_main()
