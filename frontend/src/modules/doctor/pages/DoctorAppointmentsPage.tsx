import { useEffect, useState } from 'react';
import { doctorApi } from '../../../services/api';

export function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorApi.appointments()
      .then(res => setAppointments(res.data))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await doctorApi.updateAppointmentStatus(id, status);
    const res = await doctorApi.appointments();
    setAppointments(res.data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Citas</h1>
      </div>

      <div className="rounded-xl bg-white shadow-sm border">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Todas las Citas</h2>
        </div>
        {loading ? (
          <p className="p-10 text-center">Cargando...</p>
        ) : appointments.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No hay citas registradas.</div>
        ) : (
          <div className="divide-y">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-4">
                <div className="w-20 text-sm font-medium text-gray-500">{apt.time}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{apt.pet} · {apt.service}</p>
                  <p className="text-xs text-gray-500">{apt.owner}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full px-3 py-1 text-xs font-medium bg-gray-100">
                    {apt.status}
                  </span>
                  {apt.status === 'PROGRAMADA' && (
                    <button 
                      onClick={() => updateStatus(apt.id, 'EN_CURSO')}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Iniciar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}