import { Producto } from '../../../entities/Product';

export interface IProductRepository {
  findAll(): Promise<Producto[]>;
  findById(id: string): Promise<Producto | null>;
  findByCategory(category: string): Promise<Producto[]>;
  crear(producto: Producto): Promise<Producto>;
  actualizar(id: string, producto: Partial<Producto>): Promise<Producto>;
  eliminar(id: string): Promise<void>;
}
