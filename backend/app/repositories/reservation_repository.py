from datetime import date, time

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.reservation import Reservation, ReservationStatus
from app.schemas.reservation import ReservationCreate


def list_user_reservations(db: Session, user_id: int) -> list[Reservation]:
    statement = (
        select(Reservation)
        .options(selectinload(Reservation.table), selectinload(Reservation.user))
        .where(Reservation.user_id == user_id)
        .order_by(Reservation.reservation_date.desc(), Reservation.start_time.desc())
    )
    return list(db.scalars(statement))


def list_all_reservations(db: Session) -> list[Reservation]:
    statement = (
        select(Reservation)
        .options(selectinload(Reservation.table), selectinload(Reservation.user))
        .order_by(Reservation.reservation_date.desc(), Reservation.start_time.desc())
    )
    return list(db.scalars(statement))


def get_reservation_by_id(db: Session, reservation_id: int) -> Reservation | None:
    statement = (
        select(Reservation)
        .options(selectinload(Reservation.table), selectinload(Reservation.user))
        .where(Reservation.id == reservation_id)
    )
    return db.scalar(statement)


def create_reservation(
    db: Session,
    *,
    user_id: int,
    reservation_data: ReservationCreate,
) -> Reservation:
    reservation = Reservation(
        user_id=user_id,
        **reservation_data.model_dump(exclude={"duration_minutes"}),
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return get_reservation_by_id(db, reservation.id) or reservation


def update_reservation_fields(
    db: Session,
    reservation: Reservation,
    values: dict[str, object],
) -> Reservation:
    for field, value in values.items():
        setattr(reservation, field, value)

    db.commit()
    db.refresh(reservation)
    return get_reservation_by_id(db, reservation.id) or reservation


def mark_reservation_cancelled(db: Session, reservation: Reservation) -> Reservation:
    reservation.status = ReservationStatus.CANCELLED
    db.commit()
    db.refresh(reservation)
    return reservation


def has_confirmed_reservation_conflict(
    db: Session,
    *,
    table_id: int,
    reservation_date: date,
    start_time: time,
    end_time: time,
    exclude_reservation_id: int | None = None,
) -> bool:
    statement = select(Reservation.id).where(
        Reservation.table_id == table_id,
        Reservation.reservation_date == reservation_date,
        Reservation.start_time < end_time,
        Reservation.end_time > start_time,
        Reservation.status == ReservationStatus.CONFIRMED,
    )

    if exclude_reservation_id:
        statement = statement.where(Reservation.id != exclude_reservation_id)

    return db.scalar(statement) is not None
