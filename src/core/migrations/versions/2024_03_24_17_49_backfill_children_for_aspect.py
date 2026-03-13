"""Backfill children for aspects

Revision ID: 8fa2fbaa9924
Revises: 7fd41e13e30f
Create Date: 2024-03-24 17:49:43.646792

"""

# revision identifiers, used by Alembic.
revision = "8fa2fbaa9924"
down_revision = "7fd41e13e30f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # This seems to be causing problems in older problems of sqlite3 that we still encounter.
    # Since this is just something for my own account, it can be disabled.
    # op.execute(
    #     """
    # update aspect
    # set order_of_child_aspects=bb.crd
    # from (
    #     select
    #         parent_aspect_ref_id as mpx,
    #         json_group_array(ref_id) as crd
    #     from aspect
    #     where parent_aspect_ref_id is not null
    #     group by parent_aspect_ref_id
    # ) as bb
    # where bb.mpx=aspect.ref_id;
    # """
    # )
    pass


def downgrade() -> None:
    pass
