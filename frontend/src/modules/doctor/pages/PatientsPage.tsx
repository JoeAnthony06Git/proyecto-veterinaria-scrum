import { useEffect, useState } from 'react';
import { doctorApi } from '../../../services/api';
import { Link } from 'react-router-dom';
import type { PatientDto } from '../../../types';

export function PatientsPage() {
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    doctorApi.patients()
      .then(res => setPatients(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter(p =>
    p.pet.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Pacientes</h1>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none sm:w-72"
        />
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Paciente</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Especie</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Tutor</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Última Consulta</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center text-sm text-gray-400">Cargando pacientes...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-sm text-gray-400">
                {search ? 'No se encontraron pacientes con ese nombre.' : 'No hay pacientes registrados.'}
              </td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{p.pet}</p>
                    <p className="text-xs text-gray-500">{p.breed}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.species}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.owner}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.lastVisit}</td>
                  <td className="px-6 py-4">
                    <Link to={`/doctor/patients/${p.id}`} className="text-sm font-medium text-blue-600">Ver historial</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}