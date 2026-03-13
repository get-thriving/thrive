"""Create the root aspect and assign every aspect to it

Revision ID: d1157bf2d79a
Revises: af65a31f2252
Create Date: 2024-03-24 09:28:29.379603

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "d1157bf2d79a"
down_revision = "af65a31f2252"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        insert into aspect 
        select 
            1000 + ref_id as ref_id, 
            1 as version,
            false as archived,
            created_time as created_time,
            created_time as last_modified_time,
            null as archived_time,
            ref_id as aspect_collection_ref_id,
            '<XXX> Life <XXX>' as name,
            null as parent_aspect_ref_id
        from aspect_collection;
    """
    )

    op.execute(
        """
        update aspect set parent_aspect_ref_id = 1000 + aspect_collection_ref_id where parent_aspect_ref_id is null and name != '<XXX> Life <XXX>';
    """
    )

    op.execute(
        """ 
        update aspect set name = 'Life' where name = '<XXX> Life <XXX>';
    """
    )


def downgrade() -> None:
    pass
