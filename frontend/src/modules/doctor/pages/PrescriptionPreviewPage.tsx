import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorApi } from '../../../services/api';
import type { DoctorPrescriptionDetailDto } from '../../../types';

export function PrescriptionPreviewPage() {
  const { id } = useParams();
  const [data, setData] = useState<DoctorPrescriptionDetailDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    doctorApi.getPrescriptionPreview(id)
      .then(res => setData(res.data as any))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Cargando receta...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Receta no encontrada.</div>
      </div>
    );
  }

  const ai = data.aiInterpretation as any;

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none min-h-screen print:min-h-0">
        <div className="no-print flex items-center justify-between px-6 py-3 border-b print:hidden">
          <Link to="/doctor/appointments" className="text-sm text-blue-600 hover:underline">
            &larr; Volver
          </Link>
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Imprimir / Guardar PDF
          </button>
        </div>

        <div className="px-8 py-6" style={{ fontFamily: 'Arial, sans-serif' }}>
          <div className="text-center mb-6">
            <h1 style={{ color: '#1e3a5f', fontSize: 22, fontWeight: 'bold', margin: 0 }}>
              Mi Veterinaria
            </h1>
            <p style={{ color: '#6b7280', fontSize: 11, margin: '2px 0' }}>
              Av. Urdesa Central 503, Guayaquil | Tel: 0931-345-520
            </p>
            <hr style={{ border: 'none', borderTop: '2px solid #2563eb', margin: '8px 0' }} />
            <h2 style={{ color: '#1e3a5f', fontSize: 16, margin: '4px 0' }}>RECETA MÉDICA</h2>
            <hr style={{ border: 'none', borderTop: '2px solid #2563eb', margin: '8px 0' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>
            <span>N°: {data.id.slice(0, 8).toUpperCase()}</span>
            <span>Fecha: {new Date(data.date).toLocaleDateString('es-PE')}</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
            <tr>
              <td style={{ background: '#eff6ff', padding: 10, borderRadius: 4, verticalAlign: 'top', width: '48%' }}>
                <p style={{ margin: '0 0 2px', fontSize: 10, color: '#2563eb', fontWeight: 'bold' }}>MÉDICO TRATANTE</p>
                <p style={{ margin: 0, fontSize: 13, color: '#111827' }}>{data.doctorName}</p>
              </td>
              <td style={{ width: 8 }}></td>
              <td style={{ background: '#ecfdf5', padding: 10, borderRadius: 4, verticalAlign: 'top', width: '48%' }}>
                <p style={{ margin: '0 0 2px', fontSize: 10, color: '#059669', fontWeight: 'bold' }}>PACIENTE</p>
                <p style={{ margin: 0, fontSize: 13, color: '#111827' }}>{data.pet}</p>
              </td>
            </tr>
          </table>

          <h3 style={{ color: '#1e3a5f', fontSize: 13, margin: '12px 0 4px', borderBottom: '1px solid #e5e7eb', paddingBottom: 4 }}>RECETA</h3>
          <div style={{ background: '#f9fafb', padding: 10, borderRadius: 4, fontSize: 12, color: '#111827', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
            {data.originalText}
          </div>

          {ai?.medications?.length ? (
            <>
              <h3 style={{ color: '#1e3a5f', fontSize: 13, margin: '12px 0 4px', borderBottom: '1px solid #e5e7eb', paddingBottom: 4 }}>MEDICAMENTOS</h3>
              <div style={{ fontSize: 12 }}>
                {ai.medications.map((m: any, i: number) => (
                  <p key={i} style={{ margin: '2px 0' }}>
                    &bull; <strong>{m.name}</strong> &mdash; {m.dosage} &mdash; {m.administration}{m.duration ? ` &mdash; ${m.duration}` : ''}
                  </p>
                ))}
              </div>
            </>
          ) : null}

          {ai?.care ? (
            <>
              <h3 style={{ color: '#1e3a5f', fontSize: 13, margin: '12px 0 4px', borderBottom: '1px solid #e5e7eb', paddingBottom: 4 }}>CUIDADOS</h3>
              <div style={{ fontSize: 12 }}>
                {ai.care.diet ? <p style={{ margin: '2px 0' }}>&bull; Alimentación: {ai.care.diet}</p> : null}
                {ai.care.hydration ? <p style={{ margin: '2px 0' }}>&bull; Hidratación: {ai.care.hydration}</p> : null}
                {ai.care.activity ? <p style={{ margin: '2px 0' }}>&bull; Actividad: {ai.care.activity}</p> : null}
                {ai.care.followUp ? <p style={{ margin: '2px 0' }}>&bull; Seguimiento: {ai.care.followUp}</p> : null}
              </div>
            </>
          ) : null}

          {ai?.warningSigns?.length ? (
            <>
              <h3 style={{ color: '#dc2626', fontSize: 13, margin: '12px 0 4px', borderBottom: '1px solid #fca5a5', paddingBottom: 4 }}>SEÑALES DE ALERTA</h3>
              <div style={{ fontSize: 12, color: '#dc2626' }}>
                {ai.warningSigns.map((s: string, i: number) => (
                  <p key={i} style={{ margin: '2px 0' }}>⚠ {s}</p>
                ))}
              </div>
            </>
          ) : null}

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <hr style={{ border: 'none', borderTop: '1.5px solid #2563eb', width: '60%', margin: '0 auto 6px' }} />
            <p style={{ fontSize: 12, color: '#1e3a5f', fontWeight: 'bold', margin: 0 }}>{data.doctorName}</p>
            <p style={{ fontSize: 10, color: '#6b7280', margin: '2px 0' }}>Firma del médico tratante</p>
          </div>
        </div>
      </div>
    </div>
  );
}
