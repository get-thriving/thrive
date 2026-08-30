from enum import StrEnum


class EntityReferenceBlockKind(StrEnum):
    ENTITY_REFERENCE = "entity-reference"

    def __str__(self) -> str:
        return str(self.value)
