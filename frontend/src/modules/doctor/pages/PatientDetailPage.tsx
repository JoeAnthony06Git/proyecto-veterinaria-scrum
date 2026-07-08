import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doctorApi } from '../../../services/api';
import type { PatientDetailDto, MedicalHistoryDto, VaccineRecordDto } from '../../../types';

export function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientDetailDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    doctorApi.patientById(id)
      .then(res => setPatient(res.data))
      .catch(() => setPatient(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-center">Cargando paciente...</div>;
  if (!patient) return <div className="p-10 text-center text-red-500">Paciente no encontrado.</div>;

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  return (
    <div className="space-y-6">
      <Link to="/doctor/patients" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Volver a pacientes
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <span className="text-3xl font-bold text-blue-600">
                  {patient.name ? patient.name[0].toUpperCase() : 'P'}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-800">{patient.name}</h2>
              <p className="text-sm text-gray-500">{patient.breed}</p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Sexo:</span><span className="font-medium text-gray-800">{patient.sex}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Edad:</span><span className="font-medium text-gray-800">{patient.age}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Peso:</span><span className="font-medium text-gray-800">{patient.weight}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tutor:</span><span className="font-medium text-gray-800">{patient.owner}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Teléfono:</span><span className="font-medium text-gray-800">{patient.phone}</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigate('/doctor/appointments')}
                className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Ir a Citas
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Historial Clínico</h2>
            {patient.history.length === 0 ? (
              <p className="text-sm text-gray-400">No hay consultas registradas.</p>
            ) : (
              <div className="space-y-4">
                {patient.history.map((c: MedicalHistoryDto) => (
                  <div key={c.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">{formatDate(c.date)}</span>
                      <span className="max-w-[50%] truncate rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{c.diagnosis}</span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><span className="text-gray-500">Síntomas:</span> {c.symptoms}</p>
                      <p><span className="text-gray-500">Tratamiento:</span> {c.treatment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Cartilla de Vacunación</h2>
            {patient.vaccines.length === 0 ? (
              <p className="text-sm text-gray-400">No hay vacunas registradas.</p>
            ) : (
              <div className="space-y-3">
                {patient.vaccines.map((v: VaccineRecordDto) => (
                  <div key={v.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-gray-800">{v.name}</p>
                      <p className="text-xs text-gray-500">Última: {formatDate(v.date)} · Próxima: {formatDate(v.next)}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      v.status === 'Completa' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
