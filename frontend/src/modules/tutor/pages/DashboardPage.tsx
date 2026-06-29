export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">¡Bienvenida, María!</h1>
        <p className="mt-1 text-sm text-gray-500">Resumen de tus mascotas y actividades</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mascotas Registradas</p>
              <p className="text-2xl font-bold text-gray-800">3</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Próximas Citas</p>
              <p className="text-2xl font-bold text-gray-800">2</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vacunas Pendientes</p>
              <p className="text-2xl font-bold text-gray-800">1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Mis Mascotas</h2>
          <div className="space-y-3">
            {[
              { name: 'Max', species: 'Perro', breed: 'Golden Retriever', age: '3 años' },
              { name: 'Luna', species: 'Gato', breed: 'Siamés', age: '2 años' },
              { name: 'Piolín', species: 'Ave', breed: 'Canario', age: '1 año' },
            ].map((pet) => (
              <div key={pet.name} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  {pet.name[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{pet.name}</p>
                  <p className="text-xs text-gray-500">{pet.species} · {pet.breed} · {pet.age}</p>
                </div>
                <a href={`/tutor/pets/1`} className="ml-auto text-sm text-blue-600 hover:text-blue-500">Ver</a>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Próximas Citas</h2>
          <div className="space-y-3">
            {[
              { pet: 'Max', service: 'Consulta General', date: '15 Jun 2026', time: '10:00 AM', doctor: 'Dr. Carlos López' },
              { pet: 'Luna', service: 'Vacunación', date: '18 Jun 2026', time: '3:30 PM', doctor: 'Dra. Ana Martínez' },
            ].map((apt) => (
              <div key={apt.pet + apt.date} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800">{apt.pet} · {apt.service}</p>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">Próximo</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{apt.date} {apt.time} · {apt.doctor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
