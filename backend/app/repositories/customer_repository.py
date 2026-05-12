from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.models.reservation import Reservation, ReservationStatus
from app.models.user import User, UserRole


def list_customer_summaries(db: Session) -> list[dict]:
    active_statuses = [ReservationStatus.CONFIRMED]
    statement = (
        select(
            User.id,
            User.name,
            User.email,
            User.role,
            User.created_at,
            func.count(Reservation.id).label("total_reservations"),
            func.sum(
                case((Reservation.status.in_(active_statuses), 1), else_=0),
            ).label("active_reservations"),
            func.sum(
                case((Reservation.status == ReservationStatus.CANCELLED, 1), else_=0),
            ).label("cancelled_reservations"),
        )
        .outerjoin(Reservation, Reservation.user_id == User.id)
        .where(User.role == UserRole.CUSTOMER)
        .group_by(User.id)
        .order_by(User.created_at.desc())
    )
    return [row._asdict() for row in db.execute(statement)]


def get_customer_summary(db: Session, customer_id: int) -> dict | None:
    return next(
        (
            customer
            for customer in list_customer_summaries(db)
            if customer["id"] == customer_id
        ),
        None,
    )
