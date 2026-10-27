"""Tests for finding the auth methods a user is linked to."""

import asyncio
from typing import Any
from unittest.mock import AsyncMock, MagicMock

import pytest
from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.auth.service.check_email_not_taken_by_other_method import (
    AccountExistsWithOtherAuthMethodError,
    CheckEmailNotTakenByOtherMethodService,
)
from jupiter.core.auth.service.load_linked_auth_methods import (
    LoadLinkedAuthMethodsService,
)
from jupiter.core.auth.sub.apple.root import AuthApple
from jupiter.core.auth.sub.google.root import AuthGoogle
from jupiter.core.auth.sub.local.root import AuthLocal
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.users.root import UserNotFoundError, UserRepository
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import EntityNotFoundError


def _uow(linked: set[type[Any]], existing_user: Any | None = None) -> MagicMock:
    uow = MagicMock()

    def get_for(auth_cls: type[Any]) -> MagicMock:
        repo = MagicMock()
        if auth_cls in linked:
            repo.load_by_parent = AsyncMock(return_value=MagicMock())
        else:
            repo.load_by_parent = AsyncMock(side_effect=EntityNotFoundError())
        return repo

    user_repo = MagicMock()
    if existing_user is None:
        user_repo.load_by_email_address = AsyncMock(side_effect=UserNotFoundError())
    else:
        user_repo.load_by_email_address = AsyncMock(return_value=existing_user)

    uow.get_for = get_for
    uow.get = lambda repo_cls: user_repo if repo_cls is UserRepository else MagicMock()
    return uow


def test_lists_every_method_with_a_record() -> None:
    uow = _uow({AuthLocal, AuthApple})
    linked = asyncio.run(LoadLinkedAuthMethodsService().do_it(uow, EntityId("1")))
    assert linked == [UserAuthMethod.LOCAL, UserAuthMethod.APPLE]


def test_free_email_passes() -> None:
    uow = _uow(set())
    asyncio.run(
        CheckEmailNotTakenByOtherMethodService().do_it(uow, EmailAddress("a@b.co"))
    )


def test_taken_email_points_at_existing_methods() -> None:
    user = MagicMock(archived=False, ref_id=EntityId("1"))
    uow = _uow({AuthLocal, AuthGoogle}, existing_user=user)
    with pytest.raises(AccountExistsWithOtherAuthMethodError) as err:
        asyncio.run(
            CheckEmailNotTakenByOtherMethodService().do_it(uow, EmailAddress("a@b.co"))
        )
    assert "your email and password or Google" in str(err.value)


def test_archived_user_does_not_block() -> None:
    user = MagicMock(archived=True, ref_id=EntityId("1"))
    uow = _uow({AuthLocal}, existing_user=user)
    asyncio.run(
        CheckEmailNotTakenByOtherMethodService().do_it(uow, EmailAddress("a@b.co"))
    )
