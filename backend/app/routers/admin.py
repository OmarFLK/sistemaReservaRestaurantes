from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_admin
from app.models.user import User
from app.repositories.audit_log_repository import list_audit_logs
from app.repositories.customer_repository import get_customer_summary, list_customer_summaries
from app.schemas.audit_log import AuditLogPublic
from app.schemas.customer import AdminCustomerSummary
from app.schemas.dashboard import AdminDashboardPublic
from app.schemas.reservation import AdminReservationUpdate, ReservationDetails
from app.schemas.restaurant_hour import (
    RestaurantHourCreate,
    RestaurantHourPublic,
    RestaurantHourUpdate,
)
from app.services.admin_dashboard_service import get_admin_dashboard
from app.services.reservation_service import (
    cancel_admin_reservation,
    get_admin_reservation,
    list_admin_reservations,
    update_admin_reservation,
)
from app.services.restaurant_hour_service import (
    create_admin_schedule,
    delete_admin_schedule,
    list_admin_schedules,
    update_admin_schedule,
)

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/reservations", response_model=list[ReservationDetails])
def read_admin_reservations(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(require_admin)],
) -> list[ReservationDetails]:
    return list_admin_reservations(db)


@router.get("/reservations/{reservation_id}", response_model=ReservationDetails)
def read_admin_reservation(
    reservation_id: int,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(require_admin)],
) -> ReservationDetails:
    return get_admin_reservation(db, reservation_id)


@router.put("/reservations/{reservation_id}", response_model=ReservationDetails)
def update_admin_reservation_route(
    reservation_id: int,
    reservation_data: AdminReservationUpdate,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
) -> ReservationDetails:
    return update_admin_reservation(
        db,
        admin=admin,
        reservation_id=reservation_id,
        reservation_data=reservation_data,
    )


@router.delete("/reservations/{reservation_id}", response_model=ReservationDetails)
def delete_admin_reservation(
    reservation_id: int,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
) -> ReservationDetails:
    return cancel_admin_reservation(db, admin=admin, reservation_id=reservation_id)


@router.get("/customers", response_model=list[AdminCustomerSummary])
def read_admin_customers(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(require_admin)],
) -> list[AdminCustomerSummary]:
    return list_customer_summaries(db)


@router.get("/customers/{customer_id}", response_model=AdminCustomerSummary)
def read_admin_customer(
    customer_id: int,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(require_admin)],
) -> AdminCustomerSummary:
    customer = get_customer_summary(db, customer_id)

    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found.")

    return customer


@router.get("/schedules", response_model=list[RestaurantHourPublic])
def read_admin_schedules(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(require_admin)],
) -> list[RestaurantHourPublic]:
    return list_admin_schedules(db)


@router.post("/schedules", response_model=RestaurantHourPublic, status_code=201)
def create_schedule(
    schedule_data: RestaurantHourCreate,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
) -> RestaurantHourPublic:
    return create_admin_schedule(db, schedule_data=schedule_data, admin=admin)


@router.put("/schedules/{schedule_id}", response_model=RestaurantHourPublic)
def update_schedule(
    schedule_id: int,
    schedule_data: RestaurantHourUpdate,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
) -> RestaurantHourPublic:
    return update_admin_schedule(
        db,
        schedule_id=schedule_id,
        schedule_data=schedule_data,
        admin=admin,
    )


@router.delete("/schedules/{schedule_id}", response_model=RestaurantHourPublic)
def delete_schedule(
    schedule_id: int,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
) -> RestaurantHourPublic:
    return delete_admin_schedule(db, schedule_id=schedule_id, admin=admin)


@router.get("/logs", response_model=list[AuditLogPublic])
def read_admin_logs(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(require_admin)],
    limit: Annotated[int, Query(ge=1, le=200)] = 100,
) -> list[AuditLogPublic]:
    return list_audit_logs(db, limit=limit)


@router.get("/dashboard", response_model=AdminDashboardPublic)
def read_admin_dashboard(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(require_admin)],
) -> AdminDashboardPublic:
    return get_admin_dashboard(db)
