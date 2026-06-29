export function TriagePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reportar Síntomas</h1>
        <p className="mt-1 text-sm text-gray-500">Describe los síntomas de tu mascota para una evaluación preliminar</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mascota</label>
          <select className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>Selecciona una mascota</option>
            <option>Max - Golden Retriever</option>
            <option>Luna - Siamés</option>
            <option>Piolín - Canario</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">¿Cuáles son los síntomas?</label>
          <textarea
            rows={4}
            placeholder="Describe detalladamente los síntomas que presenta tu mascota (ej: vomitó 3 veces en las últimas 2 horas, no quiere comer, está decaído)"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">¿Desde cuándo?</label>
            <select className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Hoy</option>
              <option>1 día</option>
              <option>2-3 días</option>
              <option>Más de 3 días</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nivel de dolor</label>
            <select className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Leve</option>
              <option>Moderado</option>
              <option>Severo</option>
            </select>
          </div>
        </div>

        <button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          Enviar Reporte
        </button>

        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
          <p className="font-medium">⚕️ Evaluación preliminar</p>
          <p className="mt-1 text-yellow-700">Al enviar, la IA analizará los síntomas y generará un reporte de clasificación de urgencia que será revisado por el médico.</p>
        </div>
      </div>
    </div>
  )
}
