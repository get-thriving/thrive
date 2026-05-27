"""A temporary migrator."""

import asyncio

import jupiter.core
from jupiter.cli.config import build_cli_properties
from jupiter.framework.realm.standard import ModuleExplorerRealmCodecRegistry
from jupiter.framework.storage.sqlite.connection import SqliteConnection


async def main() -> None:
    """Application main function."""
    ModuleExplorerRealmCodecRegistry.build_from_module_root(jupiter.core)

    cli_properties = build_cli_properties()
    SqliteConnection(
        SqliteConnection.Config(
            cli_properties.sqlite_db_url,
            cli_properties.alembic_ini_path,
            cli_properties.alembic_migrations_path,
        ),
    )


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    loop.close()
