import type { ReactNode } from 'react'

interface RoleGuardProps {
  role: 'tutor' | 'doctor'
  children: ReactNode
}

export function RoleGuard({ role, children }: RoleGuardProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        <h2 className="mb-2 text-xl font-semibold text-gray-800">Vista de {role === 'doctor' ? 'Doctor' : 'Tutor'}</h2>
        <p className="mb-6 text-gray-600">
          Esta es la interfaz del {role === 'doctor' ? 'médico veterinario' : 'tutor de mascotas'}.
        </p>
        {children}
      </div>
    </div>
  )
}
