import { useEffect, useState } from 'react';
import { productsApi, cartApi } from '../../../services/api';
import { useCartStore } from '../../../stores/cartStore';
import type { ProductDto } from '../../../types';

export function ShopPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Todos');
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
      alert('Producto añadido');
      fetchCart();
    } catch {
      alert('Error al añadir');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tienda</h1>
      <div className="flex gap-2">
        {['Todos', 'Alimentos', 'Accesorios', 'Higiene'].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1 rounded-full border ${category === cat ? 'bg-blue-600 text-white' : 'bg-white'}`}>
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-3xl">📦</div>
            <p className="text-[10px] text-blue-600 font-bold uppercase">{p.category}</p>
            <h3 className="font-bold text-gray-800">{p.name}</h3>
            <p className="text-lg font-black mt-1">S/ {p.price.toFixed(2)}</p>
            <button onClick={() => handleAddToCart(p.id)} className="w-full mt-3 bg-gray-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors">
              AÑADIR AL CARRITO
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
