export function PatientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pacientes</h1>
          <p className="mt-1 text-sm text-gray-500">Lista de pacientes registrados</p>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Buscar paciente..." className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none" />
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Paciente</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Especie</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Edad</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Tutor</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Última Consulta</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { pet: 'Max', species: 'Perro', breed: 'Golden Retriever', age: '3 años', owner: 'María García', lastVisit: '10 Jun 2026' },
              { pet: 'Luna', species: 'Gato', breed: 'Siamés', age: '2 años', owner: 'María García', lastVisit: '22 May 2026' },
              { pet: 'Toby', species: 'Perro', breed: 'Bulldog', age: '4 años', owner: 'Pedro Ruiz', lastVisit: '5 Jun 2026' },
              { pet: 'Nina', species: 'Gato', breed: 'Persa', age: '1 año', owner: 'Ana Torres', lastVisit: '1 Jun 2026' },
              { pet: 'Rocky', species: 'Perro', breed: 'Pastor Alemán', age: '5 años', owner: 'Jorge Silva', lastVisit: 'Hoy' },
            ].map((p) => (
              <tr key={p.pet} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">{p.pet[0]}</div>
                    <div>
                      <p className="font-medium text-gray-800">{p.pet}</p>
                      <p className="text-xs text-gray-500">{p.breed}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.species}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.age}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.owner}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.lastVisit}</td>
                <td className="px-6 py-4">
                  <a href={`/doctor/patients/1`} className="text-sm font-medium text-blue-600 hover:text-blue-500">Ver historial</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
