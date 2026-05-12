import api from "./api";
import { mapApiReservation, mapApiTable, toReservationPayload } from "./apiMappers";

export const reservationService = {
  async listMine() {
    const response = await api.get("/reservations/my");
    return response.data.map(mapApiReservation);
  },
  async listAll() {
    const response = await api.get("/reservations/my");
    return response.data.map(mapApiReservation);
  },
  async findById(id) {
    const reservations = await this.listMine();
    return reservations.find((reservation) => String(reservation.id) === String(id));
  },
  async listAvailableTables({ date, time, partySize }) {
    const response = await api.get("/availability", {
      params: { date, time, partySize },
    });
    return response.data.map(mapApiTable);
  },
  async create(data) {
    const response = await api.post("/reservations", toReservationPayload(data));
    return mapApiReservation(response.data);
  },
  async update(id, data) {
    const response = await api.put(`/reservations/${id}`, toReservationPayload(data));
    return mapApiReservation(response.data);
  },
  async cancel(id) {
    const response = await api.delete(`/reservations/${id}`);
    return mapApiReservation(response.data);
  },
};
