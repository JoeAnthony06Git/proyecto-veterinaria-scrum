export function PatientDetailPage() {
  return (
    <div className="space-y-6">
      <a href="/doctor/patients" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Volver a pacientes
      </a>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <span className="text-3xl font-bold text-blue-600">M</span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-800">Max</h2>
              <p className="text-sm text-gray-500">Golden Retriever · Macho</p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Edad:</span><span className="font-medium text-gray-800">3 años</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Peso:</span><span className="font-medium text-gray-800">28 kg</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tutor:</span><span className="font-medium text-gray-800">María García</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Teléfono:</span><span className="font-medium text-gray-800">+51 999 888 777</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">Nueva Consulta</button>
              <button className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Receta</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Historial Clínico</h2>
            <div className="space-y-4">
              {[
                { date: '10 Jun 2026', symptoms: 'Vómitos, inapetencia, decaimiento', diagnosis: 'Gastroenteritis', treatment: 'Amoxicilina 250mg c/8h x 7d, Meloxicam c/24h x 5d' },
                { date: '22 May 2026', symptoms: 'Control de rutina', diagnosis: 'Saludable', treatment: 'Vacunación antirrábica aplicada' },
                { date: '5 Feb 2026', symptoms: 'Picazón intensa, enrojecimiento en patas', diagnosis: 'Dermatitis alérgica', treatment: 'Corticoide tópico, baños medicados' },
              ].map((c) => (
                <div key={c.date} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">{c.date}</span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{c.diagnosis}</span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><span className="text-gray-500">Síntomas:</span> {c.symptoms}</p>
                    <p><span className="text-gray-500">Tratamiento:</span> {c.treatment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Cartilla de Vacunación</h2>
            <div className="space-y-3">
              {[
                { name: 'Rabia', date: '15 Ene 2026', next: '15 Ene 2027', status: 'Completa' },
                { name: 'Múltiple (M7)', date: '20 Mar 2025', next: '20 Mar 2026', status: 'Por Vencer' },
              ].map((v) => (
                <div key={v.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-gray-800">{v.name}</p>
                    <p className="text-xs text-gray-500">Última: {v.date} · Próxima: {v.next}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    v.status === 'Completa' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
