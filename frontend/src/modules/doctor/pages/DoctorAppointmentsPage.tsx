export function DoctorAppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Citas</h1>
          <p className="mt-1 text-sm text-gray-500">Administra las citas de tus pacientes</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Hoy</button>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Semana</button>
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Mes</button>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Jueves, 14 de Junio 2026</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { time: '8:00 AM', pet: 'Max', service: 'Consulta General', owner: 'María García', status: 'Completada' },
            { time: '9:00 AM', pet: 'Luna', service: 'Vacunación', owner: 'María García', status: 'Completada' },
            { time: '10:00 AM', pet: 'Toby', service: 'Control', owner: 'Pedro Ruiz', status: 'En curso' },
            { time: '11:00 AM', pet: 'Nina', service: 'Diagnóstico', owner: 'Ana Torres', status: 'Pendiente' },
            { time: '12:00 PM', pet: 'Rocky', service: 'Urgencia', owner: 'Jorge Silva', status: 'Urgente' },
            { time: '2:00 PM', pet: 'Bella', service: 'Consulta', owner: 'Lucía Méndez', status: 'Pendiente' },
          ].map((apt) => (
            <div key={apt.time + apt.pet} className={`flex items-center gap-4 p-4 ${
              apt.status === 'Urgente' ? 'bg-red-50' : ''
            }`}>
              <div className="w-16 text-sm font-medium text-gray-500">{apt.time}</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                {apt.pet[0]}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{apt.pet} · {apt.service}</p>
                <p className="text-xs text-gray-500">{apt.owner}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                apt.status === 'Completada' ? 'bg-green-100 text-green-700' :
                apt.status === 'En curso' ? 'bg-blue-100 text-blue-700' :
                apt.status === 'Urgente' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {apt.status}
              </span>
              <button className="text-sm text-blue-600 hover:text-blue-500">Gestionar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
