import { create } from 'zustand';
import { petsApi } from '../services/api';
import type { PetDto, PetDetailDto } from '../types';

interface PetState {
  pets: PetDto[];
  currentPet: PetDetailDto | null;
  loading: boolean;
  error: string | null;
  fetchPets: () => Promise<void>;
  fetchPetById: (id: string) => Promise<void>;
  createPet: (data: FormData | object) => Promise<void>;
  updatePet: (id: string, data: object) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  clearCurrentPet: () => void;
  clearError: () => void;
}

export const usePetStore = create<PetState>((set) => ({
  pets: [],
  currentPet: null,
  loading: false,
  error: null,

  fetchPets: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await petsApi.list();
      set({ pets: data, loading: false });
    } catch (err: any) {
      set({ error: 'Error al cargar mascotas', loading: false });
    }
  },

  fetchPetById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await petsApi.getById(id);
      set({ currentPet: data, loading: false });
    } catch {
      set({ error: 'Error al cargar mascota', loading: false });
    }
  },

  createPet: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await petsApi.create(data);
      // Agregamos la nueva mascota al array existente
      set((state) => ({ 
        pets: [...state.pets, response.data], 
        loading: false 
      }));
    } catch (err) {
      set({ error: 'Error al crear mascota', loading: false });
    }
  },

  updatePet: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const { data: actualizada } = await petsApi.update(id, data);
      set((state) => ({
        pets: state.pets.map((p) => (p.id === id ? actualizada : p)),
        currentPet: state.currentPet?.id === id ? { ...state.currentPet, ...actualizada } : state.currentPet,
        loading: false,
      }));
    } catch {
      set({ error: 'Error al actualizar mascota', loading: false });
    }
  },

  deletePet: async (id) => {
    set({ loading: true, error: null });
    try {
      await petsApi.delete(id);
      set((state) => ({
        pets: state.pets.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch {
      set({ error: 'Error al eliminar mascota', loading: false });
    }
  },

  clearCurrentPet: () => set({ currentPet: null }),
  clearError: () => set({ error: null }),
}));
