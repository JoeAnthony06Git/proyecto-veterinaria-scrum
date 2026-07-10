import { useEffect, useState } from 'react';
import { productsApi, cartApi } from '../../../services/api';
import { useCartStore } from '../../../stores/cartStore';
import type { ProductDto } from '../../../types';

export function ShopPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const fetchCart = useCartStore(state => state.fetchCart);

  useEffect(() => {
    setLoading(true);
    productsApi.list(category === 'Todos' ? undefined : category)
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [category]);

  const handleAddToCart = async (productId: string) => {
    try {
      await cartApi.addItem(productId, 1);
      fetchCart(); // Actualiza el contador del widget inmediatamente
    } catch {
      alert('Error al añadir');
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tienda</h1>
          <p className="text-sm text-gray-500">Busca lo mejor para tu mascota</p>
        </div>
        <input 
          type="text" 
          placeholder="Buscar producto..." 
          className="px-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Todos', 'Alimentos', 'Accesorios', 'Higiene'].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} 
            className={`px-6 py-2 rounded-full border text-xs font-black transition-all ${category === cat ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? <p className="text-center p-10">Cargando catálogo...</p> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="h-40 bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                {p.category === 'Alimentos' ? '🍲' : p.category === 'Accesorios' ? '🦴' : '🧼'}
              </div>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{p.category}</p>
              <h3 className="font-bold text-gray-800 line-clamp-1">{p.name}</h3>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-lg font-black text-gray-900">S/ {p.price.toFixed(2)}</p>
                <button onClick={() => handleAddToCart(p.id)} className="p-2 bg-gray-900 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}