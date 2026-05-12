import { Button } from "../common/Button";
import { SelectInput } from "./SelectInput";
import { TextInput } from "./TextInput";

const timeOptions = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
const durationOptions = [
  { label: "1 hora", value: 60 },
  { label: "1h30", value: 90 },
  { label: "2 horas", value: 120 },
  { label: "2h30", value: 150 },
  { label: "3 horas", value: 180 },
];

export function ReservationForm({ initialValues = {}, onSubmit, submitLabel }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit(Object.fromEntries(formData.entries()));
  }

  return (
    <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-4">
        <TextInput
          defaultValue={initialValues.date}
          id="date"
          label="Data"
          min="2026-05-11"
          name="date"
          required
          type="date"
        />
        <SelectInput defaultValue={initialValues.time || "20:00"} id="time" label="Horario" name="time">
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          defaultValue={initialValues.durationMinutes || 90}
          id="durationMinutes"
          label="Duracao"
          name="durationMinutes"
        >
          {durationOptions.map((duration) => (
            <option key={duration.value} value={duration.value}>
              {duration.label}
            </option>
          ))}
        </SelectInput>
        <TextInput
          defaultValue={initialValues.partySize || 2}
          id="partySize"
          label="Pessoas"
          min="1"
          name="partySize"
          required
          type="number"
        />
      </div>
      <TextInput
        defaultValue={initialValues.notes}
        id="notes"
        label="Observacoes"
        name="notes"
        placeholder="Preferencias, ocasiao especial ou acessibilidade"
      />
      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
