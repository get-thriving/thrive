"""A CRM backed by Wix."""

import logging
import os
from dataclasses import dataclass
from typing import Final, cast

import httpx
from jupiter.core.crm.crm import CRM, CrmDeploymentContext, CrmUpsertResult
from jupiter.core.crm.entity_indexing_record import CRMEntityIndexingRecord
from jupiter.core.users.root import User

LOGGER = logging.getLogger(__name__)

_WIX_CONTACTS_URL = "https://www.wixapis.com/contacts/v4/contacts"
_WIX_CONTACTS_QUERY_URL = "https://www.wixapis.com/contacts/v4/contacts/query"
_WIX_EXTENDED_FIELDS_URL = "https://www.wixapis.com/contacts/v4/extended-fields"
_WIX_EXTENDED_FIELDS_QUERY_URL = (
    "https://www.wixapis.com/contacts/v4/extended-fields/query"
)

_UNIVERSE_FIELD_DISPLAY_NAME = "Thrive Universe"
_ENV_FIELD_DISPLAY_NAME = "Thrive Environment"
_INSTANCE_FIELD_DISPLAY_NAME = "Thrive Instance"

_ENV_UNIVERSE_FIELD_KEY = "WIX_CRM_UNIVERSE_FIELD_KEY"
_ENV_ENV_FIELD_KEY = "WIX_CRM_ENV_FIELD_KEY"
_ENV_INSTANCE_FIELD_KEY = "WIX_CRM_INSTANCE_FIELD_KEY"


@dataclass(frozen=True)
class _WixDeploymentFieldKeys:
    """Wix extended-field keys for deployment metadata."""

    universe: str
    env: str
    instance: str


# Fallback when extended-fields APIs are forbidden (403).
_FALLBACK_DEPLOYMENT_FIELD_KEYS = _WixDeploymentFieldKeys(
    universe="custom.thrive_universe_dikoownehibcnxvxlcw",
    env="custom.thrive_environment_qxbfolqpyauuufux",
    instance="custom.thrive_instance_ygjhdsosidfeaekbbyv",
)


