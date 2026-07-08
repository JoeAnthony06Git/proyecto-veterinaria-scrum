import { useEffect } from 'react';
import { useCartStore } from '../../../stores/cartStore';

export function CartPage() {
  const { items, fetchCart, updateQuantity, removeItem, checkout, loading } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = items.reduce((sum, i) => {
    const precio = i.product?.price || 0;
    return sum + (precio * i.quantity);
  }, 0);

  if (loading && items.length === 0) return <p className="p-10 text-center">Cargando carrito...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Mi Carrito</h1>
      
      {items.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed text-gray-400">
          <p className="text-4xl mb-4">🛒</p>
          <p>Tu carrito está vacío</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">📦</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.product?.name || 'Producto'}</h3>
                  <p className="text-sm text-blue-600 font-medium">S/ {item.product?.price?.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center font-bold disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="w-4 text-center font-bold text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="font-black text-gray-900">S/ {((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                  <button 
                    onClick={() => removeItem(item.id)} 
                    className="text-red-500 text-[10px] font-bold uppercase hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm h-fit space-y-4">
            <h2 className="font-bold text-lg text-gray-800 border-b pb-3">Resumen de compra</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Envío</span>
                <span className="text-green-600 font-bold">Gratis</span>
              </div>
              <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t">
                <span>Total:</span>
                <span> {subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={checkout} 
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50"
            >
              {loading ? 'PROCESANDO...' : 'CONFIRMAR PAGO'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
