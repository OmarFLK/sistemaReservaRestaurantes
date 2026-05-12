from datetime import date, datetime, time, timedelta

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.reservation import ReservationStatus
from app.schemas.table import RestaurantTablePublic
from app.schemas.user import UserPublic

DURATION_OPTIONS_MINUTES = {60, 90, 120, 150, 180}


def add_minutes_to_time(start_time: time, minutes: int) -> time:
    base_datetime = datetime.combine(date(2026, 1, 1), start_time)
    end_datetime = base_datetime + timedelta(minutes=minutes)

    if end_datetime.date() != base_datetime.date():
        raise ValueError("Reservation duration must finish on the same day.")

    return end_datetime.time().replace(microsecond=0)


class ReservationBase(BaseModel):
    table_id: int
    reservation_date: date
    start_time: time
    end_time: time | None = None
    duration_minutes: int | None = Field(default=None, alias="duration_minutes")
    party_size: int = Field(gt=0)

    @model_validator(mode="after")
    def validate_time_range(self) -> "ReservationBase":
        if self.duration_minutes is not None:
            if self.duration_minutes not in DURATION_OPTIONS_MINUTES:
                raise ValueError("duration_minutes must be one of 60, 90, 120, 150 or 180.")
            self.end_time = add_minutes_to_time(self.start_time, self.duration_minutes)

        if self.end_time is None:
            raise ValueError("end_time or duration_minutes is required.")

        if self.end_time <= self.start_time:
            raise ValueError("end_time must be later than start_time.")
        return self


class ReservationCreate(ReservationBase):
    pass


class ReservationUpdate(BaseModel):
    table_id: int | None = None
    reservation_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None
    duration_minutes: int | None = Field(default=None, alias="duration_minutes")
    party_size: int | None = Field(default=None, gt=0)

    @model_validator(mode="after")
    def validate_optional_time_range(self) -> "ReservationUpdate":
        if self.duration_minutes is not None and self.duration_minutes not in DURATION_OPTIONS_MINUTES:
            raise ValueError("duration_minutes must be one of 60, 90, 120, 150 or 180.")

        if self.start_time and self.end_time and self.end_time <= self.start_time:
            raise ValueError("end_time must be later than start_time.")
        return self


class AdminReservationUpdate(ReservationUpdate):
    status: ReservationStatus | None = None


class ReservationPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    table_id: int
    reservation_date: date
    start_time: time
    end_time: time
    party_size: int
    status: ReservationStatus
    created_at: datetime
    updated_at: datetime


class ReservationDetails(ReservationPublic):
    user: UserPublic
    table: RestaurantTablePublic
