export function LoginForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          type="password"
          placeholder="••••••••"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          Recordarme
        </label>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-500">¿Olvidaste tu contraseña?</a>
      </div>
      <div className="flex gap-3">
        <a
          href="/tutor/dashboard"
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Entrar como Tutor
        </a>
        <a
          href="/doctor/dashboard"
          className="flex-1 rounded-lg bg-gray-800 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-gray-900 transition-colors"
        >
          Entrar como Doctor
        </a>
      </div>
    </form>
  )
}
