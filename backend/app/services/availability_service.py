from datetime import date, time

from sqlalchemy.orm import Session

from app.models.restaurant_table import RestaurantTable, TableStatus
from app.repositories.reservation_repository import has_confirmed_reservation_conflict
from app.repositories.restaurant_hour_repository import get_restaurant_hour_by_day
from app.repositories.table_repository import list_tables
from app.schemas.reservation import DURATION_OPTIONS_MINUTES, add_minutes_to_time


def list_available_tables(
    db: Session,
    *,
    reservation_date: date,
    start_time: time,
    duration_minutes: int,
    party_size: int,
) -> list[RestaurantTable]:
    if duration_minutes not in DURATION_OPTIONS_MINUTES:
        return []

    end_time = add_minutes_to_time(start_time, duration_minutes)
    schedule = get_restaurant_hour_by_day(db, reservation_date.weekday())

    if schedule and (
        not schedule.is_open
        or start_time < schedule.opening_time
        or end_time > schedule.closing_time
    ):
        return []

    candidate_tables = [
        table
        for table in list_tables(db)
        if table.status == TableStatus.ACTIVE and table.capacity >= party_size
    ]

    return [
        table
        for table in candidate_tables
        if not has_confirmed_reservation_conflict(
            db,
            table_id=table.id,
            reservation_date=reservation_date,
            start_time=start_time,
            end_time=end_time,
        )
    ]
