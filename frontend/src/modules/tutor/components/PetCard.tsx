import { Link } from 'react-router-dom';
import { type PetDto } from '../../../types';

interface PetCardProps {
  mascota: PetDto;
}

export function PetCard({ mascota }: PetCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <span className="text-xl font-bold text-blue-600">
            {mascota.nombre[0].toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{mascota.nombre}</h3>
          <p className="text-sm text-gray-500">{mascota.raza}</p>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4 text-center text-sm">
        <div>
          <p className="font-medium text-gray-800">{mascota.especie}</p>
          <p className="text-xs text-gray-500">Especie</p>
        </div>
        <div>
          <p className="font-medium text-gray-800">{mascota.sexo}</p>
          <p className="text-xs text-gray-500">Sexo</p>
        </div>
        <div>
          <p className="font-medium text-gray-800">{mascota.pesoKg} kg</p>
          <p className="text-xs text-gray-500">Peso</p>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <Link 
          to={`/tutor/pets/${mascota.id}`} 
          className="flex-1 rounded-lg border border-gray-300 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Ver Perfil
        </Link>
        <Link
          to={`/tutor/appointments/new?petId=${mascota.id}`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Cita
        </Link>
      </div>
    </div>
  );
}
