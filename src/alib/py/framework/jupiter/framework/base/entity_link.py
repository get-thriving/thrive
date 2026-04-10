"""A typed reference to an entity by kind and id."""

import re

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.realm import (
    DatabaseRealm,
    RealmDecoder,
    RealmDecodingError,
    RealmEncoder,
    RealmThing,
)
from jupiter.framework.value import AtomicValue, hashable_value

_REF_ID_RE: re.Pattern[str] = re.compile(
    r"^(?:\d+|[a-zA-Z0-9_]+|bad-entity-id)$",
)


@hashable_value
class EntityLink(AtomicValue[str]):
    """A reference combining an entity kind with an entity id and a purpose."""

    the_type: str
    ref_id: EntityId
    purpose: str = "std"

    @staticmethod
    def std(the_type: str, ref_id: EntityId) -> "EntityLink":
        """Build a link with the canonical ``std`` purpose (e.g. note ownership)."""
        return EntityLink(the_type=the_type, ref_id=ref_id, purpose="std")

    def _validate(self) -> None:
        if not self.the_type:
            raise InputValidationError("Entity link type must be non-empty")
        ref_s = str(self.ref_id)
        if not _REF_ID_RE.match(ref_s):
            raise InputValidationError(f"Invalid entity ref_id for link: {ref_s!r}")
        if not self.purpose.isalnum():
            raise InputValidationError("Entity link purpose must be alphanumeric")

    def __str__(self) -> str:
        """Canonical wire/database form."""
        return f"{self.the_type}:{self.ref_id}:{self.purpose}"


class EntityLinkDatabaseEncoder(RealmEncoder[EntityLink, DatabaseRealm]):
    """Entity link encoder for the database realm."""

    def encode(self, value: EntityLink) -> RealmThing:
        """Encode to ``{the_type}:{ref_id}:{purpose}`` for the database realm."""
        return str(value)


class EntityLinkDatabaseDecoder(RealmDecoder[EntityLink, DatabaseRealm]):
    """Entity link decoder for the database realm."""

    def decode(self, value: RealmThing) -> EntityLink:
        """Decode from the canonical string ``{the_type}:{ref_id}:{purpose}``."""
        if not isinstance(value, str):
            raise RealmDecodingError(
                f"Expected value for {self.__class__} to be a string but was {value}",
            )
        if ":" not in value:
            raise RealmDecodingError(
                f"Expected entity link to contain ':' but got {value!r}",
            )
        the_type, ref_id_str, purpose = value.rsplit(":", 2)
        if not the_type or not ref_id_str or not purpose:
            raise RealmDecodingError(
                f"Expected entity link to have non-empty type and ref id but got {value!r}",
            )
        if not _REF_ID_RE.match(ref_id_str):
            raise RealmDecodingError(
                f"Expected entity link ref id to be a valid entity id but got {ref_id_str!r}",
            )
        if not purpose.isalnum():
            raise RealmDecodingError(
                f"Expected entity link purpose to be alphanumeric but got {purpose!r}",
            )
        try:
            return EntityLink(
                the_type=the_type,
                ref_id=EntityId(ref_id_str),
                purpose=purpose,
            )
        except InputValidationError as err:
            raise RealmDecodingError(str(err)) from err
