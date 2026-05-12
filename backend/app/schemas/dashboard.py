from pydantic import BaseModel

from app.schemas.reservation import ReservationDetails


class OccupancySummary(BaseModel):
    active_tables: int
    occupied_tables: int
    occupancy_rate: float


class AdminDashboardPublic(BaseModel):
    total_customers: int
    total_tables: int
    total_reservations: int
    reservations_today: int
    active_reservations: int
    cancelled_reservations: int
    next_reservations: list[ReservationDetails]
    occupancy_summary: OccupancySummary
