import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IUserRepository } from '../../../domain/ports/out/database/IUserRepository';
import { User } from '../../../domain/entities/User';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new User(
      crypto.randomUUID(),
      data.email,
      hashedPassword,
      data.name,
      data.lastName,
      data.phone,
      'TUTOR',
      new Date(),
      new Date(),
    );

    const savedUser = await this.userRepository.create(user);

    const token = this.jwtService.sign({
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    });

    return {
      token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        lastName: savedUser.lastName,
        phone: savedUser.phone,
        role: savedUser.role,
      },
    };
  }
}
