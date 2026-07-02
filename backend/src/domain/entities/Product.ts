export class Producto {
  constructor(
    public readonly id: string,
    public nombre: string,
    public precio: number,
    public categoria: string,
    public stock: number,
    public imagenUrl?: string
  ) {}

  get disponible(): boolean {
    return this.stock > 0;
  }

  static crearNuevo(
    id: string,
    nombre: string,
    precio: number,
    categoria: string,
    stock: number,
    imagenUrl?: string
  ): Producto {
    return new Producto(id, nombre, precio, categoria, stock, imagenUrl);
  }

  actualizarStock(cantidad: number): void {
    if (this.stock + cantidad < 0) {
      throw new Error('Stock no puede ser negativo');
    }
    this.stock += cantidad;
  }
}
