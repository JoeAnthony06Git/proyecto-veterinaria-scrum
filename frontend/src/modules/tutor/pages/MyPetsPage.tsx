import { useEffect, useState } from 'react';
import { usePetStore } from '../../../stores/petStore';
import { Link } from 'react-router-dom';
import { PetFormModal } from '../components/PetFormModal'; // El componente que crearemos después

export function MyPetsPage() {
  // 1. Traemos los datos y funciones de tu Store
  const { pets, fetchPets, loading } = usePetStore();
  const [mostrarModal, setMostrarModal] = useState(false);

  // 2. Cargamos las mascotas al iniciar
  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis Mascotas</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona los perfiles de tus mascotas</p>
        </div>
        {/* 3. El botón ahora abre un formulario real */}
        <button 
          onClick={() => setMostrarModal(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + Nueva Mascota
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 4. Mapeamos tus mascotas reales */}
          {pets.map((pet) => (
            <div key={pet.id} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-blue-100`}>
                  <span className={`text-xl font-bold text-blue-600`}>
                    {pet.nombre[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{pet.nombre}</h3>
                  <p className="text-sm text-gray-500">{pet.raza}</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4 text-center text-sm">
                <div>
                  <p className="font-medium text-gray-800">{pet.especie}</p>
                  <p className="text-xs text-gray-500">Especie</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{pet.sexo}</p>
                  <p className="text-xs text-gray-500">Sexo</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{pet.pesoKg} kg</p>
                  <p className="text-xs text-gray-500">Peso</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link 
                  to={`/tutor/pets/${pet.id}`} 
                  className="flex-1 rounded-lg border border-gray-300 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Ver Perfil
                </Link>
                <Link
                  to={`/tutor/appointments/new?petId=${pet.id}`}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Agendar Cita
                </Link>
              </div>
            </div>
          ))}

          {/* 5. Mensaje si no hay datos */}
          {pets.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
              <p className="text-gray-500">No tienes mascotas registradas aún.</p>
            </div>
          )}
        </div>
      )}

      {/* 6. Modal para crear mascota (lo crearemos a continuación) */}
      {mostrarModal && <PetFormModal alCerrar={() => setMostrarModal(false)} />}
    </div>
  );
}
