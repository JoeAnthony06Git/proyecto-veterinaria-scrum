import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';
import { RolesGuard, Roles } from '../auth/RolesGuard';
import { Role } from '@prisma/client';
import { PrismaService } from '../../../out/persistence/PrismaService';
import { CurrentUser } from '../auth/CurrentUser';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TUTOR)
export class ShopController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async verCarrito(@CurrentUser('id') userId: string) {
    return await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });
  }

  @Post('items')
  async agregarAlCarrito(@CurrentUser('id') userId: string, @Body() data: { productId: string, quantity: number }) {
    const existe = await this.prisma.cartItem.findFirst({
      where: { userId, productId: data.productId }
    });

    if (existe) {
      return await this.prisma.cartItem.update({
        where: { id: existe.id },
        data: { quantity: existe.quantity + data.quantity }
      });
    }

    return await this.prisma.cartItem.create({
      data: {
        userId,
        productId: data.productId,
        quantity: data.quantity
      }
    });
  }

  @Patch('items/:id')
  async actualizarCantidad(@Param('id') id: string, @Body('quantity') quantity: number) {
    return await this.prisma.cartItem.update({
      where: { id },
      data: { quantity }
    });
  }

  @Delete('items/:id')
  async eliminarDelCarrito(@Param('id') id: string) {
    return await this.prisma.cartItem.delete({ where: { id } });
  }

  @Post('checkout')
  async procesarCompra(@CurrentUser('id') userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    if (items.length === 0) throw new Error('El carrito está vacío');

    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const orden = await this.prisma.order.create({
      data: {
        userId,
        total,
        status: 'CONFIRMADO',
        items: {
          create: items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.product.price
          }))
        }
      }
    });

    await this.prisma.cartItem.deleteMany({ where: { userId } });

    return orden;
  }
}
