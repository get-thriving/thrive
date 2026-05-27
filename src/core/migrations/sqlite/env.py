from alembic import context


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    connection = context.config.attributes.get("connection", None)
    if connection is None:
        raise RuntimeError(
            "No connection provided. Set alembic_cfg.attributes['connection']."
        )

    context.configure(
        connection=connection,
        target_metadata=None,  # or your metadata if you do autogenerate
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    connection = context.config.attributes.get("connection", None)
    if connection is None:
        raise RuntimeError(
            "No connection provided. Set alembic_cfg.attributes['connection']."
        )

    context.configure(
        connection=connection,
        target_metadata=None,  # or your metadata if you do autogenerate
    )

    with context.begin_transaction():
        context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
