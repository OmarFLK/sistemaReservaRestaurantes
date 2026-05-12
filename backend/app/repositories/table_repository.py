from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.restaurant_table import RestaurantTable, TableStatus
from app.schemas.table import RestaurantTableCreate, RestaurantTableUpdate


def list_tables(db: Session, include_inactive: bool = False) -> list[RestaurantTable]:
    statement = select(RestaurantTable).order_by(RestaurantTable.table_number)

    if not include_inactive:
        statement = statement.where(RestaurantTable.status != TableStatus.INACTIVE)

    return list(db.scalars(statement))


def get_table_by_id(db: Session, table_id: int) -> RestaurantTable | None:
    return db.get(RestaurantTable, table_id)


def create_table(db: Session, table_data: RestaurantTableCreate) -> RestaurantTable:
    table = RestaurantTable(**table_data.model_dump())
    db.add(table)
    db.commit()
    db.refresh(table)
    return table


def update_table(
    db: Session,
    table: RestaurantTable,
    table_data: RestaurantTableUpdate,
) -> RestaurantTable:
    for field, value in table_data.model_dump(exclude_unset=True).items():
        setattr(table, field, value)

    db.commit()
    db.refresh(table)
    return table


def soft_delete_table(db: Session, table: RestaurantTable) -> RestaurantTable:
    table.status = TableStatus.INACTIVE
    db.commit()
    db.refresh(table)
    return table
