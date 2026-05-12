from datetime import datetime, time

from pydantic import BaseModel, ConfigDict, Field, model_validator


class RestaurantHourBase(BaseModel):
    day_of_week: int = Field(ge=0, le=6)
    opening_time: time
    closing_time: time
    is_open: bool = True

    @model_validator(mode="after")
    def validate_time_range(self) -> "RestaurantHourBase":
        if self.opening_time >= self.closing_time:
            raise ValueError("opening_time must be earlier than closing_time.")
        return self


class RestaurantHourCreate(RestaurantHourBase):
    pass


class RestaurantHourUpdate(BaseModel):
    day_of_week: int | None = Field(default=None, ge=0, le=6)
    opening_time: time | None = None
    closing_time: time | None = None
    is_open: bool | None = None

    @model_validator(mode="after")
    def validate_optional_time_range(self) -> "RestaurantHourUpdate":
        if self.opening_time and self.closing_time and self.opening_time >= self.closing_time:
            raise ValueError("opening_time must be earlier than closing_time.")
        return self


class RestaurantHourPublic(RestaurantHourBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
