"""Find which auth methods a user can currently sign in with."""

from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.auth.sub.apple.root import AuthApple
from jupiter.core.auth.sub.google.root import AuthGoogle
from jupiter.core.auth.sub.local.root import AuthLocal
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork, EntityNotFoundError


class LoadLinkedAuthMethodsService:
    """Lists the methods a user has a live auth record for."""

    async def do_it(
        self, uow: DomainUnitOfWork, user_ref_id: EntityId
    ) -> list[UserAuthMethod]:
        """List the methods the user has a live auth record for."""
        linked: list[UserAuthMethod] = []
        for method, auth_cls in (
            (UserAuthMethod.LOCAL, AuthLocal),
            (UserAuthMethod.GOOGLE, AuthGoogle),
            (UserAuthMethod.APPLE, AuthApple),
        ):
            try:
                await uow.get_for(auth_cls).load_by_parent(user_ref_id)
            except EntityNotFoundError:
                continue
            linked.append(method)
        return linked
