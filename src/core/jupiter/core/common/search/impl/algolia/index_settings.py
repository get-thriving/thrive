"""Canonical Algolia entity-index settings.

Keep in sync with ``algolia_index.entities`` in ``infra/terraform.tf``.
The app applies these on first use so local indexes pick up new searchable
fields (for example location text) without waiting on ``terraform apply``.
"""

from typing import Final

ALGOLIA_ENTITIES_INDEX_SETTINGS: Final[dict[str, list[str]]] = {
    "searchableAttributes": [
        "name",
        "note",
        "location_name",
        "location_address",
        "location_country",
        "location_gps",
    ],
    "attributesForFaceting": [
        "filterOnly(workspace_ref_id)",
        "filterOnly(search_domain_ref_id)",
        "filterOnly(ref_id)",
        "instance",
        "entity_tag",
        "archived",
        "filterOnly(tag_ref_ids)",
        "filterOnly(contact_ref_ids)",
        "filterOnly(location_ref_ids)",
        "filterOnly(visible_to)",
    ],
    "attributesToRetrieve": [
        "workspace_ref_id",
        "search_domain_ref_id",
        "entity_tag",
        "parent_ref_id",
        "ref_id",
        "name",
        "note",
        "location_name",
        "location_address",
        "location_country",
        "location_gps",
        "archived",
        "created_time",
        "last_modified_time",
        "archived_time",
        "tag_ref_ids",
        "contact_ref_ids",
        "location_ref_ids",
        "instance",
    ],
    "numericAttributesForFiltering": [
        "created_time",
        "last_modified_time",
        "archived_time",
    ],
    "attributesToHighlight": [
        "name",
        "note",
        "location_name",
        "location_address",
        "location_country",
        "location_gps",
    ],
    "attributesToSnippet": [
        "name:64",
        "note:64",
        "location_name:64",
        "location_address:64",
        "location_country:64",
        "location_gps:64",
    ],
}
