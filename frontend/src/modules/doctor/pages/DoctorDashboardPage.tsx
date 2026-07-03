export function DoctorDashboardPage() {
  const todayAppointments: {
    pet: string; owner: string; time: string; service: string; status: string
  }[] = []

  const triageAlerts: {
    pet: string; owner: string; urgency: string; symptoms: string; time: string
  }[] = []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Panel del Doctor</h1>
        <p className="mt-1 text-sm text-gray-500">Resumen de tus pacientes y citas del día</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Citas Hoy</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pacientes</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
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
              <p className="text-sm text-gray-500">Alertas Triaje</p>
              <p className="text-2xl font-bold text-yellow-600">0</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Urgencias</p>
              <p className="text-2xl font-bold text-red-600">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Citas de Hoy</h2>
          {todayAppointments.length === 0 ? (
            <p className="text-sm text-gray-400">No hay citas para hoy.</p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((c) => (
                <div key={c.pet + c.time} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                      {c.pet[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{c.pet} · {c.service}</p>
                      <p className="text-xs text-gray-500">{c.time} · {c.owner}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    c.status === 'En sala' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Alertas de Triaje Recibidas</h2>
          {triageAlerts.length === 0 ? (
            <p className="text-sm text-gray-400">No hay alertas de triaje.</p>
          ) : (
            <div className="space-y-3">
              {triageAlerts.map((a) => (
                <div key={a.pet} className={`rounded-lg border-l-4 p-3 ${
                  a.urgency === 'ALTA' ? 'border-l-red-500 bg-red-50' : 'border-l-yellow-500 bg-yellow-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">{a.pet} · <span className={a.urgency === 'ALTA' ? 'text-red-600' : 'text-yellow-600'}>{a.urgency}</span></p>
                    <span className="text-xs text-gray-400">{a.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">{a.symptoms}</p>
                  <p className="mt-1 text-xs text-gray-400">Tutor: {a.owner}</p>
                  <div className="mt-2 flex gap-2">
                    <button className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">Atender</button>
                    <button className="rounded border px-3 py-1 text-xs text-gray-600 hover:bg-gray-50">Ver detalle</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
