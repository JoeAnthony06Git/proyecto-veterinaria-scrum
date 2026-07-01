export interface CartillaData {
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string;
    sex: string;
    birthDate: Date;
    weightKg: number;
    color: string;
  };
  vaccines: Array<{
    id: string;
    name: string;
    date: Date;
    nextDose: Date;
    status: string;
  }>;
  consultations: Array<{
    id: string;
    date: Date;
    reason: string | null;
    symptoms: string;
    diagnosis: string;
    treatment: string;
  }>;
  prescriptions: Array<{
    id: string;
    date: Date;
    originalText: string;
    status: string;
  }>;
}

export interface ICartillaRepository {
  getByPet(petId: string): Promise<CartillaData | null>;
}
