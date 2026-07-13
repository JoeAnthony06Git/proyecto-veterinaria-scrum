import { useState } from 'react';
import { usePetStore } from '../../../stores/petStore';
import type { PetDto } from '../../../types';

interface PetFormModalProps {
  onClose: () => void;
  mascota?: PetDto & { color?: string; fechaNacimiento?: string; fotoUrl?: string };
}

export function PetFormModal({ onClose, mascota }: PetFormModalProps) {
  const { createPet, updatePet, fetchPets, loading } = usePetStore();
  const esEditar = !!mascota;

  const [archivo, setArchivo] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(mascota?.fotoUrl || null);

  const [datos, setDatos] = useState({
    nombre: mascota?.nombre || '',
    especie: mascota?.especie || 'Perro',
    raza: mascota?.raza || '',
    sexo: mascota?.sexo || 'Macho',
    fechaNacimiento: mascota?.fechaNacimiento?.split('T')[0] || '',
    pesoKg: mascota?.pesoKg || 0,
    color: mascota?.color || ''
  });

  const manejarCambioArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivo(file);
      setVistaPrevia(URL.createObjectURL(file));
    }
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!datos.nombre || !datos.raza) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    const formData = new FormData();
    formData.append('nombre', datos.nombre);
    formData.append('especie', datos.especie);
    formData.append('raza', datos.raza);
    formData.append('sexo', datos.sexo);
    formData.append('fechaNacimiento', datos.fechaNacimiento);
    formData.append('pesoKg', datos.pesoKg.toString());
    formData.append('color', datos.color);

    if (archivo) {
      formData.append('file', archivo);
    }

    try {
      if (esEditar && mascota) {
        await updatePet(mascota.id, formData as any);
      } else {
        await createPet(formData as any);
      }

      await fetchPets();
      onClose();
    } catch (error) {
      console.error("Error al guardar mascota:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {esEditar ? 'Editar Mascota' : 'Registrar Nueva Mascota'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            &times;
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
              {vistaPrevia ? (
                <img src={vistaPrevia} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-gray-300">🐾</span>
              )}
            </div>
            <label className="mt-2 cursor-pointer bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition">
              {vistaPrevia ? 'Cambiar Foto' : 'Subir Foto'}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={manejarCambioArchivo} 
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              required
              value={datos.nombre}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Nombre de la mascota"
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Especie *</label>
              <select
                value={datos.especie}
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
                value={datos.sexo}
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
              value={datos.raza}
              className="w-full px-4 py-2 border rounded-xl outline-none"
              placeholder="Raza"
              onChange={(e) => setDatos({ ...datos, raza: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={datos.pesoKg || ''}
                className="w-full px-4 py-2 border rounded-xl outline-none"
                onChange={(e) => setDatos({ ...datos, pesoKg: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">F. Nacimiento</label>
              <input
                type="date"
                value={datos.fechaNacimiento}
                className="w-full px-4 py-2 border rounded-xl outline-none"
                onChange={(e) => setDatos({ ...datos, fechaNacimiento: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Color / Señas</label>
            <input
              type="text"
              value={datos.color}
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
              {loading ? 'Guardando...' : esEditar ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}