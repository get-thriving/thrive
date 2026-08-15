"""Algolia entity index naming (aligned with ``infra/terraform.tf``)."""

from jupiter.core.env import Env
from jupiter.core.universe import Universe


def algolia_entities_index_name(universe: Universe, env: Env) -> str:
    """Return the Algolia index name for entity search.

    Format: ``{universe}-{environment}-entities``, same as
    ``"${spec.universe}-${spec.environment}-entities"`` in Terraform
    ``local.algolia_entities_index_names``.
    """
    return f"{universe.the_universe}-{env.value}-entities"
