import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  role: 'tutor' | 'doctor'
  children: ReactNode
}

export function Layout({ role, children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div className="hidden lg:flex">
        <Sidebar role={role} currentPath={window.location.pathname} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar role={role} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
