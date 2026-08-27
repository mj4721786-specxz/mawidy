"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statusLabel: Record<string, string> = {
  pending: "بانتظار التأكيد",
  confirmed: "مؤكد",
  cancelled: "ملغى",
  completed: "مكتمل",
  no_show: "لم يحضر",
};

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-gray-100 text-gray-700",
  no_show: "bg-orange-100 text-orange-700",
};

export default function AppointmentRow({ appointment }: { appointment: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: string) {
    setLoading(true);
    await fetch("/api/appointments/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId: appointment.id, status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="bg-white border rounded-lg p-4 flex items-center justify-between flex-wrap gap-3">
      <div>
        <div className="font-bold">{appointment.doctors?.full_name}</div>
        <div className="text-sm text-gray-500">
          {appointment.patients?.full_name} — {appointment.patients?.phone}
        </div>
        <div className="text-sm text-gray-500" dir="ltr">
          {appointment.appointment_date} · {appointment.appointment_time}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`text-xs px-3 py-1 rounded-full ${statusColor[appointment.status]}`}>
          {statusLabel[appointment.status]}
        </span>

        {appointment.status === "pending" && (
          <>
            <button
              disabled={loading}
              onClick={() => updateStatus("confirmed")}
              className="text-xs bg-green-600 text-white px-3 py-1.5 rounded"
            >
              تأكيد
            </button>
            <button
              disabled={loading}
              onClick={() => updateStatus("cancelled")}
              className="text-xs bg-red-600 text-white px-3 py-1.5 rounded"
            >
              إلغاء
            </button>
          </>
        )}

        {appointment.status === "confirmed" && (
          <>
            <button
              disabled={loading}
              onClick={() => updateStatus("completed")}
              className="text-xs bg-gray-600 text-white px-3 py-1.5 rounded"
            >
              تم الحضور
            </button>
            <button
              disabled={loading}
              onClick={() => updateStatus("no_show")}
              className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded"
            >
              لم يحضر
            </button>
            <button
              disabled={loading}
              onClick={() => updateStatus("cancelled")}
              className="text-xs bg-red-600 text-white px-3 py-1.5 rounded"
            >
              إلغاء
            </button>
          </>
        )}
      </div>
    </div>
  );
}
