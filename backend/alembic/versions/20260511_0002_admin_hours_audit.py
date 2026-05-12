"""admin hours and audit logs

Revision ID: 20260511_0002
Revises: 20260511_0001
Create Date: 2026-05-11 11:30:00
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260511_0002"
down_revision: Union[str, None] = "20260511_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "restaurant_hours",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("day_of_week", sa.Integer(), nullable=False),
        sa.Column("opening_time", sa.Time(), nullable=False),
        sa.Column("closing_time", sa.Time(), nullable=False),
        sa.Column("is_open", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("day_of_week >= 0 AND day_of_week <= 6", name="restaurant_hours_valid_day"),
        sa.CheckConstraint("opening_time < closing_time", name="restaurant_hours_valid_range"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("day_of_week"),
    )
    op.create_index(op.f("ix_restaurant_hours_day_of_week"), "restaurant_hours", ["day_of_week"], unique=False)
    op.create_index(op.f("ix_restaurant_hours_id"), "restaurant_hours", ["id"], unique=False)

    op.create_table(
        "audit_logs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("action", sa.String(length=80), nullable=False),
        sa.Column("entity_type", sa.String(length=80), nullable=False),
        sa.Column("entity_id", sa.Integer(), nullable=True),
        sa.Column("performed_by_user_id", sa.Integer(), nullable=True),
        sa.Column("old_data", sa.JSON(), nullable=True),
        sa.Column("new_data", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["performed_by_user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_audit_logs_action"), "audit_logs", ["action"], unique=False)
    op.create_index(op.f("ix_audit_logs_entity_type"), "audit_logs", ["entity_type"], unique=False)
    op.create_index(op.f("ix_audit_logs_id"), "audit_logs", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_audit_logs_id"), table_name="audit_logs")
    op.drop_index(op.f("ix_audit_logs_entity_type"), table_name="audit_logs")
    op.drop_index(op.f("ix_audit_logs_action"), table_name="audit_logs")
    op.drop_table("audit_logs")
    op.drop_index(op.f("ix_restaurant_hours_id"), table_name="restaurant_hours")
    op.drop_index(op.f("ix_restaurant_hours_day_of_week"), table_name="restaurant_hours")
    op.drop_table("restaurant_hours")
