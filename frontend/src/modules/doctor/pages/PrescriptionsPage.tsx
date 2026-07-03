export function PrescriptionsPage() {
  const prescriptions: {
    pet: string; owner: string; date: string; text: string; status: string
  }[] = []

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
        {prescriptions.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">
            No hay recetas registradas.
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {prescriptions.map((r) => (
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
        )}
      </div>
    </div>
  )
}
