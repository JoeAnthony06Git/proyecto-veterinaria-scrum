import { useEffect } from 'react';
import { usePetStore } from '../../../stores/petStore';
import { useAuthStore } from '../../../stores/authStore'; // Para el nombre del tutor
import { Link } from 'react-router-dom';

export function DashboardPage() {
  // 1. Conectamos con los Stores
  const { pets, fetchPets, loading } = usePetStore();
  const { user } = useAuthStore(); // Obtenemos el usuario autenticado

  // 2. Cargamos las mascotas al entrar a la página
  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        {/* Usamos el nombre real del usuario o "Tutor" por defecto */}
        <h1 className="text-2xl font-bold text-gray-800">
          ¡Bienvenido/a, {user?.name || 'Tutor'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">Resumen de tus mascotas y actividades</p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mascotas Registradas</p>
              {/* Mostramos el conteo real de mascotas */}
              <p className="text-2xl font-bold text-gray-800">{loading ? '...' : pets.length}</p>
            </div>
          </div>
        </div>

        {/* Citas y Vacunas (Estos datos los manejarán tus otros compañeros, puedes dejarlos estáticos o en 0 por ahora) */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Próximas Citas</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vacunas Pendientes</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* SECCIÓN DE MIS MASCOTAS REALES */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Mis Mascotas</h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500 italic">Cargando mascotas...</p>
            ) : pets.length > 0 ? (
              // Mapeamos las mascotas reales del Store
              pets.slice(0, 3).map((pet) => (
                <div key={pet.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                    {pet.nombre[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{pet.nombre}</p>
                    <p className="text-xs text-gray-500">{pet.especie} · {pet.raza} · {pet.pesoKg}kg</p>
                  </div>
                  <Link 
                    to={`/tutor/pets/${pet.id}`} 
                    className="ml-auto text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Ver
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center border-2 border-dashed rounded-lg">
                No tienes mascotas registradas.
              </p>
            )}
            
            {pets.length > 3 && (
              <Link to="/tutor/pets" className="block text-center text-sm text-gray-500 mt-2 hover:text-blue-600">
                Ver todas las mascotas ({pets.length})
              </Link>
            )}
          </div>
        </div>

        {/* Sección de Citas (Mantener estática por ahora hasta que Persona 3 la complete) */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Próximas Citas</h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-500 py-4 text-center border-2 border-dashed rounded-lg">
              No tienes citas agendadas próximamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}