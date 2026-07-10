import { useEffect, useState } from 'react';
import { doctorApi } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import type { DoctorAppointmentDto } from '../../../types';

export function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<DoctorAppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'day' | 'all'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // Si la vista es diaria enviamos la fecha, si es todas enviamos el rango 'all'
    const range = viewMode === 'day' ? undefined : 'all';
    const dateParam = viewMode === 'day' ? selectedDate : undefined;

    doctorApi.appointments(range, dateParam)
      .then(res => setAppointments(res.data))
      .finally(() => setLoading(false));
  }, [viewMode, selectedDate]);

  const changeDay = (days: number) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await doctorApi.updateAppointmentStatus(id, status);
      const range = viewMode === 'day' ? undefined : 'all';
      const dateParam = viewMode === 'day' ? selectedDate : undefined;
      const res = await doctorApi.appointments(range, dateParam);
      setAppointments(res.data);
    } catch (e) {
      alert('Error al actualizar el estado');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Citas</h1>
        
        <div className="flex bg-white border p-1 rounded-xl shadow-sm">
          <button 
            onClick={() => setViewMode('day')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'day' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            VISTA DIARIA
          </button>
          <button 
            onClick={() => setViewMode('all')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            VER TODAS
          </button>
        </div>
      </div>

      {viewMode === 'day' && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border shadow-sm max-w-md mx-auto">
          <button 
            onClick={() => changeDay(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full text-blue-600 transition-colors"
            title="Día anterior"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div className="text-center">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Fecha Agenda</p>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-lg font-bold text-gray-800 border-none p-0 focus:ring-0 cursor-pointer"
            />
          </div>

          <button 
            onClick={() => changeDay(1)} 
            className="p-2 hover:bg-gray-100 rounded-full text-blue-600 transition-colors"
            title="Siguiente día"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-sm border overflow-hidden">
        <div className="bg-gray-50/50 px-6 py-3 border-b">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {viewMode === 'day' ? `Citas para el ${selectedDate}` : 'Listado general de citas'}
          </p>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-sm text-gray-500 font-medium">Cargando agenda...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-gray-400 font-medium">No hay citas programadas para este rango.</p>
          </div>
        ) : (
          <div className="divide-y">
            {appointments.map((apt) => (
              <div key={apt.id} className={`flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors ${apt.status === 'CANCELADA' ? 'bg-gray-50/50' : ''}`}>
                <div className="w-24 shrink-0">
                  <p className="text-lg font-black text-blue-600 leading-tight">{apt.time}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{apt.date}</p>
                </div>
                
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-lg">{apt.pet}</p>
                  <p className="text-xs text-gray-500 font-medium">{apt.service} · {apt.owner}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    apt.status === 'COMPLETADA' ? 'bg-green-100 text-green-700' : 
                    apt.status === 'CANCELADA' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {apt.status}
                  </span>
                  
                  {apt.status === 'PROGRAMADA' && (
                    <button 
                      onClick={() => updateStatus(apt.id, 'EN_CURSO')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                    >
                      INICIAR
                    </button>
                  )}

                  {apt.status === 'EN_CURSO' && (
                    <>
                      <button 
                        onClick={() => navigate(`/doctor/appointments/${apt.id}/consultation`)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-100"
                      >
                        ATENDER
                      </button>
                      <button 
                        onClick={() => updateStatus(apt.id, 'COMPLETADA')}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition-all shadow-md shadow-green-100"
                      >
                        FINALIZAR
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}