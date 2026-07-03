import { useState, useEffect } from 'react';
import { usePetStore } from '../../../stores/petStore';
import { servicesApi, doctorsApi } from '../../../services/api';

export function AppointmentFlow({ onFinish }: { onFinish: (data: any) => void }) {
  const [step, setStep] = useState(1);
  const { pets, fetchPets } = usePetStore();
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

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`h-2 flex-1 rounded ${step >= i ? 'bg-blue-600' : 'bg-gray-100'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800">1. Selecciona tu mascota</h3>
          <div className="grid grid-cols-2 gap-3">
            {pets.map(p => (
              <button
                key={p.id}
                onClick={() => { setSelection({ ...selection, petId: p.id }); next(); }}
                className={`p-4 border rounded-xl text-left transition-all ${selection.petId === p.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'hover:border-gray-300'}`}
              >
                <p className="font-bold text-gray-900">{p.nombre}</p>
                <p className="text-xs text-gray-500">{p.raza}</p>
              </button>
            ))}
          </div>
          {pets.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No tienes mascotas registradas.</p>}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800">2. ¿Qué servicio necesita?</h3>
          <div className="grid grid-cols-1 gap-2">
            {services.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelection({ ...selection, serviceId: s.id }); next(); }}
                className={`p-4 border rounded-xl text-left transition-all ${selection.serviceId === s.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}
              >
                <p className="font-bold">{s.label}</p>
                <p className="text-xs text-gray-500">{s.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800">3. Elige un profesional</h3>
          <div className="space-y-2">
            {doctors.map(d => (
              <button
                key={d.id}
                onClick={() => { setSelection({ ...selection, doctorId: d.id }); next(); }}
                className={`w-full p-4 border rounded-xl text-left flex justify-between items-center transition-all ${selection.doctorId === d.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}
              >
                <div>
                  <p className="font-bold">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.specialty}</p>
                </div>
                <span className="text-yellow-500 font-medium">★ {d.rating}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800">4. Fecha y Hora</h3>
          <input
            type="date"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSelection({ ...selection, date: e.target.value })}
          />
          <div className="grid grid-cols-3 gap-2">
            {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'].map(t => (
              <button
                key={t}
                onClick={() => setSelection({ ...selection, time: t })}
                className={`p-2 border rounded-lg transition-all ${selection.time === t ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800">5. Confirmar Cita</h3>
          <div className="p-4 bg-gray-50 rounded-xl border border-dashed space-y-2 text-sm">
            <p className="text-gray-600"><strong>Mascota:</strong> {pets.find(p => p.id === selection.petId)?.nombre}</p>
            <p className="text-gray-600"><strong>Servicio:</strong> {services.find(s => s.id === selection.serviceId)?.label}</p>
            <p className="text-gray-600"><strong>Doctor:</strong> {doctors.find(d => d.id === selection.doctorId)?.name}</p>
            <p className="text-gray-600"><strong>Fecha:</strong> {selection.date} a las {selection.time}</p>
          </div>
          <button
            onClick={() => onFinish(selection)}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
          >
            AGENDAR AHORA
          </button>
        </div>
      )}

      <div className="flex justify-between mt-6 pt-4 border-t">
        {step > 1 ? (
          <button onClick={prev} className="text-gray-500 text-sm font-medium hover:text-gray-700">
            &larr; Anterior
          </button>
        ) : <div />}
        {step < 5 && step !== 1 && step !== 2 && step !== 3 && (
          <button
            onClick={next}
            disabled={!selection.date || !selection.time}
            className="text-blue-600 font-bold disabled:opacity-30"
          >
            Siguiente &rarr;
          </button>
        )}
      </div>
    </div>
  );
}