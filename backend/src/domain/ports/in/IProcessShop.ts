import { Producto } from '../../entities/Product';
import { ItemCarrito } from '../../entities/CartItem';

export interface IProcessShop {
  listarProductos(): Promise<Producto[]>;
  obtenerProductoPorId(id: string): Promise<Producto | null>;
  listarPorCategoria(categoria: string): Promise<Producto[]>;
  agregarAlCarrito(usuarioId: string, productoId: string, cantidad: number): Promise<ItemCarrito>;
  verCarrito(usuarioId: string): Promise<ItemCarrito[]>;
  eliminarDelCarrito(usuarioId: string, productoId: string): Promise<void>;
}
