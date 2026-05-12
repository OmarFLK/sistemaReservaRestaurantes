from datetime import date, time
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.reservation import ReservationCreate, ReservationPublic, ReservationUpdate
from app.schemas.table import RestaurantTablePublic
from app.services.availability_service import list_available_tables
from app.services.reservation_service import (
    cancel_user_reservation,
    create_user_reservation,
    list_my_reservations,
    update_user_reservation,
)

router = APIRouter(tags=["reservations"])


@router.get("/availability", response_model=list[RestaurantTablePublic])
def read_availability(
    db: Annotated[Session, Depends(get_db)],
    reservation_date: Annotated[date, Query(alias="date")],
    start_time: Annotated[time, Query(alias="time")],
    party_size: Annotated[int, Query(alias="partySize", gt=0)],
) -> list[RestaurantTablePublic]:
    return list_available_tables(
        db,
        reservation_date=reservation_date,
        start_time=start_time,
        party_size=party_size,
    )


@router.get("/reservations/my", response_model=list[ReservationPublic])
def read_my_reservations(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> list[ReservationPublic]:
    return list_my_reservations(db, current_user)


@router.post("/reservations", response_model=ReservationPublic, status_code=201)
def create_reservation(
    reservation_data: ReservationCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ReservationPublic:
    return create_user_reservation(db, user=current_user, reservation_data=reservation_data)


@router.put("/reservations/{reservation_id}", response_model=ReservationPublic)
def update_reservation(
    reservation_id: int,
    reservation_data: ReservationUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ReservationPublic:
    return update_user_reservation(
        db,
        user=current_user,
        reservation_id=reservation_id,
        reservation_data=reservation_data,
    )


@router.delete("/reservations/{reservation_id}", response_model=ReservationPublic)
def delete_reservation(
    reservation_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ReservationPublic:
    return cancel_user_reservation(db, user=current_user, reservation_id=reservation_id)
