import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doctorApi } from '../../../services/api';

interface AppointmentDetail {
  id: string;
  petId: string;
  date: string;
  time: string;
  status: string;
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string;
    sex: string;
    birthDate: string;
    weightKg: number;
    color: string;
  };
  tutor: { name: string; lastName: string; phone: string };
  service: { label: string; description: string };
  reason?: string;
}

export function DoctorConsultationPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [anamnesis, setAnamnesis] = useState({ reason: '', symptoms: '', diagnosis: '', treatment: '' });
  const [anamnesisSaved, setAnamnesisSaved] = useState(false);
  const [anamnesisId, setAnamnesisId] = useState<string | null>(null);
  const [savingAnamnesis, setSavingAnamnesis] = useState(false);

  const [prescriptionText, setPrescriptionText] = useState('');
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);
  const [prescriptionId, setPrescriptionId] = useState<string | null>(null);
  const [savingPrescription, setSavingPrescription] = useState(false);
  const [interpretingPrescription, setInterpretingPrescription] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [emailHtml, setEmailHtml] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [loadingEmailHtml, setLoadingEmailHtml] = useState(false);

  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [analyzingTranscript, setAnalyzingTranscript] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!appointmentId) return;
    doctorApi.appointmentById(appointmentId)
      .then((res: any) => {
        const data = res.data;
        setAppointment({
          id: data.id,
          petId: data.petId,
          date: data.date?.split('T')[0] || data.date,
          time: data.time,
          status: data.status,
          pet: data.pet,
          tutor: data.tutor,
          service: data.service,
          reason: data.reason,
        });
      })
      .catch(() => setAppointment(null))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const handleSaveAnamnesis = async () => {
    if (!appointment) return;
    setSavingAnamnesis(true);
    try {
      const res = await doctorApi.createConsultation({
        petId: appointment.petId,
        reason: anamnesis.reason || appointment.service.label,
        symptoms: anamnesis.symptoms,
        diagnosis: anamnesis.diagnosis,
        treatment: anamnesis.treatment,
      });
      setAnamnesisId((res.data as any).id);
      setAnamnesisSaved(true);
    } catch {
      alert('Error al guardar la anamnesis');
    } finally {
      setSavingAnamnesis(false);
    }
  };

  const handleSavePrescription = async () => {
    if (!appointment || !anamnesisId) return;
    setSavingPrescription(true);
    try {
      const res = await doctorApi.createPrescription({
        petId: appointment.petId,
        medicalRecordId: anamnesisId,
        originalText: prescriptionText,
      });
      const data = res.data as any;
      setPrescriptionId(data.id);
      setPrescriptionSaved(true);
      setEmailStatus(data.emailStatus);
    } catch {
      alert('Error al guardar la receta');
    } finally {
      setSavingPrescription(false);
    }
  };

  const handleShowEmailContent = async () => {
    if (!prescriptionId) return;
    setLoadingEmailHtml(true);
    try {
      const res = await doctorApi.getPrescriptionEmailHtml(prescriptionId);
      setEmailHtml(res.data.html);
      setShowEmailModal(true);
    } catch {
      alert('Error al obtener el contenido del correo');
    } finally {
      setLoadingEmailHtml(false);
    }
  };

  const handleInterpretPrescription = async () => {
    if (!prescriptionId) return;
    setInterpretingPrescription(true);
    try {
      await doctorApi.interpretPrescription(prescriptionId);
      alert('Receta interpretada con IA exitosamente. Ve a la sección de Recetas para ver el detalle.');
    } catch {
      alert('Error al interpretar la receta. Verifica que Ollama esté corriendo.');
    } finally {
      setInterpretingPrescription(false);
    }
  };

  const handleFinalize = async () => {
    if (!appointmentId) return;
    try {
      await doctorApi.updateAppointmentStatus(appointmentId, 'COMPLETADA');
      navigate('/doctor/appointments');
    } catch {
      alert('Error al finalizar la consulta');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-PE';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setVoiceTranscript(prev => (prev ? prev + ' ' : '') + finalTranscript.trim());
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);
      if (event.error === 'not-allowed') {
        alert('Permiso de micrófono denegado. Permite el acceso al micrófono en la configuración de tu navegador.');
      } else if (event.error === 'no-speech') {
        alert('No se detectó voz. Intenta hablar más alto o verifica tu micrófono.');
      } else if (event.error === 'audio-capture') {
        alert('No se encontró un micrófono. Conecta uno e intenta de nuevo.');
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
      alert('Error al iniciar el micrófono. Verifica los permisos del navegador.');
    }
  };

  const handleAnalyzeTranscript = async () => {
    if (!voiceTranscript.trim()) return;
    setAnalyzingTranscript(true);
    try {
      const res = await doctorApi.analyzeTranscript(voiceTranscript, appointment?.reason);
      const analysis = res.data;
      setAnamnesis(prev => ({
        ...prev,
        reason: analysis.reason || prev.reason,
        symptoms: analysis.symptoms || prev.symptoms,
        diagnosis: analysis.diagnosis || prev.diagnosis,
        treatment: analysis.treatment || prev.treatment,
      }));
      setVoiceModalOpen(false);
      setVoiceTranscript('');
    } catch {
      const lines = voiceTranscript.split('\n').filter(Boolean);
      let symptoms = '', diagnosis = '', treatment = '';
      let currentSection = '';
      for (const line of lines) {
        const lower = line.toLowerCase();
        if (lower.includes('síntoma') || lower.includes('sintoma')) { currentSection = 'symptoms'; continue; }
        if (lower.includes('diagnóstico') || lower.includes('diagnostico')) { currentSection = 'diagnosis'; continue; }
        if (lower.includes('tratamiento')) { currentSection = 'treatment'; continue; }
        if (currentSection === 'symptoms') symptoms += (symptoms ? '\n' : '') + line;
        if (currentSection === 'diagnosis') diagnosis += (diagnosis ? '\n' : '') + line;
        if (currentSection === 'treatment') treatment += (treatment ? '\n' : '') + line;
      }
      setAnamnesis(prev => ({
        ...prev,
        symptoms: symptoms || prev.symptoms,
        diagnosis: diagnosis || prev.diagnosis,
        treatment: treatment || prev.treatment,
      }));
      setVoiceModalOpen(false);
      setVoiceTranscript('');
    } finally {
      setAnalyzingTranscript(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando consulta...</div>;
  if (!appointment) return <div className="p-10 text-center text-red-500">Cita no encontrada.</div>;

  const edad = new Date().getFullYear() - new Date(appointment.pet.birthDate).getFullYear();

  return (
    <div className="space-y-6">
      <Link to="/doctor/appointments" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Volver a citas
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Atención de Consulta</h1>
          <p className="mt-1 text-sm text-gray-500">{appointment.date} · {appointment.time} · {appointment.service.label}</p>
        </div>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700 uppercase">En curso</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <span className="text-3xl font-bold text-blue-600">{appointment.pet.name[0].toUpperCase()}</span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-800">{appointment.pet.name}</h2>
              <p className="text-sm text-gray-500">{appointment.pet.breed}</p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Especie:</span><span className="font-medium text-gray-800">{appointment.pet.species}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Sexo:</span><span className="font-medium text-gray-800">{appointment.pet.sex}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Edad:</span><span className="font-medium text-gray-800">{edad} años</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Peso:</span><span className="font-medium text-gray-800">{appointment.pet.weightKg} kg</span></div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between"><span className="text-gray-500">Tutor:</span><span className="font-medium text-gray-800">{appointment.tutor.name} {appointment.tutor.lastName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Teléfono:</span><span className="font-medium text-gray-800">{appointment.tutor.phone}</span></div>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between"><span className="text-gray-500">Motivo:</span><span className="font-medium text-gray-800 text-right max-w-[60%]">{appointment.service.description || appointment.service.label}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Anamnesis</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setVoiceModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  Anamnesis por Voz
                </button>
                {anamnesisSaved && <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">Guardado</span>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Motivo</label>
                <input
                  type="text"
                  value={anamnesis.reason}
                  onChange={e => setAnamnesis({ ...anamnesis, reason: e.target.value })}
                  placeholder={appointment.service.label}
                  disabled={anamnesisSaved}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Síntomas</label>
                <textarea
                  rows={3}
                  value={anamnesis.symptoms}
                  onChange={e => setAnamnesis({ ...anamnesis, symptoms: e.target.value })}
                  placeholder="Describe los síntomas del paciente..."
                  disabled={anamnesisSaved}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnóstico</label>
                <textarea
                  rows={2}
                  value={anamnesis.diagnosis}
                  onChange={e => setAnamnesis({ ...anamnesis, diagnosis: e.target.value })}
                  placeholder="Diagnóstico presuntivo o definitivo..."
                  disabled={anamnesisSaved}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
                <textarea
                  rows={2}
                  value={anamnesis.treatment}
                  onChange={e => setAnamnesis({ ...anamnesis, treatment: e.target.value })}
                  placeholder="Tratamiento indicado..."
                  disabled={anamnesisSaved}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                  required
                />
              </div>
              {!anamnesisSaved && (
                <button
                  onClick={handleSaveAnamnesis}
                  disabled={savingAnamnesis || !anamnesis.symptoms || !anamnesis.diagnosis || !anamnesis.treatment}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingAnamnesis ? 'Guardando...' : 'Guardar Anamnesis'}
                </button>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Receta Médica</h2>
              {prescriptionSaved && <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">Guardado</span>}
            </div>

            {!anamnesisSaved ? (
              <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-700">
                Primero debes guardar la anamnesis para poder crear una receta.
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Texto de la receta</label>
                  <textarea
                    rows={5}
                    value={prescriptionText}
                    onChange={e => setPrescriptionText(e.target.value)}
                    placeholder="Ej: Rx: Amoxicilina 250mg PO c/8h x 7 días..."
                    disabled={prescriptionSaved}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                    required
                  />
                </div>
                {!prescriptionSaved ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSavePrescription}
                      disabled={savingPrescription || !prescriptionText}
                      className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {savingPrescription ? 'Guardando...' : 'Guardar Receta'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleInterpretPrescription}
                      disabled={interpretingPrescription}
                      className="rounded-lg border border-purple-300 px-6 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50"
                    >
                      {interpretingPrescription ? 'Interpretando...' : 'Interpretar con IA'}
                    </button>
                    <Link
                      to={`/doctor/prescriptions/${prescriptionId}/preview`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 px-6 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Ver / Imprimir Receta
                    </Link>
                  </div>
                )}
                {emailStatus && (
                  <div className="mt-3 space-y-2">
                    <div className={`text-xs flex items-center gap-1.5 ${emailStatus === 'enviado' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {emailStatus === 'enviado' ? (
                        <><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Receta enviada al tutor por correo</>
                      ) : (
                        <><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" /></svg>No se pudo enviar el correo automáticamente</>
                      )}
                    </div>
                    {emailStatus !== 'enviado' && (
                      <button
                        onClick={handleShowEmailContent}
                        disabled={loadingEmailHtml}
                        className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                      >
                        {loadingEmailHtml ? 'Cargando...' : 'Ver contenido del correo y copiar manualmente'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleFinalize}
              disabled={!anamnesisSaved}
              className="rounded-lg bg-green-600 px-8 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
            >
              Finalizar Consulta
            </button>
          </div>
        </div>
      </div>

      {showEmailModal && emailHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Contenido del correo</h2>
              <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              No se pudo enviar automáticamente. Copia este contenido y pégalo en un correo, WhatsApp, etc.
            </p>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => { navigator.clipboard.writeText(emailHtml); alert('Contenido copiado al portapapeles'); }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Copiar HTML
              </button>
            </div>
            <div className="flex-1 overflow-auto border rounded-lg p-4 bg-gray-50">
              <iframe
                srcDoc={emailHtml}
                title="Vista previa del correo"
                className="w-full h-full min-h-[400px] bg-white"
                sandbox=""
              />
            </div>
          </div>
        </div>
      )}

      {voiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Anamnesis por Voz</h2>
              <button onClick={() => { setVoiceModalOpen(false); setVoiceTranscript(''); setIsRecording(false); recognitionRef.current?.stop(); }} className="text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Grabación</h3>
                <div className={`flex flex-col items-center justify-center rounded-lg border-2 p-8 transition-colors ${isRecording ? 'border-red-400 bg-red-50' : 'border-dashed border-gray-300 bg-gray-50'}`}>
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full transition-colors ${isRecording ? 'bg-red-200 animate-pulse' : 'bg-red-100'}`}>
                    <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-700">
                    {isRecording ? 'Grabando... Habla claro' : 'Presiona para grabar'}
                  </p>
                  <p className="text-xs text-gray-500">Reconocimiento de voz en vivo</p>
                  <button
                    onClick={toggleRecording}
                    className={`mt-4 rounded-full px-8 py-3 text-sm font-semibold text-white transition-colors ${isRecording ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {isRecording ? 'Detener Grabación' : 'Comenzar Grabación'}
                  </button>
                </div>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700">
                  <p className="font-medium">Reconocimiento de Voz (Navegador)</p>
                  <p className="mt-1 text-blue-600">La transcripción se procesa localmente en tu navegador. El texto se enviará al servidor para análisis inteligente.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Transcripción</h3>
                <textarea
                  rows={8}
                  value={voiceTranscript}
                  onChange={e => setVoiceTranscript(e.target.value)}
                  placeholder="Habla y el texto aparecerá aquí. También puedes escribir manualmente."
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAnalyzeTranscript}
                    disabled={!voiceTranscript.trim() || analyzingTranscript}
                    className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {analyzingTranscript ? 'Analizando con IA...' : 'Aplicar a Anamnesis'}
                  </button>
                  <button
                    onClick={() => { setVoiceModalOpen(false); setVoiceTranscript(''); setIsRecording(false); recognitionRef.current?.stop(); }}
                    className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
