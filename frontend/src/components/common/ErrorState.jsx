import { AlertCircle } from "lucide-react";

export function ErrorState({ message }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <AlertCircle size={20} />
      <span>{message}</span>
    </div>
  );
}
