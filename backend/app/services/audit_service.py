from datetime import date, datetime, time
from enum import Enum
from typing import Any

from sqlalchemy.orm import Session

from app.models.reservation import Reservation
from app.models.restaurant_hour import RestaurantHour
from app.models.restaurant_table import RestaurantTable
from app.models.user import User
from app.repositories.audit_log_repository import create_audit_log


def record_audit_log(
    db: Session,
    *,
    action: str,
    entity_type: str,
    entity_id: int | None,
    performed_by: User | None,
    old_data: dict | None = None,
    new_data: dict | None = None,
) -> None:
    create_audit_log(
        db,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        performed_by_user_id=performed_by.id if performed_by else None,
        old_data=sanitize_audit_data(old_data),
        new_data=sanitize_audit_data(new_data),
    )


def reservation_audit_data(reservation: Reservation) -> dict[str, Any]:
    return {
        "id": reservation.id,
        "user_id": reservation.user_id,
        "table_id": reservation.table_id,
        "reservation_date": reservation.reservation_date,
        "start_time": reservation.start_time,
        "end_time": reservation.end_time,
        "party_size": reservation.party_size,
        "status": reservation.status,
    }


def table_audit_data(table: RestaurantTable) -> dict[str, Any]:
    return {
        "id": table.id,
        "table_number": table.table_number,
        "capacity": table.capacity,
        "status": table.status,
    }


def schedule_audit_data(schedule: RestaurantHour) -> dict[str, Any]:
    return {
        "id": schedule.id,
        "day_of_week": schedule.day_of_week,
        "opening_time": schedule.opening_time,
        "closing_time": schedule.closing_time,
        "is_open": schedule.is_open,
    }


def sanitize_audit_data(data: dict | None) -> dict | None:
    if data is None:
        return None

    return {key: serialize_audit_value(value) for key, value in data.items()}


def serialize_audit_value(value: Any) -> Any:
    if isinstance(value, Enum):
        return value.value

    if isinstance(value, (date, datetime, time)):
        return value.isoformat()

    return value
