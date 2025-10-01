"""A repository of docs."""

import abc

from jupiter.core.domain.concept.docs.doc import Doc
from jupiter.framework_new.repository import (
    LeafEntityRepository,
)


class DocRepository(LeafEntityRepository[Doc], abc.ABC):
    """A repository of docs."""
