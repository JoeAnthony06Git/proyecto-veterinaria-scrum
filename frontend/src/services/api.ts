import axios from 'axios';
import type {
  LoginResponse,
  PetDto,
  PetDetailDto,
  VaccineRecordDto,
  ConsultationSummaryDto,
  AppointmentDto,
  ServiceDto,
  DoctorDto,
  ProductDto,
  CartItemDto,
  PrescriptionDto,
  PrescriptionDetailDto,
  PatientDto,
  PatientDetailDto,
  DoctorAppointmentDto,
  DoctorDashboardDto,
  TriageAlertDto,
  ConsultationDetailDto,
  UserDto,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),

  register: (data: { name: string; lastName: string; email: string; phone: string; password: string }) =>
    api.post<LoginResponse>('/auth/register', data),

  profile: () => api.get<UserDto>('/auth/profile'),
};

export const petsApi = {
  list: () => api.get<PetDto[]>('/tutor/pets'),
  getById: (id: string) => api.get<PetDetailDto>(`/tutor/pets/${id}`),
  getVaccines: (id: string) => api.get<VaccineRecordDto[]>(`/tutor/pets/${id}/vaccines`),
  getConsultations: (id: string) => api.get<ConsultationSummaryDto[]>(`/tutor/pets/${id}/consultations`),
  create: (data: FormData | object) => api.post<PetDto>('/tutor/pets', data),
  update: (id: string, data: object) => api.put<PetDto>(`/tutor/pets/${id}`, data),
  delete: (id: string) => api.delete(`/tutor/pets/${id}`),
};

export const appointmentsApi = {
  list: (status?: string) =>
    api.get<AppointmentDto[]>('/tutor/appointments', { params: { status } }),
  create: (data: object) => api.post<AppointmentDto>('/tutor/appointments', data),
  cancel: (id: string) => api.patch(`/tutor/appointments/${id}/cancel`),
};

export const productsApi = {
  list: (category?: string) =>
    api.get<ProductDto[]>('/products', { params: { category } }),
};

export const cartApi = {
  list: () => api.get<CartItemDto[]>('/cart'),
  addItem: (productId: string, quantity: number) =>
    api.post<CartItemDto>('/cart/items', { productId, quantity }),
  updateItem: (id: string, quantity: number) =>
    api.patch(`/cart/items/${id}`, { quantity }),
  removeItem: (id: string) => api.delete(`/cart/items/${id}`),
  checkout: () => api.post('/orders'),
};

export const servicesApi = {
  list: () => api.get<ServiceDto[]>('/tutor/services'),
};

export const doctorsApi = {
  list: () => api.get<DoctorDto[]>('/tutor/doctors'),
  availability: (id: string) =>
    api.get<any[]>(`/tutor/doctors/${id}/availability`),
};

export const triageApi = {
  submit: (data: { petId: string; symptoms: string; duration: string; painLevel: string }) =>
    api.post('/triage', data),
  getResult: (id: string) => api.get(`/triage/${id}`),
};

export const prescriptionsApi = {
  getTutorPrescription: (id: string) =>
    api.get<PrescriptionDetailDto>(`/tutor/prescriptions/${id}`),
};

export const doctorApi = {
  dashboard: () => api.get<DoctorDashboardDto>('/doctor/dashboard'),
  patients: () => api.get<PatientDto[]>('/doctor/patients'),
  patientById: (id: string) => api.get<PatientDetailDto>(`/doctor/patients/${id}`),
  appointments: (range?: string, date?: string) =>
    api.get<DoctorAppointmentDto[]>('/doctor/appointments', { params: { range, date } }),
  appointmentById: (id: string) => api.get(`/doctor/appointments/${id}`),
  updateAppointmentStatus: (id: string, status: string) =>
    api.patch(`/doctor/appointments/${id}/status`, { status }),
  triageAlerts: () => api.get<TriageAlertDto[]>('/doctor/triage/alerts'),
  attendTriage: (id: string) => api.patch(`/doctor/triage/${id}/attend`),
  createConsultation: (data: object) => api.post('/doctor/consultations', data),
  getConsultation: (id: string) => api.get(`/doctor/consultations/${id}`),
  updateConsultation: (id: string, data: object) => api.patch(`/doctor/consultations/${id}`, data),
  analyzeTranscript: (transcript: string, appointmentReason?: string) =>
    api.post<any>('/doctor/consultations/analyze-transcript', { transcript, appointmentReason }),
  listPrescriptions: () => api.get<PrescriptionDto[]>('/doctor/prescriptions'),
  getPrescription: (id: string) => api.get(`/doctor/prescriptions/${id}`),
  createPrescription: (data: object) => api.post('/doctor/prescriptions', data),
  interpretPrescription: (id: string) =>
    api.post(`/doctor/prescriptions/${id}/interpret`),
};

export const tutorApi = {
  getConsultation: (id: string) => api.get<ConsultationDetailDto>(`/tutor/consultations/${id}`),
};

export default api;
