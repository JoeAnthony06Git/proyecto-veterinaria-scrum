import { useState } from 'react'

interface NavbarProps {
  role: 'tutor' | 'doctor'
}

export function Navbar({ role }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const userName = role === 'doctor' ? 'Dr. Carlos López' : 'María García'

  return (
    <nav className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <button className="text-gray-500 hover:text-gray-700 lg:hidden" onClick={() => setOpen(!open)}>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">V</div>
          <span className="text-lg font-semibold text-gray-800">Veterinaria</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-full bg-gray-100 p-2 text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-700">
            {userName.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 sm:block">{userName}</span>
        </div>
      </div>
    </nav>
  )
}
