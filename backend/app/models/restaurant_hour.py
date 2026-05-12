from datetime import datetime, time

from sqlalchemy import CheckConstraint, DateTime, Integer, Time, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class RestaurantHour(Base):
    __tablename__ = "restaurant_hours"
    __table_args__ = (
        CheckConstraint("day_of_week >= 0 AND day_of_week <= 6", name="restaurant_hours_valid_day"),
        CheckConstraint("opening_time < closing_time", name="restaurant_hours_valid_range"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    day_of_week: Mapped[int] = mapped_column(Integer, unique=True, index=True, nullable=False)
    opening_time: Mapped[time] = mapped_column(Time, nullable=False)
    closing_time: Mapped[time] = mapped_column(Time, nullable=False)
    is_open: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
