from datetime import date

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.reservation import Reservation, ReservationStatus
from app.models.restaurant_table import RestaurantTable, TableStatus
from app.models.user import User, UserRole
from app.repositories.reservation_repository import list_all_reservations


def get_admin_dashboard(db: Session) -> dict:
    today = date.today()
    reservations = list_all_reservations(db)
    active_reservations = [
        reservation for reservation in reservations if reservation.status == ReservationStatus.CONFIRMED
    ]

    return {
        "total_customers": count_customers(db),
        "total_tables": count_tables(db),
        "total_reservations": len(reservations),
        "reservations_today": count_reservations_today(db, today),
        "active_reservations": len(active_reservations),
        "cancelled_reservations": count_cancelled_reservations(db),
        "next_reservations": reservations[:5],
        "occupancy_summary": build_occupancy_summary(db, active_reservations),
    }


def count_customers(db: Session) -> int:
    return db.scalar(select(func.count()).select_from(User).where(User.role == UserRole.CUSTOMER)) or 0


def count_tables(db: Session) -> int:
    return db.scalar(select(func.count()).select_from(RestaurantTable)) or 0


def count_reservations_today(db: Session, today: date) -> int:
    return (
        db.scalar(
            select(func.count())
            .select_from(Reservation)
            .where(Reservation.reservation_date == today),
        )
        or 0
    )


def count_cancelled_reservations(db: Session) -> int:
    return (
        db.scalar(
            select(func.count())
            .select_from(Reservation)
            .where(Reservation.status == ReservationStatus.CANCELLED),
        )
        or 0
    )


def build_occupancy_summary(
    db: Session,
    active_reservations: list[Reservation],
) -> dict[str, int | float]:
    active_tables = (
        db.scalar(
            select(func.count())
            .select_from(RestaurantTable)
            .where(RestaurantTable.status == TableStatus.ACTIVE),
        )
        or 0
    )
    occupied_tables = len({reservation.table_id for reservation in active_reservations})
    occupancy_rate = round((occupied_tables / active_tables) * 100, 2) if active_tables else 0

    return {
        "active_tables": active_tables,
        "occupied_tables": occupied_tables,
        "occupancy_rate": occupancy_rate,
    }
