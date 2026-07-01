import { MedicalRecord } from '@prisma/client';

export interface IConsultationRepository {
  save(data: {
    petId: string;
    doctorId: string;
    reason?: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    transcribedText?: string;
  }): Promise<MedicalRecord>;

  findById(id: string): Promise<MedicalRecord | null>;

  findByPet(petId: string): Promise<MedicalRecord[]>;

  findByDoctor(doctorId: string): Promise<MedicalRecord[]>;

  update(id: string, data: Partial<MedicalRecord>): Promise<MedicalRecord>;
}
