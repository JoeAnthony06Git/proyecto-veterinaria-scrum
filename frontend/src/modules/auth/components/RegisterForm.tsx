export function RegisterForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input type="text" placeholder="María" className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Apellido</label>
          <input type="text" placeholder="García" className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
        <input type="email" placeholder="correo@ejemplo.com" className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
        <input type="tel" placeholder="+51 999 999 999" className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
        <input type="password" placeholder="••••••••" className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
        <input type="password" placeholder="••••••••" className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
      </div>
      <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
        Crear Cuenta
      </button>
    </form>
  )
}
