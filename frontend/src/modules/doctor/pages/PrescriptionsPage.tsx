export function PrescriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Recetas Médicas</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona las prescripciones de tus pacientes</p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          + Nueva Receta
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="space-y-1 p-2">
          {[
            { pet: 'Max', owner: 'María García', date: '10 Jun 2026', text: 'Amoxicilina 250mg PO c/8h x 7d. Meloxicam 0.1mg/kg c/24h x 5d.', status: 'Interpretada' },
            { pet: 'Toby', owner: 'Pedro Ruiz', date: '5 Jun 2026', text: 'Prednisona 20mg PO c/12h x 10d. Omeprazol 10mg c/24h.', status: 'Pendiente' },
            { pet: 'Nina', owner: 'Ana Torres', date: '1 Jun 2026', text: 'Antibiótico oftálmico 1 gota c/6h x 7d. Limpieza ocular c/12h.', status: 'Interpretada' },
          ].map((r) => (
            <div key={r.pet + r.date} className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">{r.pet}</h3>
                    <span className="text-sm text-gray-500">· {r.date}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      r.status === 'Interpretada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{r.text}</p>
                  <p className="mt-1 text-xs text-gray-400">Tutor: {r.owner}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="text-sm text-blue-600 hover:text-blue-500">Editar</button>
                  <button className="text-sm text-blue-600 hover:text-blue-500">Interpretar con IA</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
