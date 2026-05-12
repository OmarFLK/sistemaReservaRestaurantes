from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.restaurant_table import TableStatus


class RestaurantTableBase(BaseModel):
    table_number: int = Field(gt=0)
    capacity: int = Field(gt=0)
    status: TableStatus = TableStatus.ACTIVE


class RestaurantTableCreate(RestaurantTableBase):
    pass


class RestaurantTableUpdate(BaseModel):
    table_number: int | None = Field(default=None, gt=0)
    capacity: int | None = Field(default=None, gt=0)
    status: TableStatus | None = None


class RestaurantTablePublic(RestaurantTableBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
