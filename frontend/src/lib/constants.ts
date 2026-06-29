export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const ROLES = {
  DOCTOR: 'doctor' as const,
  TUTOR: 'tutor' as const,
}

export const SERVICE_TYPES = {
  CONSULTA: 'Consulta General',
  SPA: 'Spa',
  DIAGNOSTICO: 'Diagnóstico',
  LABORATORIO: 'Laboratorio',
} as const

export const URGENCY_LEVELS = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
} as const

export const APPOINTMENT_STATUS = {
  PROGRAMADA: 'Programada',
  EN_CURSO: 'En Curso',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
} as const
