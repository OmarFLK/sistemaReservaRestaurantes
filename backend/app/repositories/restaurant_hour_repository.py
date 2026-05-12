from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.restaurant_hour import RestaurantHour
from app.schemas.restaurant_hour import RestaurantHourCreate, RestaurantHourUpdate


def list_restaurant_hours(db: Session) -> list[RestaurantHour]:
    statement = select(RestaurantHour).order_by(RestaurantHour.day_of_week)
    return list(db.scalars(statement))


def get_restaurant_hour_by_id(db: Session, schedule_id: int) -> RestaurantHour | None:
    return db.get(RestaurantHour, schedule_id)


def get_restaurant_hour_by_day(db: Session, day_of_week: int) -> RestaurantHour | None:
    statement = select(RestaurantHour).where(RestaurantHour.day_of_week == day_of_week)
    return db.scalar(statement)


def create_restaurant_hour(
    db: Session,
    schedule_data: RestaurantHourCreate,
) -> RestaurantHour:
    schedule = RestaurantHour(**schedule_data.model_dump())
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule


def update_restaurant_hour(
    db: Session,
    schedule: RestaurantHour,
    schedule_data: RestaurantHourUpdate,
) -> RestaurantHour:
    for field, value in schedule_data.model_dump(exclude_unset=True).items():
        setattr(schedule, field, value)

    db.commit()
    db.refresh(schedule)
    return schedule


def soft_delete_restaurant_hour(db: Session, schedule: RestaurantHour) -> RestaurantHour:
    schedule.is_open = False
    db.commit()
    db.refresh(schedule)
    return schedule
