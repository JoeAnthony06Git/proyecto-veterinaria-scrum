export class ItemCarrito {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly productoId: string,
    public cantidad: number
  ) {}

  static crearNuevo(
    id: string,
    usuarioId: string,
    productoId: string,
    cantidad: number = 1
  ): ItemCarrito {
    return new ItemCarrito(id, usuarioId, productoId, cantidad);
  }

  incrementarCantidad(n: number = 1): void {
    this.cantidad += n;
  }

  disminuirCantidad(n: number = 1): void {
    if (this.cantidad - n < 1) {
      throw new Error('La cantidad mínima es 1');
    }
    this.cantidad -= n;
  }
}
