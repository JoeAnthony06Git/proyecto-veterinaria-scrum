export function ShopPage() {
  const categories: string[] = []
  const products: { name: string; price: number; category: string; image: string }[] = []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tienda</h1>
        <p className="mt-1 text-sm text-gray-500">Productos para el cuidado de tu mascota</p>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button key={cat} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              cat === 'Todos' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center text-sm text-gray-400 shadow-sm">
          No hay productos disponibles.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p.name} className="rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-200 text-xl font-bold text-blue-700">
                  {p.image}
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-blue-600">{p.category}</span>
                <h3 className="mt-1 font-medium text-gray-800">{p.name}</h3>
                <p className="mt-1 text-lg font-bold text-gray-900">S/ {p.price.toFixed(2)}</p>
                <button className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
