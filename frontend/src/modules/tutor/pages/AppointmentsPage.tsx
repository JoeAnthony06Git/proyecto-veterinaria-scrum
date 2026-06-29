export function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis Citas</h1>
          <p className="mt-1 text-sm text-gray-500">Historial de citas agendadas</p>
        </div>
        <a href="/tutor/appointments/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          + Nueva Cita
        </a>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button className="border-b-2 border-blue-600 px-6 py-3 text-sm font-medium text-blue-600">Próximas</button>
            <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">Historial</button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { pet: 'Max', service: 'Consulta General', date: '15 Jun 2026', time: '10:00 AM', doctor: 'Dr. López', status: 'Confirmada' },
            { pet: 'Luna', service: 'Vacunación', date: '18 Jun 2026', time: '3:30 PM', doctor: 'Dra. Martínez', status: 'Pendiente' },
          ].map((apt) => (
            <div key={apt.pet + apt.date} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-sm font-bold text-blue-600">{apt.pet[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{apt.pet} · {apt.service}</p>
                  <p className="text-sm text-gray-500">{apt.date} {apt.time} · {apt.doctor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  apt.status === 'Confirmada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {apt.status}
                </span>
                <button className="text-sm text-red-500 hover:text-red-700">Cancelar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
