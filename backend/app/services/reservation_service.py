from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.reservation import Reservation, ReservationStatus
from app.models.restaurant_table import TableStatus
from app.models.user import User
from app.repositories.reservation_repository import (
    create_reservation,
    get_reservation_by_id,
    has_confirmed_reservation_conflict,
    list_all_reservations,
    list_user_reservations,
    mark_reservation_cancelled,
    update_reservation_fields,
)
from app.repositories.table_repository import get_table_by_id
from app.schemas.reservation import AdminReservationUpdate, ReservationCreate, ReservationUpdate
from app.services.audit_service import (
    record_audit_log,
    reservation_audit_data,
)


def list_my_reservations(db: Session, user: User) -> list[Reservation]:
    return list_user_reservations(db, user.id)


def create_user_reservation(
    db: Session,
    *,
    user: User,
    reservation_data: ReservationCreate,
) -> Reservation:
    validate_reservation_rules(db, reservation_data)
    reservation = create_reservation(db, user_id=user.id, reservation_data=reservation_data)
    record_audit_log(
        db,
        action="RESERVATION_CREATED",
        entity_type="reservation",
        entity_id=reservation.id,
        performed_by=user,
        new_data=reservation_audit_data(reservation),
    )
    return reservation


def update_user_reservation(
    db: Session,
    *,
    user: User,
    reservation_id: int,
    reservation_data: ReservationUpdate,
) -> Reservation:
    reservation = get_owned_reservation(db, user, reservation_id)
    merged_values = build_updated_reservation_values(reservation, reservation_data)
    validate_reservation_rules(
        db,
        ReservationCreate(**merged_values),
        exclude_reservation_id=reservation.id,
    )
    old_data = reservation_audit_data(reservation)
    updated_reservation = update_reservation_fields(
        db,
        reservation,
        reservation_data.model_dump(exclude_unset=True),
    )
    record_audit_log(
        db,
        action="RESERVATION_UPDATED",
        entity_type="reservation",
        entity_id=updated_reservation.id,
        performed_by=user,
        old_data=old_data,
        new_data=reservation_audit_data(updated_reservation),
    )
    return updated_reservation


def cancel_user_reservation(db: Session, *, user: User, reservation_id: int) -> Reservation:
    reservation = get_owned_reservation(db, user, reservation_id)
    return cancel_reservation_with_audit(db, reservation=reservation, performed_by=user)


def list_admin_reservations(db: Session) -> list[Reservation]:
    return list_all_reservations(db)


def get_admin_reservation(db: Session, reservation_id: int) -> Reservation:
    reservation = get_reservation_by_id(db, reservation_id)

    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found.",
        )

    return reservation


def update_admin_reservation(
    db: Session,
    *,
    admin: User,
    reservation_id: int,
    reservation_data: AdminReservationUpdate,
) -> Reservation:
    reservation = get_admin_reservation(db, reservation_id)
    update_values = reservation_data.model_dump(exclude_unset=True)
    merged_values = build_updated_reservation_values(reservation, reservation_data)
    final_status = update_values.get("status", reservation.status)

    if final_status == ReservationStatus.CONFIRMED:
        validate_reservation_rules(
            db,
            ReservationCreate(**merged_values),
            exclude_reservation_id=reservation.id,
        )

    old_data = reservation_audit_data(reservation)
    updated_reservation = update_reservation_fields(db, reservation, update_values)
    record_audit_log(
        db,
        action="RESERVATION_UPDATED",
        entity_type="reservation",
        entity_id=updated_reservation.id,
        performed_by=admin,
        old_data=old_data,
        new_data=reservation_audit_data(updated_reservation),
    )
    return updated_reservation


def cancel_admin_reservation(db: Session, *, admin: User, reservation_id: int) -> Reservation:
    reservation = get_admin_reservation(db, reservation_id)
    return cancel_reservation_with_audit(db, reservation=reservation, performed_by=admin)


def get_owned_reservation(db: Session, user: User, reservation_id: int) -> Reservation:
    reservation = get_reservation_by_id(db, reservation_id)

    if not reservation or reservation.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found for current user.",
        )

    return reservation


def cancel_reservation_with_audit(
    db: Session,
    *,
    reservation: Reservation,
    performed_by: User,
) -> Reservation:
    old_data = reservation_audit_data(reservation)
    cancelled_reservation = mark_reservation_cancelled(db, reservation)
    record_audit_log(
        db,
        action="RESERVATION_CANCELLED",
        entity_type="reservation",
        entity_id=cancelled_reservation.id,
        performed_by=performed_by,
        old_data=old_data,
        new_data=reservation_audit_data(cancelled_reservation),
    )
    return cancelled_reservation


def validate_reservation_rules(
    db: Session,
    reservation_data: ReservationCreate,
    exclude_reservation_id: int | None = None,
) -> None:
    if is_reservation_in_past(reservation_data):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reservation cannot be in the past.",
        )

    table = get_table_by_id(db, reservation_data.table_id)
    if not table or table.status != TableStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected table does not exist or is not active.",
        )

    if reservation_data.party_size > table.capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Party size exceeds selected table capacity.",
        )

    if has_confirmed_reservation_conflict(
        db,
        table_id=reservation_data.table_id,
        reservation_date=reservation_data.reservation_date,
        start_time=reservation_data.start_time,
        exclude_reservation_id=exclude_reservation_id,
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Selected table already has a confirmed reservation at this time.",
        )


def is_reservation_in_past(reservation_data: ReservationCreate) -> bool:
    reservation_datetime = datetime.combine(
        reservation_data.reservation_date,
        reservation_data.start_time,
    )
    return reservation_datetime < datetime.now()


def build_updated_reservation_values(
    reservation: Reservation,
    reservation_data: ReservationUpdate,
) -> dict[str, object]:
    values = {
        "table_id": reservation.table_id,
        "reservation_date": reservation.reservation_date,
        "start_time": reservation.start_time,
        "end_time": reservation.end_time,
        "party_size": reservation.party_size,
    }
    values.update(reservation_data.model_dump(exclude_unset=True))
    return values
