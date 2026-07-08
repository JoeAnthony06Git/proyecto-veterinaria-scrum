import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePetStore } from '../../../stores/petStore';

function getDaysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function vaccineStatusBadge(v: { date: string; next: string; status: string }) {
  const daysUntilNext = getDaysUntil(v.next);

  if (daysUntilNext <= 0) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Vencida</span>;
  }
  if (daysUntilNext <= 7) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700"><span className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> Próximamente</span>;
  }
  if (daysUntilNext <= 30) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Pendiente</span>;
  }
  return <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">{v.status}</span>;
}

function SkeletonLine({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className || 'h-4 w-full'}`} />;
}

export function PetDetailPage() {
  const { id } = useParams();
  const { currentPet, fetchPetById, loading } = usePetStore();

  useEffect(() => {
    if (id) fetchPetById(id);
  }, [id]);

  const upcomingVaccines = useMemo(() => {
    if (!currentPet?.vaccines) return [];
    return currentPet.vaccines
      .filter((v) => getDaysUntil(v.next) <= 30)
      .sort((a, b) => getDaysUntil(a.next) - getDaysUntil(b.next));
  }, [currentPet]);

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLine className="h-4 w-40" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm border space-y-4">
            <SkeletonLine className="h-20 w-20 rounded-full mx-auto" />
            <SkeletonLine className="h-5 w-32 mx-auto" />
            <SkeletonLine className="h-4 w-24 mx-auto" />
            <div className="space-y-2"><SkeletonLine /><SkeletonLine /><SkeletonLine /><SkeletonLine /></div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm border space-y-3">
              <SkeletonLine className="h-6 w-48" />
              <SkeletonLine className="h-20 w-full" />
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm border space-y-3">
              <SkeletonLine className="h-6 w-48" />
              <SkeletonLine className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPet) return <div className="p-10 text-center text-red-500">Mascota no encontrada.</div>;

  return (
    <div className="space-y-6">
      <Link to="/tutor/pets" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Volver a mis mascotas
      </Link>

      {upcomingVaccines.length > 0 && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="font-semibold">Recordatorio de Vacunas</span>
          </div>
          <div className="mt-2 space-y-1">
            {upcomingVaccines.map((v) => {
              const days = getDaysUntil(v.next);
              return (
                <p key={v.id} className="text-sm text-yellow-700">
                  <span className="font-medium">{v.name}</span> — próxima dosis {days <= 0 ? 'vencida' : `en ${days} día${days !== 1 ? 's' : ''}`} ({new Date(v.next).toLocaleDateString()})
                </p>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white p-6 shadow-sm text-center border">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <span className="text-3xl font-bold text-blue-600">
                {currentPet.nombre ? currentPet.nombre[0].toUpperCase() : 'P'}
              </span>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-800">{currentPet.nombre}</h2>
            <p className="text-sm text-gray-500">{currentPet.raza}</p>

            <div className="mt-4 space-y-2 text-left text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Especie:</span><span className="font-medium text-gray-800">{currentPet.especie}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Sexo:</span><span className="font-medium text-gray-800">{currentPet.sexo}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Peso:</span><span className="font-medium text-gray-800">{currentPet.pesoKg} kg</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Color:</span><span className="font-medium text-gray-800">{currentPet.color}</span></div>
            </div>

            <Link
              to={`/tutor/appointments/new?petId=${currentPet.id}`}
              className="mt-4 block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Agendar Cita
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Cartilla de Vacunación</h2>
              {currentPet.vaccines && currentPet.vaccines.filter((v) => getDaysUntil(v.next) <= 7).length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {currentPet.vaccines.filter((v) => getDaysUntil(v.next) <= 7).length} por vencer
                </span>
              )}
            </div>
            <div className="overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Vacuna</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Próxima Dosis</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentPet.vaccines && currentPet.vaccines.length > 0 ? (
                    currentPet.vaccines.map((v) => (
                      <tr key={v.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{v.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{new Date(v.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <span className={getDaysUntil(v.next) <= 7 ? 'font-semibold text-red-600' : ''}>
                            {new Date(v.next).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-4 py-3">{vaccineStatusBadge(v)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="px-4 py-3 text-sm text-center text-gray-400 italic">No hay vacunas registradas</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Historial de Consultas</h2>
            <div className="space-y-3">
              {currentPet.consultations && currentPet.consultations.length > 0 ? (
                currentPet.consultations.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-gray-800">{c.reason}</p>
                      <p className="text-xs text-gray-500">{new Date(c.date).toLocaleDateString()} · {c.doctor}</p>
                    </div>
                    <Link to={`/tutor/consultations/${c.id}`} className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                      Ver detalle
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-400 italic">No hay consultas médicas registradas</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}