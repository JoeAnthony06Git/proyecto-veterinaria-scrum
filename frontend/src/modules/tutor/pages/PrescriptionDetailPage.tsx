export function PrescriptionDetailPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <a href="/tutor/pets/1" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Volver a perfil de mascota
      </a>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Receta Médica</h1>
            <p className="mt-1 text-sm text-gray-500">Prescripción para Max · 10 de Junio 2026</p>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Interpretada por IA</span>
        </div>

        {/* Original medical text */}
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase text-gray-500">Texto Original del Doctor</p>
          <p className="mt-2 text-sm text-gray-700 italic">
            "Rx: Amoxicilina 250mg PO c/8h x 7 días. Meloxicam 0.1mg/kg PO c/24h x 5 días. 
            Reposo relativo. Control en 7 días. Dieta blanda: pollo hervido con arroz."
          </p>
        </div>

        {/* AI Interpretation */}
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-800">Guía de Cuidados (Interpretación por IA)</h2>
          </div>

          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="font-medium text-blue-800">💊 Medicamento 1: Amoxicilina</h3>
              <div className="mt-2 space-y-1 text-sm text-blue-700">
                <p>• <strong>Dosis:</strong> 1 cápsula de 250mg cada 8 horas</p>
                <p>• <strong>Duración:</strong> 7 días completos (no suspender aunque mejore)</p>
                <p>• <strong>¿Cómo darle?</strong> Administrar con comida para evitar molestias estomacales</p>
                <p>• <strong>Efectos secundarios:</strong> Puede presentar diarrea leve o pérdida de apetito</p>
              </div>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h3 className="font-medium text-green-800">💊 Medicamento 2: Meloxicam</h3>
              <div className="mt-2 space-y-1 text-sm text-green-700">
                <p>• <strong>Dosis:</strong> 0.1mg por kg de peso (Max pesa 28kg → 2.8mg = 0.56ml de jarabe)</p>
                <p>• <strong>Frecuencia:</strong> Cada 24 horas, preferiblemente a la misma hora</p>
                <p>• <strong>Duración:</strong> 5 días</p>
                <p>• <strong>Precaución:</strong> No administrar con el estómago vacío</p>
              </div>
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <h3 className="font-medium text-yellow-800">🍽️ Cuidados y Recomendaciones</h3>
              <div className="mt-2 space-y-1 text-sm text-yellow-700">
                <p>• <strong>Dieta:</strong> Alimentación blanda — pollo hervido sin piel con arroz blanco, 3-4 porciones pequeñas al día</p>
                <p>• <strong>Actividad:</strong> Reposo relativo — evitar saltos, juegos bruscos y paseos largos</p>
                <p>• <strong>Hidratación:</strong> Asegurar que tome agua fresca constantemente</p>
                <p>• <strong>Control:</strong> Regresar a consulta en 7 días para reevaluación</p>
              </div>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="font-medium text-red-800">⚠️ Señales de Alerta</h3>
              <div className="mt-2 space-y-1 text-sm text-red-700">
                <p>• Si los vómitos o diarrea empeoran</p>
                <p>• Si nota dificultad para respirar, hinchazón facial o urticaria</p>
                <p>• Si la mascota deja de beber agua por más de 12 horas</p>
                <p className="font-medium">— Acudir de inmediato a la clínica veterinaria —</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-xs text-gray-400">
            Esta interpretación fue generada automáticamente por IA basada en la prescripción del médico.
            Siempre seguir las indicaciones del profesional veterinario.
          </p>
        </div>
      </div>
    </div>
  )
}
