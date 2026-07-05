import { useEffect, useState } from 'react';
import { usePetStore } from '../../../stores/petStore';
import { useAuthStore } from '../../../stores/authStore';
import { appointmentsApi } from '../../../services/api';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { pets, fetchPets } = usePetStore();
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetchPets();
    appointmentsApi.list().then(res => setAppointments(res.data));
  }, []);

  const proximas = appointments.filter(a => a.status === 'PROGRAMADA');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">¡Bienvenido/a, {user?.name || 'Tutor'}!</h1>
        <p className="mt-1 text-sm text-gray-500">Resumen de tus mascotas y actividades</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Mascotas Registradas</p>
          <p className="text-2xl font-bold text-gray-800">{pets.length}</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Próximas Citas</p>
          <p className="text-2xl font-bold text-green-600">{proximas.length}</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Vacunas Pendientes</p>
          <p className="text-2xl font-bold text-gray-800">0</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Mis Mascotas</h2>
          <div className="space-y-3">
            {pets.map((pet) => (
              <div key={pet.id} className="flex items-center justify-between p-3 border rounded-lg">
                <span>{pet.nombre}</span>
                <Link to={`/tutor/pets/${pet.id}`} className="text-sm text-blue-600">Ver</Link>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Próximas Citas</h2>
          <div className="space-y-3">
            {proximas.length > 0 ? (
              proximas.map(cita => (
                <div key={cita.id} className="p-3 border rounded-lg bg-blue-50 border-blue-100">
                  <p className="font-bold text-blue-900">{cita.pet} · {cita.service}</p>
                  <p className="text-xs text-blue-700">{cita.date} a las {cita.time} · {cita.doctor}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4 border-2 border-dashed rounded-lg">No hay citas agendadas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}