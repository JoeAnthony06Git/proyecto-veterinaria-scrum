import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import { IUserRepository } from '../../../../../domain/ports/out/database/IUserRepository';
import { User, Role } from '../../../../../domain/entities/User';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { email } });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  async create(user: User): Promise<User> {
    const raw = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role as any,
      },
    });
    return this.toDomain(raw);
  }

  async findById(id: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  private toDomain(raw: any): User {
    return new User(
      raw.id,
      raw.email,
      raw.password,
      raw.name,
      raw.lastName,
      raw.phone,
      raw.role as Role,
      raw.createdAt,
      raw.updatedAt,
    );
  }
}
