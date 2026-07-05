import { useEffect, useState } from 'react';
import { doctorApi } from '../../../services/api';
import { Link } from 'react-router-dom';

export function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorApi.patients()
      .then(res => setPatients(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Pacientes</h1>
      </div>

      <div className="rounded-xl bg-white shadow-sm border overflow-hidden">
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
            ) : patients.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-sm text-gray-400">No hay pacientes registrados.</td></tr>
            ) : (
              patients.map((p) => (
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