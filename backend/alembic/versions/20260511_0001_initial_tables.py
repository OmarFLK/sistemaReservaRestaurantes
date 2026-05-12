"""initial tables

Revision ID: 20260511_0001
Revises:
Create Date: 2026-05-11 10:20:00
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20260511_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    user_role = postgresql.ENUM("CUSTOMER", "ADMIN", name="user_role", create_type=False)
    table_status = postgresql.ENUM(
        "ACTIVE",
        "INACTIVE",
        "MAINTENANCE",
        name="table_status",
        create_type=False,
    )
    reservation_status = postgresql.ENUM(
        "CONFIRMED",
        "CANCELLED",
        "COMPLETED",
        "NO_SHOW",
        name="reservation_status",
        create_type=False,
    )

    postgresql.ENUM("CUSTOMER", "ADMIN", name="user_role").create(op.get_bind(), checkfirst=True)
    postgresql.ENUM("ACTIVE", "INACTIVE", "MAINTENANCE", name="table_status").create(
        op.get_bind(),
        checkfirst=True,
    )
    postgresql.ENUM(
        "CONFIRMED",
        "CANCELLED",
        "COMPLETED",
        "NO_SHOW",
        name="reservation_status",
    ).create(op.get_bind(), checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", user_role, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=False)
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)

    op.create_table(
        "restaurant_tables",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("table_number", sa.Integer(), nullable=False),
        sa.Column("capacity", sa.Integer(), nullable=False),
        sa.Column("status", table_status, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("capacity > 0", name="restaurant_tables_capacity_positive"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("table_number"),
    )
    op.create_index(op.f("ix_restaurant_tables_id"), "restaurant_tables", ["id"], unique=False)
    op.create_index(op.f("ix_restaurant_tables_table_number"), "restaurant_tables", ["table_number"], unique=False)

    op.create_table(
        "reservations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("table_id", sa.Integer(), nullable=False),
        sa.Column("reservation_date", sa.Date(), nullable=False),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column("end_time", sa.Time(), nullable=False),
        sa.Column("party_size", sa.Integer(), nullable=False),
        sa.Column("status", reservation_status, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("party_size > 0", name="reservations_party_size_positive"),
        sa.ForeignKeyConstraint(["table_id"], ["restaurant_tables.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_reservations_id"), "reservations", ["id"], unique=False)
    op.create_index(
        "ix_reservations_availability",
        "reservations",
        ["reservation_date", "start_time", "table_id", "status"],
        unique=False,
    )
    op.create_index("ix_reservations_user_status", "reservations", ["user_id", "status"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_reservations_user_status", table_name="reservations")
    op.drop_index("ix_reservations_availability", table_name="reservations")
    op.drop_index(op.f("ix_reservations_id"), table_name="reservations")
    op.drop_table("reservations")
    op.drop_index(op.f("ix_restaurant_tables_table_number"), table_name="restaurant_tables")
    op.drop_index(op.f("ix_restaurant_tables_id"), table_name="restaurant_tables")
    op.drop_table("restaurant_tables")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")
    sa.Enum(name="reservation_status").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="table_status").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="user_role").drop(op.get_bind(), checkfirst=True)
