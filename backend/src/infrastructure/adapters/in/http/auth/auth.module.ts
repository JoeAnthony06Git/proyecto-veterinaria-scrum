import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './JwtStrategy';
import { JwtAuthGuard } from './JwtAuthGuard';
import { RolesGuard } from './RolesGuard';
import { AuthController } from './AuthController';
import { RegisterUseCase } from '../../../../../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../../../../application/use-cases/auth/LoginUseCase';
import { PrismaUserRepository } from '../../../out/persistence/repositories/PrismaUserRepository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    RegisterUseCase,
    LoginUseCase,
    { provide: 'IUserRepository', useClass: PrismaUserRepository },
  ],
  exports: [JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
