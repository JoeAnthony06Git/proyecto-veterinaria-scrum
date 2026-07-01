import { useState } from 'react';
import { usePetStore } from '../../../stores/petStore';

interface PetFormModalProps {
  onClose: () => void; // Función para cerrar la ventana
}

export function PetFormModal({ onClose }: PetFormModalProps) {
  // 1. Conectamos con la función de crear del Store
  const { createPet, loading } = usePetStore();

  // 2. Estado local para el formulario (Nombres en Español)
  const [datos, setDatos] = useState({
    nombre: '',
    especie: 'Perro',
    raza: '',
    sexo: 'Macho',
    fechaNacimiento: '',
    pesoKg: 0,
    color: ''
  });

  // 3. Función al enviar el formulario
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!datos.nombre || !datos.raza) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    await createPet(datos);
    onClose(); // Cerrar el modal tras guardar
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Cabecera */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Registrar Nueva Mascota</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            &times;
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarEnvio} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Ej: Max"
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Especie *</label>
              <select
                className="w-full px-4 py-2 border rounded-xl outline-none"
                onChange={(e) => setDatos({ ...datos, especie: e.target.value })}
              >
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sexo *</label>
              <select
                className="w-full px-4 py-2 border rounded-xl outline-none"
                onChange={(e) => setDatos({ ...datos, sexo: e.target.value })}
              >
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Raza *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-xl outline-none"
              placeholder="Ej: Golden Retriever"
              onChange={(e) => setDatos({ ...datos, raza: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-4 py-2 border rounded-xl outline-none"
                onChange={(e) => setDatos({ ...datos, pesoKg: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">F. Nacimiento</label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-xl outline-none"
                onChange={(e) => setDatos({ ...datos, fechaNacimiento: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Color / Señas</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-xl outline-none"
              placeholder="Ej: Blanco con manchas cafés"
              onChange={(e) => setDatos({ ...datos, color: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg disabled:bg-blue-300"
            >
              {loading ? 'Guardando...' : 'Guardar Mascota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
