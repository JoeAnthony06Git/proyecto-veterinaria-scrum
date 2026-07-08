import { Injectable } from '@nestjs/common';
import type { IAiService, AnamnesisAnalysis, AiInterpretation } from '../../../../domain/ports/out/ai/IAiService';

@Injectable()
export class OllamaAdapter implements IAiService {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'qwen2.5';
  }

  async analyzeTranscript(transcript: string, appointmentReason?: string): Promise<AnamnesisAnalysis> {
    const motivoCita = appointmentReason
      ? `El tutor escribió este motivo al agendar la cita: "${appointmentReason}"`
      : '';

    const prompt = `Eres un veterinario experto analizando consultas clínicas.

${motivoCita}
El doctor dictó durante la consulta:
"${transcript}"

Con esta información, genera un JSON con estos 4 campos, diferenciando CADA UNO claramente:

1. reason: La razón principal de consulta, SINTETIZADA en UNA frase corta y clara
   (ej: "dolor abdominal", "vómitos y diarrea", "cojera extremidad trasera", "control rutinario").
   Si el tutor escribió un texto largo, resúmelo a lo esencial.

2. symptoms: Manifestaciones subjetivas y signos que el tutor o doctor describen,
   separados por comas (ej: "vómitos, diarrea, anorexia, fiebre, dolor abdominal").

3. diagnosis: La enfermedad, síndrome o condición identificada
   (ej: "gastroenteritis aguda", "otitis externa bacteriana", "dermatitis atópica").

4. treatment: Las medidas terapéuticas, dieta, medicamentos y cuidados indicados
   (ej: "ayuno 12h, dieta blanda 48h, metoclopramida 1mg/kg c/8h x 5 días").

REGLAS IMPORTANTES:
- reason debe ser CORTO (máximo 6 palabras idealmente).
- Si no hay suficiente información para un campo, déjalo como cadena vacía.
- No inventes diagnósticos si el doctor no los mencionó explícitamente.
- Los síntomas deben listarse separados por comas, no como párrafo.

Responde SOLO con un JSON válido, sin explicaciones adicionales:
{"reason": "...", "symptoms": "...", "diagnosis": "...", "treatment": "..."}`;

    const data = await this.callOllama(prompt);
    return JSON.parse(data.response);
  }

  async interpretPrescription(text: string): Promise<AiInterpretation> {
    const prompt = `Eres un veterinario con 15 años de experiencia interpretando recetas médicas y generando recomendaciones profesionales.

El doctor escribió esta receta:
"${text}"

Con base en tu conocimiento veterinario, genera un JSON enriqueciendo la información:

1. medications: Array de medicamentos recetados. Si la receta NO menciona medicamentos, devuelve [].
   Para cada medicamento incluye: name, dosage, duration, administration, sideEffects.
   Si la receta no especifica algún detalle, usa valores razonables para ese tipo de medicamento.

2. care: Objeto con recomendaciones profesionales ENRIQUECIDAS (no te limites a copiar el texto):
   - diet: Si la receta menciona dieta, inclúyela y complétala. Si no, recomienda una alimentación 
     adecuada para la condición (ej: "Alimento balanceado de alta calidad, evitar comida casera. 
     Dividir en 3-4 porciones al día.")
   - activity: Recomendaciones de actividad según la condición
     (ej: "Paseos cortos 2-3 veces al día, evitar ejercicios intensos durante el tratamiento", 
     o "Reposo absoluto por 48h, luego actividad gradual")
   - hydration: "Agua fresca y limpia siempre disponible. Vigilar que beba lo suficiente."
   - followUp: Cuándo regresar a consulta y qué vigilar

3. warningSigns: Array de señales de alarma que el tutor debe vigilar, específicas para la 
   condición tratada o los medicamentos recetados.
   (ej: ["Vómitos persistentes", "Falta de apetito por más de 24h", "Decaimiento extremo"])

NO te limites a copiar el texto de la receta. APORTA VALOR con recomendaciones 
profesionales como lo haría un veterinario real. Piensa en qué más necesita 
saber el tutor para cuidar bien a su mascota.

Responde SOLO con un JSON válido, sin explicaciones adicionales:
{
  "medications": [{"name": "...", "dosage": "...", "duration": "...", "administration": "...", "sideEffects": "..."}],
  "care": {"diet": "...", "activity": "...", "hydration": "...", "followUp": "..."},
  "warningSigns": ["...", "..."]
}`;

    const data = await this.callOllama(prompt);
    return JSON.parse(data.response);
  }

  private async callOllama(prompt: string) {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false,
        format: 'json',
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}
