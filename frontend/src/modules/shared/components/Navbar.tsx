import { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { CartWidget } from '../../tutor/components/CartWidget'; // Importar

export function Navbar({ role }: { role: 'tutor' | 'doctor' }) {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <img src="/Logo.PNG" alt="Logo VetePet" className="h-8 w-8 rounded-full object-cover" />
        <span className="text-lg font-semibold text-gray-800 hidden sm:block">Veterinaria</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Solo el tutor ve el carrito */}
        {user?.role === 'TUTOR' && <CartWidget />}
        
        <div className="h-8 w-px bg-gray-200 mx-2" />

        <div className="flex items-center gap-2 text-right">
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-gray-900">{user?.name} {user?.lastName}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{user?.role}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-blue-600 border border-blue-100">
            {user?.name?.[0]}
          </div>
        </div>
      </div>
    </nav>
  );
}