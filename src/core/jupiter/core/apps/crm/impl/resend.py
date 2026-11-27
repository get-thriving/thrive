"""A CRM backed by Resend contacts.

Resend keeps one global contact per email address for the whole team, so
unlike a per-site CRM there is nothing to separate deployments with: two
deployments that share a user email share the contact, and the last sync wins.
The deployment is recorded in the ``thrive_*`` contact properties instead.

The API has no revision or ETag. ``CrmUpsertResult.revision`` is a local counter
that is bumped on every write, and is never sent to Resend.

The ``unsubscribed`` flag is owned by the contact, not by Thrive: it is never
sent, so a sync can never re-subscribe someone who opted out.
"""

import asyncio
import logging
from typing import Final, cast

import httpx
from jupiter.core.apps.crm.crm import CRM, CrmDeploymentContext, CrmUpsertResult
from jupiter.core.apps.crm.entity_indexing_record import (
    FIRST_CRM_REVISION,
    CRMEntityIndexingRecord,
)
from jupiter.core.users.root import User

LOGGER = logging.getLogger(__name__)

_RESEND_CONTACTS_URL = "https://api.resend.com/contacts"
_RESEND_CONTACT_PROPERTIES_URL = "https://api.resend.com/contact-properties"

_UNIVERSE_PROPERTY_KEY = "thrive_universe"
_ENV_PROPERTY_KEY = "thrive_env"
_INSTANCE_PROPERTY_KEY = "thrive_instance"
_DEPLOYMENT_PROPERTY_KEYS: Final = (
    _UNIVERSE_PROPERTY_KEY,
    _ENV_PROPERTY_KEY,
    _INSTANCE_PROPERTY_KEY,
)

# Resend allows 10 requests per second per team, shared by every API key.
_MAX_RATE_LIMIT_RETRIES: Final = 5
_DEFAULT_RETRY_AFTER_SECONDS: Final = 1.0
_MAX_RETRY_AFTER_SECONDS: Final = 30.0