class WixCRM(CRM):
    """A CRM backed by Wix."""

    _api_key: Final[str]
    _account_id: Final[str]
    _site_id: Final[str]
    _client: Final[httpx.AsyncClient]
    _deployment_field_keys: _WixDeploymentFieldKeys | None
    _omit_deployment_extended_fields: bool

    def __init__(
        self,
        api_key: str,
        account_id: str,
        site_id: str,
        deployment: CrmDeploymentContext,
    ) -> None:
        """Constructor."""
        super().__init__()
        self._api_key = api_key
        self._account_id = account_id
        self._site_id = site_id
        self._deployment = deployment
        self._client = httpx.AsyncClient()
        self._deployment_field_keys = None
        self._omit_deployment_extended_fields = False

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
        field_keys = await self._deployment_field_keys_for(deployment)
        headers = self._headers()
        info = self._contact_info(user, deployment, field_keys)

        try:
            if indexing_record is not None:
                return await self._write_contact(
                    headers,
                    info,
                    contact_id=indexing_record.object_id,
                    revision=indexing_record.revision,
                )

            existing = await self._find_contact_for_deployment(
                headers, user, deployment, field_keys
            )
            if existing is not None:
                contact_id, revision = existing
                return await self._write_contact(
                    headers,
                    info,
                    contact_id=contact_id,
                    revision=revision,
                )

            allow_duplicates = field_keys is not None and (
                await self._any_contact_with_email(headers, user) is not None
            )
            try:
                return await self._create_contact(
                    headers, info, allow_duplicates=allow_duplicates
                )
            except httpx.HTTPStatusError as error:
                if error.response.status_code != 409:
                    raise
                resolved = await self._find_contact_for_deployment(
                    headers, user, deployment, field_keys
                )
                if resolved is None:
                    raise
                contact_id, revision = resolved
                return await self._write_contact(
                    headers,
                    info,
                    contact_id=contact_id,
                    revision=revision,
                )
        except httpx.HTTPStatusError as error:
            if (
                not self._omit_deployment_extended_fields
                and field_keys is not None
                and error.response.status_code in {400, 404, 422}
            ):
                LOGGER.warning(
                    "Wix CRM upsert rejected deployment extended fields "
                    "(status=%s body=%s); retrying without them",
                    error.response.status_code,
                    error.response.text,
                )
                self._omit_deployment_extended_fields = True
                return await self.upsert_as_user(
                    user,
                    deployment=deployment,
                    indexing_record=indexing_record,
                )
            raise

    async def remove_user(
        self,
        *,
        indexing_record: CRMEntityIndexingRecord,
    ) -> None:
        """Remove a user from the CRM."""
        contact_id = indexing_record.object_id
        response = await self._client.delete(
            f"{_WIX_CONTACTS_URL}/{contact_id}",
            headers=self._headers(),
        )
        if response.status_code == 404:
            return
        if response.status_code == 428:
            LOGGER.warning(
                "Wix CRM could not delete contact %s for User:%s (precondition failed)",
                contact_id,
                indexing_record.entity_ref_id,
            )
            return
        if response.is_error:
            LOGGER.warning(
                "Wix CRM delete failed contact %s User:%s status=%s body=%s",
                contact_id,
                indexing_record.entity_ref_id,
                response.status_code,
                response.text,
            )
        response.raise_for_status()
        LOGGER.info(
            "Wix CRM removed contact %s User:%s",
            contact_id,
            indexing_record.entity_ref_id,
        )

    async def _deployment_field_keys_for(
        self, deployment: CrmDeploymentContext
    ) -> _WixDeploymentFieldKeys | None:
        _ = deployment
        if self._omit_deployment_extended_fields:
            return None
        if self._deployment_field_keys is not None:
            return self._deployment_field_keys

        configured = _deployment_field_keys_from_env()
        if configured is not None:
            self._deployment_field_keys = configured
            return configured

        headers = self._headers()
        try:
            universe_key = await self._resolve_extended_field_key(
                headers, _UNIVERSE_FIELD_DISPLAY_NAME
            )
            env_key = await self._resolve_extended_field_key(
                headers, _ENV_FIELD_DISPLAY_NAME
            )
            instance_key = await self._resolve_extended_field_key(
                headers, _INSTANCE_FIELD_DISPLAY_NAME
            )
        except httpx.HTTPStatusError as error:
            if error.response.status_code != 403:
                raise
            LOGGER.warning(
                "Wix CRM extended-fields API returned 403 (requires "
                "SCOPE.DC-CONTACTS.MANAGE-EX-FIELDS). Using fallback keys %s; "
                "or set %s, %s, and %s.",
                _FALLBACK_DEPLOYMENT_FIELD_KEYS,
                _ENV_UNIVERSE_FIELD_KEY,
                _ENV_ENV_FIELD_KEY,
                _ENV_INSTANCE_FIELD_KEY,
            )
            self._deployment_field_keys = _FALLBACK_DEPLOYMENT_FIELD_KEYS
            return _FALLBACK_DEPLOYMENT_FIELD_KEYS

        keys = _WixDeploymentFieldKeys(
            universe=universe_key,
            env=env_key,
            instance=instance_key,
        )
        self._deployment_field_keys = keys
        return keys

    async def _resolve_extended_field_key(
        self, headers: dict[str, str], display_name: str
    ) -> str:
        existing = await self._query_extended_field_key(headers, display_name)
        if existing is not None:
            return existing
        return await self._find_or_create_extended_field_key(headers, display_name)

    async def _query_extended_field_key(
        self, headers: dict[str, str], display_name: str
    ) -> str | None:
        response = await self._client.post(
            _WIX_EXTENDED_FIELDS_QUERY_URL,
            headers=headers,
            json={
                "query": {
                    "filter": {"displayName": display_name},
                    "paging": {"limit": 1},
                }
            },
        )
        if response.status_code == 403:
            raise httpx.HTTPStatusError(
                "Wix extended-fields query forbidden",
                request=response.request,
                response=response,
            )
        if response.is_error:
            LOGGER.warning(
                "Wix CRM extended-fields query failed display_name=%r status=%s body=%s",
                display_name,
                response.status_code,
                response.text,
            )
        response.raise_for_status()
        data = response.json()
        fields = cast(list[object], data.get("fields", []))
        if not fields:
            return None
        field = cast(dict[str, object], fields[0])
        return str(field["key"])

    async def _find_or_create_extended_field_key(
        self, headers: dict[str, str], display_name: str
    ) -> str:
        response = await self._client.post(
            _WIX_EXTENDED_FIELDS_URL,
            headers=headers,
            json={"displayName": display_name, "dataType": "TEXT"},
        )
        if response.status_code == 403:
            raise httpx.HTTPStatusError(
                "Wix extended-fields find-or-create forbidden",
                request=response.request,
                response=response,
            )
        if response.is_error:
            LOGGER.warning(
                "Wix CRM extended-fields find-or-create failed display_name=%r "
                "status=%s body=%s",
                display_name,
                response.status_code,
                response.text,
            )
        response.raise_for_status()
        data = response.json()
        return str(cast(dict[str, object], data["field"])["key"])

    async def _write_contact(
        self,
        headers: dict[str, str],
        info: dict[str, object],
        *,
        contact_id: str | None = None,
        revision: int | None = None,
    ) -> CrmUpsertResult:
        if contact_id is not None:
            assert revision is not None
            return await self._update_contact(headers, contact_id, revision, info)
        return await self._create_contact(headers, info)

    async def _create_contact(
        self,
        headers: dict[str, str],
        info: dict[str, object],
        *,
        allow_duplicates: bool = False,
    ) -> CrmUpsertResult:
        response = await self._client.post(
            _WIX_CONTACTS_URL,
            headers=headers,
            json={"info": info, "allowDuplicates": allow_duplicates},
        )
        if response.is_error:
            LOGGER.warning(
                "Wix CRM create failed status=%s body=%s",
                response.status_code,
                response.text,
            )
        response.raise_for_status()
        return self._parse_contact_response(response.json())

    async def _update_contact(
        self,
        headers: dict[str, str],
        contact_id: str,
        revision: int,
        info: dict[str, object],
    ) -> CrmUpsertResult:
        response = await self._client.patch(
            f"{_WIX_CONTACTS_URL}/{contact_id}",
            headers=headers,
            json={"revision": revision, "info": info},
        )
        if response.is_error:
            LOGGER.warning(
                "Wix CRM update failed contact_id=%s status=%s body=%s",
                contact_id,
                response.status_code,
                response.text,
            )
        response.raise_for_status()
        return self._parse_contact_response(response.json())

    async def _find_contact_for_deployment(
        self,
        headers: dict[str, str],
        user: User,
        deployment: CrmDeploymentContext,
        field_keys: _WixDeploymentFieldKeys | None,
    ) -> tuple[str, int] | None:
        """Find the Wix contact for this email in the current deployment."""
        email = str(user.email_address)
        if field_keys is None:
            LOGGER.warning(
                "Wix CRM lookup for %s by email only (no deployment fields); "
                "cannot separate contacts across deployments",
                email,
            )
            return await self._query_contacts(
                headers,
                {"primaryInfo.email": email},
                deployment=deployment,
                field_keys=None,
            )

        contact_filter = _deployment_contact_filter(email, deployment, field_keys)
        return await self._query_contacts(
            headers,
            contact_filter,
            deployment=deployment,
            field_keys=field_keys,
        )

    async def _any_contact_with_email(
        self, headers: dict[str, str], user: User
    ) -> tuple[str, int] | None:
        """Whether any Wix contact exists for this email (any deployment)."""
        return await self._query_contacts(
            headers,
            {"primaryInfo.email": str(user.email_address)},
            deployment=None,
            field_keys=None,
        )

    async def _query_contacts(
        self,
        headers: dict[str, str],
        contact_filter: dict[str, object],
        *,
        deployment: CrmDeploymentContext | None,
        field_keys: _WixDeploymentFieldKeys | None,
    ) -> tuple[str, int] | None:
        response = await self._client.post(
            _WIX_CONTACTS_QUERY_URL,
            headers=headers,
            json={
                "query": {
                    "filter": contact_filter,
                    "paging": {"limit": 10},
                }
            },
        )
        if response.is_error:
            LOGGER.warning(
                "Wix CRM contact query failed status=%s body=%s",
                response.status_code,
                response.text,
            )
        response.raise_for_status()
        data = response.json()
        contacts = cast(list[object], data.get("contacts", []))
        for raw in contacts:
            contact = cast(dict[str, object], raw)
            if deployment is not None and field_keys is not None:
                if not _contact_matches_deployment(contact, deployment, field_keys):
                    continue
            return (
                str(contact["id"]),
                int(cast(int, contact["revision"])),
            )
        return None

    def _headers(self) -> dict[str, str]:
        return {
            "Content-Type": "application/json",
            "Authorization": self._api_key,
            "wix-account-id": self._account_id,
            "wix-site-id": self._site_id,
        }

    @staticmethod
    def _contact_info(
        user: User,
        deployment: CrmDeploymentContext,
        field_keys: _WixDeploymentFieldKeys | None,
    ) -> dict[str, object]:
        info: dict[str, object] = {
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
        }
        if field_keys is not None:
            values = deployment.as_strings()
            info["extendedFields"] = {
                "items": {
                    field_keys.universe: values["universe"],
                    field_keys.env: values["env"],
                    field_keys.instance: values["instance"],
                }
            }
        return info

    @staticmethod
    def _parse_contact_response(data: dict[str, object]) -> CrmUpsertResult:
        contact = cast(dict[str, object], data["contact"])
        return CrmUpsertResult(
            object_id=str(contact["id"]),
            revision=int(cast(int, contact["revision"])),
        )


