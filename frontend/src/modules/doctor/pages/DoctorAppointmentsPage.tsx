import { useEffect, useState } from 'react';
import { doctorApi } from '../../../services/api';

export function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'today' | 'all'>('today');

  useEffect(() => {
    setLoading(true);
    doctorApi.appointments(range)
      .then(res => setAppointments(res.data))
      .finally(() => setLoading(false));
  }, [range]);

  const updateStatus = async (id: string, status: string) => {
    await doctorApi.updateAppointmentStatus(id, status);
    const res = await doctorApi.appointments(range);
    setAppointments(res.data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Citas</h1>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setRange('today')}
            className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${range === 'today' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            Hoy
          </button>
          <button 
            onClick={() => setRange('all')}
            className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${range === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            Todas
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border overflow-hidden">
        {loading ? (
          <p className="p-10 text-center">Cargando...</p>
        ) : appointments.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No hay citas para mostrar en este rango.</div>
        ) : (
          <div className="divide-y">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <div className="w-32 text-sm font-bold text-blue-600">
                  <p>{apt.date}</p>
                  <p className="text-gray-400 font-normal">{apt.time}</p>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{apt.pet} · {apt.service}</p>
                  <p className="text-xs text-gray-500">{apt.owner}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${apt.status === 'CANCELADA' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                    {apt.status}
                  </span>
                  {apt.status === 'PROGRAMADA' && (
                    <button 
                      onClick={() => updateStatus(apt.id, 'EN_CURSO')}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700"
                    >
                      INICIAR
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