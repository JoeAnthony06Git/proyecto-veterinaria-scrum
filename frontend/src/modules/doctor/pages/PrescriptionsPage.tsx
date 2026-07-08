import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorApi } from '../../../services/api';
import type { PrescriptionDto, DoctorPrescriptionDetailDto } from '../../../types';

export function PrescriptionsPage() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState<DoctorPrescriptionDetailDto | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await doctorApi.listPrescriptions();
      setPrescriptions(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const openDetail = async (p: PrescriptionDto) => {
    setShowModal(true);
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await doctorApi.getPrescription(p.id);
      setDetail(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleInterpret = async () => {
    if (!detail) return;
    setDetailLoading(true);
    try {
      const res = await doctorApi.interpretPrescription(detail.id);
      setDetail(res.data);
      fetchPrescriptions();
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Recetas Médicas</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona las prescripciones de tus pacientes</p>
        </div>
        <button
          onClick={() => navigate('/doctor/appointments')}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + Nueva Receta
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-center text-sm text-gray-400">Cargando recetas...</div>
        ) : prescriptions.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">No hay recetas registradas.</div>
        ) : (
          <div className="space-y-1 p-2">
            {prescriptions.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => openDetail(r)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">{r.pet}</h3>
                      <span className="text-sm text-gray-500">· {new Date(r.date).toLocaleDateString()}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        r.status === 'INTERPRETADA' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {r.status === 'INTERPRETADA' ? 'Interpretada' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{r.text}</p>
                    <p className="mt-1 text-xs text-gray-400">Tutor: {r.owner}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); openDetail(r); }}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Detalle de Receta</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            {detailLoading ? (
              <div className="p-8 text-center text-sm text-gray-400">Cargando...</div>
            ) : detail ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Mascota</p>
                    <p className="font-medium text-gray-800">{detail.pet}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tutor</p>
                    <p className="font-medium text-gray-800">{detail.owner}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fecha</p>
                    <p className="font-medium text-gray-800">{new Date(detail.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Estado</p>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      detail.status === 'INTERPRETADA' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {detail.status === 'INTERPRETADA' ? 'Interpretada' : 'Pendiente'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Texto de la receta</p>
                  <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-wrap">{detail.originalText}</div>
                </div>

                {detail.aiInterpretation ? (
                  <div className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-4">
                    <h3 className="font-semibold text-green-800">Interpretación con IA</h3>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Medicamentos</p>
                      <div className="space-y-2">
                        {detail.aiInterpretation.medications.map((m, i) => (
                          <div key={i} className="rounded-lg bg-white p-3 text-sm">
                            <p className="font-medium">{m.name}</p>
                            <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600">
                              <span>Dosis: {m.dosage}</span>
                              <span>Duración: {m.duration}</span>
                              <span>Administración: {m.administration}</span>
                              <span>Efectos: {m.sideEffects}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Cuidados</p>
                      <div className="rounded-lg bg-white p-3 text-sm text-gray-600 space-y-1">
                        <p>Dieta: {detail.aiInterpretation.care.diet}</p>
                        <p>Actividad: {detail.aiInterpretation.care.activity}</p>
                        <p>Hidratación: {detail.aiInterpretation.care.hydration}</p>
                        <p>Seguimiento: {detail.aiInterpretation.care.followUp}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Signos de Alarma</p>
                      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                        {detail.aiInterpretation.warningSigns.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleInterpret}
                    className="w-full rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
                  >
                    Interpretar con IA
                  </button>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-red-500">Error al cargar la receta.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
