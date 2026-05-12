from datetime import date, time
import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.core.database import Base
from app.models.reservation import Reservation, ReservationStatus
from app.models.restaurant_hour import RestaurantHour
from app.models.restaurant_table import RestaurantTable, TableStatus
from app.models.user import User, UserRole
from app.repositories.reservation_repository import has_confirmed_reservation_conflict
from app.schemas.reservation import ReservationCreate
from app.services.availability_service import list_available_tables
from app.services.reservation_service import create_user_reservation


class ReservationIntervalConflictTest(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        Base.metadata.create_all(self.engine)
        self.db = Session(self.engine)

        self.user = User(
            name="Cliente",
            email="cliente@example.com",
            password_hash="hash",
            role=UserRole.CUSTOMER,
        )
        self.table = RestaurantTable(
            table_number=1,
            capacity=4,
            status=TableStatus.ACTIVE,
        )
        self.db.add_all([self.user, self.table])
        self.db.add(
            RestaurantHour(
                day_of_week=2,
                opening_time=time(18, 0),
                closing_time=time(23, 59),
                is_open=True,
            ),
        )
        self.db.commit()

        self.db.add(
            Reservation(
                user_id=self.user.id,
                table_id=self.table.id,
                reservation_date=date(2026, 5, 20),
                start_time=time(21, 0),
                end_time=time(22, 30),
                party_size=4,
                status=ReservationStatus.CONFIRMED,
            ),
        )
        self.db.commit()

    def tearDown(self) -> None:
        self.db.close()
        self.engine.dispose()

    def test_confirmed_reservation_blocks_overlapping_times(self) -> None:
        self.assertTrue(self.has_conflict(time(21, 30), time(22, 0)))
        self.assertTrue(self.has_conflict(time(22, 0), time(22, 30)))
        self.assertFalse(self.has_conflict(time(22, 30), time(23, 0)))

    def test_availability_uses_full_reserved_interval(self) -> None:
        self.assertEqual(self.available_table_ids(time(21, 30)), [])
        self.assertEqual(self.available_table_ids(time(22, 0)), [])
        self.assertEqual(self.available_table_ids(time(22, 30), duration_minutes=60), [self.table.id])

    def test_conflicting_create_returns_clear_error(self) -> None:
        with self.assertRaises(HTTPException) as context:
            create_user_reservation(
                self.db,
                user=self.user,
                reservation_data=ReservationCreate(
                    table_id=self.table.id,
                    reservation_date=date(2026, 5, 20),
                    start_time=time(21, 30),
                    duration_minutes=90,
                    party_size=2,
                ),
            )

        self.assertEqual(context.exception.status_code, 409)
        self.assertIn("time range", context.exception.detail)

    def test_cancelled_reservation_does_not_block_availability(self) -> None:
        self.db.add(
            Reservation(
                user_id=self.user.id,
                table_id=self.table.id,
                reservation_date=date(2026, 5, 21),
                start_time=time(21, 0),
                end_time=time(22, 30),
                party_size=4,
                status=ReservationStatus.CANCELLED,
            ),
        )
        self.db.commit()

        self.assertFalse(
            has_confirmed_reservation_conflict(
                self.db,
                table_id=self.table.id,
                reservation_date=date(2026, 5, 21),
                start_time=time(21, 30),
                end_time=time(22, 0),
            ),
        )

    def has_conflict(self, start_time: time, end_time: time) -> bool:
        return has_confirmed_reservation_conflict(
            self.db,
            table_id=self.table.id,
            reservation_date=date(2026, 5, 20),
            start_time=start_time,
            end_time=end_time,
        )

    def available_table_ids(self, start_time: time, duration_minutes: int = 90) -> list[int]:
        return [
            table.id
            for table in list_available_tables(
                self.db,
                reservation_date=date(2026, 5, 20),
                start_time=start_time,
                duration_minutes=duration_minutes,
                party_size=2,
            )
        ]


if __name__ == "__main__":
    unittest.main()