def _deployment_field_keys_from_env() -> _WixDeploymentFieldKeys | None:
    universe = os.getenv(_ENV_UNIVERSE_FIELD_KEY, "").strip()
    env = os.getenv(_ENV_ENV_FIELD_KEY, "").strip()
    instance = os.getenv(_ENV_INSTANCE_FIELD_KEY, "").strip()
    if not universe or not env or not instance:
        return None
    return _WixDeploymentFieldKeys(
        universe=_wix_extended_field_key(universe),
        env=_wix_extended_field_key(env),
        instance=_wix_extended_field_key(instance),
    )


def _wix_extended_field_key(key: str) -> str:
    if "." in key:
        return key
    return f"custom.{key}"


def _extended_field_filter_path(field_key: str) -> str:
    return f"info.extendedFields.{field_key}"


def _deployment_contact_filter(
    email: str,
    deployment: CrmDeploymentContext,
    field_keys: _WixDeploymentFieldKeys,
) -> dict[str, object]:
    values = deployment.as_strings()
    return {
        "$and": [
            {"primaryInfo.email": email},
            {
                _extended_field_filter_path(field_keys.universe): {
                    "$eq": values["universe"]
                }
            },
            {_extended_field_filter_path(field_keys.env): {"$eq": values["env"]}},
            {
                _extended_field_filter_path(field_keys.instance): {
                    "$eq": values["instance"]
                }
            },
        ]
    }


def _contact_matches_deployment(
    contact: dict[str, object],
    deployment: CrmDeploymentContext,
    field_keys: _WixDeploymentFieldKeys,
) -> bool:
    info = cast(dict[str, object], contact.get("info", {}))
    extended = info.get("extendedFields")
    if not isinstance(extended, dict):
        return False
    items = extended.get("items", extended)
    if not isinstance(items, dict):
        return False
    values = deployment.as_strings()
    return (
        items.get(field_keys.universe) == values["universe"]
        and items.get(field_keys.env) == values["env"]
        and items.get(field_keys.instance) == values["instance"]
    )
