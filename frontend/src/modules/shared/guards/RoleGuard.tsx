
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore'
import type { ReactNode } from 'react'

interface RoleGuardProps {
  role: 'TUTOR' | 'DOCTOR'
  children: ReactNode
}

export function RoleGuard({ role, children }: RoleGuardProps) {
  const { token, user } = useAuthStore()

  if (!token) return <Navigate to="/login" replace />

  if (user?.role !== role) {
    const dashboard = user?.role === 'DOCTOR' ? '/doctor/dashboard' : '/tutor/dashboard'
    return <Navigate to={dashboard} replace />
  }

  return <>{children}</>
}
