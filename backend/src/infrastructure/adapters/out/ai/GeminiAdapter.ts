import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { IAiService, AnamnesisAnalysis, AiInterpretation } from '../../../../domain/ports/out/ai/IAiService';

@Injectable()
export class GeminiAdapter implements IAiService {
  private model;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY no configurada');
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async analyzeTranscript(transcript: string, appointmentReason?: string): Promise<AnamnesisAnalysis> {
    const motivoCita = appointmentReason
      ? `El tutor escribió este motivo al agendar la cita: "${appointmentReason}"`
      : '';

    const prompt = `Eres un veterinario experto analizando consultas clínicas.

${motivoCita}
El doctor dictó durante la consulta:
"${transcript}"

Con esta información, genera un JSON con estos 4 campos:

1. reason: Es el MOTIVO DE CONSULTA, la razón principal por la cual el tutor
   acude al veterinario. Redáctalo como una frase corta usando las palabras
   del tutor. Ejemplo: "Vómitos y diarrea desde hace tres días"

2. symptoms: Son los SÍNTOMAS Y SIGNOS, manifestaciones subjetivas que el tutor
   describe y signos objetivos observados por el doctor. Deben listarse
   separados por comas, en formato de lista.
   Ejemplo: "vómitos biliosos, diarrea líquida con moco, anorexia, decaimiento"

3. diagnosis: Es el DIAGNÓSTICO, la condición, enfermedad o síndrome identificado
   tras analizar los síntomas. Si el doctor no lo mencionó explícitamente,
   INFIERE el diagnóstico más probable basado en los hallazgos descritos.
   Ejemplo: "Gastroenteritis aguda de probable etiología infecciosa"

4. treatment: Es el TRATAMIENTO o plan terapéutico GENERAL indicado para la
   condición. Debe ser una orientación a NIVEL ALTO: tipo de medicación,
   cuidados generales, dieta, cambios de ambiente, etc. SIN DOSIS EXACTAS
   ni nombres comerciales específicos (eso va en la receta médica aparte).
   Ejemplo: "Antibiótico de amplio espectro, antiinflamatorio, ayuno 12h,
   dieta blanda, control en 5 días"

REGLAS IMPORTANTES (prioridad máxima):
- TODOS los campos son OBLIGATORIOS. NUNCA dejes ninguno vacío.
- Si no hay suficiente información para diagnosis, INFIERE el diagnóstico más
  probable según los síntomas (usa tu conocimiento veterinario).
- Siempre propón un tratamiento de primera línea acorde al diagnóstico inferido.
- treatment debe ser GENERAL. Sin dosis exactas ni nombres específicos.
- symptoms debe ser una lista separada por comas, no un párrafo.
- reason debe ser UNA frase corta (máx 15 palabras).
- No inventes información que contradiga directamente lo dicho por el doctor,
  pero SÍ puedes completar con tu criterio profesional veterinario.

Responde SOLO con un JSON válido, sin explicaciones adicionales:
{"reason": "...", "symptoms": "...", "diagnosis": "...", "treatment": "..."}`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(this.stripMarkdown(text));
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

    const result = await this.model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(this.stripMarkdown(responseText));
  }

  private stripMarkdown(text: string): string {
    return text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^`|`$/g, '')
      .trim();
  }
}
