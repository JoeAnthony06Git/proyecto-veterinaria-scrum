import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { servicesApi, doctorsApi, appointmentsApi } from '../../../services/api';
import { usePetStore } from '../../../stores/petStore';

const stepLabels = ['Mascota', 'Servicio', 'Doctor', 'Fecha/Hora', 'Confirmar'];

export function NewAppointmentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const petIdFromUrl = searchParams.get('petId');
  
  const { pets, fetchPets } = usePetStore();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [selection, setSelection] = useState({
    petId: petIdFromUrl || '',
    serviceId: '',
    doctorId: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    const loadAll = async () => {
      setLoadingData(true);
      try {
        await fetchPets();
        const [resS, resD] = await Promise.all([servicesApi.list(), doctorsApi.list()]);
        setServices(resS.data || []);
        setDoctors(resD.data || []);
      } catch (e) { console.error(e); }
      finally { setLoadingData(false); }
    };
    loadAll();
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
    } catch (err) { alert('Error al agendar cita'); }
  };

  if (loadingData) return <div className="p-20 text-center">Cargando datos de agenda...</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Nueva Cita</h1>

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${i + 1 <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-sm hidden sm:inline ${i + 1 <= step ? 'font-medium text-blue-600' : 'text-gray-400'}`}>{label}</span>
            {i < stepLabels.length - 1 && <div className={`mx-2 h-px w-8 bg-gray-200`} />}
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">1. Selecciona tu mascota</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {pets.map((p) => (
                <button key={p.id} onClick={() => setSelection({ ...selection, petId: p.id })}
                  className={`p-4 border rounded-xl text-left ${selection.petId === p.id ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <p className="font-bold">{p.nombre || 'Sin nombre'}</p>
                  <p className="text-xs text-gray-500">{p.raza}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">2. Selecciona un Servicio</h2>
            {services.length === 0 ? (
               <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">No hay servicios en la DB. Necesitas ejecutar un Seed.</div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <button key={s.id} onClick={() => setSelection({ ...selection, serviceId: s.id })}
                    className={`p-4 border rounded-xl text-left ${selection.serviceId === s.id ? 'border-blue-500 bg-blue-50' : ''}`}>
                    <p className="font-bold">{s.label}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">3. Selecciona un Doctor</h2>
            <div className="space-y-3">
              {doctors.map((d) => (
                <button key={d.id} onClick={() => setSelection({ ...selection, doctorId: d.id })}
                  className={`flex w-full items-center gap-4 border p-4 rounded-xl ${selection.doctorId === d.id ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">{d.name?.[0] || 'D'}</div>
                  <div className="text-left"><p className="font-bold">{d.name}</p><p className="text-xs text-gray-500">{d.specialty || 'Veterinario'}</p></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">4. Fecha y Hora</h2>
            <input type="date" className="w-full border p-3 rounded-xl" onChange={(e) => setSelection({ ...selection, date: e.target.value })} />
            <div className="grid grid-cols-4 gap-2">
              {['09:00', '10:00', '11:00', '15:00'].map(t => (
                <button key={t} onClick={() => setSelection({ ...selection, time: t })} className={`p-2 border rounded-lg ${selection.time === t ? 'bg-blue-600 text-white' : ''}`}>{t}</button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">5. Confirmar</h2>
            <div className="p-4 bg-gray-50 rounded-xl border border-dashed text-sm">
              <p><strong>Mascota:</strong> {pets.find(p => p.id === selection.petId)?.nombre}</p>
              <p><strong>Servicio:</strong> {services.find(s => s.id === selection.serviceId)?.label}</p>
              <p><strong>Fecha:</strong> {selection.date} - {selection.time}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button onClick={() => setStep(step - 1)} disabled={step === 1} className="px-6 py-2 border rounded-lg disabled:opacity-30">Anterior</button>
        {step < 5 ? (
          <button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-30">Siguiente</button>
        ) : (
          <button onClick={handleFinish} className="px-6 py-2 bg-green-600 text-white rounded-lg">Finalizar</button>
        )}
      </div>
    </div>
  );
}
