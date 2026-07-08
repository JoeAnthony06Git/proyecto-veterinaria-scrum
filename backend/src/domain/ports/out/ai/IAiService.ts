export interface AnamnesisAnalysis {
  reason: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
}

export interface MedicationDto {
  name: string;
  dosage: string;
  duration: string;
  administration: string;
  sideEffects: string;
}

export interface CareDto {
  diet: string;
  activity: string;
  hydration: string;
  followUp: string;
}

export interface AiInterpretation {
  medications: MedicationDto[];
  care: CareDto;
  warningSigns: string[];
}

export interface IAiService {
  analyzeTranscript(transcript: string, appointmentReason?: string): Promise<AnamnesisAnalysis>;
  interpretPrescription(text: string): Promise<AiInterpretation>;
}
