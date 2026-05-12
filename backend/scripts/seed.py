from datetime import time
import sys
from pathlib import Path

from sqlalchemy import select

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.database import create_db_session
from app.core.security import hash_password
from app.models.restaurant_table import RestaurantTable, TableStatus
from app.models.restaurant_hour import RestaurantHour
from app.models.user import UserRole
from app.repositories.user_repository import create_user, get_user_by_email


def seed_users() -> None:
    with create_db_session() as db:
        if not get_user_by_email(db, "admin@restaurante.com"):
            create_user(
                db,
                name="Administrador",
                email="admin@restaurante.com",
                password_hash=hash_password("admin123"),
                role=UserRole.ADMIN,
            )

        if not get_user_by_email(db, "cliente@restaurante.com"):
            create_user(
                db,
                name="Cliente Teste",
                email="cliente@restaurante.com",
                password_hash=hash_password("123456"),
                role=UserRole.CUSTOMER,
            )


def seed_tables() -> None:
    tables = [
        {"table_number": 1, "capacity": 2, "status": TableStatus.ACTIVE},
        {"table_number": 2, "capacity": 4, "status": TableStatus.ACTIVE},
        {"table_number": 3, "capacity": 4, "status": TableStatus.ACTIVE},
        {"table_number": 4, "capacity": 6, "status": TableStatus.ACTIVE},
        {"table_number": 5, "capacity": 8, "status": TableStatus.MAINTENANCE},
    ]

    with create_db_session() as db:
        for table_data in tables:
            existing_table = db.scalar(
                select(RestaurantTable).where(
                    RestaurantTable.table_number == table_data["table_number"],
                ),
            )

            if existing_table:
                continue

            db.add(RestaurantTable(**table_data))

        db.commit()


def seed_restaurant_hours() -> None:
    default_hours = [
        {"day_of_week": 0, "opening_time": time(18, 0), "closing_time": time(23, 0), "is_open": True},
        {"day_of_week": 1, "opening_time": time(18, 0), "closing_time": time(23, 0), "is_open": True},
        {"day_of_week": 2, "opening_time": time(18, 0), "closing_time": time(23, 0), "is_open": True},
        {"day_of_week": 3, "opening_time": time(18, 0), "closing_time": time(23, 30), "is_open": True},
        {"day_of_week": 4, "opening_time": time(18, 0), "closing_time": time(23, 59), "is_open": True},
        {"day_of_week": 5, "opening_time": time(12, 0), "closing_time": time(23, 59), "is_open": True},
        {"day_of_week": 6, "opening_time": time(12, 0), "closing_time": time(22, 0), "is_open": True},
    ]

    with create_db_session() as db:
        for schedule_data in default_hours:
            existing_schedule = db.scalar(
                select(RestaurantHour).where(
                    RestaurantHour.day_of_week == schedule_data["day_of_week"],
                ),
            )

            if existing_schedule:
                continue

            db.add(RestaurantHour(**schedule_data))

        db.commit()


if __name__ == "__main__":
    seed_users()
    seed_tables()
    seed_restaurant_hours()
    print("Development seed completed.")