class ResendCRM(CRM):
    """A CRM backed by Resend contacts."""

    _api_key: Final[str]
    _client: Final[httpx.AsyncClient]
    _properties_ensured: bool
    _omit_properties: bool

    def __init__(
        self,
        api_key: str,
        deployment: CrmDeploymentContext,
        client: httpx.AsyncClient | None = None,
    ) -> None:
        """Constructor.

        The key needs "Full access": Resend refuses contacts calls on keys that
        are restricted to sending email.
        """
        super().__init__()
        self._api_key = api_key
        self._deployment = deployment
        self._client = client if client is not None else httpx.AsyncClient(timeout=30.0)
        self._properties_ensured = False
        self._omit_properties = False

    async def close(self) -> None:
        """Close the underlying HTTP client."""
        await self._client.aclose()

    async def upsert_as_user(
        self,
        user: User,
        *,
        deployment: CrmDeploymentContext,
        indexing_record: CRMEntityIndexingRecord | None = None,
    ) -> CrmUpsertResult:
        """Upsert a user in the CRM."""
        email = str(user.email_address)
        await self._ensure_deployment_properties()

        next_revision = (
            indexing_record.revision + 1
            if indexing_record is not None
            else FIRST_CRM_REVISION
        )

        contact_id: str | None = None
        if indexing_record is not None:
            contact_id = await self._update_contact_by_known_id(
                indexing_record.object_id, user, email, deployment
            )
        if contact_id is None:
            contact_id = await self._upsert_contact_by_email(user, email, deployment)

        return CrmUpsertResult(object_id=contact_id, revision=next_revision)

    async def remove_user(
        self,
        *,
        indexing_record: CRMEntityIndexingRecord,
    ) -> None:
        """Remove a user from the CRM."""
        contact_id = indexing_record.object_id
        response = await self._request("DELETE", f"{_RESEND_CONTACTS_URL}/{contact_id}")
        if response.status_code == 404:
            return
        if response.is_error:
            LOGGER.warning(
                "Resend CRM delete failed contact=%s User:%s status=%s body=%s",
                contact_id,
                indexing_record.entity_ref_id,
                response.status_code,
                response.text,
            )
        response.raise_for_status()
        LOGGER.info(
            "Resend CRM removed contact %s User:%s",
            contact_id,
            indexing_record.entity_ref_id,
        )

    async def _update_contact_by_known_id(
        self,
        contact_id: str,
        user: User,
        email: str,
        deployment: CrmDeploymentContext,
    ) -> str | None:
        """Update the contact the indexing map points at.

        Returns ``None`` when that contact cannot be used and the caller should
        fall back to the email: it is gone (404), or the id is not a Resend one
        (rows written by the old Wix CRM carry Wix ids), or the user changed
        their email, which Resend cannot do on an existing contact.
        """
        response = await self._request("GET", f"{_RESEND_CONTACTS_URL}/{contact_id}")
        if response.status_code in {400, 404, 422}:
            return None
        self._raise_for_status(response, "load", contact_id)

        current_email = cast(dict[str, object], response.json()).get("email")
        if str(current_email).lower() != email.lower():
            LOGGER.info(
                "Resend CRM contact %s changed email; recreating for User:%s",
                contact_id,
                user.ref_id,
            )
            delete = await self._request(
                "DELETE", f"{_RESEND_CONTACTS_URL}/{contact_id}"
            )
            if delete.status_code != 404:
                self._raise_for_status(delete, "delete", contact_id)
            return None

        update = await self._patch_contact(contact_id, user, deployment)
        if update.status_code == 404:
            return None
        self._raise_for_status(update, "update", contact_id)
        return contact_id

    async def _upsert_contact_by_email(
        self,
        user: User,
        email: str,
        deployment: CrmDeploymentContext,
    ) -> str:
        update = await self._patch_contact(email, user, deployment)
        if update.status_code != 404:
            self._raise_for_status(update, "update", email)
            return self._contact_id(update)

        create = await self._post_contact(user, email, deployment)
        if create.is_error and create.status_code in {400, 409, 422}:
            # Lost a race with another writer that created the contact between
            # our update and our create. Resend does not document the duplicate
            # status, so try the update once more before giving up.
            retry = await self._patch_contact(email, user, deployment)
            if not retry.is_error:
                return self._contact_id(retry)
        self._raise_for_status(create, "create", email)
        return self._contact_id(create)

    async def _patch_contact(
        self, id_or_email: str, user: User, deployment: CrmDeploymentContext
    ) -> httpx.Response:
        body = self._contact_body(user, deployment)
        response = await self._request(
            "PATCH", f"{_RESEND_CONTACTS_URL}/{id_or_email}", json=body
        )
        if self._rejected_properties(response, body):
            return await self._patch_contact(id_or_email, user, deployment)
        return response

    async def _post_contact(
        self, user: User, email: str, deployment: CrmDeploymentContext
    ) -> httpx.Response:
        body = {"email": email, **self._contact_body(user, deployment, create=True)}
        response = await self._request("POST", _RESEND_CONTACTS_URL, json=body)
        if self._rejected_properties(response, body):
            return await self._post_contact(user, email, deployment)
        return response

    def _contact_body(
        self, user: User, deployment: CrmDeploymentContext, *, create: bool = False
    ) -> dict[str, object]:
        body: dict[str, object] = {
            "first_name": str(user.name),
            "last_name": "",
        }
        if not self._omit_properties:
            values = deployment.as_strings()
            keyed = {
                _UNIVERSE_PROPERTY_KEY: values["universe"],
                _ENV_PROPERTY_KEY: values["env"],
                _INSTANCE_PROPERTY_KEY: values["instance"],
            }
            if create:
                body["properties"] = {
                    key: {"key": key, "value": value} for key, value in keyed.items()
                }
            else:
                body["properties"] = keyed
        return body

    def _rejected_properties(
        self, response: httpx.Response, body: dict[str, object]
    ) -> bool:
        """Whether the write failed over the properties, which are now dropped."""
        if (
            self._omit_properties
            or "properties" not in body
            or response.status_code not in {400, 422}
        ):
            return False
        LOGGER.warning(
            "Resend CRM rejected deployment properties (status=%s body=%s); "
            "retrying without them",
            response.status_code,
            response.text,
        )
        self._omit_properties = True
        return True

    async def _ensure_deployment_properties(self) -> None:
        """Create the deployment contact properties once per process."""
        if self._properties_ensured or self._omit_properties:
            return
        for key in _DEPLOYMENT_PROPERTY_KEYS:
            response = await self._request(
                "POST",
                _RESEND_CONTACT_PROPERTIES_URL,
                json={"key": key, "type": "string"},
            )
            if response.is_success:
                continue
            if response.status_code in {400, 409, 422}:
                # Resend does not document the duplicate-property status; the
                # property most likely already exists.
                LOGGER.info(
                    "Resend CRM contact property %s not created "
                    "(status=%s body=%s); assuming it exists",
                    key,
                    response.status_code,
                    response.text,
                )
                continue
            self._raise_for_status(response, "create property", key)
        self._properties_ensured = True

    async def _request(
        self, method: str, url: str, *, json: dict[str, object] | None = None
    ) -> httpx.Response:
        """Send a request, waiting out Resend's rate limit."""
        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
        }
        response = await self._client.request(method, url, headers=headers, json=json)
        retries = 0
        while response.status_code == 429 and retries < _MAX_RATE_LIMIT_RETRIES:
            retries += 1
            await asyncio.sleep(_retry_after_seconds(response))
            response = await self._client.request(
                method, url, headers=headers, json=json
            )
        return response

    @staticmethod
    def _contact_id(response: httpx.Response) -> str:
        return str(cast(dict[str, object], response.json())["id"])

    @staticmethod
    def _raise_for_status(response: httpx.Response, action: str, target: str) -> None:
        if response.is_error:
            LOGGER.warning(
                "Resend CRM %s failed target=%s status=%s body=%s",
                action,
                target,
                response.status_code,
                response.text,
            )
        response.raise_for_status()


def _retry_after_seconds(response: httpx.Response) -> float:
    try:
        seconds = float(response.headers.get("retry-after", ""))
    except ValueError:
        return _DEFAULT_RETRY_AFTER_SECONDS
    return min(max(seconds, 0.0), _MAX_RETRY_AFTER_SECONDS)
