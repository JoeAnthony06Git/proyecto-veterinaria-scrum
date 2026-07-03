import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesApi, doctorsApi, appointmentsApi } from '../../../services/api';
import { usePetStore } from '../../../stores/petStore';

const stepLabels = ['Mascota', 'Servicio', 'Doctor', 'Fecha/Hora', 'Confirmar'];

export function NewAppointmentPage() {
  const navigate = useNavigate();
  const { pets, fetchPets } = usePetStore();
  
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  
  const [selection, setSelection] = useState({
    petId: '',
    serviceId: '',
    doctorId: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    fetchPets();
    servicesApi.list().then(res => setServices(res.data));
    doctorsApi.list().then(res => setDoctors(res.data));
  }, []);

  const canProceed = () => {
    if (step === 1) return selection.petId !== '';
    if (step === 2) return selection.serviceId !== '';
    if (step === 3) return selection.doctorId !== '';
    if (step === 4) return selection.date !== '' && selection.time !== '';
    return true;
  };

  const handleFinish = async () => {
    try {
      await appointmentsApi.create({
        id: crypto.randomUUID(),
        petId: selection.petId,
        doctorId: selection.doctorId,
        serviceId: selection.serviceId,
        date: new Date(selection.date),
        time: selection.time,
        status: 'PROGRAMADA'
      });
      alert('¡Cita agendada con éxito!');
      navigate('/tutor/appointments');
    } catch (err) {
      alert('Error al agendar cita');
    }
  };

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
            <span className={`ml-2 text-sm hidden sm:inline ${i + 1 <= step ? 'font-medium text-blue-600' : 'text-gray-400'}`}>
              {label}
            </span>
            {i < stepLabels.length - 1 && <div className={`mx-2 sm:mx-4 h-px w-8 sm:w-12 ${i + 1 < step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">1. Selecciona tu mascota</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {pets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelection({ ...selection, petId: p.id })}
                  className={`p-4 border rounded-xl text-left transition-all ${selection.petId === p.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'hover:border-gray-300'}`}
                >
                  <p className="font-bold text-gray-900">{p.nombre}</p>
                  <p className="text-xs text-gray-500">{p.raza} · {p.especie}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">2. Selecciona un Servicio</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelection({ ...selection, serviceId: s.id })}
                  className={`p-4 border rounded-xl text-left transition-all ${selection.serviceId === s.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'hover:border-gray-300'}`}
                >
                  <p className="font-bold text-gray-900">{s.label}</p>
                  <p className="text-xs text-gray-500">{s.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">3. Selecciona un Doctor</h2>
            <div className="space-y-3">
              {doctors.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelection({ ...selection, doctorId: d.id })}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 transition-all ${selection.doctorId === d.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'hover:border-gray-300'}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                    {d.name[0]}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900">{d.name}</p>
                    <p className="text-sm text-gray-500">{d.specialty}</p>
                  </div>
                  <div className="text-sm text-yellow-500">★ {d.rating}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">4. Fecha y Hora</h2>
            <input
              type="date"
              className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSelection({ ...selection, date: e.target.value })}
            />
            <div className="grid grid-cols-3 gap-2">
              {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelection({ ...selection, time: t })}
                  className={`p-2 border rounded-lg text-sm transition-all ${selection.time === t ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">5. Confirmar Cita</h2>
            <div className="rounded-xl bg-gray-50 p-4 border border-dashed space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Mascota:</span><span className="font-bold">{pets.find(p => p.id === selection.petId)?.nombre}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Servicio:</span><span className="font-bold">{services.find(s => s.id === selection.serviceId)?.label}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Doctor:</span><span className="font-bold">{doctors.find(d => d.id === selection.doctorId)?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Fecha:</span><span className="font-bold">{selection.date}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Hora:</span><span className="font-bold">{selection.time}</span></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition-colors"
        >
          Anterior
        </button>
        {step < 5 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-30 transition-colors"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            Confirmar y Agendar
          </button>
        )}
      </div>
    </div>
  );
}
