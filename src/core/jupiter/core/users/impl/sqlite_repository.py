"""The SQLIte based user repository."""

from collections.abc import Iterable

from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.users.name import UserName
from jupiter.core.users.root import (
    User,
    UserAlreadyExistsError,
    UserNotFoundError,
    UserRepository,
)
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.storage.sqlite.repository import (
    SqliteRootEntityRepository,
)
from sqlalchemy import (
    MetaData,
    func,
    or_,
    select,
)
from sqlalchemy.ext.asyncio import AsyncConnection


class SqliteUserRepository(SqliteRootEntityRepository[User], UserRepository):
    """The SQLite based user repository."""

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

    async def find_all_light_by_ref_ids(
        self,
        ref_ids: Iterable[EntityId],
    ) -> list[UserLight]:
        """Load lightweight user summaries for the given ref ids."""
        ref_id_list = list(ref_ids)
        if not ref_id_list:
            return []
        query_stmt = select(
            self._table.c.ref_id,
            self._table.c.name,
            self._table.c.email_address,
        ).where(
            self._table.c.ref_id.in_([ref_id.as_int() for ref_id in ref_id_list]),
        )
        results = await self._connection.execute(query_stmt)
        return [
            UserLight(
                ref_id=EntityId(str(row.ref_id)),
                name=UserName(row.name),
                email_address=EmailAddress(row.email_address),
            )
            for row in results
        ]

    async def search_by_name_or_email(
        self,
        query: str,
        limit: int,
        *,
        exclude_ref_ids: Iterable[EntityId] | None = None,
    ) -> list[User]:
        """Find unarchived users whose name or email matches a prefix of ``query``."""
        pattern = f"{SqliteUserRepository._like_escape(query.strip().lower())}%"
        wheres = [
            self._table.c.archived.is_(False),
            or_(
                func.lower(self._table.c.name).like(pattern, escape="\\"),
                func.lower(self._table.c.email_address).like(pattern, escape="\\"),
            ),
        ]
        if exclude_ref_ids is not None:
            exclude_ints = [ref_id.as_int() for ref_id in exclude_ref_ids]
            if len(exclude_ints) > 0:
                wheres.append(self._table.c.ref_id.not_in(exclude_ints))

        query_stmt = (
            select(self._table).where(*wheres).order_by(self._table.c.name).limit(limit)
        )
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    @staticmethod
    def _like_escape(value: str) -> str:
        return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
