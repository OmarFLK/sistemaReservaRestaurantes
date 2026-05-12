from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_admin
from app.models.user import User
from app.repositories.table_repository import (
    create_table,
    get_table_by_id,
    list_tables,
    soft_delete_table,
    update_table,
)
from app.schemas.table import (
    RestaurantTableCreate,
    RestaurantTablePublic,
    RestaurantTableUpdate,
)
from app.services.audit_service import record_audit_log, table_audit_data

router = APIRouter(tags=["tables"])


@router.get("/tables", response_model=list[RestaurantTablePublic])
def read_tables(db: Annotated[Session, Depends(get_db)]) -> list[RestaurantTablePublic]:
    return list_tables(db)


@router.get("/tables/{table_id}", response_model=RestaurantTablePublic)
def read_table(
    table_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> RestaurantTablePublic:
    table = get_table_by_id(db, table_id)

    if not table:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Table not found.")

    return table


@router.post("/admin/tables", response_model=RestaurantTablePublic, status_code=201)
def create_admin_table(
    table_data: RestaurantTableCreate,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
) -> RestaurantTablePublic:
    try:
        table = create_table(db, table_data)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Table number already exists.",
        ) from exc

    record_audit_log(
        db,
        action="TABLE_CREATED",
        entity_type="restaurant_table",
        entity_id=table.id,
        performed_by=admin,
        new_data=table_audit_data(table),
    )
    return table


@router.put("/admin/tables/{table_id}", response_model=RestaurantTablePublic)
def update_admin_table(
    table_id: int,
    table_data: RestaurantTableUpdate,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
) -> RestaurantTablePublic:
    table = get_table_by_id(db, table_id)

    if not table:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Table not found.")

    old_data = table_audit_data(table)
    try:
        updated_table = update_table(db, table, table_data)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Table number already exists.",
        ) from exc

    record_audit_log(
        db,
        action="TABLE_UPDATED",
        entity_type="restaurant_table",
        entity_id=updated_table.id,
        performed_by=admin,
        old_data=old_data,
        new_data=table_audit_data(updated_table),
    )
    return updated_table


@router.delete("/admin/tables/{table_id}", response_model=RestaurantTablePublic)
def delete_admin_table(
    table_id: int,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
) -> RestaurantTablePublic:
    table = get_table_by_id(db, table_id)

    if not table:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Table not found.")

    old_data = table_audit_data(table)
    deleted_table = soft_delete_table(db, table)
    record_audit_log(
        db,
        action="TABLE_DEACTIVATED",
        entity_type="restaurant_table",
        entity_id=deleted_table.id,
        performed_by=admin,
        old_data=old_data,
        new_data=table_audit_data(deleted_table),
    )
    return deleted_table
