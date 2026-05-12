from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.restaurant_hour import RestaurantHour
from app.models.user import User
from app.repositories.restaurant_hour_repository import (
    create_restaurant_hour,
    get_restaurant_hour_by_day,
    get_restaurant_hour_by_id,
    list_restaurant_hours,
    soft_delete_restaurant_hour,
    update_restaurant_hour,
)
from app.schemas.restaurant_hour import RestaurantHourCreate, RestaurantHourUpdate
from app.services.audit_service import (
    record_audit_log,
    schedule_audit_data,
)


def list_admin_schedules(db: Session) -> list[RestaurantHour]:
    return list_restaurant_hours(db)


def create_admin_schedule(
    db: Session,
    *,
    schedule_data: RestaurantHourCreate,
    admin: User,
) -> RestaurantHour:
    existing_schedule = get_restaurant_hour_by_day(db, schedule_data.day_of_week)

    if existing_schedule and existing_schedule.is_open:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Schedule already exists for this day of week.",
        )

    if existing_schedule:
        old_data = schedule_audit_data(existing_schedule)
        schedule_update = RestaurantHourUpdate(**schedule_data.model_dump())
        schedule = update_restaurant_hour(db, existing_schedule, schedule_update)
        record_audit_log(
            db,
            action="SCHEDULE_CREATED",
            entity_type="restaurant_hour",
            entity_id=schedule.id,
            performed_by=admin,
            old_data=old_data,
            new_data=schedule_audit_data(schedule),
        )
        return schedule

    try:
        schedule = create_restaurant_hour(db, schedule_data)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Schedule already exists for this day of week.",
        ) from exc

    record_audit_log(
        db,
        action="SCHEDULE_CREATED",
        entity_type="restaurant_hour",
        entity_id=schedule.id,
        performed_by=admin,
        new_data=schedule_audit_data(schedule),
    )
    return schedule


def update_admin_schedule(
    db: Session,
    *,
    schedule_id: int,
    schedule_data: RestaurantHourUpdate,
    admin: User,
) -> RestaurantHour:
    schedule = get_required_schedule(db, schedule_id)
    validate_final_schedule_time_range(schedule, schedule_data)
    old_data = schedule_audit_data(schedule)

    try:
        updated_schedule = update_restaurant_hour(db, schedule, schedule_data)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Schedule day of week already exists.",
        ) from exc

    record_audit_log(
        db,
        action="SCHEDULE_UPDATED",
        entity_type="restaurant_hour",
        entity_id=updated_schedule.id,
        performed_by=admin,
        old_data=old_data,
        new_data=schedule_audit_data(updated_schedule),
    )
    return updated_schedule


def delete_admin_schedule(db: Session, *, schedule_id: int, admin: User) -> RestaurantHour:
    schedule = get_required_schedule(db, schedule_id)
    old_data = schedule_audit_data(schedule)
    deleted_schedule = soft_delete_restaurant_hour(db, schedule)
    record_audit_log(
        db,
        action="SCHEDULE_DEACTIVATED",
        entity_type="restaurant_hour",
        entity_id=deleted_schedule.id,
        performed_by=admin,
        old_data=old_data,
        new_data=schedule_audit_data(deleted_schedule),
    )
    return deleted_schedule


def get_required_schedule(db: Session, schedule_id: int) -> RestaurantHour:
    schedule = get_restaurant_hour_by_id(db, schedule_id)

    if not schedule:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found.")

    return schedule


def validate_final_schedule_time_range(
    schedule: RestaurantHour,
    schedule_data: RestaurantHourUpdate,
) -> None:
    opening_time = schedule_data.opening_time or schedule.opening_time
    closing_time = schedule_data.closing_time or schedule.closing_time

    if opening_time >= closing_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="opening_time must be earlier than closing_time.",
        )
