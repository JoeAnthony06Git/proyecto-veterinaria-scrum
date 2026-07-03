export function AnamnesisPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Anamnesis por Voz</h1>
        <p className="mt-1 text-sm text-gray-500">Dicta el historial clínico usando reconocimiento de voz</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Grabación</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Paciente</label>
            <select className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none">
              <option>No hay pacientes registrados</option>
            </select>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-700">Presiona para grabar</p>
            <p className="text-xs text-gray-500">Whisper procesará el audio localmente</p>
            <button className="mt-4 rounded-full bg-red-500 px-8 py-3 text-sm font-semibold text-white hover:bg-red-600 transition-colors">
              Comenzar Grabación
            </button>
          </div>

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700">
            <p className="font-medium">Whisper (Local)</p>
            <p className="mt-1 text-blue-600">La transcripción se procesa localmente mediante whisper.cpp. No se envía audio a servicios externos.</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Transcripción y Datos Estructurados</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">Texto transcrito</label>
            <textarea
              rows={4}
              placeholder="El texto transcrito aparecerá aquí..."
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="rounded-lg border divide-y">
            <div className="p-3">
              <p className="text-xs font-medium uppercase text-gray-500">Síntomas</p>
              <p className="mt-1 text-sm text-gray-800">-</p>
            </div>
            <div className="p-3">
              <p className="text-xs font-medium uppercase text-gray-500">Diagnóstico Presuntivo</p>
              <p className="mt-1 text-sm text-gray-800">-</p>
            </div>
            <div className="p-3">
              <p className="text-xs font-medium uppercase text-gray-500">Tratamiento Sugerido</p>
              <p className="mt-1 text-sm text-gray-800">-</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
              Guardar en Historial
            </button>
            <button className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Regrabar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
