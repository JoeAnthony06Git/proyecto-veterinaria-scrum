import { useEffect, useState } from 'react';
import { appointmentsApi } from '../../../services/api';

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'PROXIMAS' | 'HISTORIAL'>('PROXIMAS');

  useEffect(() => {
    appointmentsApi.list()
      .then(res => setAppointments(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtrarCitas = () => {
    if (tab === 'PROXIMAS') {
      return appointments.filter(a => a.status === 'PROGRAMADA' || a.status === 'EN_CURSO');
    }
    return appointments.filter(a => a.status === 'COMPLETADA' || a.status === 'CANCELADA');
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('¿Estás seguro de cancelar esta cita?')) {
      await appointmentsApi.cancel(id);
      const res = await appointmentsApi.list();
      setAppointments(res.data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Mis Citas</h1>
        <a href="/tutor/appointments/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">+ Nueva Cita</a>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="flex border-b">
          <button 
            onClick={() => setTab('PROXIMAS')}
            className={`flex-1 py-3 text-sm font-bold ${tab === 'PROXIMAS' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            PRÓXIMAS
          </button>
          <button 
            onClick={() => setTab('HISTORIAL')}
            className={`flex-1 py-3 text-sm font-bold ${tab === 'HISTORIAL' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            HISTORIAL
          </button>
        </div>

        {loading ? (
          <p className="p-10 text-center">Cargando...</p>
        ) : filtrarCitas().length > 0 ? (
          <div className="divide-y">
            {filtrarCitas().map((apt) => (
              <div key={apt.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">{apt.pet} · {apt.service}</p>
                  <p className="text-sm text-gray-500">{apt.date} {apt.time} · {apt.doctor}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${apt.status === 'PROGRAMADA' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {apt.status}
                  </span>
                  {apt.status === 'PROGRAMADA' && (
                    <button onClick={() => handleCancel(apt.id)} className="text-red-500 text-sm font-bold">Cancelar</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-10 text-center text-gray-400">No hay citas en esta sección.</p>
        )}
      </div>
    </div>
  );
}