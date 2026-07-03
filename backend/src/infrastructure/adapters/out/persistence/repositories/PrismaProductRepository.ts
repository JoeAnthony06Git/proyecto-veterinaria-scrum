import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import { IProductRepository } from '../../../../../domain/ports/out/database/IProductRepository';
import { Producto } from '../../../../../domain/entities/Product';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Producto[]> {
    const raws = await this.prisma.product.findMany();
    return raws.map(r => this.toDomain(r));
  }

  async findById(id: string): Promise<Producto | null> {
    const raw = await this.prisma.product.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  async findByCategory(category: string): Promise<Producto[]> {
    const raws = await this.prisma.product.findMany({ where: { category } });
    return raws.map(r => this.toDomain(r));
  }

  async crear(producto: Producto): Promise<Producto> {
    const raw = await this.prisma.product.create({
      data: {
        id: producto.id,
        name: producto.nombre,
        price: producto.precio,
        category: producto.categoria,
        stock: producto.stock,
        imageUrl: producto.imagenUrl,
      },
    });
    return this.toDomain(raw);
  }

  async actualizar(id: string, producto: Partial<Producto>): Promise<Producto> {
    const raw = await this.prisma.product.update({
      where: { id },
      data: {
        name: producto.nombre,
        price: producto.precio,
        category: producto.categoria,
        stock: producto.stock,
        imageUrl: producto.imagenUrl,
      },
    });
    return this.toDomain(raw);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  private toDomain(raw: any): Producto {
    return Producto.crearNuevo(
      raw.id, raw.name, raw.price, raw.category, raw.stock, raw.imageUrl ?? undefined
    );
  }
}
