import enum
from datetime import date, datetime, time

from sqlalchemy import CheckConstraint, Date, DateTime, Enum, ForeignKey, Index, Integer, Time, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ReservationStatus(str, enum.Enum):
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"
    NO_SHOW = "NO_SHOW"


class Reservation(Base):
    __tablename__ = "reservations"
    __table_args__ = (
        CheckConstraint("party_size > 0", name="reservations_party_size_positive"),
        Index(
            "ix_reservations_availability",
            "reservation_date",
            "start_time",
            "table_id",
            "status",
        ),
        Index("ix_reservations_user_status", "user_id", "status"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    table_id: Mapped[int] = mapped_column(ForeignKey("restaurant_tables.id"), nullable=False)
    reservation_date: Mapped[date] = mapped_column(Date, nullable=False)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    party_size: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[ReservationStatus] = mapped_column(
        Enum(ReservationStatus, name="reservation_status"),
        default=ReservationStatus.CONFIRMED,
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

    user = relationship("User", back_populates="reservations")
    table = relationship("RestaurantTable", back_populates="reservations")
