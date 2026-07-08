import { useEffect, useState, useMemo } from 'react';
import { usePetStore } from '../../../stores/petStore';
import { PetCard } from '../components/PetCard';
import { PetFormModal } from '../components/PetFormModal';

const PAGE_SIZE = 6;

function PetCardSkeleton() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-gray-200" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-3 w-16 rounded bg-gray-200" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4">
        <div className="space-y-1"><div className="h-3 w-12 mx-auto rounded bg-gray-200" /><div className="h-2 w-8 mx-auto rounded bg-gray-200" /></div>
        <div className="space-y-1"><div className="h-3 w-10 mx-auto rounded bg-gray-200" /><div className="h-2 w-8 mx-auto rounded bg-gray-200" /></div>
        <div className="space-y-1"><div className="h-3 w-14 mx-auto rounded bg-gray-200" /><div className="h-2 w-8 mx-auto rounded bg-gray-200" /></div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="flex-1 h-9 rounded-lg bg-gray-200" />
        <div className="flex-1 h-9 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
        className="rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Anterior
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
            p === current
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current >= total}
        className="rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Siguiente
      </button>
    </div>
  );
}

export function MyPetsPage() {
  const { pets, fetchPets, loading } = usePetStore();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [pets.length]);

  const totalPaginas = Math.max(1, Math.ceil(pets.length / PAGE_SIZE));

  const petsPagina = useMemo(() => {
    const start = (pagina - 1) * PAGE_SIZE;
    return pets.slice(start, start + PAGE_SIZE);
  }, [pets, pagina]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis Mascotas</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona los perfiles de tus mascotas</p>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + Nueva Mascota
        </button>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PetCardSkeleton key={i} />
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
          <p className="text-gray-500">No tienes mascotas registradas aún.</p>
          <button
            onClick={() => setMostrarModal(true)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Registrar tu primera mascota
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {petsPagina.map((pet) => (
              <PetCard key={pet.id} mascota={pet} />
            ))}
          </div>

          {pets.length > PAGE_SIZE && (
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Mostrando {(pagina - 1) * PAGE_SIZE + 1}-{Math.min(pagina * PAGE_SIZE, pets.length)} de {pets.length}</span>
              <Pagination current={pagina} total={totalPaginas} onChange={setPagina} />
            </div>
          )}
        </>
      )}

      {mostrarModal && <PetFormModal onClose={() => setMostrarModal(false)} />}
    </div>
  );
}