import { useState } from 'react'

const stepLabels = ['Servicio', 'Doctor', 'Fecha', 'Turno', 'Confirmar']

const services: { id: string; label: string; desc: string; icon: string }[] = []
const doctors: { id: string; name: string; specialty: string; rating: number }[] = []
const timeSlots: string[] = []

export function NewAppointmentPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const canProceed = () => {
    if (step === 1) return selectedService !== ''
    if (step === 2) return selectedDoctor !== ''
    if (step === 3) return selectedDate !== ''
    if (step === 4) return selectedTime !== ''
    return true
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Nueva Cita</h1>
        <p className="mt-1 text-sm text-gray-500">Sigue los pasos para agendar una atención</p>
      </div>

      <div className="flex items-center justify-between">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              i + 1 <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-sm ${i + 1 <= step ? 'font-medium text-blue-600' : 'text-gray-400'}`}>
              {label}
            </span>
            {i < stepLabels.length - 1 && <div className={`mx-4 h-px w-12 ${i + 1 < step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Selecciona un Servicio</h2>
            {services.length === 0 ? (
              <p className="text-sm text-gray-400">No hay servicios disponibles.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s.id)}
                    className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                      selectedService === s.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{s.label}</p>
                      <p className="mt-1 text-xs text-gray-500">{s.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Selecciona un Doctor</h2>
            {doctors.length === 0 ? (
              <p className="text-sm text-gray-400">No hay doctores disponibles.</p>
            ) : (
              <div className="space-y-3">
                {doctors.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDoctor(d.id)}
                    className={`flex w-full items-center gap-4 rounded-lg border p-4 transition-colors ${
                      selectedDoctor === d.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600">
                      {d.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-800">{d.name}</p>
                      <p className="text-sm text-gray-500">{d.specialty}</p>
                    </div>
                    <div className="text-sm text-yellow-500">{'★'.repeat(Math.floor(d.rating))} {d.rating}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Selecciona una Fecha</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Selecciona un Turno</h2>
            {timeSlots.length === 0 ? (
              <p className="text-sm text-gray-400">No hay turnos disponibles.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`rounded-lg border py-3 text-sm transition-colors ${
                      selectedTime === t ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-500' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Confirmar Cita</h2>
            <p className="text-sm text-gray-400">Completa los pasos anteriores para confirmar.</p>
            <button className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
              Confirmar y Agendar
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Anterior
        </button>
        <button
          onClick={() => setStep(Math.min(5, step + 1))}
          disabled={!canProceed()}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {step === 5 ? 'Finalizar' : 'Siguiente'}
        </button>
      </div>
    </div>
  )
}
