import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './JwtAuthGuard';
import { CurrentUser } from './CurrentUser';
import { RegisterUseCase } from '../../../../../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../../../../application/use-cases/auth/LoginUseCase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  async register(
    @Body() body: { name: string; lastName: string; email: string; phone: string; password: string },
  ) {
    return this.registerUseCase.execute(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.loginUseCase.execute(body.email, body.password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@CurrentUser() user: any) {
    return user;
  }
}
