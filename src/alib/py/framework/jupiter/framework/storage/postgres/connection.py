"""The PostgreSQL connection."""

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Final

import sqlalchemy.exc
from alembic import command
from alembic.config import Config
from jupiter.framework.storage.connection import Connection, ConnectionPrepareError
from pydantic_core import to_jsonable_python
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Connection as SyncConnection
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine


def _to_sync_postgres_url(async_url: str) -> str:
    """Map an async SQLAlchemy PostgreSQL URL to a synchronous driver URL."""
    if "+asyncpg" in async_url:
        return async_url.replace("+asyncpg", "+psycopg", 1)
    if "+psycopg_async" in async_url:
        return async_url.replace("+psycopg_async", "+psycopg", 1)
    return async_url


class PostgresConnection(Connection):
    """A connection to PostgreSQL storage."""

    @dataclass(frozen=True)
    class Config:
        """Config for a PostgreSQL storage engine."""

        postgres_db_url: str
        alembic_ini_path: Path
        alembic_migrations_path: Path

    _config: Final[Config]
    _sql_engine: Final[AsyncEngine]

    def __init__(self, config: Config) -> None:
        """Constructor."""
        self._config = config
        self._sql_engine = create_async_engine(
            config.postgres_db_url,
            future=True,
            json_serializer=lambda *a, **kw: json.dumps(
                to_jsonable_python(*a, **kw),
            ),
        )

    async def prepare(self) -> None:
        """Prepare the PostgreSQL storage."""
        try:
            async with self._sql_engine.begin() as connection:

                def do_alembic_upgrade(sync_conn: SyncConnection) -> None:
                    alembic_cfg = Config(str(self._config.alembic_ini_path))
                    alembic_cfg.set_section_option(
                        "alembic",
                        "script_location",
                        str(self._config.alembic_migrations_path),
                    )
                    alembic_cfg.set_main_option(
                        "sqlalchemy.url", self._config.postgres_db_url
                    )

                    # Give Alembic a *sync* connection
                    alembic_cfg.attributes["connection"] = sync_conn

                    command.upgrade(alembic_cfg, "head")

                await connection.run_sync(do_alembic_upgrade)
        except sqlalchemy.exc.OperationalError as exc:
            raise ConnectionPrepareError(
                "Failed to prepare PostgreSQL connection",
            ) from exc

    async def dispose(self) -> None:
        """Close the PostgreSQL storage."""
        await self._sql_engine.dispose()

    def nuke(self) -> None:
        """Completely destroy all objects in the public schema (destructive)."""
        sync_url = _to_sync_postgres_url(self._config.postgres_db_url)
        engine = create_engine(sync_url)
        try:
            with engine.begin() as conn:
                conn.execute(text("DROP SCHEMA IF EXISTS public CASCADE"))
                conn.execute(text("CREATE SCHEMA public"))
                conn.execute(text("GRANT ALL ON SCHEMA public TO public"))
        finally:
            engine.dispose()

    @property
    def sql_engine(self) -> AsyncEngine:
        """The raw PostgreSQL engine object."""
        return self._sql_engine
