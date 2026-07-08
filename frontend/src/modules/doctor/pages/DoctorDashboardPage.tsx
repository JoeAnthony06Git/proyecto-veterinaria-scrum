import { useEffect, useState } from 'react';
import { doctorApi } from '../../../services/api';
import type { DoctorDashboardDto, DoctorAppointmentDto, TriageAlertDto } from '../../../types';

export function DoctorDashboardPage() {
  const [stats, setStats] = useState<DoctorDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorApi.dashboard()
      .then(res => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const handleAttendTriage = async (alertId: string) => {
    try {
      await doctorApi.attendTriage(alertId);
      const res = await doctorApi.dashboard();
      setStats(res.data);
    } catch {
      // silent
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando panel...</div>;
  if (!stats) return <div className="p-10 text-center text-red-500">Error al cargar datos.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Panel del Doctor</h1>
        <p className="mt-1 text-sm text-gray-500">Gestión de pacientes y citas asignadas</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Citas Pendientes</p>
          <p className="text-2xl font-bold text-gray-800">{stats.todayAppointments}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Pacientes Totales</p>
          <p className="text-2xl font-bold text-gray-800">{stats.patientCount}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Alertas Triaje</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.triageAlerts}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Urgencias</p>
          <p className="text-2xl font-bold text-red-600">{stats.emergencies}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Lista de Próximas Citas</h2>
          {stats.appointments.length === 0 ? (
            <p className="text-sm text-gray-400">No hay citas pendientes.</p>
          ) : (
            <div className="space-y-3">
              {stats.appointments.map((c: DoctorAppointmentDto) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-gray-800">{c.pet} · {c.service}</p>
                    <p className="text-xs text-gray-500">{c.date} | {c.time} · {c.owner}</p>
                  </div>
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Alertas de Triaje</h2>
          {stats.alerts.length === 0 ? (
            <p className="text-sm text-gray-400">No hay alertas de triaje pendientes.</p>
          ) : (
            <div className="space-y-3">
              {stats.alerts.map((a: TriageAlertDto) => (
                <div key={a.id} className={`rounded-lg border-l-4 p-3 ${a.urgency === 'CRITICA' ? 'border-l-red-500 bg-red-50' : 'border-l-yellow-500 bg-yellow-50'}`}>
                  <p className="font-medium text-gray-800">{a.pet} · <span className="uppercase text-xs font-bold">{a.urgency}</span></p>
                  <p className="mt-1 text-xs text-gray-600 line-clamp-1">{a.symptoms}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleAttendTriage(a.id)}
                      className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      Atender
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}