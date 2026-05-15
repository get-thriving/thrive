"""Normalize database URLs for SQLAlchemy async engines."""

_SQL_URL_SCHEME_SEP = "://"


def normalized_async_sqlalchemy_db_url(
    raw: str | None,
    *,
    async_engine_scheme: str,
    label: str,
) -> str:
    """Strip any URL scheme and force ``async_engine_scheme`` for SQLAlchemy async drivers."""
    if not raw:
        raise ValueError(f"{label} database URL is missing or empty.")
    sep_at = raw.find(_SQL_URL_SCHEME_SEP)
    if sep_at == -1:
        raise ValueError(
            f'{label} database URL must contain "{_SQL_URL_SCHEME_SEP}" (got {raw!r}).'
        )
    remainder = raw[sep_at + len(_SQL_URL_SCHEME_SEP) :]
    return f"{async_engine_scheme}{_SQL_URL_SCHEME_SEP}{remainder}"
