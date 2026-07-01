import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePetStore } from '../../../stores/petStore';

export function PetDetailPage() {
  const { id } = useParams();
  const { currentPet, fetchPetById, loading } = usePetStore();

  useEffect(() => {
    if (id) fetchPetById(id);
  }, [id]);

  if (loading) return <div className="p-10 text-center">Cargando información de la mascota...</div>;
  if (!currentPet) return <div className="p-10 text-center text-red-500">Mascota no encontrada.</div>;

  return (
    <div className="space-y-6">
      <Link to="/tutor/pets" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Volver a mis mascotas
      </Link>

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
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Cartilla de Vacunación Dinámica (Usando 'vaccines') */}
          <div className="rounded-xl bg-white p-6 shadow-sm border">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Cartilla de Vacunación</h2>
            <div className="overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Vacuna</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentPet.vaccines && currentPet.vaccines.length > 0 ? (
                    currentPet.vaccines.map((v) => (
                      <tr key={v.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{v.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{new Date(v.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            {v.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="px-4 py-3 text-sm text-center text-gray-400 italic">No hay vacunas registradas</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historial de Consultas Dinámico (Usando 'consultations') */}
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
                    <Link to={`/tutor/prescriptions/${c.id}`} className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                      Ver receta
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