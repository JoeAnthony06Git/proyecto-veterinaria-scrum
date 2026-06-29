export function PetDetailPage() {
  return (
    <div className="space-y-6">
      <a href="/tutor/pets" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Volver a mis mascotas
      </a>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white p-6 shadow-sm text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <span className="text-3xl font-bold text-blue-600">M</span>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-800">Max</h2>
            <p className="text-sm text-gray-500">Golden Retriever</p>
            <div className="mt-4 space-y-2 text-left text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Especie:</span><span className="font-medium text-gray-800">Perro</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Sexo:</span><span className="font-medium text-gray-800">Macho</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Edad:</span><span className="font-medium text-gray-800">3 años</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Peso:</span><span className="font-medium text-gray-800">28 kg</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Color:</span><span className="font-medium text-gray-800">Dorado</span></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Cartilla de Vacunación</h2>
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
                  {[
                    { name: 'Rabia', date: '15 Ene 2026', next: '15 Ene 2027', status: 'Completa' },
                    { name: 'Múltiple (M7)', date: '20 Mar 2025', next: '20 Mar 2026', status: 'Por Vencer' },
                    { name: 'Parvovirosis', date: '10 Dic 2025', next: '10 Dic 2026', status: 'Completa' },
                  ].map((v) => (
                    <tr key={v.name}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{v.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{v.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{v.next}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          v.status === 'Completa' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Historial de Consultas</h2>
            <div className="space-y-3">
              {[
                { date: '10 May 2026', reason: 'Control general', doctor: 'Dr. Carlos López' },
                { date: '22 Mar 2026', reason: 'Vacunación Rabia', doctor: 'Dra. Ana Martínez' },
                { date: '05 Feb 2026', reason: 'Dermatitis alérgica', doctor: 'Dr. Carlos López' },
              ].map((c) => (
                <div key={c.date} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-gray-800">{c.reason}</p>
                    <p className="text-xs text-gray-500">{c.date} · {c.doctor}</p>
                  </div>
                  <a href="/tutor/prescriptions/1" className="text-sm text-blue-600 hover:text-blue-500">Ver receta</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
