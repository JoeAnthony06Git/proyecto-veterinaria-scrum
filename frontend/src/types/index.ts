// ─── Enums ──────────────────────────────────────────────

export type Role = 'TUTOR' | 'DOCTOR';
export type AppointmentStatus = 'PROGRAMADA' | 'EN_CURSO' | 'COMPLETADA' | 'CANCELADA';
export type UrgencyLevel = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type TriageStatus = 'PENDIENTE' | 'REVISADO' | 'ATENDIDO';
export type PrescriptionStatus = 'PENDIENTE' | 'INTERPRETADA';
export type OrderStatus = 'PENDIENTE' | 'CONFIRMADO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';

// ─── DTOs de respuesta ──────────────────────────────────

export interface UserDto {
  id: string;
  email: string;
  name: string;
  lastName: string;
  phone: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  user: UserDto;
}

export interface PetDto {
  id: string;
  nombre: string;    // Antes decía 'name'
  especie: string;   // Antes decía 'species'
  raza: string;      // Antes decía 'breed'
  sexo: string;
  pesoKg: number;    // Antes decía 'weightKg'
  tutorId: string;
}

export interface PetDetailDto extends PetDto {
  fechaNacimiento: string;
  color: string;
  vaccines: VaccineRecordDto[];
  consultations: ConsultationSummaryDto[];
}

export interface VaccineRecordDto {
  id: string;
  name: string;
  date: string;
  next: string;
  status: string;
}

export interface ConsultationSummaryDto {
  id: string;
  date: string;
  reason: string;
  doctor: string;
}

export interface AppointmentDto {
  id: string;
  pet: string;
  service: string;
  date: string;
  time: string;
  doctor: string;
  status: AppointmentStatus;
  reason?: string;
}

export interface ServiceDto {
  id: string;
  code: string;
  label: string;
  description: string;
}

export interface DoctorDto {
  id: string;
  name: string;
  specialty: string;
  rating: number;
}

export interface ProductDto {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export interface CartItemDto {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface TriageSubmitDto {
  petId: string;
  symptoms: string;
  duration: string;
  painLevel: string;
}

export interface PrescriptionDto {
  id: string;
  pet: string;
  owner: string;
  date: string;
  text: string;
  status: PrescriptionStatus;
}

export interface DoctorPrescriptionDetailDto {
  id: string;
  pet: string;
  owner: string;
  date: string;
  originalText: string;
  status: PrescriptionStatus;
  aiInterpretation: AiInterpretation | null;
}

export interface PrescriptionDetailDto {
  petName: string;
  date: string;
  status: string;
  originalText: string;
  aiInterpretation: AiInterpretation;
}

export interface AiInterpretation {
  medications: MedicationDto[];
  care: CareDto;
  warningSigns: string[];
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

export interface PatientDto {
  id: string;
  pet: string;
  species: string;
  breed: string;
  age: string;
  owner: string;
  lastVisit: string;
}

export interface PatientDetailDto {
  name: string;
  breed: string;
  sex: string;
  age: string;
  weight: string;
  owner: string;
  phone: string;
  history: MedicalHistoryDto[];
  vaccines: VaccineRecordDto[];
}

export interface MedicalHistoryDto {
  id: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
}

export interface DoctorDashboardDto {
  todayAppointments: number;
  patientCount: number;
  triageAlerts: number;
  emergencies: number;
  appointments: DoctorAppointmentDto[];
  alerts: TriageAlertDto[];
}

export interface DoctorAppointmentDto {
  id: string;
  petId: string;
  pet: string;
  owner: string;
  time: string;
  service: string;
  status: string;
  date?: string;
}

export interface TriageAlertDto {
  id: string;
  pet: string;
  owner: string;
  urgency: string;
  symptoms: string;
  time: string;
}

export interface ConsultationDetailDto {
  id: string;
  pet: string;
  petId: string;
  date: string;
  reason: string | null;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  doctor: string;
  prescriptions: PrescriptionSummaryDto[];
}

export interface PrescriptionSummaryDto {
  id: string;
  date: string;
  originalText: string;
  status: string;
  aiInterpretation: unknown;
}
