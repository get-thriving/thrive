"""PostgreSQL variant — see `sqlite_repository.py` for SQLite."""

from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.users.root import (
    User,
    UserAlreadyExistsError,
    UserNotFoundError,
    UserRepository,
)
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.storage.postgres.repository import (
    PostgresRootEntityRepository,
)
from sqlalchemy import (
    MetaData,
    select,
)
from sqlalchemy.ext.asyncio import AsyncConnection


class PostgresUserRepository(PostgresRootEntityRepository[User], UserRepository):
    """The PostgreSQL based user repository."""

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(
            realm_codec_registry,
            connection,
            metadata,
            already_exists_err_cls=UserAlreadyExistsError,
            not_found_err_cls=UserNotFoundError,
        )

    async def load_by_email_address(self, email_address: EmailAddress) -> User:
        """Retrieve a user by their email address."""
        query_stmt = select(self._table).where(
            self._table.c.email_address == str(email_address)
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise UserNotFoundError(f"User with email {email_address} does not exist")
        return self._row_to_entity(result)

    async def find_all_unarchived_by_auth_method(
        self, auth_method: UserAuthMethod
    ) -> list[User]:
        """Find all unarchived users with the given auth method."""
        query_stmt = select(self._table).where(
            self._table.c.archived.is_(False),
            self._table.c.auth_method == auth_method.value,
        )
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]
