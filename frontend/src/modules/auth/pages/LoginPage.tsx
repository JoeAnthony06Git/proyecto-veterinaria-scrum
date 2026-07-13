import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src="/Logo.PNG" alt="Logo VetePet" className="mx-auto mb-4 h-16 w-16 rounded-full object-cover shadow-lg" />
          <h1 className="text-2xl font-bold text-gray-800">Veterinaria</h1>
          <p className="mt-1 text-sm text-gray-500">Sistema de Gestión Integral</p>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">Iniciar Sesión</h2>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Registrarse
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
