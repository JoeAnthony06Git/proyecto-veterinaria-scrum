export function CartPage() {
  const items = [
    { name: 'Royal Canin Perro Adulto', price: 89.90, quantity: 2 },
    { name: 'Collar Antipulgas', price: 65.00, quantity: 1 },
    { name: 'Shampoo Medicado', price: 28.00, quantity: 1 },
  ]

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Carrito de Compras</h1>
        <p className="mt-1 text-sm text-gray-500">{items.length} producto(s) en tu carrito</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.name} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-500">
                {item.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">S/ {item.price.toFixed(2)} c/u</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded border text-gray-500 hover:bg-gray-50">-</button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button className="flex h-8 w-8 items-center justify-center rounded border text-gray-500 hover:bg-gray-50">+</button>
              </div>
              <p className="w-20 text-right font-semibold text-gray-800">S/ {(item.price * item.quantity).toFixed(2)}</p>
              <button className="text-red-400 hover:text-red-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Resumen</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium text-gray-800">S/ {subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Envío</span><span className="font-medium text-green-600">Gratis</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Descuento</span><span className="font-medium text-red-500">-S/ 0.00</span></div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-base"><span className="font-semibold text-gray-800">Total</span><span className="font-bold text-gray-900">S/ {subtotal.toFixed(2)}</span></div>
              </div>
            </div>
            <button className="mt-6 w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
              Proceder al Pago
            </button>
            <p className="mt-2 text-center text-xs text-gray-400">Pago simulado (demo académica)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
