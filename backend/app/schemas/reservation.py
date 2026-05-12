from datetime import date, datetime, time

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.reservation import ReservationStatus
from app.schemas.table import RestaurantTablePublic
from app.schemas.user import UserPublic


class ReservationBase(BaseModel):
    table_id: int
    reservation_date: date
    start_time: time
    end_time: time
    party_size: int = Field(gt=0)

    @model_validator(mode="after")
    def validate_time_range(self) -> "ReservationBase":
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
    party_size: int | None = Field(default=None, gt=0)

    @model_validator(mode="after")
    def validate_optional_time_range(self) -> "ReservationUpdate":
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
