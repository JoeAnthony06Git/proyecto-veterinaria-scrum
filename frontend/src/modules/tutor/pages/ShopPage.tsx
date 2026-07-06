import { useEffect, useState } from 'react';
import { productsApi } from '../../../services/api';
import type { ProductDto } from '../../../types';

export function ShopPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Todos');

  const categories = ['Todos', 'Alimentos', 'Accesorios', 'Higiene'];

  useEffect(() => {
    setLoading(true);
    const filter = category === 'Todos' ? undefined : category;
    productsApi.list(filter)
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tienda de Mascotas</h1>
        <p className="mt-1 text-sm text-gray-500">Los mejores productos para tu mascota</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full px-6 py-2 text-xs font-bold transition-all border ${
              category === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="p-10 text-center">Cargando catálogo...</p>
      ) : products.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center text-sm text-gray-400 border border-dashed">
          No hay productos disponibles en esta categoría.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{p.category}</span>
                <h3 className="mt-1 font-bold text-gray-800 line-clamp-1">{p.name}</h3>
                <p className="mt-2 text-xl font-black text-gray-900">S/ {p.price.toFixed(2)}</p>
                <button className="mt-4 w-full rounded-lg bg-gray-900 py-2 text-xs font-bold text-white hover:bg-blue-600 transition-colors">
                  AÑADIR AL CARRITO
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
