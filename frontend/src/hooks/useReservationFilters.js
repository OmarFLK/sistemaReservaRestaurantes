import { useMemo, useState } from "react";

export function useReservationFilters(reservations) {
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredReservations = useMemo(() => {
    if (statusFilter === "ALL") {
      return reservations;
    }

    return reservations.filter((reservation) => reservation.status === statusFilter);
  }, [reservations, statusFilter]);

  return { filteredReservations, statusFilter, setStatusFilter };
}
