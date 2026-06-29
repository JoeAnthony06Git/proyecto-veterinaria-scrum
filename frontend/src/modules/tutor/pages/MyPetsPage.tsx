export function MyPetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis Mascotas</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona los perfiles de tus mascotas</p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          + Nueva Mascota
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { name: 'Max', species: 'Perro', breed: 'Golden Retriever', age: '3 años', weight: '28 kg', color: 'blue' },
          { name: 'Luna', species: 'Gato', breed: 'Siamés', age: '2 años', weight: '4 kg', color: 'purple' },
          { name: 'Piolín', species: 'Ave', breed: 'Canario', age: '1 año', weight: '15 g', color: 'orange' },
        ].map((pet) => (
          <div key={pet.name} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-${pet.color}-100`}>
                <span className={`text-xl font-bold text-${pet.color}-600`}>{pet.name[0]}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{pet.name}</h3>
                <p className="text-sm text-gray-500">{pet.breed}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4 text-center text-sm">
              <div>
                <p className="font-medium text-gray-800">{pet.species}</p>
                <p className="text-xs text-gray-500">Especie</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">{pet.age}</p>
                <p className="text-xs text-gray-500">Edad</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">{pet.weight}</p>
                <p className="text-xs text-gray-500">Peso</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <a href={`/tutor/pets/1`} className="flex-1 rounded-lg border border-gray-300 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Ver Perfil
              </a>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                Agendar Cita
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
