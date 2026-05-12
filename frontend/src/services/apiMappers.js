export function mapApiUser(apiUser) {
  if (!apiUser) {
    return null;
  }

  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
  };
}

export function mapApiTable(apiTable) {
  if (!apiTable) {
    return null;
  }

  return {
    id: apiTable.id,
    number: apiTable.table_number,
    tableNumber: apiTable.table_number,
    capacity: apiTable.capacity,
    status: apiTable.status,
    area: apiTable.status === "MAINTENANCE" ? "Manutencao" : "Salao",
    createdAt: apiTable.created_at,
    updatedAt: apiTable.updated_at,
  };
}

export function mapApiReservation(apiReservation) {
  if (!apiReservation) {
    return null;
  }

  const table = mapApiTable(apiReservation.table);
  const user = mapApiUser(apiReservation.user);

  return {
    id: apiReservation.id,
    userId: apiReservation.user_id,
    tableId: apiReservation.table_id,
    tableNumber: table?.number || apiReservation.table_id,
    customerName: user?.name || "Cliente",
    customerEmail: user?.email || "",
    date: apiReservation.reservation_date,
    time: formatTime(apiReservation.start_time),
    endTime: formatTime(apiReservation.end_time),
    partySize: apiReservation.party_size,
    status: apiReservation.status,
    notes: "",
    createdAt: apiReservation.created_at,
    updatedAt: apiReservation.updated_at,
  };
}

export function mapApiCustomer(apiCustomer) {
  return {
    id: apiCustomer.id,
    name: apiCustomer.name,
    email: apiCustomer.email,
    role: apiCustomer.role,
    createdAt: apiCustomer.created_at,
    totalReservations: apiCustomer.total_reservations,
    activeReservations: apiCustomer.active_reservations,
    cancelledReservations: apiCustomer.cancelled_reservations,
  };
}

export function mapApiSchedule(apiSchedule) {
  return {
    id: apiSchedule.id,
    dayOfWeek: apiSchedule.day_of_week,
    dayName: dayNames[apiSchedule.day_of_week] || `Dia ${apiSchedule.day_of_week}`,
    opensAt: formatTime(apiSchedule.opening_time),
    closesAt: formatTime(apiSchedule.closing_time),
    isOpen: apiSchedule.is_open,
    createdAt: apiSchedule.created_at,
    updatedAt: apiSchedule.updated_at,
  };
}

export function mapApiAuditLog(apiLog) {
  return {
    id: apiLog.id,
    action: apiLog.action,
    entityType: apiLog.entity_type,
    entityId: apiLog.entity_id,
    actor: apiLog.performed_by?.email || "Sistema",
    date: apiLog.created_at,
    oldData: apiLog.old_data,
    newData: apiLog.new_data,
  };
}

export function mapApiDashboard(apiDashboard) {
  return {
    totalCustomers: apiDashboard.total_customers,
    totalTables: apiDashboard.total_tables,
    totalReservations: apiDashboard.total_reservations,
    reservationsToday: apiDashboard.reservations_today,
    activeReservations: apiDashboard.active_reservations,
    cancelledReservations: apiDashboard.cancelled_reservations,
    nextReservations: apiDashboard.next_reservations.map(mapApiReservation),
    occupancySummary: apiDashboard.occupancy_summary,
  };
}

export function toSchedulePayload(formValues) {
  return {
    day_of_week: Number(formValues.dayOfWeek || formValues.day_of_week),
    opening_time: normalizeTime(formValues.opensAt || formValues.opening_time),
    closing_time: normalizeTime(formValues.closesAt || formValues.closing_time),
    is_open: String(formValues.isOpen ?? formValues.is_open) === "true",
  };
}

export function toReservationPayload(formValues) {
  return {
    table_id: Number(formValues.tableId || formValues.table_id),
    reservation_date: formValues.date,
    start_time: normalizeTime(formValues.time),
    end_time: normalizeTime(addNinetyMinutes(formValues.time)),
    party_size: Number(formValues.partySize || formValues.party_size),
  };
}

export function toTablePayload(formValues) {
  return {
    table_number: Number(formValues.tableNumber || formValues.table_number),
    capacity: Number(formValues.capacity),
    status: formValues.status || "ACTIVE",
  };
}

function normalizeTime(time) {
  return time?.length === 5 ? `${time}:00` : time;
}

function formatTime(time) {
  return time?.slice(0, 5) || "";
}

function addNinetyMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(2026, 0, 1, hours, minutes + 90);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

const dayNames = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"];
