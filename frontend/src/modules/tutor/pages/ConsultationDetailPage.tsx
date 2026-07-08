import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tutorApi } from '../../../services/api';
import type { ConsultationDetailDto } from '../../../types';

export function ConsultationDetailPage() {
  const { id } = useParams();
  const [consultation, setConsultation] = useState<ConsultationDetailDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    tutorApi.getConsultation(id)
      .then(res => setConsultation(res.data))
      .catch(() => setConsultation(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-center">Cargando consulta...</div>;
  if (!consultation) return <div className="p-10 text-center text-red-500">Consulta no encontrada.</div>;

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to={`/tutor/pets/${consultation.petId}`} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Volver a perfil de {consultation.pet}
      </Link>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Detalle de Consulta</h1>
          <p className="mt-1 text-sm text-gray-500">
            {consultation.pet} · {formatDate(consultation.date)} · Dr. {consultation.doctor}
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Diagnóstico</h2>
            <div className="mt-3 space-y-3">
              <div className="rounded-lg border p-4">
                <p className="text-xs font-medium uppercase text-gray-500">Motivo</p>
                <p className="mt-1 text-sm text-gray-800">{consultation.reason || 'No especificado'}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs font-medium uppercase text-gray-500">Síntomas</p>
                <p className="mt-1 text-sm text-gray-800">{consultation.symptoms}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs font-medium uppercase text-gray-500">Diagnóstico</p>
                <p className="mt-1 text-sm text-gray-800">{consultation.diagnosis}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs font-medium uppercase text-gray-500">Tratamiento</p>
                <p className="mt-1 text-sm text-gray-800">{consultation.treatment}</p>
              </div>
            </div>
          </div>

          {consultation.prescriptions.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Receta Médica</h2>
              {consultation.prescriptions.map((rx) => (
                <div key={rx.id} className="mt-3 space-y-4">
                  <div className="rounded-lg bg-gray-50 border p-4">
                    <p className="text-xs font-medium uppercase text-gray-500">Indicaciones del Doctor</p>
                    <p className="mt-2 text-sm text-gray-700 italic">{rx.originalText}</p>
                  </div>

                  {(rx.aiInterpretation as any) && (
                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">Interpretada por IA</span>
                      </div>

                      {(rx.aiInterpretation as any).medications?.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium uppercase text-gray-500">Medicamentos</p>
                          {(rx.aiInterpretation as any).medications.map((m: any, i: number) => (
                            <div key={i} className="rounded-lg border bg-white p-3">
                              <p className="font-medium text-gray-800">{m.name}</p>
                              <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <span>Dosis: {m.dosage}</span>
                                <span>Duración: {m.duration}</span>
                                <span>Vía: {m.administration}</span>
                                <span>Efectos: {m.sideEffects}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {(rx.aiInterpretation as any).care && (
                        <div className="mt-3">
                          <p className="text-xs font-medium uppercase text-gray-500">Cuidados</p>
                          <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                            <div className="rounded-lg border bg-white p-3">
                              <p className="font-medium text-gray-700">Dieta</p>
                              <p className="text-xs text-gray-600">{(rx.aiInterpretation as any).care.diet}</p>
                            </div>
                            <div className="rounded-lg border bg-white p-3">
                              <p className="font-medium text-gray-700">Actividad</p>
                              <p className="text-xs text-gray-600">{(rx.aiInterpretation as any).care.activity}</p>
                            </div>
                            <div className="rounded-lg border bg-white p-3">
                              <p className="font-medium text-gray-700">Hidratación</p>
                              <p className="text-xs text-gray-600">{(rx.aiInterpretation as any).care.hydration}</p>
                            </div>
                            <div className="rounded-lg border bg-white p-3">
                              <p className="font-medium text-gray-700">Seguimiento</p>
                              <p className="text-xs text-gray-600">{(rx.aiInterpretation as any).care.followUp}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {(rx.aiInterpretation as any).warningSigns?.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium uppercase text-red-500">Señales de Alarma</p>
                          <ul className="mt-1 space-y-1">
                            {(rx.aiInterpretation as any).warningSigns.map((s: string, i: number) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-red-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {consultation.prescriptions.length === 0 && (
            <div className="rounded-lg border-2 border-dashed p-6 text-center text-sm text-gray-400">
              No se recetaron medicamentos en esta consulta.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}