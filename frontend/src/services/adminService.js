import api from "./api";
import {
  mapApiAuditLog,
  mapApiCustomer,
  mapApiDashboard,
  mapApiReservation,
  mapApiSchedule,
  mapApiTable,
  toSchedulePayload,
  toTablePayload,
} from "./apiMappers";

export const adminService = {
  async listReservations() {
    const response = await api.get("/admin/reservations");
    return response.data.map(mapApiReservation);
  },
  async updateReservation(id, data) {
    const response = await api.put(`/admin/reservations/${id}`, data);
    return mapApiReservation(response.data);
  },
  async cancelReservation(id) {
    const response = await api.delete(`/admin/reservations/${id}`);
    return mapApiReservation(response.data);
  },
  async listTables() {
    const response = await api.get("/tables");
    return response.data.map(mapApiTable);
  },
  async listCustomers() {
    const response = await api.get("/admin/customers");
    return response.data.map(mapApiCustomer);
  },
  async listSchedules() {
    const response = await api.get("/admin/schedules");
    return response.data.map(mapApiSchedule);
  },
  async createSchedule(data) {
    const response = await api.post("/admin/schedules", toSchedulePayload(data));
    return mapApiSchedule(response.data);
  },
  async updateSchedule(id, data) {
    const response = await api.put(`/admin/schedules/${id}`, toSchedulePayload(data));
    return mapApiSchedule(response.data);
  },
  async deleteSchedule(id) {
    const response = await api.delete(`/admin/schedules/${id}`);
    return mapApiSchedule(response.data);
  },
  async listAuditLogs() {
    const response = await api.get("/admin/logs");
    return response.data.map(mapApiAuditLog);
  },
  async fetchDashboard() {
    const response = await api.get("/admin/dashboard");
    return mapApiDashboard(response.data);
  },
  async createTable(data) {
    const response = await api.post("/admin/tables", toTablePayload(data));
    return mapApiTable(response.data);
  },
  async updateTable(id, data) {
    const response = await api.put(`/admin/tables/${id}`, toTablePayload(data));
    return mapApiTable(response.data);
  },
  async deleteTable(id) {
    const response = await api.delete(`/admin/tables/${id}`);
    return mapApiTable(response.data);
  },
};
