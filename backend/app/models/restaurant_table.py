import enum
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, Enum, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class TableStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    MAINTENANCE = "MAINTENANCE"


class RestaurantTable(Base):
    __tablename__ = "restaurant_tables"
    __table_args__ = (
        CheckConstraint("capacity > 0", name="restaurant_tables_capacity_positive"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    table_number: Mapped[int] = mapped_column(Integer, unique=True, index=True, nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[TableStatus] = mapped_column(
        Enum(TableStatus, name="table_status"),
        default=TableStatus.ACTIVE,
        nullable=False,
    )
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

    reservations = relationship("Reservation", back_populates="table")
