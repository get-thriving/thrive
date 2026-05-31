"""A CRM backed by Wix."""

from typing import Final

import aiohttp
from jupiter.core.application.crm import CRM
from jupiter.core.users.root import User


class WixCRM(CRM):
    """A CRM backed by Wix."""

    _api_key: Final[str]
    _account_id: Final[str]
    _site_id: Final[str]
    _session: Final[aiohttp.ClientSession]

    def __init__(
        self,
        api_key: str,
        account_id: str,
        site_id: str,
        session: aiohttp.ClientSession,
    ) -> None:
        """Constructor."""
        super().__init__()
        self._api_key = api_key
        self._account_id = account_id
        self._site_id = site_id
        self._session = session

    async def upsert_as_user(self, user: User) -> None:
        """Upsert a user in the CRM."""
        headers = {
            "Content-Type": "application/json",
            "Authorization": self._api_key,
            "wix-account-id": self._account_id,
            "wix-site-id": self._site_id,
        }
        payload = {
            "info": {
                "name": {"first": str(user.name), "last": ""},
                "emails": {
                    "items": [
                        {
                            "tag": "MAIN",
                            "email": str(user.email_address),
                        }
                    ]
                },
                "labelKeys": {"items": ["custom.inapp"]},
            },
            "allowDuplicates": True,
        }

        print("I'm here")

        async with self._session.post(
            "https://www.wixapis.com/contacts/v4/contacts",
            headers=headers,
            json=payload,
        ) as response:
            response.raise_for_status()
